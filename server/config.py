import json
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file="server/.env",
        env_file_encoding="utf-8",
    )

    app_name: str = "Open Shelf"
    debug: bool = True
    environment: str = "local"
    database_url: str = "sqlite:///./dev.db"
    openai_api_key: str | None = None
    receipt_local_dir: str = "uploaded_receipts"
    receipt_bucket: str | None = None
    receipt_base_url: str | None = None

    allowed_origins: list[str] = Field(default_factory=list)

    @field_validator("allowed_origins", mode="before")
    @classmethod
    def parse_allowed_origins(cls, v):
        if isinstance(v, str):
            # Try JSON array first (e.g. '["http://...","http://..."]')
            try:
                parsed = json.loads(v)
                if isinstance(parsed, list):
                    return parsed
            except ValueError:
                pass
            # Fallback: comma-separated
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v



# Single global settings object
settings = Settings()
