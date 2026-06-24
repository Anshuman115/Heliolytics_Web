# Heliolytics Web

**Next.js dashboard for a self-hosted wearable-health platform.** It visualizes the
metrics synced from a fitness band — steps, vitals, sleep stages, recovery, and workouts —
reading from the Heliolytics Go API over a server-signed, HMAC-authenticated channel.

> **This repository is the web dashboard.** It pairs with a Flutter BLE client and a Go
> ingestion/analytics backend — see [System architecture](#system-architecture).

---

## Engineering highlights

- **Secret-safe API access** — every backend call is **HMAC-signed in a server component /
  route handler**; the signing secret never reaches the browser. The client only ever sees
  rendered data.
- **Auth at the edge** — `middleware.ts` gates every route, redirecting unauthenticated
  requests to `/login`; password login is rate-limited with a signed, 7-day session cookie.
- **App Router, server-first** — data is fetched in React Server Components, so the
  dashboard ships minimal client JS and never exposes API internals.
- **Typed data layer** — a small typed Go-API client (`lib/api`) mirrors the backend's
  metrics contract; charts are one focused Recharts component per visualization.

---

## System architecture

| Repo | Role | Stack |
|------|------|-------|
| **Heliolytics_Web** (this repo) | Web dashboard | Next.js · TypeScript · Tailwind · Recharts |
| **Heliolytics** | Ingest, parse, store, metrics API | Go · PostgreSQL + TimescaleDB |
| **Heliolytics_App** | BLE sync + health UI | Flutter · Dart |

```
Go API  ──HMAC (server-side)──►  Next.js (server components)  ──►  browser (rendered charts)
```

---

## Features

- **Daily metrics** — steps, HRV, SpO₂, stress, PAI, resting HR, respiratory rate, recovery score
- **Sleep** — deep / REM / light breakdown with a per-night stage bar
- **Workouts & activity sessions** — sport, duration, calories, avg HR
- **Time-series charts** — vitals, temperature, sleep stages, step trends (Recharts)

---

## Tech stack

Next.js 14 (App Router, Server Components) · TypeScript · Tailwind CSS · Recharts ·
HMAC-SHA256 request signing · Docker / Vercel

---

## Environment variables

| Variable | Description |
|----------|-------------|
| `HELIOLYTICS_WEB_PASSWORD` | Dashboard login password |
| `HELIOLYTICS_SIGNING_SECRET` | HMAC secret shared with the Go API |
| `API_INTERNAL_URL` | Go API base URL (default `http://localhost:8080`) |
| `COOKIE_SECURE` | `true` in production to enforce HTTPS-only cookies |

Set these in the deployment environment (Vercel / Docker) — never commit them.

---

## Dev setup

```bash
export HELIOLYTICS_SIGNING_SECRET=your-api-secret
export HELIOLYTICS_WEB_PASSWORD=your-web-password
export API_INTERNAL_URL=http://localhost:8080

npm install
npm run dev          # http://localhost:3000
```

---

## Project structure

```
app/                  App Router pages, layouts, and /api route handlers (incl. auth)
components/
  Dashboard.tsx       Top-level dashboard composition
  charts/             One Recharts component per visualization
  ui/                 Shared primitives (Chip, Stat, StageBar…)
lib/
  api/                Typed Go-API client + endpoints (HMAC-signed)
  auth/               Session management, login guard, cookie options
middleware.ts         Edge auth gate → redirects unauthenticated requests to /login
```

---

## Deployment

Deploys to **Vercel** via GitHub integration (set the four env vars in the dashboard; every
PR gets a preview deployment). For self-hosting, the Docker + Cloudflare Tunnel stack lives in
the sibling **Heliolytics** repo's `deploy/` folder — HTTPS at the edge, no open ports on the VPS.

To redeploy just this dashboard (rebuild + restart only the `web` container; db/api stay up):

```bash
./deploy.sh           # build from the current checkout
PULL=1 ./deploy.sh    # git pull first, then rebuild
```
