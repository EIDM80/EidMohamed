"""Gateway settings.

Values come from the environment, or from files in `secrets_dir` when present.
The file form is what Docker and Kubernetes secrets mount, so production can
keep keys out of the environment entirely: a file named `gateway_secret_key`
under /run/secrets is read as that setting.
"""

from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# Only point at the secrets mount when it exists, otherwise pydantic warns on
# every import in development and in tests.
_SECRETS_DIR = Path("/run/secrets")


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        secrets_dir=str(_SECRETS_DIR) if _SECRETS_DIR.is_dir() else None,
        extra="ignore",
    )

    # --- Gateway ---
    gateway_secret_key: str = "dev-only-insecure-key"
    gateway_token_ttl_minutes: int = 720
    gateway_database_url: str = "sqlite+pysqlite:///./gateway.db"
    # Origins your own frontend is served from. "*" is deliberately unsupported:
    # credentialed requests need explicit origins.
    cors_origins: str = ""
    # Serve the bundled customer dashboard at /app. Turn it off if you ship
    # your own frontend.
    serve_dashboard: bool = True

    # --- Admin API (provisioning) ---
    # Empty disables the admin routes entirely.
    admin_api_key: str = ""

    # --- Billing webhook ---
    # Empty disables the webhook route entirely.
    billing_webhook_secret: str = ""
    billing_webhook_tolerance_seconds: int = 300
    # price id to plan key, comma separated: price_abc:pro,price_xyz:enterprise
    billing_price_map: str = ""

    # --- Dify (never exposed to customers) ---
    dify_base_url: str = "http://localhost/v1"
    dify_timeout_seconds: float = 120.0
    # Must match the metadata field name in Dify AND the retrieval filter.
    dify_tenant_metadata_field: str = "tenant_id"

    # --- Rate limiting (Dify's own limiter is cloud-only) ---
    rate_limit_per_minute: int = 30
    redis_url: str = ""

    # --- Uploads ---
    max_upload_mb: int = 25

    # --- Ops ---
    log_level: str = "INFO"
    json_logs: bool = False

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
