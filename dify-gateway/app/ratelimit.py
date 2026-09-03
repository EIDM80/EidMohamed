"""Per-tenant rate limiting.

Dify's own limiter is gated behind the cloud edition
(`cloud_edition_billing_rate_limit_check` in controllers/service_api/wraps.py),
so a self-hosted deployment has none. This is that missing piece.

Two backends. In-memory is correct for exactly one process; Redis is what you
need the moment you run a second worker, because each process would otherwise
enforce its own separate allowance.
"""

from __future__ import annotations

import logging
import threading
import time
from collections import defaultdict, deque
from typing import Protocol

from fastapi import HTTPException, status

logger = logging.getLogger(__name__)


def _too_many(retry_after: int) -> HTTPException:
    return HTTPException(
        status.HTTP_429_TOO_MANY_REQUESTS,
        f"Too many requests. Try again in {retry_after} seconds.",
        headers={"Retry-After": str(retry_after)},
    )


class LimiterBackend(Protocol):
    def hit(self, key: str, limit: int) -> int | None:
        """Record a hit. Return seconds to wait if the caller is over `limit`."""


class MemoryBackend:
    def __init__(self) -> None:
        self._hits: dict[str, deque[float]] = defaultdict(deque)
        self._lock = threading.Lock()

    def hit(self, key: str, limit: int) -> int | None:
        now = time.monotonic()
        cutoff = now - 60.0
        with self._lock:
            window = self._hits[key]
            while window and window[0] < cutoff:
                window.popleft()
            if len(window) >= limit:
                return max(1, int(60 - (now - window[0])))
            window.append(now)
            return None

    def reset(self) -> None:
        with self._lock:
            self._hits.clear()


class RedisBackend:
    """Fixed-window counter in Redis. Shared across every worker."""

    def __init__(self, url: str) -> None:
        import redis  # imported lazily so the dependency stays optional

        self._client = redis.Redis.from_url(url, decode_responses=True)

    def hit(self, key: str, limit: int) -> int | None:
        window = int(time.time() // 60)
        redis_key = f"ratelimit:{key}:{window}"
        try:
            pipe = self._client.pipeline()
            pipe.incr(redis_key)
            pipe.expire(redis_key, 120)
            count, _ = pipe.execute()
        except Exception:
            # Never let a limiter outage take the product down; log and allow.
            logger.exception("rate limiter backend unavailable, allowing request")
            return None
        if int(count) > limit:
            return max(1, 60 - int(time.time() % 60))
        return None

    def reset(self) -> None:
        for key in self._client.scan_iter("ratelimit:*"):
            self._client.delete(key)


class RateLimiter:
    """Applies a per-tenant, per-minute allowance using the configured backend."""

    def __init__(self, backend: LimiterBackend, default_limit: int) -> None:
        self._backend = backend
        self._default_limit = default_limit

    def check(self, key: str, limit: int | None = None) -> None:
        effective = self._default_limit if limit is None else limit
        if effective <= 0:
            return
        retry_after = self._backend.hit(key, effective)
        if retry_after is not None:
            raise _too_many(retry_after)

    def reset(self) -> None:
        reset = getattr(self._backend, "reset", None)
        if callable(reset):
            reset()


def build_limiter(redis_url: str | None, default_limit: int) -> RateLimiter:
    if redis_url:
        try:
            return RateLimiter(RedisBackend(redis_url), default_limit)
        except Exception:
            logger.exception("could not reach Redis, falling back to in-memory rate limiting")
    return RateLimiter(MemoryBackend(), default_limit)
