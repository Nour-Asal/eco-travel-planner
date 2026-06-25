from __future__ import annotations

import os
import re
from typing import Any

import gradio as gr
import requests
from dotenv import load_dotenv

from api.maps import search_places
from utils.prompts import BASE_SYSTEM_PROMPT, LANGUAGE_PROMPTS


load_dotenv()

OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY", "").strip()
OPENROUTER_MODEL = os.environ.get("OPENROUTER_MODEL", "openai/gpt-4o-mini").strip()
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

WEATHER_API_KEY = os.environ.get("WEATHER_API_KEY", "").strip()
WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather"


CITY_ALIASES = {
    "istanbul": "Istanbul",
    "اسطنبول": "Istanbul",
    "إسطنبول": "Istanbul",
    "tokyo": "Tokyo",
    "طوكيو": "Tokyo",
    "paris": "Paris",
    "باريس": "Paris",
    "london": "London",
    "لندن": "London",
    "dubai": "Dubai",
    "دبي": "Dubai",
    "cairo": "Cairo",
    "القاهرة": "Cairo",
    "ankara": "Ankara",
    "انقرة": "Ankara",
    "أنقرة": "Ankara",
    "new york": "New York",
    "نيويورك": "New York",
    "rome": "Rome",
    "روما": "Rome",
    "berlin": "Berlin",
    "برلين": "Berlin",
    "madrid": "Madrid",
    "مدريد": "Madrid",
    "bangkok": "Bangkok",
    "بانكوك": "Bangkok",
    "seoul": "Seoul",
    "سيول": "Seoul",
    "toronto": "Toronto",
    "تورونتو": "Toronto",
}


ERROR_MESSAGES = {
    "missing_key": {
        "English": "Missing OPENROUTER_API_KEY. Add it to your .env file, then restart the app.",
        "Turkish": "OPENROUTER_API_KEY eksik. .env dosyasina ekleyip uygulamayi yeniden baslatin.",
        "Arabic": "مفتاح OPENROUTER_API_KEY غير موجود. أضفه داخل ملف .env ثم أعد تشغيل التطبيق.",
    },
    "timeout": {
        "English": "The request took too long. Please try again with a shorter question.",
        "Turkish": "Istek uzun surdu. Lutfen daha kisa bir soru ile tekrar deneyin.",
        "Arabic": "استغرق الطلب وقتًا طويلًا. جرّب سؤالًا أقصر.",
    },
    "empty": {
        "English": "Write a destination or travel idea and I will build a plan.",
        "Turkish": "Bir destinasyon veya seyahat fikri yazin, sizin icin plan hazirlayayim.",
        "Arabic": "اكتب وجهة أو فكرة سفر وسأبني لك خطة.",
    },
}


def message_for(key: str, language: str) -> str:
    return ERROR_MESSAGES[key].get(language, ERROR_MESSAGES[key]["English"])


def detect_city(message: str) -> str | None:
    normalized = message.casefold()

    for alias, city in CITY_ALIASES.items():
        pattern = rf"(?<!\w){re.escape(alias.casefold())}(?!\w)"
        if re.search(pattern, normalized):
            return city

    return None


def get_weather_context(city: str | None) -> str:
    if not city or not WEATHER_API_KEY:
        return ""

    try:
        response = requests.get(
            WEATHER_URL,
            params={
                "q": city,
                "appid": WEATHER_API_KEY,
                "units": "metric",
            },
            timeout=10,
        )
        response.raise_for_status()
        data = response.json()

        weather = data["weather"][0]
        main = data["main"]
        wind = data.get("wind", {})

        return f"""
Live weather context for {city}:
- Temperature: {main["temp"]:.0f} C
- Conditions: {weather["description"]}
- Humidity: {main["humidity"]}%
- Wind speed: {wind.get("speed", 0)} m/s

Use this context only when it is relevant to the user's itinerary.
"""
    except (requests.RequestException, KeyError, IndexError, TypeError) as exc:
        print(f"Weather API error for {city}: {exc}")
        return ""


