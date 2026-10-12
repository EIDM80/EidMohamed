from __future__ import annotations

import httpx
import respx


def test_health_reports_liveness_only(client):
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}


@respx.mock
def test_ready_is_200_when_dependencies_answer(client):
    respx.get("http://dify.test/v1/parameters").mock(return_value=httpx.Response(401))
    resp = client.get("/ready")
    assert resp.status_code == 200
    assert resp.json()["checks"] == {"database": "ok", "dify": "ok"}


@respx.mock
def test_ready_is_503_when_dify_is_unreachable(client):
    """Readiness must fail so traffic stops; liveness must not, so nothing restarts."""
    respx.get("http://dify.test/v1/parameters").mock(side_effect=httpx.ConnectError("refused"))

    assert client.get("/ready").status_code == 503
    assert client.get("/health").status_code == 200


def test_dashboard_is_served_and_leaks_no_dify_details(client):
    resp = client.get("/app/")
    assert resp.status_code == 200

    page = resp.text
    assert "/api/chat/stream" in page
    # The browser must never see a Dify key, host, or endpoint.
    assert "dify" not in page.lower()
    assert "app-" not in page
