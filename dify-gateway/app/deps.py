"""Request dependencies: who is calling, and are they allowed to."""

from __future__ import annotations

from dataclasses import dataclass

import jwt
from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import DifyBinding, Tenant, User
from app.security import decode_token


@dataclass(frozen=True)
class Principal:
    """The authenticated caller, resolved entirely server-side."""

    tenant_id: str
    user_id: str
    plan: str


def current_principal(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
) -> Principal:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Sign in to continue.")

    try:
        claims = decode_token(authorization.split(" ", 1)[1].strip())
    except jwt.PyJWTError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Your session expired. Sign in again.")

    user_id = claims.get("sub")
    tenant_id = claims.get("tid")
    if not user_id or not tenant_id:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Your session expired. Sign in again.")

    # Re-check against the database: a token stays valid until it expires, but a
    # deactivated user or suspended tenant must lose access immediately.
    user = db.get(User, user_id)
    if user is None or not user.is_active or user.tenant_id != tenant_id:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Your session expired. Sign in again.")

    tenant = db.get(Tenant, tenant_id)
    if tenant is None or not tenant.is_active:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "This account is suspended. Contact support.")

    return Principal(tenant_id=tenant.id, user_id=user.id, plan=tenant.plan)


def get_binding(db: Session, tenant_id: str, purpose: str) -> DifyBinding:
    binding = (
        db.query(DifyBinding)
        .filter(DifyBinding.tenant_id == tenant_id, DifyBinding.purpose == purpose)
        .one_or_none()
    )
    if binding is None:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            f"No assistant is configured for '{purpose}' on this account.",
        )
    return binding
