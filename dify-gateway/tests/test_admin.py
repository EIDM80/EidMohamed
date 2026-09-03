"""Provisioning routes. A customer token must never open these."""

from __future__ import annotations

import httpx
import respx

from app.db import SessionLocal
from app.models import DifyBinding, Quota, Tenant

ADMIN = {"X-Admin-Key": "test-admin-key"}


def test_admin_routes_reject_customer_tokens_and_bad_keys(client, make_tenant, login):
    make_tenant("Acme", email="a@acme.io")
    customer_token = login("a@acme.io")

    assert client.get("/api/admin/tenants").status_code == 401
    assert client.get("/api/admin/tenants", headers={"X-Admin-Key": "wrong"}).status_code == 401
    # A valid customer session is still not an admin key.
    assert client.get(
        "/api/admin/tenants", headers={"Authorization": f"Bearer {customer_token}"}
    ).status_code == 401
    assert client.get("/api/admin/tenants", headers=ADMIN).status_code == 200


def test_provision_creates_a_complete_tenant(client):
    resp = client.post(
        "/api/admin/tenants",
        headers=ADMIN,
        json={"name": "Acme", "email": "owner@acme.io", "app_key": "app-acme", "plan": "pro"},
    )
    assert resp.status_code == 200, resp.text
    body = resp.json()

    # The tag the retrieval filter matches is the tenant id itself.
    assert body["metadata_value"] == body["tenant_id"]

    with SessionLocal() as db:
        tenant = db.get(Tenant, body["tenant_id"])
        assert tenant.plan == "pro"
        quota = db.get(Quota, body["tenant_id"])
        assert quota.monthly_token_limit == 2_000_000
        binding = db.query(DifyBinding).filter(DifyBinding.tenant_id == body["tenant_id"]).one()
        assert binding.app_key == "app-acme"

    # The generated password works straight away.
    login = client.post("/api/auth/login", json={"email": "owner@acme.io", "password": body["password"]})
    assert login.status_code == 200


@respx.mock
def test_enterprise_plan_gets_its_own_dataset(client):
    route = respx.post("http://dify.test/v1/datasets").mock(
        return_value=httpx.Response(200, json={"id": "ds-dedicated"})
    )

    resp = client.post(
        "/api/admin/tenants",
        headers=ADMIN,
        json={"name": "BigCo", "email": "ops@bigco.io", "app_key": "app-bigco", "plan": "enterprise"},
    )

    assert resp.status_code == 200, resp.text
    assert route.called
    assert resp.json()["dataset_id"] == "ds-dedicated"


def test_duplicate_email_is_refused(client, make_tenant):
    make_tenant("Acme", email="a@acme.io")
    resp = client.post(
        "/api/admin/tenants",
        headers=ADMIN,
        json={"name": "Other", "email": "a@acme.io", "app_key": "app-x"},
    )
    assert resp.status_code == 409


def test_unknown_plan_is_refused(client):
    resp = client.post(
        "/api/admin/tenants",
        headers=ADMIN,
        json={"name": "Acme", "email": "a@acme.io", "app_key": "app-x", "plan": "platinum"},
    )
    assert resp.status_code == 400


def test_plan_change_raises_the_ceiling_without_clearing_usage(client, make_tenant):
    acme = make_tenant("Acme", email="a@acme.io", token_limit=50_000, tokens_used=40_000)

    resp = client.patch(
        f"/api/admin/tenants/{acme['tenant_id']}/plan",
        headers=ADMIN,
        json={"plan": "enterprise"},
    )

    assert resp.status_code == 200
    with SessionLocal() as db:
        quota = db.get(Quota, acme["tenant_id"])
        assert quota.monthly_token_limit == 20_000_000
        assert quota.tokens_used == 40_000, "an upgrade must not wipe the month's usage"


def test_suspending_a_tenant_takes_effect_immediately(client, make_tenant, login):
    acme = make_tenant("Acme", email="a@acme.io")
    token = login("a@acme.io")

    client.patch(f"/api/admin/tenants/{acme['tenant_id']}/status", headers=ADMIN, json={"is_active": False})

    assert client.post(
        "/api/chat", json={"query": "hi"}, headers={"Authorization": f"Bearer {token}"}
    ).status_code == 403


def test_email_is_unique_across_tenants(client, make_tenant):
    """Login is by email alone, so two tenants sharing one would make it ambiguous."""
    make_tenant("Acme", email="shared@example.com")

    resp = client.post(
        "/api/admin/tenants",
        headers=ADMIN,
        json={"name": "Globex", "email": "shared@example.com", "app_key": "app-globex"},
    )
    assert resp.status_code == 409

    # And login still resolves to exactly one account rather than erroring.
    assert client.post(
        "/api/auth/login", json={"email": "shared@example.com", "password": "pw-12345"}
    ).status_code == 200


def test_billing_export_totals_per_tenant(client, make_tenant):
    from app.db import SessionLocal
    from app.models import UsageEvent
    from app.usage import current_period

    acme = make_tenant("Acme", email="a@acme.io")
    globex = make_tenant("Globex", email="g@globex.io")

    with SessionLocal() as db:
        for _ in range(2):
            db.add(UsageEvent(tenant_id=acme["tenant_id"], user_id=acme["user_id"], total_tokens=100))
        db.add(UsageEvent(tenant_id=globex["tenant_id"], user_id=globex["user_id"], total_tokens=7))
        db.commit()

    resp = client.get(f"/api/admin/billing/{current_period()}", headers=ADMIN)
    assert resp.status_code == 200, resp.text

    lines = {line["tenant_id"]: line for line in resp.json()["lines"]}
    assert lines[acme["tenant_id"]]["calls"] == 2
    assert lines[acme["tenant_id"]]["total_tokens"] == 200
    assert lines[globex["tenant_id"]]["total_tokens"] == 7


def test_billing_export_rejects_a_malformed_period(client):
    assert client.get("/api/admin/billing/2026", headers=ADMIN).status_code == 400
