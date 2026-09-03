"""Gateway settings, read from the environment."""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # --- Gateway ---
    gateway_secret_key: str = "dev-only-insecure-key"
    gateway_token_ttl_minutes: int = 720
    gateway_database_url: str = "sqlite+pysqlite:///./gateway.db"
    # Comma-separated origins your own frontend is served from. "*" is refused
    # in production because credentialed requests need explicit origins.
    cors_origins: str = ""

    # --- Admin API (provisioning) ---
    # Leave empty to disable the admin routes entirely.
    admin_api_key: str = ""

    # --- Dify (never exposed to customers) ---
    dify_base_url: str = "http://localhost/v1"
    dify_timeout_seconds: float = 120.0
    # Metadata field the retrieval filter matches on. Must exist in Dify with
    # this exact name, and the filter value must be {{#sys.user_id#}}.
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
