from __future__ import annotations

from app.db import SessionLocal
from app.models import Tenant, User


def test_login_succeeds_with_correct_credentials(client, make_tenant):
    make_tenant("Acme", email="a@acme.io", password="correct-horse")
    resp = client.post("/api/auth/login", json={"email": "a@acme.io", "password": "correct-horse"})
    assert resp.status_code == 200
    assert resp.json()["access_token"]


def test_wrong_password_and_unknown_email_look_identical(client, make_tenant):
    make_tenant("Acme", email="a@acme.io", password="correct-horse")

    wrong = client.post("/api/auth/login", json={"email": "a@acme.io", "password": "nope"})
    unknown = client.post("/api/auth/login", json={"email": "ghost@nowhere.io", "password": "nope"})

    assert wrong.status_code == unknown.status_code == 401
    assert wrong.json()["detail"] == unknown.json()["detail"]


def test_suspended_tenant_loses_access_immediately(client, make_tenant, login):
    acme = make_tenant("Acme", email="a@acme.io")
    token = login("a@acme.io")

    with SessionLocal() as db:
        db.get(Tenant, acme["tenant_id"]).is_active = False
        db.commit()

    # The token is still cryptographically valid; the database check is what stops it.
    resp = client.post("/api/chat", json={"query": "hi"}, headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 403


def test_deactivated_user_loses_access_immediately(client, make_tenant, login):
    acme = make_tenant("Acme", email="a@acme.io")
    token = login("a@acme.io")

    with SessionLocal() as db:
        db.get(User, acme["user_id"]).is_active = False
        db.commit()

    resp = client.post("/api/chat", json={"query": "hi"}, headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 401
