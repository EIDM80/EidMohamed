"""Customer-facing knowledge base.

Two rules hold this together:

  1. The tenant tag is applied here, server-side, from the session. It is what
     the retrieval filter matches, so an untagged document has no boundary at
     all — a failed tagging step therefore deletes the document rather than
     leaving it readable by everyone.
  2. Listing and deletion are authorized against the gateway's own `documents`
     table, never against Dify. Dify's list endpoint returns the whole dataset,
     so trusting it would let one tenant enumerate another's files.
"""

from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, File, HTTPException, Response, UploadFile, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.config import get_settings
from app.db import get_db
from app.deps import Principal, current_principal, get_binding
from app.dify import DifyClient, DifyError
from app.models import Document, Tenant
from app.plans import get_plan

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/documents", tags=["documents"])
settings = get_settings()

UNAVAILABLE = "We could not process that file. Please try again."


def _client_and_binding(db: Session, principal: Principal, purpose: str):
    binding = get_binding(db, principal.tenant_id, purpose)
    if not binding.dataset_id:
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            "No knowledge base is set up for this account yet.",
        )
    return DifyClient(binding.app_key), binding


@router.post("", status_code=status.HTTP_202_ACCEPTED)
async def upload(
    file: UploadFile = File(...),
    purpose: str = "default",
    principal: Principal = Depends(current_principal),
    db: Session = Depends(get_db),
) -> dict[str, str]:
    max_bytes = settings.max_upload_mb * 1024 * 1024
    too_large = HTTPException(
        status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
        f"That file is larger than {settings.max_upload_mb} MB.",
    )

    # Reject on the declared size before reading, so an oversized upload never
    # lands in memory. The post-read check still runs, because the declared
    # size is client-supplied and may be absent or wrong.
    if file.size is not None and file.size > max_bytes:
        raise too_large

    content = await file.read()
    if not content:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "That file is empty.")
    if len(content) > max_bytes:
        raise too_large

    client, binding = _client_and_binding(db, principal, purpose)
    tenant = db.get(Tenant, principal.tenant_id)
    plan = get_plan(tenant.plan if tenant else None)

    owned = db.query(func.count(Document.id)).filter(Document.tenant_id == principal.tenant_id).scalar() or 0
    if owned >= plan.max_documents:
        raise HTTPException(
            status.HTTP_402_PAYMENT_REQUIRED,
            f"Your plan allows {plan.max_documents} documents. Remove one or upgrade to add more.",
        )

    dataset_id = binding.dataset_id
    tag_value = binding.metadata_value or principal.tenant_id
    field_name = settings.dify_tenant_metadata_field

    try:
        field_id = await client.ensure_metadata_field(dataset_id, field_name)
        created = await client.upload_document(
            dataset_id,
            filename=file.filename or "upload",
            content=content,
            content_type=file.content_type or "application/octet-stream",
        )
    except DifyError as exc:
        logger.warning("upload failed for tenant %s: %s", principal.tenant_id, exc)
        raise HTTPException(exc.status_code, UNAVAILABLE) from exc

    document_id = (created.get("document") or {}).get("id")
    if not document_id:
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, UNAVAILABLE)

    try:
        await client.tag_document(
            dataset_id,
            document_id,
            field_id=field_id,
            field_name=field_name,
            value=tag_value,
        )
    except DifyError as exc:
        logger.error("tagging failed for document %s, removing it", document_id)
        try:
            await client.delete_document(dataset_id, document_id)
        except DifyError:
            logger.critical(
                "UNTAGGED DOCUMENT %s LEFT IN DATASET %s - remove it manually", document_id, dataset_id
            )
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, UNAVAILABLE) from exc

    record = Document(
        tenant_id=principal.tenant_id,
        purpose=purpose,
        dataset_id=dataset_id,
        dify_document_id=document_id,
        name=file.filename or "upload",
        size_bytes=len(content),
        batch=created.get("batch"),
    )
    db.add(record)
    db.commit()

    return {"id": record.id, "name": record.name, "status": "indexing"}


@router.get("")
def list_documents(
    page: int = 1,
    limit: int = 20,
    principal: Principal = Depends(current_principal),
    db: Session = Depends(get_db),
) -> dict:
    page = max(1, page)
    limit = min(max(1, limit), 100)

    query = db.query(Document).filter(Document.tenant_id == principal.tenant_id)
    total = query.count()
    rows = query.order_by(Document.created_at.desc()).offset((page - 1) * limit).limit(limit).all()

    return {
        "total": total,
        "page": page,
        "documents": [
            {
                "id": row.id,
                "name": row.name,
                "size_bytes": row.size_bytes,
                "created_at": row.created_at.isoformat() if row.created_at else None,
            }
            for row in rows
        ],
    }


@router.get("/{document_id}/status")
async def indexing_status(
    document_id: str,
    principal: Principal = Depends(current_principal),
    db: Session = Depends(get_db),
) -> dict:
    record = _owned_document(db, principal, document_id)
    binding = get_binding(db, principal.tenant_id, record.purpose)
    if not record.batch:
        return {"id": record.id, "status": "unknown"}

    try:
        body = await DifyClient(binding.app_key).indexing_status(record.dataset_id, record.batch)
    except DifyError:
        return {"id": record.id, "status": "unknown"}

    entries = body.get("data") or []
    state = entries[0].get("indexing_status") if entries else "unknown"
    return {"id": record.id, "status": state}


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT, response_model=None)
async def delete_document(
    document_id: str,
    principal: Principal = Depends(current_principal),
    db: Session = Depends(get_db),
) -> Response:
    record = _owned_document(db, principal, document_id)
    binding = get_binding(db, principal.tenant_id, record.purpose)

    try:
        await DifyClient(binding.app_key).delete_document(record.dataset_id, record.dify_document_id)
    except DifyError as exc:
        raise HTTPException(exc.status_code, "We could not remove that document. Please try again.") from exc

    db.delete(record)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


def _owned_document(db: Session, principal: Principal, document_id: str) -> Document:
    """Look up by (id, tenant_id) together.

    Filtering on tenant_id in the same query — rather than fetching by id and
    checking afterwards — is what makes a guessed id a 404 instead of a leak.
    """
    record = (
        db.query(Document)
        .filter(Document.id == document_id, Document.tenant_id == principal.tenant_id)
        .one_or_none()
    )
    if record is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "That document does not exist.")
    return record
