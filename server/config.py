from pydantic import BaseSettings

class Settings(BaseSettings):
    """Application configuration."""

    app_name: str = "Open Shelf API"
    debug: bool = False
    database_url: str = "sqlite:///./dev.db"

settings = Settings()
