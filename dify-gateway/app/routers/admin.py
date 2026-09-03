"""Provisioning and operations. Not reachable by customers.

Guarded by a static admin key rather than a customer session: these routes
create tenants, so they must never be callable with a customer token no matter
what that token claims. Leave ADMIN_API_KEY empty and the routes refuse
everything, which is the right default for a deployment that provisions by
hand.
"""

from __future__ import annotations

import secrets

from fastapi import APIRouter, Depends, Header, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.config import get_settings
from app.db import get_db
from app.dify import DifyClient, DifyError
from app.models import DifyBinding, Document, Quota, Tenant, UsageEvent, User
from app.plans import PLANS, get_plan
from app.security import hash_password
from app.usage import current_period

router = APIRouter(prefix="/api/admin", tags=["admin"])


def require_admin(x_admin_key: str | None = Header(default=None)) -> None:
    configured = get_settings().admin_api_key
    if not configured:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found.")
    # Constant-time compare: a plain != leaks key length and prefix by timing.
    if not x_admin_key or not secrets.compare_digest(x_admin_key, configured):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid admin key.")


class ProvisionRequest(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    email: EmailStr
    app_key: str = Field(min_length=1, description="Dify app API key (app-...)")
    plan: str = "free"
    purpose: str = "default"
    password: str | None = None
    # Reuse a shared knowledge base, or leave empty to create a dedicated one
    # when the plan calls for it.
    dataset_id: str | None = None


class ProvisionResponse(BaseModel):
    tenant_id: str
    user_id: str
    email: str
    password: str
    plan: str
    dataset_id: str | None
    metadata_value: str


@router.post("/tenants", response_model=ProvisionResponse, dependencies=[Depends(require_admin)])
async def provision(body: ProvisionRequest, db: Session = Depends(get_db)) -> ProvisionResponse:
    if body.plan not in PLANS:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, f"Unknown plan '{body.plan}'.")

    existing = db.query(User).filter(User.email == body.email).one_or_none()
    if existing is not None:
        raise HTTPException(status.HTTP_409_CONFLICT, "That email already has an account.")

    plan = get_plan(body.plan)
    password = body.password or secrets.token_urlsafe(12)

    tenant = Tenant(name=body.name, plan=plan.key)
    db.add(tenant)
    db.flush()

    dataset_id = body.dataset_id
    if dataset_id is None and plan.dedicated_dataset:
        try:
            dataset_id = await DifyClient(body.app_key).create_dataset(f"{body.name} ({tenant.id[:8]})")
        except DifyError as exc:
            db.rollback()
            raise HTTPException(status.HTTP_502_BAD_GATEWAY, "Could not create the knowledge base.") from exc

    user = User(tenant_id=tenant.id, email=body.email, password_hash=hash_password(password))
    db.add(user)
    db.add(
        DifyBinding(
            tenant_id=tenant.id,
            purpose=body.purpose,
            app_key=body.app_key,
            dataset_id=dataset_id,
            # The value the retrieval filter matches against sys.user_id's tenant part.
            metadata_value=tenant.id,
        )
    )
    db.add(
        Quota(
            tenant_id=tenant.id,
            monthly_token_limit=plan.monthly_token_limit,
            period=current_period(),
            tokens_used=0,
        )
    )
    db.commit()

    return ProvisionResponse(
        tenant_id=tenant.id,
        user_id=user.id,
        email=body.email,
        password=password,
        plan=plan.key,
        dataset_id=dataset_id,
        metadata_value=tenant.id,
    )


class PlanChange(BaseModel):
    plan: str


@router.patch("/tenants/{tenant_id}/plan", dependencies=[Depends(require_admin)])
def change_plan(tenant_id: str, body: PlanChange, db: Session = Depends(get_db)) -> dict:
    if body.plan not in PLANS:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, f"Unknown plan '{body.plan}'.")

    tenant = db.get(Tenant, tenant_id)
    if tenant is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No such tenant.")

    plan = get_plan(body.plan)
    tenant.plan = plan.key

    quota = db.get(Quota, tenant_id)
    if quota is not None:
        # Raise the ceiling, keep the counter: an upgrade mid-month should not
        # wipe what has already been used.
        quota.monthly_token_limit = plan.monthly_token_limit
    db.commit()
    return {"tenant_id": tenant_id, "plan": plan.key, "monthly_token_limit": plan.monthly_token_limit}


class SuspendChange(BaseModel):
    is_active: bool


@router.patch("/tenants/{tenant_id}/status", dependencies=[Depends(require_admin)])
def set_status(tenant_id: str, body: SuspendChange, db: Session = Depends(get_db)) -> dict:
    tenant = db.get(Tenant, tenant_id)
    if tenant is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No such tenant.")
    tenant.is_active = body.is_active
    db.commit()
    return {"tenant_id": tenant_id, "is_active": tenant.is_active}


@router.get("/tenants", dependencies=[Depends(require_admin)])
def list_tenants(db: Session = Depends(get_db)) -> dict:
    rows = db.query(Tenant).order_by(Tenant.created_at.desc()).all()
    quotas = {q.tenant_id: q for q in db.query(Quota).all()}
    docs = dict(
        db.query(Document.tenant_id, func.count(Document.id)).group_by(Document.tenant_id).all()
    )
    return {
        "tenants": [
            {
                "id": t.id,
                "name": t.name,
                "plan": t.plan,
                "is_active": t.is_active,
                "tokens_used": getattr(quotas.get(t.id), "tokens_used", 0),
                "monthly_token_limit": getattr(quotas.get(t.id), "monthly_token_limit", 0),
                "documents": docs.get(t.id, 0),
                "created_at": t.created_at.isoformat() if t.created_at else None,
            }
            for t in rows
        ]
    }


@router.get("/billing/{period}", dependencies=[Depends(require_admin)])
def billing_export(period: str, db: Session = Depends(get_db)) -> dict:
    """Per-tenant totals for one month (YYYY-MM). Feed this to your invoicing."""
    if len(period) != 7 or period[4] != "-":
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Use a YYYY-MM period, for example 2026-09.")

    rows = (
        db.query(
            UsageEvent.tenant_id,
            func.count(UsageEvent.id),
            func.sum(UsageEvent.total_tokens),
            func.sum(UsageEvent.total_price),
        )
        .filter(func.strftime("%Y-%m", UsageEvent.created_at) == period)
        .group_by(UsageEvent.tenant_id)
        .all()
        if db.get_bind().dialect.name == "sqlite"
        else db.query(
            UsageEvent.tenant_id,
            func.count(UsageEvent.id),
            func.sum(UsageEvent.total_tokens),
            func.sum(UsageEvent.total_price),
        )
        .filter(func.to_char(UsageEvent.created_at, "YYYY-MM") == period)
        .group_by(UsageEvent.tenant_id)
        .all()
    )

    return {
        "period": period,
        "lines": [
            {
                "tenant_id": tenant_id,
                "calls": calls,
                "total_tokens": int(tokens or 0),
                "total_cost": float(cost or 0),
            }
            for tenant_id, calls, tokens, cost in rows
        ],
    }
