"""What a signed-in customer can see about their own account."""

from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.deps import Principal, current_principal
from app.schemas import UsageSummary
from app.usage import _quota_for, current_period

router = APIRouter(prefix="/api/account", tags=["account"])


@router.get("/usage", response_model=UsageSummary)
def usage(
    principal: Principal = Depends(current_principal),
    db: Session = Depends(get_db),
) -> UsageSummary:
    quota = _quota_for(db, principal.tenant_id)
    db.commit()
    return UsageSummary(
        period=current_period(),
        tokens_used=quota.tokens_used,
        monthly_token_limit=quota.monthly_token_limit,
        remaining=max(0, quota.monthly_token_limit - quota.tokens_used),
    )
