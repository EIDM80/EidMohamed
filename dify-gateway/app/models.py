"""Tables the gateway owns.

The isolation boundary lives here: every customer-facing row carries a
tenant_id, and everything Dify-related is confined to DifyBinding so the
platform stays replaceable.
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


def _uuid() -> str:
    return str(uuid.uuid4())


def _now() -> datetime:
    return datetime.now(timezone.utc)


class Tenant(Base):
    """A customer of yours. Never a Dify workspace."""

    __tablename__ = "tenants"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    plan: Mapped[str] = mapped_column(String(50), nullable=False, default="free")
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)

    users: Mapped[list[User]] = relationship(back_populates="tenant")
    bindings: Mapped[list[DifyBinding]] = relationship(back_populates="tenant")
    quota: Mapped[Quota | None] = relationship(back_populates="tenant", uselist=False)


class User(Base):
    """A person inside a tenant."""

    __tablename__ = "users"
    __table_args__ = (UniqueConstraint("tenant_id", "email", name="uq_users_tenant_email"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    tenant_id: Mapped[str] = mapped_column(String(36), ForeignKey("tenants.id"), nullable=False, index=True)
    email: Mapped[str] = mapped_column(String(320), nullable=False)
    password_hash: Mapped[str] = mapped_column(String(200), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)

    tenant: Mapped[Tenant] = relationship(back_populates="users")


class DifyBinding(Base):
    """Everything this tenant owns on the Dify side.

    Keep every Dify identifier in this one table. Swapping Dify for another
    engine then means rewriting this table and app/dify.py, nothing else.
    """

    __tablename__ = "dify_bindings"
    __table_args__ = (UniqueConstraint("tenant_id", "purpose", name="uq_binding_tenant_purpose"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    tenant_id: Mapped[str] = mapped_column(String(36), ForeignKey("tenants.id"), nullable=False, index=True)
    # Which product surface this binding serves, e.g. "support-chat", "invoice-extract".
    purpose: Mapped[str] = mapped_column(String(80), nullable=False, default="default")
    # Dify app API key (app-...). One shared key per surface is the norm.
    app_key: Mapped[str] = mapped_column(String(200), nullable=False)
    # Optional: a dataset dedicated to this tenant (strongest isolation).
    dataset_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    # The value written into document metadata and matched by the retrieval filter.
    metadata_value: Mapped[str | None] = mapped_column(String(120), nullable=True)

    tenant: Mapped[Tenant] = relationship(back_populates="bindings")


class Quota(Base):
    """Monthly ceiling for a tenant, checked before any model call is paid for."""

    __tablename__ = "quotas"

    tenant_id: Mapped[str] = mapped_column(String(36), ForeignKey("tenants.id"), primary_key=True)
    monthly_token_limit: Mapped[int] = mapped_column(Integer, nullable=False, default=100_000)
    # Which month the counter below belongs to, as YYYY-MM.
    period: Mapped[str] = mapped_column(String(7), nullable=False, default="")
    tokens_used: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    tenant: Mapped[Tenant] = relationship(back_populates="quota")


class UsageEvent(Base):
    """One row per model call. The billing and analytics source of truth."""

    __tablename__ = "usage_events"
    __table_args__ = (Index("ix_usage_tenant_created", "tenant_id", "created_at"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    tenant_id: Mapped[str] = mapped_column(String(36), nullable=False, index=True)
    user_id: Mapped[str] = mapped_column(String(36), nullable=False)
    purpose: Mapped[str] = mapped_column(String(80), nullable=False, default="default")
    conversation_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    prompt_tokens: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    completion_tokens: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    total_tokens: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    total_price: Mapped[float | None] = mapped_column(Numeric(12, 7), nullable=True)
    currency: Mapped[str | None] = mapped_column(String(10), nullable=True)
    latency_ms: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="ok")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now, index=True)
