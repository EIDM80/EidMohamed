"""The only module that knows Dify exists.

Everything Dify-specific is confined here and to models.DifyBinding, so that
swapping the engine later is a contained change rather than a rewrite.

Two rules this module enforces:
  1. The `user` field is always built server-side from the authenticated
     session, as "<tenant_id>:<user_id>". Inside a Dify workflow it arrives as
     `sys.user_id`, which is what the knowledge retrieval metadata filter
     matches on. That is the isolation mechanism.
  2. The Dify API key never leaves this process.
"""

from __future__ import annotations

import json
from collections.abc import AsyncIterator
from dataclasses import dataclass, field
from typing import Any

import httpx

from app.config import get_settings


class DifyError(RuntimeError):
    """Dify returned an error. Wrap it before it reaches a customer."""

    def __init__(self, message: str, status_code: int = 502) -> None:
        super().__init__(message)
        self.status_code = status_code


def end_user_id(tenant_id: str, user_id: str) -> str:
    """Build the value Dify stores as EndUser.session_id and exposes as sys.user_id.

    Dify keys an EndUser on (tenant_id, app_id, session_id), so a distinct value
    here gives every customer their own conversation space inside one app.
    """
    return f"{tenant_id}:{user_id}"


@dataclass
class Usage:
    prompt_tokens: int = 0
    completion_tokens: int = 0
    total_tokens: int = 0
    total_price: float | None = None
    currency: str | None = None


@dataclass
class ChatResult:
    answer: str = ""
    conversation_id: str | None = None
    message_id: str | None = None
    usage: Usage = field(default_factory=Usage)


def _parse_usage(metadata: dict[str, Any]) -> Usage:
    raw = metadata.get("usage") or {}
    price = raw.get("total_price")
    return Usage(
        prompt_tokens=int(raw.get("prompt_tokens") or 0),
        completion_tokens=int(raw.get("completion_tokens") or 0),
        total_tokens=int(raw.get("total_tokens") or 0),
        total_price=float(price) if price is not None else None,
        currency=raw.get("currency"),
    )


class DifyClient:
    def __init__(self, app_key: str, *, base_url: str | None = None, timeout: float | None = None) -> None:
        settings = get_settings()
        self._app_key = app_key
        self._base_url = (base_url or settings.dify_base_url).rstrip("/")
        self._timeout = timeout if timeout is not None else settings.dify_timeout_seconds

    @property
    def _headers(self) -> dict[str, str]:
        return {"Authorization": f"Bearer {self._app_key}", "Content-Type": "application/json"}

    def _payload(
        self,
        *,
        query: str,
        tenant_id: str,
        user_id: str,
        conversation_id: str | None,
        inputs: dict[str, Any] | None,
        response_mode: str,
    ) -> dict[str, Any]:
        payload: dict[str, Any] = {
            "query": query,
            "inputs": inputs or {},
            "response_mode": response_mode,
            # Server-derived. A caller can never influence this value.
            "user": end_user_id(tenant_id, user_id),
        }
        if conversation_id:
            payload["conversation_id"] = conversation_id
        return payload

    async def chat(
        self,
        *,
        query: str,
        tenant_id: str,
        user_id: str,
        conversation_id: str | None = None,
        inputs: dict[str, Any] | None = None,
    ) -> ChatResult:
        """Blocking call. Simplest path; use stream_chat for a real chat UI."""
        payload = self._payload(
            query=query,
            tenant_id=tenant_id,
            user_id=user_id,
            conversation_id=conversation_id,
            inputs=inputs,
            response_mode="blocking",
        )
        async with httpx.AsyncClient(timeout=self._timeout) as client:
            resp = await client.post(f"{self._base_url}/chat-messages", headers=self._headers, json=payload)
        if resp.status_code >= 400:
            raise DifyError(f"dify responded {resp.status_code}", status_code=502)

        body = resp.json()
        return ChatResult(
            answer=body.get("answer", ""),
            conversation_id=body.get("conversation_id"),
            message_id=body.get("message_id") or body.get("id"),
            usage=_parse_usage(body.get("metadata") or {}),
        )

    async def stream_chat(
        self,
        *,
        query: str,
        tenant_id: str,
        user_id: str,
        conversation_id: str | None = None,
        inputs: dict[str, Any] | None = None,
        result: ChatResult | None = None,
    ) -> AsyncIterator[str]:
        """Yield answer chunks as they arrive.

        Pass `result` to collect usage and ids: the caller needs them to write a
        usage row once the stream finishes.
        """
        payload = self._payload(
            query=query,
            tenant_id=tenant_id,
            user_id=user_id,
            conversation_id=conversation_id,
            inputs=inputs,
            response_mode="streaming",
        )
        sink = result if result is not None else ChatResult()

        async with httpx.AsyncClient(timeout=self._timeout) as client:
            async with client.stream(
                "POST", f"{self._base_url}/chat-messages", headers=self._headers, json=payload
            ) as resp:
                if resp.status_code >= 400:
                    await resp.aread()
                    raise DifyError(f"dify responded {resp.status_code}", status_code=502)

                async for line in resp.aiter_lines():
                    if not line.startswith("data:"):
                        continue
                    raw = line[5:].strip()
                    if not raw:
                        continue
                    try:
                        event = json.loads(raw)
                    except json.JSONDecodeError:
                        continue

                    kind = event.get("event")
                    if kind in ("message", "agent_message"):
                        chunk = event.get("answer", "")
                        sink.answer += chunk
                        sink.conversation_id = event.get("conversation_id") or sink.conversation_id
                        sink.message_id = event.get("message_id") or sink.message_id
                        if chunk:
                            yield chunk
                    elif kind == "message_end":
                        sink.usage = _parse_usage(event.get("metadata") or {})
                        sink.conversation_id = event.get("conversation_id") or sink.conversation_id
                        sink.message_id = event.get("id") or sink.message_id
                    elif kind == "error":
                        raise DifyError(str(event.get("message") or "dify stream error"))

    async def create_dataset(self, name: str) -> str:
        """Create a dedicated knowledge base — the storage-level isolation option."""
        async with httpx.AsyncClient(timeout=self._timeout) as client:
            resp = await client.post(
                f"{self._base_url}/datasets",
                headers=self._headers,
                json={"name": name, "permission": "only_me"},
            )
        if resp.status_code >= 400:
            raise DifyError(f"dify responded {resp.status_code}", status_code=502)
        return resp.json()["id"]
