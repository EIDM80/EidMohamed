"""Password hashing and the gateway's own session tokens.

These tokens authenticate YOUR customers. They are unrelated to Dify's
API key, which never leaves the server.
"""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any

import bcrypt
import jwt

from app.config import get_settings

ALGORITHM = "HS256"


def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except ValueError:
        # Malformed hash in the database — treat as a failed login, never a 500.
        return False


def issue_token(*, tenant_id: str, user_id: str) -> str:
    settings = get_settings()
    now = datetime.now(timezone.utc)
    payload = {
        "sub": user_id,
        "tid": tenant_id,
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(minutes=settings.gateway_token_ttl_minutes)).timestamp()),
    }
    return jwt.encode(payload, settings.gateway_secret_key, algorithm=ALGORITHM)


def decode_token(token: str) -> dict[str, Any]:
    """Raises jwt.PyJWTError on anything that is not a valid, unexpired token."""
    settings = get_settings()
    return jwt.decode(token, settings.gateway_secret_key, algorithms=[ALGORITHM])
