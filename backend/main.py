from __future__ import annotations

from pathlib import Path

from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from backend.config import settings
from backend.schemas import (
    ServiceNotice,
    ShareCreateRequest,
    ShareCreateResponse,
    ShareSnapshot,
    BudgetLevel,
    Language,
    OfferSearchResponse,
    TripPlanRequest,
    TripPlanResponse,
)
from backend.services.ai import generate_trip_plan
from backend.services.cities import detect_city
from backend.services.flights import get_mock_flight_offers
from backend.services.places import PlacesServiceError, format_places_context, search_places
from backend.services.shares import ShareStorageError, create_share, get_share
from backend.services.stays import get_mock_stay_offers
from backend.services.weather import WeatherServiceError, format_weather_context, get_weather


PROJECT_ROOT = Path(__file__).resolve().parents[1]
FRONTEND_DIR = PROJECT_ROOT / "frontend"
STATIC_DIR = FRONTEND_DIR / "static"


app = FastAPI(
    title=settings.app_name,
    version="1.1.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.app_env == "development" else [settings.public_url],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


@app.get("/api/health")
async def health() -> dict[str, str | bool]:
    return {
        "status": "ok",
        "app": settings.app_name,
        "model": settings.openrouter_model,
        "has_openrouter_key": bool(settings.openrouter_api_key),
        "has_weather_key": bool(settings.weather_api_key),
    }


@app.post("/api/plan", response_model=TripPlanResponse)
async def plan_trip(request: TripPlanRequest) -> TripPlanResponse:
    city = detect_city(request.message)
    service_notices: list[ServiceNotice] = []

    try:
        weather = await get_weather(city)
    except WeatherServiceError as exc:
        weather = None
        service_notices.append(ServiceNotice(source="weather", message=str(exc)))

    try:
        places = await search_places(request.message, limit=3)
    except PlacesServiceError as exc:
        places = []
        service_notices.append(ServiceNotice(source="places", message=str(exc)))

    weather_context = format_weather_context(weather)
    places_context = format_places_context(places)

    try:
        answer = await generate_trip_plan(request, weather_context, places_context)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Backend error while generating the trip plan.",
        ) from exc

    return TripPlanResponse(
        answer=answer,
        weather=weather,
        places=places,
        service_notices=service_notices,
        model=settings.openrouter_model,
        used_live_weather=bool(weather),
        used_location_context=bool(places),
    )


@app.get("/api/offers/flights", response_model=OfferSearchResponse)
async def flight_offers(
    origin: str = Query(default="", max_length=120),
    destination: str = Query(default="", max_length=120),
    departureDate: str = Query(default="", max_length=40),
    returnDate: str = Query(default="", max_length=40),
    travelers: int = Query(default=1, ge=1, le=12),
    budget: BudgetLevel = "Smart value",
    language: Language = "English",
) -> OfferSearchResponse:
    return get_mock_flight_offers(
        origin=origin,
        destination=destination,
        departureDate=departureDate,
        returnDate=returnDate,
        travelers=travelers,
        budget=budget,
        language=language,
    )


@app.get("/api/offers/stays", response_model=OfferSearchResponse)
async def stay_offers(
    origin: str = Query(default="", max_length=120),
    destination: str = Query(default="", max_length=120),
    departureDate: str = Query(default="", max_length=40),
    returnDate: str = Query(default="", max_length=40),
    travelers: int = Query(default=1, ge=1, le=12),
    budget: BudgetLevel = "Smart value",
    language: Language = "English",
) -> OfferSearchResponse:
    return get_mock_stay_offers(
        origin=origin,
        destination=destination,
        departureDate=departureDate,
        returnDate=returnDate,
        travelers=travelers,
        budget=budget,
        language=language,
    )


@app.post("/api/shares", response_model=ShareCreateResponse)
async def create_share_link(
    share: ShareCreateRequest,
    request: Request,
) -> ShareCreateResponse:
    try:
        share_id = await create_share(share)
    except ShareStorageError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    base_url = str(request.base_url).rstrip("/")
    return ShareCreateResponse(id=share_id, url=f"{base_url}/share/{share_id}")


@app.get("/api/shares/{share_id}", response_model=ShareSnapshot)
async def read_share_link(share_id: str) -> ShareSnapshot:
    if not share_id.isalnum() or not 4 <= len(share_id) <= 32:
        raise HTTPException(status_code=404, detail="Share link not found.")

    try:
        share = await get_share(share_id)
    except ShareStorageError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    if not share:
        raise HTTPException(status_code=404, detail="Share link not found.")

    return share


@app.get("/{path:path}")
async def serve_frontend(path: str) -> FileResponse:
    requested = FRONTEND_DIR / path

    if path and requested.exists() and requested.is_file():
        return FileResponse(requested)

    return FileResponse(FRONTEND_DIR / "index.html")
