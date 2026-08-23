"""Gateway settings, read from the environment."""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    gateway_secret_key: str = "dev-only-insecure-key"
    gateway_token_ttl_minutes: int = 720
    gateway_database_url: str = "sqlite+pysqlite:///./gateway.db"

    dify_base_url: str = "http://localhost/v1"
    dify_timeout_seconds: float = 120.0

    rate_limit_per_minute: int = 30

    log_level: str = "INFO"


@lru_cache
def get_settings() -> Settings:
    return Settings()
