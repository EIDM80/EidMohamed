"""Request and response bodies.

Note what is absent: no schema accepts a tenant_id from the caller. Tenant
identity is derived from the session token, never from the request body.
"""

from __future__ import annotations

from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class ChatRequest(BaseModel):
    query: str = Field(min_length=1, max_length=8000)
    conversation_id: str | None = None
    purpose: str = "default"
    inputs: dict[str, str] = Field(default_factory=dict)


class ChatResponse(BaseModel):
    answer: str
    conversation_id: str | None = None
    message_id: str | None = None
    total_tokens: int = 0


class UsageSummary(BaseModel):
    period: str
    tokens_used: int
    monthly_token_limit: int
    remaining: int
