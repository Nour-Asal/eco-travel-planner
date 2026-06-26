from __future__ import annotations

from backend.schemas import BudgetLevel, Language, OfferSearchResponse, TravelOffer
from backend.services.travel_offers import budget_multiplier, clean_offer_query, localized_mock_note, offer_response


def get_mock_stay_offers(
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
    city = query["destination"] or origin or "Jeddah"
    multiplier = budget_multiplier(str(query["budget"]))
    note = localized_mock_note(str(query["language"]))

    offers = [
        TravelOffer(
            id="mock-hotel-central-1",
            type="hotel",
            provider="StayMock",
            title="Central eco hotel",
            subtitle="Walkable location with breakfast and transit access",
            imageUrl="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=70",
            price=round(118 * multiplier),
            currency="USD",
            rating=4.7,
            location=str(city),
            duration="per night",
            cancellationPolicy="Free cancellation until 48 hours before arrival",
            bookingUrl="https://example.com/mock-hotel-central-1",
            badges=["Top rated", "Breakfast", note],
            pros=["Near public transport", "Breakfast included", "Strong guest rating"],
            cons=["Rooms are compact"],
            score=93,
        ),
        TravelOffer(
            id="mock-apartment-family-2",
            type="apartment",
            provider="Apartment Demo",
            title="Serviced apartment near the waterfront",
            subtitle="More space for families or longer stays",
            imageUrl="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=70",
            price=round(142 * multiplier),
            currency="USD",
            rating=4.5,
            location=str(city),
            duration="per night",
            cancellationPolicy="Refundable mock rate",
            bookingUrl="https://example.com/mock-apartment-family-2",
            badges=["Apartment", "Kitchen", "Family friendly"],
            pros=["Kitchen and laundry", "Good for 3+ nights", "Extra living space"],
            cons=["Limited front desk service"],
            score=89,
        ),
        TravelOffer(
            id="mock-hotel-budget-3",
            type="hotel",
            provider="ValueStay Mock",
            title="Smart-value city stay",
            subtitle="Simple room with easy ride-share and bus access",
            imageUrl="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=70",
            price=round(82 * multiplier),
            currency="USD",
            rating=4.1,
            location=str(city),
            duration="per night",
            cancellationPolicy="Non-refundable mock saver fare",
            bookingUrl="https://example.com/mock-hotel-budget-3",
            badges=["Lowest price", "Simple stay"],
            pros=["Lowest nightly price", "Clean essentials"],
            cons=["Less flexible cancellation", "Fewer amenities"],
            score=82,
        ),
    ]
    return offer_response(offers, query)
