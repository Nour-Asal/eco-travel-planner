import requests

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"


def search_places(query):

    try:

        response = requests.get(
            NOMINATIM_URL,
            params={
                "q": query,
                "format": "json",
                "limit": 5
            },
            headers={
                "User-Agent": "EcoTravelPlanner"
            },
            timeout=10
        )

        data = response.json()

        results = []

        for place in data:

            results.append({
                "name": place.get("display_name", "Unknown"),
                "lat": place.get("lat"),
                "lon": place.get("lon")
            })

        return results

    except Exception as e:
        print("Maps Error:", e)
        return []