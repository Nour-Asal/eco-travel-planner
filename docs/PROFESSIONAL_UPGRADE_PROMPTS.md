# Professional Upgrade Prompts Applied

These are the product and engineering prompts used to reshape the project from a local Gradio demo into a deployable web product.

## 1. Product Architecture Prompt

Act as a senior product engineer. Replace demo-only tooling with a deployable architecture. Separate user interface, API routes, external service integrations, request schemas, and prompt logic. Keep the system simple enough for an MVP but structured enough to grow into a production product.

Applied:

- `backend/` for FastAPI.
- `frontend/` for the website.
- `backend/services/` for AI, weather, places, and city detection.
- `backend/schemas.py` for typed request and response contracts.

## 2. UI/UX Prompt

Act as a senior product designer for a travel-planning SaaS tool. The first screen must be the actual planner, not a marketing page. Use restrained colors, clear hierarchy, compact panels, helpful blank states, and responsive layout. Avoid fighting framework defaults; build a custom interface when the framework limits the experience.

Applied:

- Replaced Gradio UI with custom HTML/CSS/JS.
- Added trip brief panel, result workspace, insight strip, prompt starters, and responsive mobile layout.
- Removed oversized empty chat surface and badge-like labels.

## 3. Backend Prompt

Act as a backend engineer. Create a stable API that can serve web and mobile clients. Validate inputs, isolate third-party integrations, keep secrets in environment variables, and expose health checks and API documentation.

Applied:

- `POST /api/plan`
- `GET /api/health`
- `GET /api/docs`
- Environment-driven configuration.

## 4. AI Prompt Engineering Prompt

Act as a travel-domain prompt engineer. Make the assistant specific, honest, and useful. Force clear sections, realistic assumptions, budget ranges, sustainable transportation tradeoffs, and no invented booking guarantees.

Applied:

- New system prompt in `backend/prompts.py`.
- Traveler profile included in every request.
- Weather and location context included only when available.

## 5. Deployment Prompt

Act as a deployment engineer. Make the app run as one web service that can be deployed beyond localhost. Serve frontend and backend from the same FastAPI app, document the start command, and include common hosting files.

Applied:

- `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
- `Procfile`
- `render.yaml`
- Root `main.py`
