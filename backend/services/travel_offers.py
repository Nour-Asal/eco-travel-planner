from __future__ import annotations

from datetime import date, timedelta
from typing import Any

from backend.schemas import BudgetLevel, Language, OfferSearchResponse, TravelOffer


def clean_offer_query(
    *,
    origin: str = "",
    destination: str = "",
    departureDate: str = "",
    returnDate: str = "",
    travelers: int = 1,
    budget: BudgetLevel = "Smart value",
    language: Language = "English",
) -> dict[str, str | int | None]:
    return {
        "origin": origin.strip() or None,
        "destination": destination.strip() or None,
        "departureDate": departureDate.strip() or next_weekend(),
        "returnDate": returnDate.strip() or "",
        "travelers": max(1, min(int(travelers or 1), 12)),
        "budget": budget,
        "language": language,
    }


def next_weekend() -> str:
    today = date.today()
    days_until_friday = (4 - today.weekday()) % 7 or 7
    return (today + timedelta(days=days_until_friday)).isoformat()


def budget_multiplier(budget: str) -> float:
    return {
        "Economy": 0.82,
        "Smart value": 1.0,
        "Premium": 1.35,
        "Luxury": 1.85,
    }.get(budget, 1.0)


def localized_mock_note(language: str) -> str:
    if language == "Arabic":
        return "بيانات تجريبية الآن، جاهزة للربط بمزود حجز لاحقا"
    if language == "Turkish":
        return "Şimdilik örnek veridir, gerçek sağlayıcıya bağlanmaya hazır"
    return "Mock data for now, ready for a live booking provider later"


def offer_response(offers: list[TravelOffer], query: dict[str, Any]) -> OfferSearchResponse:
    return OfferSearchResponse(offers=offers, provider="mock", isMock=True, query=query)
