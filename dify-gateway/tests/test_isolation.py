"""The invariant the whole architecture rests on.

If any test in this file fails, customer data is leaking. Treat a failure here
as a release blocker, not a bug to triage.
"""

from __future__ import annotations

import json

import httpx
import respx

from app.db import SessionLocal
from app.dify import end_user_id
from app.models import UsageEvent

DIFY_CHAT = "http://dify.test/v1/chat-messages"


def _dify_reply(answer: str = "مرحباً", tokens: int = 42) -> httpx.Response:
    return httpx.Response(
        200,
        json={
            "answer": answer,
            "conversation_id": "conv-1",
            "message_id": "msg-1",
            "metadata": {
                "usage": {
                    "prompt_tokens": 10,
                    "completion_tokens": tokens - 10,
                    "total_tokens": tokens,
                    "total_price": "0.0012",
                    "currency": "USD",
                }
            },
        },
    )


@respx.mock
def test_user_field_is_built_from_the_session(client, make_tenant, login):
    """Dify must receive the tenant identity we derived, in the documented shape."""
    route = respx.post(DIFY_CHAT).mock(return_value=_dify_reply())
    acme = make_tenant("Acme", email="a@acme.io")
    token = login("a@acme.io")

    resp = client.post(
        "/api/chat",
        json={"query": "ما سياسة الاسترجاع؟"},
        headers={"Authorization": f"Bearer {token}"},
    )

    assert resp.status_code == 200, resp.text
    sent = json.loads(route.calls.last.request.content)
    assert sent["user"] == end_user_id(acme["tenant_id"], acme["user_id"])
    assert sent["user"] == f"{acme['tenant_id']}:{acme['user_id']}"


@respx.mock
def test_client_cannot_override_tenant_identity(client, make_tenant, login):
    """A caller forging tenant_id in the body must not change what Dify sees.

    This is the attack the whole design exists to stop.
    """
    route = respx.post(DIFY_CHAT).mock(return_value=_dify_reply())
    acme = make_tenant("Acme", email="a@acme.io")
    victim = make_tenant("Victim", email="v@victim.io")
    token = login("a@acme.io")

    resp = client.post(
        "/api/chat",
        json={
            "query": "hello",
            # All hostile. None of it may reach Dify.
            "tenant_id": victim["tenant_id"],
            "user": f"{victim['tenant_id']}:{victim['user_id']}",
            "inputs": {"tenant_id": victim["tenant_id"]},
        },
        headers={"Authorization": f"Bearer {token}"},
    )

    assert resp.status_code == 200, resp.text
    sent = json.loads(route.calls.last.request.content)
    assert sent["user"] == end_user_id(acme["tenant_id"], acme["user_id"])
    assert victim["tenant_id"] not in sent["user"]


@respx.mock
def test_each_tenant_uses_its_own_dify_app_key(client, make_tenant, login):
    route = respx.post(DIFY_CHAT).mock(return_value=_dify_reply())
    make_tenant("Acme", email="a@acme.io", app_key="app-acme")
    make_tenant("Globex", email="g@globex.io", app_key="app-globex")

    client.post(
        "/api/chat",
        json={"query": "hi"},
        headers={"Authorization": f"Bearer {login('a@acme.io')}"},
    )
    assert route.calls.last.request.headers["authorization"] == "Bearer app-acme"

    client.post(
        "/api/chat",
        json={"query": "hi"},
        headers={"Authorization": f"Bearer {login('g@globex.io')}"},
    )
    assert route.calls.last.request.headers["authorization"] == "Bearer app-globex"


@respx.mock
def test_usage_is_attributed_to_the_calling_tenant(client, make_tenant, login):
    respx.post(DIFY_CHAT).mock(return_value=_dify_reply(tokens=42))
    acme = make_tenant("Acme", email="a@acme.io")
    make_tenant("Globex", email="g@globex.io")

    client.post(
        "/api/chat",
        json={"query": "hi"},
        headers={"Authorization": f"Bearer {login('a@acme.io')}"},
    )

    with SessionLocal() as db:
        events = db.query(UsageEvent).all()
        assert len(events) == 1
        assert events[0].tenant_id == acme["tenant_id"]
        assert events[0].total_tokens == 42


def test_anonymous_and_forged_tokens_are_refused(client, make_tenant):
    make_tenant("Acme", email="a@acme.io")

    assert client.post("/api/chat", json={"query": "hi"}).status_code == 401
    assert (
        client.post(
            "/api/chat",
            json={"query": "hi"},
            headers={"Authorization": "Bearer not-a-real-token"},
        ).status_code
        == 401
    )
