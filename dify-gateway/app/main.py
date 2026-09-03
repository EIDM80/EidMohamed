"""Gateway entrypoint.

Dify sits behind this process and is never reachable from the public network.
Bind the Dify containers to a private network and expose only this service.
"""

from __future__ import annotations

import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import observability
from app.config import get_settings
from app.db import Base, engine
from app.routers import account, admin, auth, chat, documents

settings = get_settings()
logging.basicConfig(level=settings.log_level)
logger = logging.getLogger("gateway")


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    if settings.gateway_database_url.startswith("sqlite"):
        # Convenience for local development. Postgres deployments run Alembic:
        #   alembic upgrade head
        Base.metadata.create_all(bind=engine)
    if settings.gateway_secret_key == "dev-only-insecure-key":
        logger.warning("GATEWAY_SECRET_KEY is the default value — set a real one before deploying.")
    yield


app = FastAPI(
    title="Dify Gateway",
    description="Multi-tenant boundary in front of a single-workspace Dify deployment.",
    version="0.2.0",
    lifespan=lifespan,
)

observability.install(app, json_logs=settings.json_logs)

if settings.cors_origin_list:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
    )

app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(documents.router)
app.include_router(account.router)
app.include_router(admin.router)


@app.get("/health", tags=["ops"])
def health() -> dict[str, str]:
    return {"status": "ok"}
