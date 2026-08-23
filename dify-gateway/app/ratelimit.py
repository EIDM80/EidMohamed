"""Per-tenant rate limiting.

Dify's own limiter is gated behind the cloud edition
(`cloud_edition_billing_rate_limit_check` in controllers/service_api/wraps.py),
so a self-hosted deployment has none. This is that missing piece.

The in-memory backend is correct for a single process. Swap in Redis before
running more than one worker.
"""

from __future__ import annotations

import threading
import time
from collections import defaultdict, deque

from fastapi import HTTPException, status


class SlidingWindowLimiter:
    def __init__(self, limit_per_minute: int) -> None:
        self._limit = limit_per_minute
        self._hits: dict[str, deque[float]] = defaultdict(deque)
        self._lock = threading.Lock()

    def check(self, key: str) -> None:
        if self._limit <= 0:
            return
        now = time.monotonic()
        cutoff = now - 60.0
        with self._lock:
            window = self._hits[key]
            while window and window[0] < cutoff:
                window.popleft()
            if len(window) >= self._limit:
                retry_after = max(1, int(60 - (now - window[0])))
                raise HTTPException(
                    status.HTTP_429_TOO_MANY_REQUESTS,
                    f"Too many requests. Try again in {retry_after} seconds.",
                    headers={"Retry-After": str(retry_after)},
                )
            window.append(now)

    def reset(self) -> None:
        with self._lock:
            self._hits.clear()
