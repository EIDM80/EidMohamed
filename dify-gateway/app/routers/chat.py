"""The customer-facing chat endpoint.

This is where the architecture is enforced: identity comes from the session,
the quota is checked before spending, Dify is called with a server-built user
id, and usage is written once the answer completes.
"""

from __future__ import annotations

import time

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.config import get_settings
from app.deps import Principal, current_principal, get_binding
from app.dify import ChatResult, DifyClient, DifyError
from app.db import SessionLocal, get_db
from app.plans import get_plan
from app.ratelimit import build_limiter
from app.schemas import ChatRequest, ChatResponse
from app.usage import assert_within_quota, record_usage

settings = get_settings()
router = APIRouter(prefix="/api", tags=["chat"])
limiter = build_limiter(settings.redis_url or None, settings.rate_limit_per_minute)


@router.post("/chat", response_model=ChatResponse)
async def chat(
    body: ChatRequest,
    principal: Principal = Depends(current_principal),
    db: Session = Depends(get_db),
) -> ChatResponse:
    limiter.check(principal.tenant_id, get_plan(principal.plan).requests_per_minute)
    assert_within_quota(db, principal.tenant_id)
    binding = get_binding(db, principal.tenant_id, body.purpose)

    client = DifyClient(binding.app_key)
    started = time.monotonic()
    try:
        result = await client.chat(
            query=body.query,
            tenant_id=principal.tenant_id,
            user_id=principal.user_id,
            conversation_id=body.conversation_id,
            inputs=body.inputs,
        )
    except DifyError as exc:
        # Never surface Dify's own error text to a customer.
        raise HTTPException(exc.status_code, "The assistant is unavailable right now. Please try again.") from exc

    record_usage(
        db,
        tenant_id=principal.tenant_id,
        user_id=principal.user_id,
        purpose=body.purpose,
        usage=result.usage,
        conversation_id=result.conversation_id,
        latency_ms=int((time.monotonic() - started) * 1000),
    )

    return ChatResponse(
        answer=result.answer,
        conversation_id=result.conversation_id,
        message_id=result.message_id,
        total_tokens=result.usage.total_tokens,
    )


@router.post("/chat/stream")
async def chat_stream(
    body: ChatRequest,
    request: Request,
    principal: Principal = Depends(current_principal),
    db: Session = Depends(get_db),
) -> StreamingResponse:
    limiter.check(principal.tenant_id, get_plan(principal.plan).requests_per_minute)
    assert_within_quota(db, principal.tenant_id)
    binding = get_binding(db, principal.tenant_id, body.purpose)

    client = DifyClient(binding.app_key)
    collected = ChatResult()
    started = time.monotonic()

    async def generate():
        status_label = "ok"
        try:
            async for chunk in client.stream_chat(
                query=body.query,
                tenant_id=principal.tenant_id,
                user_id=principal.user_id,
                conversation_id=body.conversation_id,
                inputs=body.inputs,
                result=collected,
            ):
                if await request.is_disconnected():
                    status_label = "client_disconnected"
                    break
                yield chunk
        except DifyError:
            status_label = "error"
            yield "\n[The assistant is unavailable right now. Please try again.]"
        finally:
            # The request-scoped session may already be closing by the time the
            # stream drains, so account for usage on a session of our own.
            with SessionLocal() as session:
                record_usage(
                    session,
                    tenant_id=principal.tenant_id,
                    user_id=principal.user_id,
                    purpose=body.purpose,
                    usage=collected.usage,
                    conversation_id=collected.conversation_id,
                    latency_ms=int((time.monotonic() - started) * 1000),
                    status_label=status_label,
                )

    return StreamingResponse(generate(), media_type="text/plain; charset=utf-8")
