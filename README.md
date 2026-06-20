# Heliolytics Web

Next.js dashboard for the Heliolytics health analytics platform. Displays metrics synced from a wearable via the Heliolytics Go API — steps, vitals, sleep stages, workouts, and more.

## Stack

- **Next.js 14** (App Router, server components)
- **TypeScript** · **Tailwind CSS** · **Recharts**
- **HMAC signing** — every API request is signed server-side; the secret never reaches the browser
- Password-gated login with rate limiting and a 7-day session cookie

## Features

- Daily metrics: steps, HRV, SpO₂, stress, PAI, resting HR, respiratory rate
- Sleep breakdown: deep / REM / light with a stage bar per night
- Workout log: sport, duration, calories, avg HR
- Time-series charts: vitals, temperature, sleep stages, step trends

## Environment Variables

| Variable | Description |
|---|---|
| `HELIOLYTICS_WEB_PASSWORD` | Password to access the dashboard |
| `HELIOLYTICS_SIGNING_SECRET` | HMAC secret shared with the Go API |
| `API_INTERNAL_URL` | Go API base URL (default: `http://localhost:8080`) |
| `COOKIE_SECURE` | Set `true` in production to enforce HTTPS-only cookies |

Never commit these — set them in your deployment environment (Vercel dashboard, Docker env, etc.).

## Dev Setup

```bash
export HELIOLYTICS_SIGNING_SECRET=your-api-secret
export HELIOLYTICS_WEB_PASSWORD=your-web-password
export API_INTERNAL_URL=http://localhost:8080

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/                  # Next.js App Router pages and API routes
components/
  charts/             # One file per chart type (Recharts)
  ui/                 # Shared UI primitives (Chip, Stat, StageBar)
lib/
  api/                # Go backend HTTP client + typed endpoints
  auth/               # Session management, login guard, cookie options
middleware.ts         # Auth gate — redirects unauthenticated requests to /login
```

## Deployment

Deploys to Vercel via GitHub integration. Set the four env vars in the Vercel dashboard. Every PR gets a preview deployment automatically.

For self-hosted deployment, use the Docker + Cloudflare Tunnel stack in the Heliolytics `deploy/` folder — HTTPS at the edge, no open ports on the VPS.
