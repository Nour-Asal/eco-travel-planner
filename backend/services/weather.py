from __future__ import annotations

import httpx

from backend.config import settings
from backend.schemas import WeatherSnapshot


class WeatherServiceError(RuntimeError):
    """Raised when the live weather provider is unavailable or returns bad data."""


async def get_weather(city: str | None) -> WeatherSnapshot | None:
    if not city or not settings.weather_api_key:
        return None

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(
                settings.weather_url,
                params={
                    "q": city,
                    "appid": settings.weather_api_key,
                    "units": "metric",
                },
            )
            response.raise_for_status()
            data = response.json()

        return WeatherSnapshot(
            city=city,
            temperature_c=float(data["main"]["temp"]),
            description=str(data["weather"][0]["description"]),
            humidity=int(data["main"]["humidity"]),
            wind_speed=float(data.get("wind", {}).get("speed", 0)),
        )
    except (httpx.HTTPError, KeyError, IndexError, TypeError, ValueError) as exc:
        raise WeatherServiceError(
            f"Weather API is unavailable for {city}. Continuing without live weather."
        ) from exc


def format_weather_context(weather: WeatherSnapshot | None) -> str:
    if not weather:
        return ""

    return f"""
Live weather context for {weather.city}:
- Temperature: {weather.temperature_c:.0f} C
- Conditions: {weather.description}
- Humidity: {weather.humidity}%
- Wind speed: {weather.wind_speed} m/s
"""