def get_places_context(message: str) -> str:
    places = search_places(message, limit=3)

    if not places:
        return ""

    lines = ["Map/location context from public geodata:"]

    for place in places:
        lines.append(
            "- {name}: {display_name} ({lat}, {lon})".format(
                name=place["name"],
                display_name=place["display_name"],
                lat=place["lat"],
                lon=place["lon"],
            )
        )

    return "\n".join(lines)


def build_preference_context(
    travel_style: str,
    budget_level: str,
    sustainability_priority: int | float,
) -> str:
    return f"""
Traveler preferences:
- Travel style: {travel_style}
- Budget level: {budget_level}
- Sustainability priority: {int(sustainability_priority)}/5

Reflect these preferences in transportation, hotels, activities, and budget ranges.
"""


def normalize_history(history: list[Any] | None) -> list[dict[str, str]]:
    messages: list[dict[str, str]] = []

    for item in history or []:
        if isinstance(item, dict):
            role = item.get("role")
            content = item.get("content")
            if role in {"user", "assistant"} and content:
                messages.append({"role": role, "content": str(content)})
            continue

        if isinstance(item, (list, tuple)) and len(item) >= 2:
            user_message, assistant_message = item[0], item[1]
            if user_message:
                messages.append({"role": "user", "content": str(user_message)})
            if assistant_message:
                messages.append({"role": "assistant", "content": str(assistant_message)})

    return messages


def build_system_prompt(
    language: str,
    preferences: str,
    weather_context: str,
    places_context: str,
) -> str:
    sections = [
        BASE_SYSTEM_PROMPT,
        LANGUAGE_PROMPTS.get(language, LANGUAGE_PROMPTS["English"]),
        preferences,
        weather_context,
        places_context,
    ]

    return "\n\n".join(section.strip() for section in sections if section.strip())


def eco_chat_respond(
    message: str,
    history: list[Any] | None,
    language: str,
    travel_style: str,
    budget_level: str,
    sustainability_priority: int | float,
) -> str:
    if not message or not message.strip():
        return message_for("empty", language)

    if not OPENROUTER_API_KEY:
        return message_for("missing_key", language)

    city = detect_city(message)
    weather_context = get_weather_context(city)
    places_context = get_places_context(message)
    preference_context = build_preference_context(
        travel_style,
        budget_level,
        sustainability_priority,
    )

    messages = [
        {
            "role": "system",
            "content": build_system_prompt(
                language=language,
                preferences=preference_context,
                weather_context=weather_context,
                places_context=places_context,
            ),
        },
        *normalize_history(history),
        {"role": "user", "content": message.strip()},
    ]

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": os.environ.get("APP_PUBLIC_URL", "http://localhost:7860"),
        "X-Title": "Eco Travel Planner",
    }

    payload = {
        "model": OPENROUTER_MODEL,
        "messages": messages,
        "temperature": 0.65,
        "max_tokens": 1400,
    }

    try:
        response = requests.post(
            OPENROUTER_URL,
            headers=headers,
            json=payload,
            timeout=45,
        )

        if response.status_code != 200:
            return f"API error {response.status_code}\n\n{response.text}"

        data = response.json()
        text = data.get("choices", [{}])[0].get("message", {}).get("content", "")

        if not text:
            return "No response was generated. Please try again."

        return text.strip()
    except requests.exceptions.Timeout:
        return message_for("timeout", language)
    except requests.RequestException as exc:
        return f"Network error: {exc}"
    except (KeyError, IndexError, TypeError) as exc:
        return f"Unexpected response format: {exc}"


