from __future__ import annotations

from datetime import datetime
from decimal import Decimal, InvalidOperation
import re
from typing import Any

import httpx

from backend.config import settings
from backend.schemas import TravelOffer
from backend.services.travel_offers import clean_offer_query

DUFFEL_API_URL = "https://api.duffel.com/air/offer_requests"
DUFFEL_VERSION = "v2"


class DuffelProviderError(RuntimeError):
    """Raised when Duffel is unavailable or cannot return usable offers."""


IATA_ALIASES = {
    "istanbul": "IST",
    "istanbul airport": "IST",
    "ist": "IST",
    "saw": "SAW",
    "اسطنبول": "IST",
    "إسطنبول": "IST",
    "جدة": "JED",
    "جده": "JED",
    "jeddah": "JED",
    "jed": "JED",
    "riyadh": "RUH",
    "الرياض": "RUH",
    "dubai": "DXB",
    "دبي": "DXB",
    "paris": "CDG",
    "london": "LHR",
    "amsterdam": "AMS",
}


def _iata(value: str | None) -> str:
    clean = (value or "").strip()
    if not clean:
        return ""
    upper = clean.upper()
    if re.fullmatch(r"[A-Z]{3}", upper):
        return upper
    return IATA_ALIASES.get(clean.lower(), upper)


def _money(value: Any) -> float:
    try:
        return float(Decimal(str(value or "0")))
    except (InvalidOperation, ValueError):
        return 0.0


def _parse_time(value: str) -> datetime | None:
    if not value:
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None


def _time_label(value: str) -> str:
    parsed = _parse_time(value)
    return parsed.strftime("%H:%M") if parsed else ""


def _duration_minutes(value: str) -> int:
    if not value:
        return 0
    match = re.fullmatch(r"P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?", value)
    if not match:
        return 0
    days, hours, minutes = (int(part or 0) for part in match.groups())
    return days * 1440 + hours * 60 + minutes


def _duration_label(minutes: int) -> str:
    if minutes <= 0:
        return ""
    hours, mins = divmod(minutes, 60)
    if hours and mins:
        return f"{hours}h {mins}m"
    if hours:
        return f"{hours}h"
    return f"{mins}m"


