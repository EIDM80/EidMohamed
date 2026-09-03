"""Quota and rate limiting — the parts Dify's community edition does not provide."""

from __future__ import annotations

import httpx
import respx

from dataclasses import replace

from app.db import SessionLocal
from app.models import Quota
from app.plans import get_plan

DIFY_CHAT = "http://dify.test/v1/chat-messages"


def _reply(tokens: int = 30) -> httpx.Response:
    return httpx.Response(
        200,
        json={
            "answer": "ok",
            "conversation_id": "c1",
            "message_id": "m1",
            "metadata": {"usage": {"prompt_tokens": 10, "completion_tokens": tokens - 10, "total_tokens": tokens}},
        },
    )


@respx.mock
def test_exhausted_quota_is_refused_before_the_model_is_called(client, make_tenant, login):
    route = respx.post(DIFY_CHAT).mock(return_value=_reply())
    make_tenant("Acme", email="a@acme.io", token_limit=100, tokens_used=100)

    resp = client.post(
        "/api/chat",
        json={"query": "hi"},
        headers={"Authorization": f"Bearer {login('a@acme.io')}"},
    )

    assert resp.status_code == 402
    # The point of checking first: no model call was paid for.
    assert route.call_count == 0


@respx.mock
def test_usage_accumulates_against_the_quota(client, make_tenant, login):
    respx.post(DIFY_CHAT).mock(return_value=_reply(tokens=30))
    acme = make_tenant("Acme", email="a@acme.io", token_limit=1000)
    token = login("a@acme.io")

    for _ in range(3):
        client.post("/api/chat", json={"query": "hi"}, headers={"Authorization": f"Bearer {token}"})

    with SessionLocal() as db:
        assert db.get(Quota, acme["tenant_id"]).tokens_used == 90

    resp = client.get("/api/account/usage", headers={"Authorization": f"Bearer {token}"})
    assert resp.json() == {
        "period": resp.json()["period"],
        "tokens_used": 90,
        "monthly_token_limit": 1000,
        "remaining": 910,
    }


@respx.mock
def test_rate_limit_is_per_tenant(client, make_tenant, login, monkeypatch):
    respx.post(DIFY_CHAT).mock(return_value=_reply())
    make_tenant("Acme", email="a@acme.io")
    make_tenant("Globex", email="g@globex.io")
    acme_token = login("a@acme.io")
    globex_token = login("g@globex.io")

    tight = replace(get_plan("pro"), requests_per_minute=2)
    monkeypatch.setattr("app.routers.chat.get_plan", lambda _plan: tight)

    for _ in range(2):
        allowed = client.post("/api/chat", json={"query": "hi"}, headers={"Authorization": f"Bearer {acme_token}"})
        assert allowed.status_code == 200

    blocked = client.post("/api/chat", json={"query": "hi"}, headers={"Authorization": f"Bearer {acme_token}"})
    assert blocked.status_code == 429
    assert "Retry-After" in blocked.headers

    # A noisy tenant must not throttle a quiet one.
    other = client.post("/api/chat", json={"query": "hi"}, headers={"Authorization": f"Bearer {globex_token}"})
    assert other.status_code == 200


@respx.mock
def test_plan_sets_the_rate_allowance(client, make_tenant, login):
    """The free plan's 10/minute must apply without any per-test patching."""
    respx.post(DIFY_CHAT).mock(return_value=_reply(tokens=1))
    make_tenant("Small", email="s@small.io", plan="free", token_limit=1_000_000)
    token = login("s@small.io")

    codes = [
        client.post("/api/chat", json={"query": "hi"}, headers={"Authorization": f"Bearer {token}"}).status_code
        for _ in range(11)
    ]

    assert codes[:10] == [200] * 10
    assert codes[10] == 429
