from __future__ import annotations

import httpx
from fastapi import HTTPException

from backend.config import settings
from backend.prompts import build_system_prompt, max_tokens_for_mode, response_mode_for
from backend.schemas import AttachmentInput, ChatMessage, TripPlanRequest


def _format_history(history: list[ChatMessage]) -> list[dict[str, str]]:
    return [{"role": item.role, "content": item.content} for item in history[-12:]]


def _attachment_context(attachments: list[AttachmentInput]) -> str:
    if not attachments:
        return ""

    lines = [
        "The user attached travel-related files. Analyze them carefully when visible.",
        "For tickets, booking confirmations, screenshots, or maps: extract destinations, dates, times, airports/stations, passenger context, constraints, and any useful travel clues. Then suggest practical places and next steps for the detected city or country.",
    ]

    for index, attachment in enumerate(attachments, start=1):
        lines.append(
            f"Attachment {index}: {attachment.name} ({attachment.mime_type}, {attachment.size} bytes)."
        )
        if attachment.text:
            lines.append(f"Text content from {attachment.name}:\n{attachment.text[:6000]}")

    return "\n".join(lines)


def _build_user_content(request: TripPlanRequest) -> str | list[dict[str, object]]:
    attachment_context = _attachment_context(request.attachments)
    user_text = "\n\n".join(
        section.strip()
        for section in [request.message.strip(), attachment_context]
        if section.strip()
    )

    image_parts = [
        {
            "type": "image_url",
            "image_url": {"url": attachment.data_url},
        }
        for attachment in request.attachments
        if attachment.data_url and attachment.mime_type.startswith("image/")
    ]

    if not image_parts:
        return user_text

    return [{"type": "text", "text": user_text}, *image_parts]


def _ai_error_detail(response: httpx.Response) -> str:
    try:
        data = response.json()
    except ValueError:
        data = None

    if isinstance(data, dict):
        error = data.get("error")
        if isinstance(error, dict):
            message = error.get("message") or error.get("code")
            if message:
                return str(message)
        if data.get("message"):
            return str(data["message"])
        if data.get("detail"):
            return str(data["detail"])

    return response.text[:500] or "The provider returned an error without details."


async def generate_trip_plan(
    request: TripPlanRequest,
    weather_context: str,
    places_context: str,
) -> str:
    if not settings.openrouter_api_key:
        raise HTTPException(
            status_code=500,
            detail="OPENROUTER_API_KEY is missing. Add it to .env before using planning.",
        )

    response_mode = response_mode_for(request)
    messages = [
        {
            "role": "system",
            "content": build_system_prompt(request, weather_context, places_context, response_mode),
        },
        *_format_history(request.history),
        {"role": "user", "content": _build_user_content(request)},
    ]

    headers = {
        "Authorization": f"Bearer {settings.openrouter_api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": settings.public_url,
        "X-Title": settings.app_name,
    }

    payload = {
        "model": settings.openrouter_model,
        "messages": messages,
        "temperature": 0.62,
        "max_tokens": max_tokens_for_mode(response_mode),
    }

    try:
        async with httpx.AsyncClient(timeout=45) as client:
            response = await client.post(
                settings.openrouter_url,
                headers=headers,
                json=payload,
            )
    except httpx.TimeoutException as exc:
        raise HTTPException(status_code=504, detail="The AI request timed out.") from exc
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"AI network error: {exc}") from exc

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail=f"AI API error ({response.status_code}): {_ai_error_detail(response)}",
        )

    data = response.json()
    answer = data.get("choices", [{}])[0].get("message", {}).get("content", "")

    if not answer:
        raise HTTPException(status_code=502, detail="The AI provider returned no answer.")

    return answer.strip()
