from __future__ import annotations

import re


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
    "amsterdam": "Amsterdam",
    "أمستردام": "Amsterdam",
    "oslo": "Oslo",
    "أوسلو": "Oslo",
}


def detect_city(message: str) -> str | None:
    normalized = message.casefold()

    for alias, city in CITY_ALIASES.items():
        pattern = rf"(?<!\w){re.escape(alias.casefold())}(?!\w)"
        if re.search(pattern, normalized):
            return city

    return None
