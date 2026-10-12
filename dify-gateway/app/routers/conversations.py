"""A customer's own chat history.

Every call passes the server-built `user` value, and Dify scopes its response
to that EndUser. So a conversation id belonging to another tenant returns
nothing useful rather than another customer's messages — the scoping happens
upstream, not in a filter here that could be forgotten.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Response, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.db import get_db
from app.deps import Principal, current_principal, get_binding
from app.dify import DifyClient, DifyError

router = APIRouter(prefix="/api/conversations", tags=["conversations"])
UNAVAILABLE = "We could not load your conversations. Please try again."


def _client(db: Session, principal: Principal, purpose: str) -> DifyClient:
    return DifyClient(get_binding(db, principal.tenant_id, purpose).app_key)


@router.get("")
async def list_conversations(
    limit: int = 20,
    last_id: str | None = None,
    purpose: str = "default",
    principal: Principal = Depends(current_principal),
    db: Session = Depends(get_db),
) -> dict:
    client = _client(db, principal, purpose)
    try:
        body = await client.list_conversations(
            tenant_id=principal.tenant_id,
            user_id=principal.user_id,
            limit=min(max(1, limit), 100),
            last_id=last_id,
        )
    except DifyError as exc:
        raise HTTPException(exc.status_code, UNAVAILABLE) from exc

    return {
        "has_more": body.get("has_more", False),
        "conversations": [
            {
                "id": item.get("id"),
                "name": item.get("name"),
                "updated_at": item.get("updated_at"),
            }
            for item in body.get("data") or []
        ],
    }


@router.get("/{conversation_id}/messages")
async def list_messages(
    conversation_id: str,
    limit: int = 50,
    purpose: str = "default",
    principal: Principal = Depends(current_principal),
    db: Session = Depends(get_db),
) -> dict:
    client = _client(db, principal, purpose)
    try:
        body = await client.list_messages(
            conversation_id=conversation_id,
            tenant_id=principal.tenant_id,
            user_id=principal.user_id,
            limit=min(max(1, limit), 100),
        )
    except DifyError as exc:
        raise HTTPException(exc.status_code, UNAVAILABLE) from exc

    return {
        "messages": [
            {
                "id": item.get("id"),
                "query": item.get("query"),
                "answer": item.get("answer"),
                "created_at": item.get("created_at"),
            }
            for item in body.get("data") or []
        ]
    }


class RenameRequest(BaseModel):
    name: str = Field(min_length=1, max_length=200)


@router.post("/{conversation_id}/name")
async def rename(
    conversation_id: str,
    body: RenameRequest,
    purpose: str = "default",
    principal: Principal = Depends(current_principal),
    db: Session = Depends(get_db),
) -> dict:
    client = _client(db, principal, purpose)
    try:
        await client.rename_conversation(
            conversation_id=conversation_id,
            tenant_id=principal.tenant_id,
            user_id=principal.user_id,
            name=body.name,
        )
    except DifyError as exc:
        raise HTTPException(exc.status_code, "We could not rename that conversation.") from exc
    return {"id": conversation_id, "name": body.name}


@router.delete("/{conversation_id}", status_code=status.HTTP_204_NO_CONTENT, response_model=None)
async def delete_conversation(
    conversation_id: str,
    purpose: str = "default",
    principal: Principal = Depends(current_principal),
    db: Session = Depends(get_db),
) -> Response:
    client = _client(db, principal, purpose)
    try:
        await client.delete_conversation(
            conversation_id=conversation_id,
            tenant_id=principal.tenant_id,
            user_id=principal.user_id,
        )
    except DifyError as exc:
        raise HTTPException(exc.status_code, "We could not remove that conversation.") from exc
    return Response(status_code=status.HTTP_204_NO_CONTENT)
