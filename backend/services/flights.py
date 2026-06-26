from __future__ import annotations

from backend.schemas import BudgetLevel, Language, OfferSearchResponse, TravelOffer
from backend.services.travel_offers import budget_multiplier, clean_offer_query, localized_mock_note, offer_response


def get_mock_flight_offers(
    *,
    origin: str = "",
    destination: str = "",
    departureDate: str = "",
    returnDate: str = "",
    travelers: int = 1,
    budget: BudgetLevel = "Smart value",
    language: Language = "English",
) -> OfferSearchResponse:
    query = clean_offer_query(
        origin=origin,
        destination=destination,
        departureDate=departureDate,
        returnDate=returnDate,
        travelers=travelers,
        budget=budget,
        language=language,
    )
    start = query["origin"] or "Istanbul"
    end = query["destination"] or "Jeddah"
    multiplier = budget_multiplier(str(query["budget"]))
    note = localized_mock_note(str(query["language"]))

    offers = [
        TravelOffer(
            id="mock-flight-green-1",
            type="flight",
            provider="EcoMock Air",
            title=f"{start} to {end}",
            subtitle="Best balance of price, timing, and lower-emission routing",
            imageUrl="",
            price=round(248 * multiplier),
            currency="USD",
            rating=4.6,
            location=f"{start} -> {end}",
            duration="3h 55m",
            stops=0,
            departureTime="08:15",
            arrivalTime="12:10",
            cancellationPolicy="Free hold for 24 hours",
            bookingUrl="https://example.com/mock-flight-green-1",
            badges=["Best value", "Direct", note],
            pros=["Direct flight", "Good departure time", "Lower total travel time"],
            cons=["Checked bag may cost extra"],
            score=94,
        ),
        TravelOffer(
            id="mock-flight-flex-2",
            type="flight",
            provider="OpenSky Mock",
            title=f"{start} to {end}",
            subtitle="Flexible fare with a short connection",
            imageUrl="",
            price=round(219 * multiplier),
            currency="USD",
            rating=4.3,
            location=f"{start} -> {end}",
            duration="5h 20m",
            stops=1,
            departureTime="13:40",
            arrivalTime="19:00",
            cancellationPolicy="Change fee waived on mock fare",
            bookingUrl="https://example.com/mock-flight-flex-2",
            badges=["Lowest price", "1 stop"],
            pros=["Cheapest option", "Flexible timing"],
            cons=["Longer journey", "Connection risk"],
            score=87,
        ),
        TravelOffer(
            id="mock-flight-comfort-3",
            type="flight",
            provider="Atlas Demo",
            title=f"{start} to {end}",
            subtitle="Premium timing with included cabin bag",
            imageUrl="",
            price=round(312 * multiplier),
            currency="USD",
            rating=4.8,
            location=f"{start} -> {end}",
            duration="4h 10m",
            stops=0,
            departureTime="21:30",
            arrivalTime="01:40",
            cancellationPolicy="Partial refund before departure",
            bookingUrl="https://example.com/mock-flight-comfort-3",
            badges=["Comfort pick", "Direct"],
            pros=["Direct flight", "Cabin bag included", "Strong provider score"],
            cons=["Late arrival"],
            score=90,
        ),
    ]
    return offer_response(offers, query)
