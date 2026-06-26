from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


Language = Literal["English", "Turkish", "Arabic"]
TravelStyle = Literal["Balanced", "Relaxed", "Adventure", "Family", "Business"]
BudgetLevel = Literal["Economy", "Smart value", "Premium", "Luxury"]


OfferType = Literal["flight", "hotel", "apartment"]


class TravelOffer(BaseModel):
    id: str = Field(min_length=1, max_length=80)
    type: OfferType
    provider: str = Field(min_length=1, max_length=80)
    title: str = Field(min_length=1, max_length=160)
    subtitle: str = Field(default="", max_length=220)
    imageUrl: str = Field(default="", max_length=600)
    price: float = Field(ge=0)
    currency: str = Field(default="USD", min_length=3, max_length=3)
    rating: float | None = Field(default=None, ge=0, le=5)
    location: str = Field(default="", max_length=160)
    duration: str = Field(default="", max_length=80)
    stops: int | None = Field(default=None, ge=0, le=8)
    departureTime: str = Field(default="", max_length=80)
    arrivalTime: str = Field(default="", max_length=80)
    cancellationPolicy: str = Field(default="", max_length=180)
    bookingUrl: str = Field(default="", max_length=600)
    badges: list[str] = Field(default_factory=list, max_length=8)
    pros: list[str] = Field(default_factory=list, max_length=6)
    cons: list[str] = Field(default_factory=list, max_length=6)
    score: float = Field(default=0, ge=0, le=100)


class OfferSearchResponse(BaseModel):
    offers: list[TravelOffer] = Field(default_factory=list, max_length=24)
    provider: str = "mock"
    isMock: bool = True
    query: dict[str, str | int | None] = Field(default_factory=dict)


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=6000)
    offers: list[TravelOffer] = Field(default_factory=list, max_length=24)


class AttachmentInput(BaseModel):
    name: str = Field(min_length=1, max_length=180)
    mime_type: str = Field(min_length=1, max_length=120)
    size: int = Field(default=0, ge=0, le=6_000_000)
    data_url: str | None = Field(default=None, max_length=8_500_000)
    text: str | None = Field(default=None, max_length=12000)


class TripPlanRequest(BaseModel):
    message: str = Field(min_length=2, max_length=4000)
    language: Language = "English"
    travel_style: TravelStyle = "Balanced"
    budget_level: BudgetLevel = "Smart value"
    sustainability_priority: int = Field(default=4, ge=1, le=5)
    travelers: int = Field(default=2, ge=1, le=12)
    days: int = Field(default=5, ge=1, le=45)
    history: list[ChatMessage] = Field(default_factory=list, max_length=12)
    attachments: list[AttachmentInput] = Field(default_factory=list, max_length=4)


class WeatherSnapshot(BaseModel):
    city: str
    temperature_c: float
    description: str
    humidity: int
    wind_speed: float


class PlaceSnapshot(BaseModel):
    name: str
    display_name: str
    lat: str
    lon: str
    type: str = ""


class ServiceNotice(BaseModel):
    source: Literal["weather", "places"]
    message: str


class TripPlanResponse(BaseModel):
    answer: str
    weather: WeatherSnapshot | None = None
    places: list[PlaceSnapshot] = Field(default_factory=list)
    service_notices: list[ServiceNotice] = Field(default_factory=list)
    model: str
    used_live_weather: bool
    used_location_context: bool


class ShareTripSettings(BaseModel):
    language: Language = "English"
    budget: BudgetLevel = "Smart value"
    travelStyle: TravelStyle = "Balanced"
    days: int = Field(default=5, ge=1, le=45)
    travelers: int = Field(default=2, ge=1, le=20)
    sustainability: int = Field(default=4, ge=1, le=5)


class ShareSnapshot(BaseModel):
    version: str = Field(default="1.1.0", min_length=1, max_length=30)
    title: str = Field(default="Eco Travel Planner chat", min_length=1, max_length=120)
    createdAt: str = Field(min_length=1, max_length=80)
    history: list[ChatMessage] = Field(default_factory=list, min_length=1, max_length=80)
    settings: ShareTripSettings = Field(default_factory=ShareTripSettings)


class ShareCreateRequest(ShareSnapshot):
    pass


class ShareCreateResponse(BaseModel):
    id: str
    url: str
