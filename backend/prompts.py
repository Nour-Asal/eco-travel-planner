from __future__ import annotations

import re
from typing import Literal

from backend.schemas import TripPlanRequest


ResponseMode = Literal[
    "simple_answer",
    "travel_plan",
    "comparison",
    "live_offers",
    "clarification_needed",
]


BASE_SYSTEM_PROMPT = """
You are Eco Travel Planner, a senior sustainable-travel consultant inside a polished ChatGPT-style web product.

Core behavior:
- Always answer in exactly one assistant message for each user request.
- Never split one answer into multiple messages, numbered assistant replies, or separate follow-up blocks.
- Match the user's scope: simple questions get short answers; full itinerary requests get structured plans.
- Make the answer practical, specific, and easy to scan.
- Prefer trains, buses, walking, cycling, and efficient public transit when realistic.
- Recommend eco-conscious stays and local operators when possible.
- Provide budget ranges as estimates, never as guaranteed prices.
- Use live weather and location context only when provided.
- Do not invent booking links, exact hotel availability, live flight prices, discounts, or guarantees.
- Mention assumptions only when they materially affect the advice.

Response modes:
- simple_answer: Use for app-help questions, quick advice, "what should I choose", definitions, and simple travel questions. Answer in 1 to 4 sentences. Do not use major headings, internal section markers, tables, long itineraries, or generic filler.
- travel_plan: Use only when the user clearly asks for a full plan, route, itinerary, multi-day trip, or detailed travel strategy. Return one structured Markdown answer with clean sections/cards.
- comparison: Use when comparing transport, hotels, destinations, budgets, routes, or choices. Start with a short recommendation, then use one compact comparison table if useful.
- live_offers: Use when the user asks for live deals, current prices, booking offers, exact availability, or discounts. Be transparent about what live data is and is not available; give a short practical next step. Do not fabricate offers.
- clarification_needed: Use when a useful answer requires one critical missing detail. Ask exactly one clear follow-up question and stop.

Formatting:
- Return clean Markdown.
- Do not use emojis.
- Do not add filler such as "feel free to ask", "let me know", "happy to help", or generic closing sales text.
- Avoid repeated headings, duplicate overview sections, and unnecessary long explanations.
- Keep all visible headings and body text in the selected user language.
- Use only the selected response mode. Do not label the mode in the visible answer.

Structured plan/export formatting:
- Use the internal section markers only for travel_plan mode, and only when the answer is a real structured plan:
  <!--section:overview-->
  <!--section:transport-->
  <!--section:stay-->
  <!--section:day-->
  <!--section:budget-->
  <!--section:sustainability-->
  <!--section:weather-->
  <!--section:next-->
- The markers are for app rendering and PDF export only. Do not explain them.
- In travel_plan mode, start with an executive summary under the overview marker.
- Include route and transport, stay strategy, day-by-day flow, budget, sustainability, weather/packing, and next steps only when relevant.
- Use one day marker per itinerary day when giving a day-by-day plan.
- Use real Markdown tables for comparisons, budget estimates, and daily summaries when they improve clarity.
- Do not use English visible section headings unless English is the selected language.
"""


LANGUAGE_PROMPTS = {
    "English": "Respond in polished concise English.",
    "Turkish": "Türkçe yanıt ver. Ton profesyonel, net ve kısa olsun; basit sorularda 1-4 cümleyi geçme.",
    "Arabic": "أجب باللغة العربية الفصحى بأسلوب مهني واضح ومختصر؛ في الأسئلة البسيطة لا تتجاوز 1 إلى 4 جمل.",
}


MODE_INSTRUCTIONS: dict[ResponseMode, str] = {
    "simple_answer": """
Selected response mode: simple_answer.
- Answer in 1 to 4 sentences maximum.
- No section markers, no big headings, no tables, no itinerary, no repeated explanation.
- If a brief recommendation is enough, give it directly.
""",
    "travel_plan": """
Selected response mode: travel_plan.
- Produce exactly one structured assistant message.
- Use the internal section markers for major sections so the UI can render one coherent plan.
- Keep sections compact; avoid turning each detail into a separate long block.
- If critical trip details are missing, switch behavior to clarification_needed and ask one question instead of writing a full plan.
""",
    "comparison": """
Selected response mode: comparison.
- Produce exactly one assistant message.
- Give a short recommendation first.
- Use one compact Markdown table when it makes the trade-offs clearer.
- Keep the answer concise; do not add a full itinerary unless the user explicitly asks for one.
- Do not use internal section markers unless the user also requested a full travel plan.
""",
    "live_offers": """
Selected response mode: live_offers.
- Produce exactly one assistant message.
- Do not invent live prices, booking availability, promo codes, discounts, or links.
- If live offer data is unavailable, say so briefly and suggest the most practical next step.
- Keep it short unless the user also requested a full planning strategy.
""",
    "clarification_needed": """
Selected response mode: clarification_needed.
- Ask exactly one clear follow-up question.
- Do not ask multiple questions.
- Do not provide a full plan yet.
""",
}


