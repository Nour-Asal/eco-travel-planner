from __future__ import annotations

import os
from dataclasses import dataclass

from dotenv import load_dotenv


load_dotenv()


@dataclass(frozen=True)
class Settings:
    app_name: str = "Eco Travel Planner"
    app_env: str = os.environ.get("APP_ENV", "development")
    openrouter_api_key: str = os.environ.get("OPENROUTER_API_KEY", "").strip()
    openrouter_model: str = os.environ.get("OPENROUTER_MODEL", "openai/gpt-4o-mini").strip()
    openrouter_url: str = "https://openrouter.ai/api/v1/chat/completions"
    weather_api_key: str = os.environ.get("WEATHER_API_KEY", "").strip()
    weather_url: str = "https://api.openweathermap.org/data/2.5/weather"
    nominatim_url: str = "https://nominatim.openstreetmap.org/search"
    nominatim_user_agent: str = os.environ.get(
        "NOMINATIM_USER_AGENT",
        "EcoTravelPlanner/1.0 local-development",
    )
    public_url: str = os.environ.get("APP_PUBLIC_URL", "http://127.0.0.1:8000")
    database_url: str = os.environ.get("DATABASE_URL", "").strip()


settings = Settings()
