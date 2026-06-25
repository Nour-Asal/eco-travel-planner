# Eco Travel Planner

Professional web version of the sustainable travel-planning assistant.

## Important

Do not open `frontend/index.html` directly as a file for normal use.
Run the backend server, then open:

```text
http://127.0.0.1:8000
```

The old Gradio version is archived in `legacy_gradio/` and is no longer the main app.

## Run locally

Option 1:

```powershell
python app.py
```

Option 2:

```powershell
.\run_new_site.ps1
```

Option 3:

```powershell
venv\Scripts\activate
uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

Open:

```text
http://127.0.0.1:8000
```

API docs:

```text
http://127.0.0.1:8000/api/docs
```

Health check:

```text
http://127.0.0.1:8000/api/health
```

## Current structure

```text
backend/              FastAPI backend and AI integrations
frontend/             Custom website UI
frontend/static/      CSS and JavaScript
docs/                 Professional upgrade notes
legacy_gradio/        Old Gradio version, kept only as backup
app.py                Launcher for the new FastAPI website
main.py               ASGI app export for hosting
Procfile              Deployment command for Python web hosts
render.yaml           Render deployment template
.env                  Local secrets, do not upload publicly
.env.example          Example environment file
requirements.txt      Production Python dependencies
```

## Environment

Copy `.env.example` to `.env` and fill:

```text
OPENROUTER_API_KEY=...
WEATHER_API_KEY=...
APP_PUBLIC_URL=https://your-domain.com
APP_ENV=production
```

## Deployment

The app can be deployed as one Python web service because FastAPI serves both:

- `/api/*` backend routes
- `/` and `/static/*` frontend files

Recommended start command:

```bash
uvicorn backend.main:app --host 0.0.0.0 --port $PORT
```

## Next professional upgrades

1. Add user accounts and saved trips.
2. Add a database such as PostgreSQL or Supabase.
3. Add real booking/search integrations.
4. Add a React or Next.js frontend when the UI grows beyond this focused app.
5. Build the mobile app with Expo and call the same FastAPI backend.