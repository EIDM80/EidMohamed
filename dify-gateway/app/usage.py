"""Quota enforcement and usage accounting.

Order matters: check the ceiling BEFORE calling a model, record actual usage
AFTER. Checking afterwards means you have already paid for the call you meant
to refuse.
"""

from __future__ import annotations

from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.dify import Usage
from app.models import Quota, UsageEvent


def current_period() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m")


def _quota_for(db: Session, tenant_id: str) -> Quota:
    quota = db.get(Quota, tenant_id)
    if quota is None:
        quota = Quota(tenant_id=tenant_id, period=current_period(), tokens_used=0)
        db.add(quota)
        db.flush()

    period = current_period()
    if quota.period != period:
        # New month: roll the counter over.
        quota.period = period
        quota.tokens_used = 0
        db.flush()
    return quota


def assert_within_quota(db: Session, tenant_id: str) -> Quota:
    quota = _quota_for(db, tenant_id)
    if quota.tokens_used >= quota.monthly_token_limit:
        db.commit()
        raise HTTPException(
            status.HTTP_402_PAYMENT_REQUIRED,
            "You have used this month's included tokens. Upgrade your plan or wait for the next cycle.",
        )
    db.commit()
    return quota


def record_usage(
    db: Session,
    *,
    tenant_id: str,
    user_id: str,
    purpose: str,
    usage: Usage,
    conversation_id: str | None,
    latency_ms: int,
    status_label: str = "ok",
) -> None:
    db.add(
        UsageEvent(
            tenant_id=tenant_id,
            user_id=user_id,
            purpose=purpose,
            conversation_id=conversation_id,
            prompt_tokens=usage.prompt_tokens,
            completion_tokens=usage.completion_tokens,
            total_tokens=usage.total_tokens,
            total_price=usage.total_price,
            currency=usage.currency,
            latency_ms=latency_ms,
            status=status_label,
        )
    )
    quota = _quota_for(db, tenant_id)
    quota.tokens_used += usage.total_tokens
    db.commit()
