"""Billing webhook verification and plan mapping.

Kept separate from the route so the signature check can be tested on its own —
it is the part that must not be wrong.
"""

from __future__ import annotations

import hashlib
import hmac
import time

from app.config import get_settings


class SignatureError(Exception):
    """The payload did not come from the billing provider."""


def parse_signature_header(header: str) -> tuple[int | None, list[str]]:
    """Read a Stripe-style `t=<ts>,v1=<sig>,v1=<sig>` header."""
    timestamp: int | None = None
    signatures: list[str] = []
    for part in header.split(","):
        key, _, value = part.strip().partition("=")
        if key == "t":
            try:
                timestamp = int(value)
            except ValueError:
                timestamp = None
        elif key == "v1":
            signatures.append(value)
    return timestamp, signatures


def verify_signature(payload: bytes, header: str | None, *, now: int | None = None) -> None:
    """Raise SignatureError unless `payload` is signed by the configured secret.

    Checks the timestamp as well as the digest: a valid signature replayed days
    later is still a replay, and plan changes are not something to re-apply.
    """
    secret = get_settings().billing_webhook_secret
    if not secret:
        raise SignatureError("billing webhook secret is not configured")
    if not header:
        raise SignatureError("missing signature header")

    timestamp, signatures = parse_signature_header(header)
    if timestamp is None or not signatures:
        raise SignatureError("malformed signature header")

    tolerance = get_settings().billing_webhook_tolerance_seconds
    current = int(time.time()) if now is None else now
    if abs(current - timestamp) > tolerance:
        raise SignatureError("signature timestamp outside the allowed window")

    signed = f"{timestamp}.".encode() + payload
    expected = hmac.new(secret.encode(), signed, hashlib.sha256).hexdigest()

    # compare_digest against each candidate; a plain `in` would leak by timing.
    if not any(hmac.compare_digest(expected, candidate) for candidate in signatures):
        raise SignatureError("signature mismatch")


def plan_for_price(price_id: str | None) -> str | None:
    """Map a provider price id to one of our plan keys.

    Configured as `price_abc:pro,price_xyz:enterprise` so adding a price is an
    environment change rather than a deploy.
    """
    if not price_id:
        return None
    for pair in get_settings().billing_price_map.split(","):
        key, _, plan = pair.strip().partition(":")
        if key and key == price_id:
            return plan or None
    return None


def extract_price_id(subscription: dict) -> str | None:
    items = (subscription.get("items") or {}).get("data") or []
    for item in items:
        price = item.get("price") or {}
        if price.get("id"):
            return str(price["id"])
    # Some payloads carry a flat plan object instead of expanded items.
    plan = subscription.get("plan") or {}
    return str(plan["id"]) if plan.get("id") else None
