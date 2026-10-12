"""Conversation history.

Scoping happens upstream: Dify filters by the EndUser named in `user`. These
cases pin down that the gateway always sends the session's own value.
"""

from __future__ import annotations

import httpx
import respx

from app.dify import end_user_id

BASE = "http://dify.test/v1"


@respx.mock
def test_listing_is_scoped_to_the_callers_end_user(client, make_tenant, login):
    route = respx.get(f"{BASE}/conversations").mock(
        return_value=httpx.Response(
            200,
            json={"has_more": False, "data": [{"id": "conv-1", "name": "شكوى", "updated_at": 1}]},
        )
    )
    acme = make_tenant("Acme", email="a@acme.io")

    resp = client.get("/api/conversations", headers={"Authorization": f"Bearer {login('a@acme.io')}"})

    assert resp.status_code == 200
    assert resp.json()["conversations"][0]["name"] == "شكوى"
    assert route.calls.last.request.url.params["user"] == end_user_id(acme["tenant_id"], acme["user_id"])


@respx.mock
def test_messages_carry_the_same_scope(client, make_tenant, login):
    route = respx.get(f"{BASE}/messages").mock(
        return_value=httpx.Response(200, json={"data": [{"id": "m1", "query": "س", "answer": "ج"}]})
    )
    acme = make_tenant("Acme", email="a@acme.io")

    resp = client.get(
        "/api/conversations/conv-1/messages",
        headers={"Authorization": f"Bearer {login('a@acme.io')}"},
    )

    assert resp.status_code == 200
    assert resp.json()["messages"][0]["answer"] == "ج"
    params = route.calls.last.request.url.params
    assert params["conversation_id"] == "conv-1"
    assert params["user"] == end_user_id(acme["tenant_id"], acme["user_id"])


@respx.mock
def test_another_tenant_cannot_borrow_a_conversation_id(client, make_tenant, login):
    """Passing someone else's id must still be scoped to the caller's own user."""
    route = respx.get(f"{BASE}/messages").mock(return_value=httpx.Response(200, json={"data": []}))
    acme = make_tenant("Acme", email="a@acme.io")
    globex = make_tenant("Globex", email="g@globex.io", app_key="app-globex")

    resp = client.get(
        "/api/conversations/acmes-private-conversation/messages",
        headers={"Authorization": f"Bearer {login('g@globex.io')}"},
    )

    assert resp.status_code == 200
    sent_user = route.calls.last.request.url.params["user"]
    assert sent_user == end_user_id(globex["tenant_id"], globex["user_id"])
    assert acme["tenant_id"] not in sent_user


@respx.mock
def test_rename_and_delete_pass_the_scope(client, make_tenant, login):
    import json

    rename = respx.post(f"{BASE}/conversations/conv-1/name").mock(return_value=httpx.Response(200, json={}))
    delete = respx.delete(f"{BASE}/conversations/conv-1").mock(return_value=httpx.Response(204))
    acme = make_tenant("Acme", email="a@acme.io")
    token = login("a@acme.io")
    expected = end_user_id(acme["tenant_id"], acme["user_id"])

    renamed = client.post(
        "/api/conversations/conv-1/name",
        json={"name": "طلب استرجاع"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert renamed.status_code == 200
    assert json.loads(rename.calls.last.request.content)["user"] == expected

    removed = client.delete("/api/conversations/conv-1", headers={"Authorization": f"Bearer {token}"})
    assert removed.status_code == 204
    assert json.loads(delete.calls.last.request.content)["user"] == expected


def test_history_requires_a_session(client, make_tenant):
    make_tenant("Acme", email="a@acme.io")
    assert client.get("/api/conversations").status_code == 401
