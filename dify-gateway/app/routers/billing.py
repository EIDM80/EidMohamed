"""Billing webhook.

Subscription events change what a tenant is allowed to do, so three things hold
here: the payload is verified before it is parsed, each event id is applied at
most once, and an unmatched customer is acknowledged rather than retried
forever.

The endpoint returns 200 for anything it has deliberately decided to ignore.
A provider retries non-2xx responses, and retrying an event we will never act
on just fills the queue.
"""

from __future__ import annotations

import json
import logging

from fastapi import APIRouter, Depends, Header, HTTPException, Request, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.billing import SignatureError, extract_price_id, plan_for_price, verify_signature
from app.config import get_settings
from app.db import get_db
from app.models import Quota, Tenant, WebhookEvent
from app.plans import DEFAULT_PLAN, get_plan

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/billing", tags=["billing"])

# Events that change a tenant's entitlement. Anything else is acknowledged and dropped.
HANDLED = {
    "checkout.session.completed",
    "customer.subscription.created",
    "customer.subscription.updated",
    "customer.subscription.deleted",
}


def _apply_plan(db: Session, tenant: Tenant, plan_key: str) -> None:
    plan = get_plan(plan_key)
    tenant.plan = plan.key
    quota = db.get(Quota, tenant.id)
    if quota is not None:
        # Move the ceiling, keep the counter: a mid-month change must not erase
        # usage already incurred.
        quota.monthly_token_limit = plan.monthly_token_limit


@router.post("/webhook", status_code=status.HTTP_200_OK)
async def webhook(
    request: Request,
    stripe_signature: str | None = Header(default=None, alias="Stripe-Signature"),
    db: Session = Depends(get_db),
) -> dict[str, str]:
    settings = get_settings()
    if not settings.billing_webhook_secret:
        # Not configured means not in use; do not advertise the endpoint.
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found.")

    raw = await request.body()
    try:
        verify_signature(raw, stripe_signature)
    except SignatureError as exc:
        logger.warning("rejected billing webhook: %s", exc)
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid signature.") from exc

    try:
        event = json.loads(raw)
    except json.JSONDecodeError as exc:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Malformed payload.") from exc

    event_id = event.get("id")
    event_type = event.get("type", "")
    if not event_id:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Event is missing an id.")

    if event_type not in HANDLED:
        return {"status": "ignored"}

    # Claim the event id first. A duplicate delivery loses the race and exits
    # before touching any plan.
    db.add(WebhookEvent(event_id=event_id, event_type=event_type))
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        logger.info("billing event %s already applied, skipping", event_id)
        return {"status": "duplicate"}

    obj = (event.get("data") or {}).get("object") or {}
    customer_id = obj.get("customer")
    if not customer_id:
        logger.warning("billing event %s carries no customer id", event_id)
        return {"status": "ignored"}

    tenant = db.query(Tenant).filter(Tenant.billing_customer_id == str(customer_id)).one_or_none()
    if tenant is None:
        # Acknowledge: retrying will not make an unknown customer known. Surface
        # it in logs so the link can be made by hand.
        logger.error("billing event %s references unknown customer %s", event_id, customer_id)
        return {"status": "unknown_customer"}

    if event_type == "customer.subscription.deleted":
        tenant.billing_subscription_id = None
        _apply_plan(db, tenant, DEFAULT_PLAN)
        db.commit()
        logger.info("tenant %s downgraded to %s after cancellation", tenant.id, DEFAULT_PLAN)
        return {"status": "downgraded"}

    subscription = obj if obj.get("object") == "subscription" else obj.get("subscription") or obj
    if isinstance(subscription, str):
        # checkout.session.completed can carry only the subscription id. Without
        # the price we cannot tell which plan was bought, so record the id and
        # wait for the subscription.created event that follows.
        tenant.billing_subscription_id = subscription
        db.commit()
        return {"status": "awaiting_subscription_detail"}

    plan_key = plan_for_price(extract_price_id(subscription))
    if plan_key is None:
        logger.error("billing event %s has no plan mapping for its price", event_id)
        return {"status": "unmapped_price"}

    tenant.billing_subscription_id = subscription.get("id") or tenant.billing_subscription_id
    _apply_plan(db, tenant, plan_key)
    db.commit()
    logger.info("tenant %s moved to plan %s", tenant.id, plan_key)
    return {"status": "applied", "plan": plan_key}
