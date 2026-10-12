"""Liveness and readiness.

They answer different questions, so they are separate endpoints. `/health`
says the process is up — a load balancer uses it to decide whether to restart.
`/ready` says the dependencies answer too, which is what decides whether to
send traffic. Conflating them makes a database outage look like a crash loop.
"""

from __future__ import annotations

import asyncio

import httpx
from fastapi import APIRouter, Depends, Response, status
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.config import get_settings
from app.db import get_db

router = APIRouter(tags=["ops"])


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/ready")
async def ready(response: Response, db: Session = Depends(get_db)) -> dict:
    settings = get_settings()
    checks: dict[str, str] = {}

    try:
        db.execute(text("SELECT 1"))
        checks["database"] = "ok"
    except Exception:
        checks["database"] = "unavailable"

    base = settings.dify_base_url.rstrip("/")
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            # No app key here, so 401/404 both prove Dify is answering. Only a
            # transport failure means it is unreachable.
            await client.get(f"{base}/parameters")
        checks["dify"] = "ok"
    except (httpx.HTTPError, asyncio.TimeoutError):
        checks["dify"] = "unreachable"

    healthy = all(value == "ok" for value in checks.values())
    if not healthy:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    return {"status": "ready" if healthy else "degraded", "checks": checks}
