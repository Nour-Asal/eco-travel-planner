from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


Language = Literal["English", "Turkish", "Arabic"]
TravelStyle = Literal["Balanced", "Relaxed", "Adventure", "Family", "Business"]
BudgetLevel = Literal["Economy", "Smart value", "Premium", "Luxury"]


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=6000)


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
    version: str = Field(default="1.0.0", min_length=1, max_length=30)
    title: str = Field(default="Eco Travel Planner chat", min_length=1, max_length=120)
    createdAt: str = Field(min_length=1, max_length=80)
    history: list[ChatMessage] = Field(default_factory=list, min_length=1, max_length=80)
    settings: ShareTripSettings = Field(default_factory=ShareTripSettings)


class ShareCreateRequest(ShareSnapshot):
    pass


class ShareCreateResponse(BaseModel):
    id: str
    url: str
