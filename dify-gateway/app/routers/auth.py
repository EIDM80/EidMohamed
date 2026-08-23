"""Sign-in for your customers. Unrelated to Dify's own accounts."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Tenant, User
from app.schemas import LoginRequest, TokenResponse
from app.security import issue_token, verify_password

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    user = db.query(User).filter(User.email == body.email).one_or_none()

    # Same response for unknown email and wrong password: do not confirm which
    # addresses are registered.
    if user is None or not verify_password(body.password, user.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Email or password is incorrect.")
    if not user.is_active:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "This user is deactivated. Contact your administrator.")

    tenant = db.get(Tenant, user.tenant_id)
    if tenant is None or not tenant.is_active:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "This account is suspended. Contact support.")

    return TokenResponse(access_token=issue_token(tenant_id=user.tenant_id, user_id=user.id))