CUSTOM_CSS = """
:root {
    color-scheme: light;
    --app-bg: #f4f7fb;
    --surface: #ffffff;
    --surface-soft: #f8fafc;
    --surface-tint: #eef7f3;
    --ink: #111827;
    --text: #243041;
    --muted: #667085;
    --line: #d9e2ec;
    --line-soft: #edf1f5;
    --brand: #0f766e;
    --brand-strong: #115e59;
    --brand-soft: #e7f4ef;
    --accent: #c99738;
    --danger: #b42318;
    --shadow: 0 18px 45px rgba(16, 24, 40, 0.08);
}

html,
body,
.gradio-container {
    background: var(--app-bg) !important;
    color: var(--ink) !important;
    font-family: Inter, "Segoe UI", Arial, sans-serif !important;
}

.gradio-container {
    --body-background-fill: var(--app-bg);
    --block-background-fill: var(--surface);
    --block-border-color: var(--line);
    --input-background-fill: #ffffff;
    --input-border-color: #d0d7e2;
    --input-placeholder-color: #98a2b3;
    --button-primary-background-fill: var(--brand);
    --button-primary-background-fill-hover: var(--brand-strong);
    --button-primary-text-color: #ffffff;
    --button-secondary-background-fill: #ffffff;
    --button-secondary-text-color: var(--text);
    --button-secondary-border-color: var(--line);
    --border-color-primary: var(--line);
    --link-text-color: var(--brand);
    max-width: 1280px !important;
    margin: 0 auto !important;
}

.gradio-container * {
    letter-spacing: 0 !important;
}

#app-shell {
    min-height: 100vh;
}

.app-shell {
    gap: 16px;
    padding: 24px;
}

.app-header {
    align-items: center;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 10px;
    box-shadow: var(--shadow);
    display: flex;
    justify-content: space-between;
    gap: 24px;
    padding: 16px 18px;
}

.brand-cluster {
    align-items: center;
    display: flex;
    gap: 14px;
    min-width: 0;
}

.brand-mark {
    align-items: center;
    background: linear-gradient(135deg, var(--brand), #164e63);
    border-radius: 10px;
    color: #ffffff;
    display: flex;
    flex: 0 0 auto;
    font-size: 0.95rem;
    font-weight: 800;
    height: 44px;
    justify-content: center;
    width: 44px;
}

.header-kicker {
    color: var(--brand);
    font-size: 0.72rem;
    font-weight: 800;
    line-height: 1;
    margin-bottom: 5px;
    text-transform: uppercase;
}

.header-title {
    color: var(--ink);
    font-size: 1.48rem;
    font-weight: 800;
    line-height: 1.15;
    margin: 0;
}

.header-sub {
    color: var(--muted);
    font-size: 0.91rem;
    line-height: 1.45;
    margin-top: 4px;
    max-width: 660px;
}

.feature-strip {
    display: grid;
    flex: 0 0 auto;
    gap: 8px;
    grid-template-columns: repeat(2, minmax(126px, 1fr));
}

.feature-chip {
    align-items: center;
    background: var(--surface-soft);
    border: 1px solid var(--line-soft);
    border-radius: 8px;
    color: #344054;
    display: flex;
    font-size: 0.82rem;
    font-weight: 650;
    gap: 7px;
    min-height: 34px;
    padding: 7px 9px;
    white-space: nowrap;
}

.feature-dot {
    background: var(--brand);
    border-radius: 999px;
    height: 7px;
    width: 7px;
}

.content-row {
    align-items: stretch;
    gap: 16px;
}

.settings-panel,
.chat-panel {
    background: var(--surface) !important;
    border: 1px solid var(--line) !important;
    border-radius: 10px !important;
    box-shadow: var(--shadow);
}

.settings-panel {
    padding: 16px !important;
}

.chat-panel {
    overflow: hidden;
    padding: 0 !important;
}

.panel-title {
    border-bottom: 1px solid var(--line-soft);
    margin-bottom: 14px;
    padding-bottom: 12px;
}

.panel-title span {
    color: var(--ink);
    display: block;
    font-size: 1.08rem;
    font-weight: 800;
}

.panel-title small {
    color: var(--muted);
    display: block;
    font-size: 0.82rem;
    margin-top: 3px;
}

.quick-starts {
    background: var(--surface-soft);
    border: 1px solid var(--line-soft);
    border-radius: 8px;
    margin-top: 14px;
    padding: 12px;
}

.quick-title {
    color: var(--ink);
    font-size: 0.86rem;
    font-weight: 800;
    margin-bottom: 9px;
}

.quick-item {
    border-top: 1px solid var(--line-soft);
    color: var(--muted);
    font-size: 0.83rem;
    line-height: 1.4;
    padding: 8px 0;
}

.quick-item:first-of-type {
    border-top: 0;
    padding-top: 0;
}

.chat-toolbar {
    align-items: center;
    background: linear-gradient(180deg, #ffffff 0%, #fbfcfe 100%);
    border-bottom: 1px solid var(--line);
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 16px;
}

.chat-title {
    color: var(--ink);
    font-size: 1.02rem;
    font-weight: 800;
}

.chat-subtitle {
    color: var(--muted);
    font-size: 0.82rem;
    margin-top: 2px;
}

.status-pill {
    align-items: center;
    background: var(--brand-soft);
    border: 1px solid #bfe4d4;
    border-radius: 999px;
    color: var(--brand-strong);
    display: flex;
    font-size: 0.78rem;
    font-weight: 750;
    gap: 7px;
    padding: 7px 10px;
    white-space: nowrap;
}

.status-dot {
    background: #16a34a;
    border-radius: 999px;
    height: 7px;
    width: 7px;
}

#settings-panel .block,
#settings-panel .form,
#settings-panel .wrap,
#settings-panel fieldset {
    background: transparent !important;
    border-color: transparent !important;
    box-shadow: none !important;
}

#settings-panel label,
#settings-panel .label-wrap,
#settings-panel .label-wrap span,
#settings-panel .block-info,
#settings-panel .block-label {
    background: transparent !important;
    border: 0 !important;
    box-shadow: none !important;
    color: #475467 !important;
    font-size: 0.8rem !important;
    font-weight: 750 !important;
    margin-bottom: 6px !important;
    padding: 0 !important;
}

#settings-panel input,
#settings-panel textarea,
#settings-panel select,
#settings-panel [role="textbox"],
#settings-panel [data-testid="dropdown"],
#settings-panel .dropdown-container,
#settings-panel .input-wrap,
#settings-panel .wrap input {
    background: #ffffff !important;
    border-color: #d0d7e2 !important;
    border-radius: 8px !important;
    color: var(--ink) !important;
    min-height: 42px !important;
}

#settings-panel .wrap:hover,
#settings-panel .input-wrap:focus-within,
#planner-input textarea:focus {
    border-color: var(--brand) !important;
    box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.12) !important;
}

#settings-panel .slider input,
#settings-panel input[type="range"] {
    accent-color: var(--brand) !important;
}

#chat-panel .block,
#chat-panel .wrap,
#chat-panel .form {
    background: transparent !important;
    border: 0 !important;
    box-shadow: none !important;
}

#planner-chatbot,
#planner-chatbot .wrap,
#planner-chatbot > div {
    background: #ffffff !important;
    border: 0 !important;
    color: var(--ink) !important;
}

#planner-chatbot {
    border-radius: 0 !important;
    min-height: 520px;
}

#planner-chatbot label,
#planner-chatbot .label-wrap,
#planner-chatbot .block-label {
    display: none !important;
}

#planner-chatbot .message,
#planner-chatbot .message-row,
#planner-chatbot .bubble-wrap {
    color: var(--ink) !important;
}

#planner-input {
    border-top: 1px solid var(--line-soft) !important;
    padding: 12px 14px 14px !important;
}

#planner-input textarea {
    background: #ffffff !important;
    border: 1px solid #d0d7e2 !important;
    border-radius: 8px !important;
    color: var(--ink) !important;
    min-height: 50px !important;
}

.gradio-container button {
    border-radius: 8px !important;
    font-weight: 700 !important;
}

.gradio-container button.primary,
.gradio-container button[aria-label="Submit"] {
    background: var(--brand) !important;
    border-color: var(--brand) !important;
    color: #ffffff !important;
}

.gradio-container button.primary:hover,
.gradio-container button[aria-label="Submit"]:hover {
    background: var(--brand-strong) !important;
    border-color: var(--brand-strong) !important;
}

.footer-note {
    color: var(--muted);
    font-size: 0.78rem;
    padding: 0 4px 8px;
    text-align: center;
}

@media (max-width: 980px) {
    .app-header {
        align-items: flex-start;
        flex-direction: column;
    }

    .feature-strip {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        width: 100%;
    }
}

@media (max-width: 760px) {
    .app-shell {
        padding: 12px;
    }

    .app-header,
    .settings-panel,
    .chat-panel {
        border-radius: 8px !important;
    }

    .brand-mark {
        height: 38px;
        width: 38px;
    }

    .header-title {
        font-size: 1.25rem;
    }

    .feature-strip {
        grid-template-columns: 1fr;
    }

    .chat-toolbar {
        align-items: flex-start;
        flex-direction: column;
    }

    #planner-chatbot {
        min-height: 420px;
    }
}
"""

