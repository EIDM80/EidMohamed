"""Gateway entrypoint.

Dify sits behind this process and is never reachable from the public network.
Bind the Dify containers to a private network and expose only this service.
"""

from __future__ import annotations

import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.config import get_settings
from app.db import Base, engine
from app.routers import account, auth, chat

settings = get_settings()
logging.basicConfig(level=settings.log_level)


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    # Fine for development. Use Alembic migrations once the schema is live.
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="Dify Gateway",
    description="Multi-tenant boundary in front of a single-workspace Dify deployment.",
    version="0.1.0",
    lifespan=lifespan,
)

app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(account.router)


@app.get("/health", tags=["ops"])
def health() -> dict[str, str]:
    return {"status": "ok"}
