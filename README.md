# plango AI

**Sri Lanka’s multi-agent family grocery OS** — meal plans and shopping lists that already know what’s in your pantry, who you’re cooking for, and what’s happening outside your door.

> *“Plan 5 dinners for a family of 4, LKR 5,000, diabetic-friendly, no fish — monsoon this week.”*

plango turns that into recipes, a store-aware shopping list, and agent logs you can trust — not another generic chat window.

**Live:** [plangoai.vercel.app](https://plangoai.vercel.app)

---

## Why it exists

Family grocery planning in Sri Lanka is fragmented: no real inventory memory, dietary prefs get forgotten, weather and crises change spoilage and routes, and price-hunting across Keells / Cargills / local markets is manual.

plango connects **home inventory (RAG)**, **family preferences**, **dietary screening**, **weather & spoilage**, **prices**, and **route/store signals** into one conversational OS.

---

## Features

| Area | What you get |
|------|----------------|
| **Conversational planning** | Natural-language prompts → meals, shopping list, savings, agent trail |
| **Home inventory + RAG** | Pantry-aware plans; bill scan to restock |
| **Family preferences** | Diets, allergies, likes — remembered per household |
| **Specialist agents** | Price catalog, recipe compiler, route optimizer, sensory decay, dietary screen |
| **Context signals** | Weather, news/crisis awareness, store/places search |
| **MiroFish sourcing** | Optional synthetic / live sourcing simulations |
| **Auth** | Email + Google via Supabase |

---

## Architecture (high level)

```
User prompt
    │
    ▼
┌─────────────────┐     ┌──────────────────────────────────────┐
│  Next.js App    │────▶│  Orchestrator (/api/plan)            │
│  App Shell UI   │     │  Intent → specialist agents → plan   │
└────────┬────────┘     └───────────────┬──────────────────────┘
         │                              │
         ▼                              ▼
   Supabase Auth + DB            Vertex AI (Gemini)
   inventory · family ·          embeddings · JSON plans
   memory · sessions
```

**Agents (examples):** inventory RAG · dietary · spoilage/weather · prices · recipes · route/stores · MiroFish

---

## Tech stack

- **App:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, Motion
- **Auth & data:** Supabase (SSR cookies, Postgres)
- **AI:** Google Cloud Vertex AI (Gemini + embeddings) via service account env
- **Integrations:** Firecrawl / scrape.do, SerpAPI, weather & news APIs, MiroFish
- **Deploy:** Vercel

---

## Quick start

```bash
npm install
cp .env.example .env   # then fill values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).  
Health: [http://localhost:3000/api/health](http://localhost:3000/api/health)

### Required environment

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase anon / publishable key |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Full service account JSON **as one line** (no file on Vercel) |
| `GOOGLE_CLOUD_PROJECT` | GCP project id |
| `GOOGLE_CLOUD_LOCATION` | e.g. `us-central1` |

Optional: `FIRECRAWL_API_KEY`, `SCRAPE_DO_TOKEN`, `SERPAPI_KEY`, `WEATHER_API_KEY`, `NEWS_API_KEY`, MiroFish URLs — see `.env.example`.

Generate the Google env line locally (file stays gitignored):

```bash
npm run print:google-env
```

### Auth redirects (Google login)

In **Supabase → Authentication → URL Configuration**:

- Site URL: `https://plangoai.vercel.app` (and `http://localhost:3000` for local)
- Redirect URLs: `…/auth/callback` for each origin

In **Google Cloud OAuth client**, authorized redirect URI must be:

`https://<your-project-ref>.supabase.co/auth/v1/callback`

---

## Deploy on Vercel

1. Import the GitHub repo in [Vercel](https://vercel.com/new)
2. Add the same env vars as local (including `GOOGLE_SERVICE_ACCOUNT_JSON` — **not** a JSON file path)
3. Deploy

Do **not** commit `.env` or `google-service-account.json`. Both are gitignored; production secrets live only in Vercel Environment Variables.

---

## Project layout

```
app/                 # App Router pages + API routes
  api/plan/          # Multi-agent meal planning
  api/inventory/     # Inventory + bill scan
  auth/callback/     # OAuth code exchange
components/          # Dashboard, agents, chat, inventory UI
lib/
  agents/            # Specialist agents
  orchestrator/      # Plan pipeline
  services/          # Vertex, scrape, weather, news, …
  supabase/          # Clients, data, RAG helpers
supabase/            # SQL / schema
scripts/             # Dev helpers (env print, orchestration tests)
```

---

## Core API

`POST /api/plan`

```json
{
  "prompt": "Plan 3 dinners, diabetic-friendly, no fish",
  "budgetLkr": 5000,
  "stream": false
}
```

Uses the signed-in user’s inventory, family, and memory when available. Returns recipes, shopping list, savings signals, and agent execution logs. Set `"stream": true` for progressive updates where supported.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Local development |
| `npm run build` / `start` | Production build & serve |
| `npm run lint` | Lint |
| `npm run print:google-env` | Emit `GOOGLE_SERVICE_ACCOUNT_JSON=…` from local key file |
| `npm run test:orchestration` | Smoke-test planning flow |

---

## License

Private / team project — all rights reserved unless otherwise noted.