HEADER_HTML = """
<section class="app-header">
    <div class="brand-cluster">
        <div class="brand-mark">ET</div>
        <div>
            <div class="header-kicker">Sustainable travel intelligence</div>
            <h1 class="header-title">Eco Travel Planner</h1>
            <div class="header-sub">
                Build practical low-impact itineraries with weather, budgets, route choices, and local context.
            </div>
        </div>
    </div>
    <div class="feature-strip">
        <span class="feature-chip"><i class="feature-dot"></i>Routes</span>
        <span class="feature-chip"><i class="feature-dot"></i>Eco stays</span>
        <span class="feature-chip"><i class="feature-dot"></i>Weather</span>
        <span class="feature-chip"><i class="feature-dot"></i>Budget</span>
    </div>
</section>
"""

with gr.Blocks(title="Eco Travel Planner", fill_width=True) as demo:
    with gr.Column(elem_id="app-shell", elem_classes=["app-shell"]):
        gr.HTML(HEADER_HTML)

        with gr.Row(elem_classes=["content-row"]):
            with gr.Column(scale=1, min_width=280, elem_id="settings-panel", elem_classes=["settings-panel"]):
                gr.HTML("""<div class="panel-title"><span>Trip profile</span><small>Preferences</small></div>""")

                language_dropdown = gr.Dropdown(
                    choices=["English", "Turkish", "Arabic"],
                    value="English",
                    label="Language",
                )

                travel_style_dropdown = gr.Dropdown(
                    choices=["Balanced", "Relaxed", "Adventure", "Family", "Business"],
                    value="Balanced",
                    label="Travel style",
                )

                budget_dropdown = gr.Dropdown(
                    choices=["Economy", "Smart value", "Premium", "Luxury"],
                    value="Smart value",
                    label="Budget level",
                )

                sustainability_slider = gr.Slider(
                    minimum=1,
                    maximum=5,
                    value=4,
                    step=1,
                    label="Sustainability priority",
                )
                gr.HTML("""
                <div class="quick-starts">
                    <div class="quick-title">Quick starts</div>
                    <div class="quick-item">4 days in Istanbul using public transport</div>
                    <div class="quick-item">Eco hotels in Tokyo near train stations</div>
                    <div class="quick-item">Budget trip to Thailand with lower-carbon choices</div>
                </div>
                """)

            with gr.Column(scale=4, min_width=520, elem_id="chat-panel", elem_classes=["chat-panel"]):
                gr.HTML("""
                <div class="chat-toolbar">
                    <div>
                        <div class="chat-title">Travel planning workspace</div>
                        <div class="chat-subtitle">Ask for dates, cities, budget, transport, or hotel options.</div>
                    </div>
                    <div class="status-pill"><i class="status-dot"></i>Ready</div>
                </div>
                """)
                gr.ChatInterface(
                    fn=eco_chat_respond,
                    additional_inputs=[
                        language_dropdown,
                        travel_style_dropdown,
                        budget_dropdown,
                        sustainability_slider,
                    ],
                    chatbot=gr.Chatbot(
                        height=560,
                        render_markdown=True,
                        show_label=False,
                        layout="bubble",
                        placeholder="Start with a destination, dates, budget, or travel style.",
                        buttons=["copy"],
                        elem_id="planner-chatbot",
                        elem_classes=["chatbot"],
                    ),
                    textbox=gr.Textbox(
                        placeholder="Plan 5 days in Istanbul for two people with a smart budget...",
                        container=False,
                        scale=7,
                        elem_id="planner-input",
                    ),
                )

        gr.HTML(
            """
            <div class="footer-note">
                Connect OpenRouter and OpenWeather keys in .env. Run locally, host online,
                or wrap the hosted URL in the mobile app template.
            </div>
            """
        )


if __name__ == "__main__":
    demo.launch(
        server_name=os.environ.get("GRADIO_SERVER_NAME", "127.0.0.1"),
        server_port=int(os.environ.get("GRADIO_SERVER_PORT", "7860")),
        css=CUSTOM_CSS,
        theme=gr.themes.Soft(primary_hue="green", neutral_hue="slate"),
    )
