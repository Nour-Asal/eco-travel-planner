from __future__ import annotations

import httpx

from backend.config import settings
from backend.schemas import PlaceSnapshot


class PlacesServiceError(RuntimeError):
    """Raised when public geodata lookup is unavailable or returns bad data."""


async def search_places(query: str, limit: int = 3) -> list[PlaceSnapshot]:
    clean_query = query.strip()

    if not clean_query:
        return []

    try:
        async with httpx.AsyncClient(timeout=8) as client:
            response = await client.get(
                settings.nominatim_url,
                params={
                    "q": clean_query,
                    "format": "jsonv2",
                    "addressdetails": 1,
                    "limit": max(1, min(limit, 5)),
                },
                headers={"User-Agent": settings.nominatim_user_agent},
            )
            response.raise_for_status()
            data = response.json()
            if not isinstance(data, list):
                raise ValueError("Unexpected places response shape.")
    except (httpx.HTTPError, TypeError, ValueError) as exc:
        raise PlacesServiceError(
            "Places service is unavailable. Continuing without public geodata."
        ) from exc

    places: list[PlaceSnapshot] = []

    for item in data:
        if not isinstance(item, dict):
            continue

        display_name = str(item.get("display_name", "")).strip()
        lat = str(item.get("lat", "")).strip()
        lon = str(item.get("lon", "")).strip()

        if not display_name or not lat or not lon:
            continue

        places.append(
            PlaceSnapshot(
                name=str(item.get("name") or display_name.split(",")[0]).strip(),
                display_name=display_name,
                lat=lat,
                lon=lon,
                type=str(item.get("type", "")).strip(),
            )
        )

    return places


def format_places_context(places: list[PlaceSnapshot]) -> str:
    if not places:
        return ""

    lines = ["Map/location context from public geodata:"]

    for place in places:
        lines.append(
            f"- {place.name}: {place.display_name} ({place.lat}, {place.lon})"
        )

    return "\n".join(lines)
