from __future__ import annotations

import logging
import os
import tempfile

import pytest

# Settings are cached, so the environment must be set before app modules import.
_tmpdir = tempfile.mkdtemp(prefix="gateway-tests-")
os.environ.setdefault("GATEWAY_DATABASE_URL", f"sqlite+pysqlite:///{_tmpdir}/test.db")
os.environ.setdefault("GATEWAY_SECRET_KEY", "test-secret-key")
os.environ.setdefault("DIFY_BASE_URL", "http://dify.test/v1")
os.environ.setdefault("RATE_LIMIT_PER_MINUTE", "1000")
os.environ.setdefault("ADMIN_API_KEY", "test-admin-key")

from fastapi.testclient import TestClient  # noqa: E402

from app.db import Base, SessionLocal, engine  # noqa: E402
from app.main import app  # noqa: E402
from app.models import DifyBinding, Quota, Tenant, User  # noqa: E402
from app.routers.chat import limiter  # noqa: E402

logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("gateway.access").setLevel(logging.WARNING)
from app.security import hash_password  # noqa: E402
from app.usage import current_period  # noqa: E402


@pytest.fixture(autouse=True)
def clean_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    limiter.reset()
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c


@pytest.fixture
def make_tenant():
    """Create a tenant with one user, one binding and a quota. Returns ids + login."""

    def _make(
        name: str,
        *,
        email: str,
        password: str = "pw-12345",
        app_key: str = "app-test-key",
        token_limit: int = 100_000,
        tokens_used: int = 0,
        dataset_id: str | None = None,
        plan: str = "pro",
    ) -> dict:
        with SessionLocal() as db:
            tenant = Tenant(name=name, plan=plan)
            db.add(tenant)
            db.flush()

            user = User(tenant_id=tenant.id, email=email, password_hash=hash_password(password))
            db.add(user)
            db.add(
                DifyBinding(
                    tenant_id=tenant.id,
                    purpose="default",
                    app_key=app_key,
                    dataset_id=dataset_id,
                    metadata_value=tenant.id,
                )
            )
            db.add(
                Quota(
                    tenant_id=tenant.id,
                    monthly_token_limit=token_limit,
                    period=current_period(),
                    tokens_used=tokens_used,
                )
            )
            db.commit()
            return {
                "tenant_id": tenant.id,
                "user_id": user.id,
                "email": email,
                "password": password,
            }

    return _make


@pytest.fixture
def login(client):
    def _login(email: str, password: str = "pw-12345") -> str:
        resp = client.post("/api/auth/login", json={"email": email, "password": password})
        assert resp.status_code == 200, resp.text
        return resp.json()["access_token"]

    return _login