def _slice_minutes(item: dict[str, Any]) -> int:
    duration = str(item.get("duration") or "")
    minutes = _duration_minutes(duration)
    if minutes:
        return minutes

    segments = item.get("segments") if isinstance(item.get("segments"), list) else []
    if not segments:
        return 0
    start = _parse_time(str(segments[0].get("departing_at") or ""))
    end = _parse_time(str(segments[-1].get("arriving_at") or ""))
    if not start or not end:
        return 0
    return max(0, int((end - start).total_seconds() // 60))


def _offer_minutes(offer: dict[str, Any]) -> int:
    slices = offer.get("slices") if isinstance(offer.get("slices"), list) else []
    return sum(_slice_minutes(item) for item in slices)


def _segments(offer: dict[str, Any]) -> list[dict[str, Any]]:
    slices = offer.get("slices") if isinstance(offer.get("slices"), list) else []
    segments: list[dict[str, Any]] = []
    for item in slices:
        if isinstance(item, dict) and isinstance(item.get("segments"), list):
            segments.extend(segment for segment in item["segments"] if isinstance(segment, dict))
    return segments


def _stops(offer: dict[str, Any]) -> int:
    slices = offer.get("slices") if isinstance(offer.get("slices"), list) else []
    stops = 0
    for item in slices:
        segments = item.get("segments") if isinstance(item, dict) and isinstance(item.get("segments"), list) else []
        stops += max(0, len(segments) - 1)
    return stops


def _carrier_name(offer: dict[str, Any]) -> str:
    owner = offer.get("owner") if isinstance(offer.get("owner"), dict) else {}
    return str(owner.get("name") or "Duffel")


def _city_or_code(place: Any) -> str:
    if not isinstance(place, dict):
        return ""
    city = place.get("city") if isinstance(place.get("city"), dict) else {}
    return str(city.get("name") or place.get("name") or place.get("iata_code") or "")


def _title(offer: dict[str, Any], fallback_origin: str, fallback_destination: str) -> str:
    slices = offer.get("slices") if isinstance(offer.get("slices"), list) else []
    first = slices[0] if slices and isinstance(slices[0], dict) else {}
    origin = _city_or_code(first.get("origin")) or fallback_origin
    destination = _city_or_code(first.get("destination")) or fallback_destination
    return f"{origin} to {destination}" if origin or destination else "Duffel flight offer"


def _first_last_times(offer: dict[str, Any]) -> tuple[str, str]:
    segments = _segments(offer)
    if not segments:
        return "", ""
    return _time_label(str(segments[0].get("departing_at") or "")), _time_label(str(segments[-1].get("arriving_at") or ""))


def _booking_url(offer: dict[str, Any]) -> str:
    # Duffel offer search returns bookable offer IDs, not public booking URLs. Keep this empty
    # until the app has a first-party checkout/order flow.
    return ""


def _score(price: float, stops: int, minutes: int, min_price: float, min_minutes: int) -> float:
    price_penalty = ((price - min_price) / max(min_price, 1)) * 28 if min_price else 0
    stop_penalty = stops * 10
    duration_penalty = ((minutes - min_minutes) / max(min_minutes, 1)) * 18 if min_minutes else 0
    return max(0, round(100 - price_penalty - stop_penalty - duration_penalty, 1))


def _with_badges(offers: list[TravelOffer]) -> list[TravelOffer]:
    if not offers:
        return offers
    cheapest_id = min(offers, key=lambda item: item.price).id
    fastest_id = min(offers, key=lambda item: _duration_minutes_from_label(item.duration)).id
    best_id = max(offers, key=lambda item: item.score).id

    updated: list[TravelOffer] = []
    for offer in offers:
        badges = list(offer.badges)
        if offer.id == best_id:
            badges.insert(0, "Best value")
        if offer.id == cheapest_id:
            badges.insert(0, "Cheapest")
        if offer.id == fastest_id:
            badges.insert(0, "Fastest")
        seen: set[str] = set()
        offer.badges = [badge for badge in badges if not (badge in seen or seen.add(badge))][:6]
        updated.append(offer)
    return updated


def _duration_minutes_from_label(label: str) -> int:
    hours = re.search(r"(\d+)h", label or "")
    minutes = re.search(r"(\d+)m", label or "")
    return (int(hours.group(1)) * 60 if hours else 0) + (int(minutes.group(1)) if minutes else 0)


def _normalize_offer(offer: dict[str, Any], *, fallback_origin: str, fallback_destination: str, min_price: float, min_minutes: int) -> TravelOffer:
    price = _money(offer.get("total_amount"))
    currency = str(offer.get("total_currency") or "USD")[:3].upper()
    minutes = _offer_minutes(offer)
    stops = _stops(offer)
    departure, arrival = _first_last_times(offer)
    carrier = _carrier_name(offer)
    direct_badge = "Direct" if stops == 0 else f"{stops} stop" if stops == 1 else f"{stops} stops"

    return TravelOffer(
        id=str(offer.get("id") or "duffel-offer"),
        type="flight",
        provider="Duffel",
        title=_title(offer, fallback_origin, fallback_destination),
        subtitle=f"{carrier} via Duffel · {direct_badge}",
        imageUrl="",
        price=price,
        currency=currency,
        rating=None,
        location=f"{fallback_origin} -> {fallback_destination}",
        duration=_duration_label(minutes),
        stops=stops,
        departureTime=departure,
        arrivalTime=arrival,
        cancellationPolicy="Fare rules available during booking",
        bookingUrl=_booking_url(offer),
        badges=[direct_badge, "Real offer"],
        pros=["Live Duffel availability", "Sorted by value"],
        cons=[] if stops == 0 else ["Includes a connection"],
        score=_score(price, stops, minutes, min_price, min_minutes),
    )


def _payload(*, origin: str, destination: str, departure_date: str, return_date: str, travelers: int) -> dict[str, Any]:
    slices: list[dict[str, str]] = [
        {
            "origin": origin,
            "destination": destination,
            "departure_date": departure_date,
        }
    ]
    if return_date:
        slices.append(
            {
                "origin": destination,
                "destination": origin,
                "departure_date": return_date,
            }
        )

    return {
        "data": {
            "slices": slices,
            "passengers": [{"type": "adult"} for _ in range(max(1, min(travelers, 12)))],
            "cabin_class": "economy",
        }
    }


async def search_duffel_flights(
    *,
    origin: str = "",
    destination: str = "",
    departureDate: str = "",
    returnDate: str = "",
    travelers: int = 1,
    budget: str = "Smart value",
    language: str = "English",
) -> list[TravelOffer]:
    if not settings.duffel_access_token:
        raise DuffelProviderError("Duffel access token is not configured.")

    query = clean_offer_query(
        origin=origin,
        destination=destination,
        departureDate=departureDate,
        returnDate=returnDate,
        travelers=travelers,
        budget=budget,
        language=language,
    )
    origin_code = _iata(str(query["origin"] or ""))
    destination_code = _iata(str(query["destination"] or ""))
    if not origin_code or not destination_code:
        raise DuffelProviderError("Duffel flight search needs origin and destination airport codes.")

    headers = {
        "Authorization": f"Bearer {settings.duffel_access_token}",
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Duffel-Version": DUFFEL_VERSION,
    }

    try:
        async with httpx.AsyncClient(timeout=25) as client:
            response = await client.post(
                DUFFEL_API_URL,
                headers=headers,
                json=_payload(
                    origin=origin_code,
                    destination=destination_code,
                    departure_date=str(query["departureDate"]),
                    return_date=str(query["returnDate"] or ""),
                    travelers=int(query["travelers"] or 1),
                ),
            )
    except httpx.HTTPError as exc:
        raise DuffelProviderError("Duffel flight search is temporarily unavailable.") from exc

    if response.status_code >= 400:
        raise DuffelProviderError("Duffel could not return flight offers for this search.")

    try:
        data = response.json().get("data", {})
    except ValueError as exc:
        raise DuffelProviderError("Duffel returned an invalid response.") from exc

    raw_offers = data.get("offers") if isinstance(data, dict) else []
    if not isinstance(raw_offers, list) or not raw_offers:
        raise DuffelProviderError("Duffel returned no flight offers for this search.")

    prices = [_money(offer.get("total_amount")) for offer in raw_offers if isinstance(offer, dict)]
    durations = [_offer_minutes(offer) for offer in raw_offers if isinstance(offer, dict)]
    min_price = min([price for price in prices if price > 0], default=0)
    min_minutes = min([duration for duration in durations if duration > 0], default=0)

    normalized = [
        _normalize_offer(
            offer,
            fallback_origin=origin_code,
            fallback_destination=destination_code,
            min_price=min_price,
            min_minutes=min_minutes,
        )
        for offer in raw_offers
        if isinstance(offer, dict)
    ]
    return sorted(_with_badges(normalized), key=lambda item: item.score, reverse=True)[:8]
