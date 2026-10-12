"""Billing webhook.

A forged or replayed event changes what a tenant is entitled to, so signature
verification and idempotency are both security properties, not conveniences.
"""

from __future__ import annotations

import hashlib
import hmac
import json
import time

import pytest

from app.billing import SignatureError, plan_for_price, verify_signature
from app.db import SessionLocal
from app.models import Quota, Tenant

SECRET = "whsec-test"


def sign(payload: bytes, *, timestamp: int | None = None, secret: str = SECRET) -> str:
    ts = int(time.time()) if timestamp is None else timestamp
    digest = hmac.new(secret.encode(), f"{ts}.".encode() + payload, hashlib.sha256).hexdigest()
    return f"t={ts},v1={digest}"


def subscription_event(customer: str, price: str, *, event_id="evt_1", kind="customer.subscription.updated"):
    return {
        "id": event_id,
        "type": kind,
        "data": {
            "object": {
                "object": "subscription",
                "id": "sub_1",
                "customer": customer,
                "items": {"data": [{"price": {"id": price}}]},
            }
        },
    }


def post(client, event: dict, *, signature: str | None = None):
    raw = json.dumps(event).encode()
    return client.post(
        "/api/billing/webhook",
        content=raw,
        headers={"Stripe-Signature": signature if signature is not None else sign(raw)},
    )


def link_billing(tenant_id: str, customer_id: str) -> None:
    with SessionLocal() as db:
        db.get(Tenant, tenant_id).billing_customer_id = customer_id
        db.commit()


# ----------------------------------------------------------------- signatures


def test_valid_signature_passes():
    payload = b'{"id":"evt_1"}'
    verify_signature(payload, sign(payload))


def test_forged_signature_is_rejected():
    payload = b'{"id":"evt_1"}'
    with pytest.raises(SignatureError):
        verify_signature(payload, sign(payload, secret="attacker-secret"))


def test_tampered_payload_is_rejected():
    signature = sign(b'{"plan":"free"}')
    with pytest.raises(SignatureError):
        verify_signature(b'{"plan":"enterprise"}', signature)


def test_replayed_signature_outside_the_window_is_rejected():
    """A signature valid days ago must not re-apply a plan today."""
    payload = b'{"id":"evt_1"}'
    stale = int(time.time()) - 86_400
    with pytest.raises(SignatureError):
        verify_signature(payload, sign(payload, timestamp=stale))


@pytest.mark.parametrize("header", [None, "", "garbage", "t=123", "v1=abc"])
def test_malformed_headers_are_rejected(header):
    with pytest.raises(SignatureError):
        verify_signature(b"{}", header)


def test_price_map_resolves_plans():
    assert plan_for_price("price_pro") == "pro"
    assert plan_for_price("price_ent") == "enterprise"
    assert plan_for_price("price_unknown") is None
    assert plan_for_price(None) is None


# --------------------------------------------------------------------- routes


def test_unsigned_request_is_refused(client, make_tenant):
    acme = make_tenant("Acme", email="a@acme.io")
    link_billing(acme["tenant_id"], "cus_acme")

    resp = post(client, subscription_event("cus_acme", "price_ent"), signature="t=1,v1=deadbeef")

    assert resp.status_code == 400
    with SessionLocal() as db:
        assert db.get(Tenant, acme["tenant_id"]).plan == "pro", "an unsigned event must change nothing"


def test_subscription_update_applies_the_plan(client, make_tenant):
    acme = make_tenant("Acme", email="a@acme.io", token_limit=50_000, tokens_used=40_000)
    link_billing(acme["tenant_id"], "cus_acme")

    resp = post(client, subscription_event("cus_acme", "price_ent"))

    assert resp.status_code == 200
    assert resp.json() == {"status": "applied", "plan": "enterprise"}
    with SessionLocal() as db:
        assert db.get(Tenant, acme["tenant_id"]).plan == "enterprise"
        quota = db.get(Quota, acme["tenant_id"])
        assert quota.monthly_token_limit == 20_000_000
        assert quota.tokens_used == 40_000, "a plan change must not erase the month's usage"


def test_duplicate_delivery_is_applied_once(client, make_tenant):
    """Providers retry. Re-applying a subscription event must be a no-op."""
    acme = make_tenant("Acme", email="a@acme.io")
    link_billing(acme["tenant_id"], "cus_acme")

    first = post(client, subscription_event("cus_acme", "price_ent"))
    second = post(client, subscription_event("cus_acme", "price_ent"))

    assert first.json()["status"] == "applied"
    assert second.json()["status"] == "duplicate"


def test_cancellation_downgrades_to_the_default_plan(client, make_tenant):
    acme = make_tenant("Acme", email="a@acme.io")
    link_billing(acme["tenant_id"], "cus_acme")

    resp = post(
        client,
        subscription_event("cus_acme", "price_ent", kind="customer.subscription.deleted"),
    )

    assert resp.json()["status"] == "downgraded"
    with SessionLocal() as db:
        tenant = db.get(Tenant, acme["tenant_id"])
        assert tenant.plan == "free"
        assert tenant.billing_subscription_id is None
        assert db.get(Quota, acme["tenant_id"]).monthly_token_limit == 50_000


def test_unknown_customer_is_acknowledged_not_retried(client):
    """Retrying will not make an unknown customer known, so return 200."""
    resp = post(client, subscription_event("cus_nobody", "price_ent"))
    assert resp.status_code == 200
    assert resp.json()["status"] == "unknown_customer"


def test_unmapped_price_leaves_the_plan_alone(client, make_tenant):
    acme = make_tenant("Acme", email="a@acme.io")
    link_billing(acme["tenant_id"], "cus_acme")

    resp = post(client, subscription_event("cus_acme", "price_mystery"))

    assert resp.json()["status"] == "unmapped_price"
    with SessionLocal() as db:
        assert db.get(Tenant, acme["tenant_id"]).plan == "pro"


def test_irrelevant_event_types_are_ignored(client):
    resp = post(client, {"id": "evt_x", "type": "invoice.payment_succeeded", "data": {"object": {}}})
    assert resp.status_code == 200
    assert resp.json()["status"] == "ignored"