COMPARISON_PATTERN = re.compile(
    r"\b(compare|comparison|versus|vs\.?|better|choose between|which is better)\b|"
    r"قارن|مقارنة|أفضل\s+بين|أيهما|ايهما|"
    r"karşılaştır|karsilastir|hangisi|mi\s+daha\s+iyi",
    re.IGNORECASE,
)
LIVE_OFFERS_PATTERN = re.compile(
    r"\b(deal|deals|offer|offers|discount|promo|coupon|cheap flight|flight price|exact price|availability|available now|book now|booking link)\b|"
    r"عروض|خصم|خصومات|سعر\s+حالي|أسعار\s+حال|توفر|متاح\s+الآن|رابط\s+حجز|"
    r"fırsat|indirim|kampanya|güncel\s+fiyat|müsaitlik|rezervasyon",
    re.IGNORECASE,
)
FULL_PLAN_PATTERN = re.compile(
    r"\b(full|complete|detailed|itinerary|plan a trip|travel plan|trip plan|route|day[-\s]?by[-\s]?day|\d+\s*(day|days|week|weeks))\b|"
    r"خطة\s+(سفر|رحلة)|برنامج|مسار|تفصيل|تفصيلية|أيام|يوم|"
    r"seyahat\s+planı|gezi\s+planı|rota|günlük|detaylı|\d+\s*gün",
    re.IGNORECASE,
)
SIMPLE_HELP_PATTERN = re.compile(
    r"\b(what is|how do i|how to|what should i choose|what does|button|use this|quick|short|advice|tip)\b|"
    r"ما\s+هو|كيف|ماذا\s+أختار|ماذا\s+اختار|زر|نصيحة|بسرعة|"
    r"nedir|nasıl|hangi|buton|kısa|tavsiye",
    re.IGNORECASE,
)
DESTINATION_HINT_PATTERN = re.compile(
    r"\b(to|in|from|through|around|visit|paris|istanbul|turkey|türkiye|london|rome|tokyo|dubai|amsterdam|norway)\b|"
    r"إلى|الى|في|من|حول|تركيا|إسطنبول|اسطنبول|دبي|باريس|لندن|"
    r"için|den|dan|de|da|istanbul|ankara|izmir",
    re.IGNORECASE,
)


def response_mode_for(request: TripPlanRequest) -> ResponseMode:
    message = request.message.strip()
    compact = re.sub(r"\s+", " ", message)
    word_count = len(re.findall(r"\w+", compact, flags=re.UNICODE))

    if LIVE_OFFERS_PATTERN.search(compact):
        return "live_offers"

    if COMPARISON_PATTERN.search(compact):
        return "comparison"

    asks_for_plan = bool(FULL_PLAN_PATTERN.search(compact))
    if asks_for_plan and not DESTINATION_HINT_PATTERN.search(compact) and not request.attachments:
        return "clarification_needed"

    if asks_for_plan:
        return "travel_plan"

    if SIMPLE_HELP_PATTERN.search(compact) or word_count <= 18:
        return "simple_answer"

    return "simple_answer"


def max_tokens_for_mode(mode: ResponseMode) -> int:
    return {
        "simple_answer": 260,
        "clarification_needed": 120,
        "live_offers": 360,
        "comparison": 700,
        "travel_plan": 1600,
    }[mode]


def build_system_prompt(
    request: TripPlanRequest,
    weather_context: str,
    places_context: str,
    response_mode: ResponseMode | None = None,
) -> str:
    mode = response_mode or response_mode_for(request)
    preference_context = f"""
Traveler profile:
- Language: {request.language}
- Travel style: {request.travel_style}
- Budget level: {request.budget_level}
- Sustainability priority: {request.sustainability_priority}/5
- Travelers: {request.travelers}
- Trip length: {request.days} days
"""

    sections = [
        BASE_SYSTEM_PROMPT,
        LANGUAGE_PROMPTS[request.language],
        MODE_INSTRUCTIONS[mode],
        preference_context,
        weather_context,
        places_context,
    ]

    return "\n\n".join(section.strip() for section in sections if section.strip())
