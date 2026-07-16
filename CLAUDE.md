# CLAUDE.md — Heliolytics_Web (Next.js)

The web dashboard for Heliolytics. Public repo. Current line: `v3`.

## Project Identity

- **Stack:** Next.js 14 (App Router) · React 18 · TypeScript · Tailwind · **Recharts**
- **No Firebase. No React Query / TanStack. No ShadCN. No Tremor.**
  `components/ui/` is hand-written. Check `package.json` before assuming a library
- **Single shared password.** No user accounts

Part of a 3-repo system, cloned as **siblings** under one parent:

| Repo | Role |
|------|------|
| `Heliolytics_Web` (this) | Next.js dashboard — reads metrics |
| `Heliolytics` | Go API — the hub. Backend at `../Heliolytics` |
| `Heliolytics_App` | Flutter — BLE sync |

## Docs — read before changing a feature

| Doc | When |
|-----|------|
| [docs/features/dashboard.md](docs/features/dashboard.md) | Server-fetch → client shell, views, charts, routes |
| [docs/features/auth.md](docs/features/auth.md) | Password cookie, middleware gate, API signing |

`docs/features/` is published; anything else under `docs/` is local-only. The
cross-repo wire contract lives in the backend repo's local-only reference notes.

## Actual Folder Structure

```
Heliolytics_Web/
├── app/
│   ├── page.tsx              # THE dashboard — server component, fetches all data
│   ├── layout.tsx  error.tsx  loading.tsx  not-found.tsx
│   ├── login/                # Password form
│   ├── demo/                 # PUBLIC — synthetic data
│   ├── about/                # PUBLIC — marketing
│   └── api/auth/             # login + logout routes
├── components/
│   ├── dashboard/            # DashboardApp + one file per view
│   ├── charts/               # One file per chart type (Recharts)
│   └── ui/                   # Hand-written primitives
├── lib/
│   ├── api/                  # client, signing, endpoints, types
│   ├── auth/                 # session, cookie_options, login_guard
│   └── demo/                 # Synthetic data generator
└── middleware.ts             # Route auth gate
```

There are **no** `(auth)/`, `dashboard/`, `metrics/`, or `settings/` routes.

## The Single Most Important Rule

**One responsibility per file. No file should exceed ~150 lines.**

A chart component renders a chart. An API file calls one endpoint. If it grows past
150 lines, split it.

## The data-flow pattern — preserve it

```
app/page.tsx  (server)  → fetches everything, signs each request
  └─ <DashboardApp/>  ('use client')  → tab state only, over loaded data
```

- **Fetch on the server, pass data down as props.** `lib/api/apiGet` is server-only —
  calling it from a client component ships `HELIOLYTICS_SIGNING_SECRET` to the browser
- The browser never talks to the Go API directly
- No `useEffect` + `fetch`. No client data library. Tab switches are local state
- `cache: 'no-store'` on API reads — health data must never be served stale

## Naming

- Files: `PascalCase.tsx` for components, `snake_case.ts` / `camelCase.ts` for lib
- Components: `PascalCase` · Hooks: `useXxx` · API functions: `fetchXxx`
- Types: `PascalCase` in `lib/api/types.ts`

## Code Style

- **TypeScript strict.** No `any`, no `as any`, no `@ts-ignore` without a comment
- **No magic strings.** API paths in `lib/api/endpoints.ts`
- **Tailwind only.** No inline styles
- **Server components by default.** `"use client"` only for real interactivity
- Before every commit: `npx tsc --noEmit` and `npm run build`

> `npm run lint` maps to `next lint`, but no ESLint config is checked in yet, so it
> will prompt for setup rather than lint. Type-check and build are the real gates.

## Auth

- One password: `HELIOLYTICS_WEB_PASSWORD`. Session is an **HMAC-signed expiry**
  cookie (`heliolytics_session`, 7 days) — there is no session store
- Runs on the **Edge runtime** → `crypto.subtle`, not Node `crypto`
- Signature comparison is constant-time (`timingSafeEqual`). Never `===`
- `middleware.ts` gates everything except `/api/auth`, `/_next`, `/demo`, `/about`
- **`safeRedirectPath` is an open-redirect guard.** Don't route around it
- Login is rate-limited to 10 attempts per IP per 15 min (`login_guard.ts` → 429).
  With one shared password, this is the only brute-force defense — don't weaken it
- Auth state lives in `lib/auth/` — never in component state

## API / Networking

- All backend calls go through `lib/api/`
- Every request carries `X-Heliolytics-Token`; `apiGet` maps 401 and 429
- `API_INTERNAL_URL` (in Docker `http://api:8080`) — server-side only

## Cross-repo invariants — break these and another repo breaks

- **`X-Heliolytics-Token` format** (`ts.nonce.sig`, HMAC-SHA256 over `"ts:nonce"`)
  must stay byte-identical across `lib/api/signing.ts`, Go
  `internal/auth/signing.go`, and app `lib/services/network/heliolytics_token.dart`
- `HELIOLYTICS_SIGNING_SECRET` must match the Go server's, or every request 401s
- Signing throws when the secret is unset — fail closed, never send unsigned

## Charts & Visualization

- **Recharts** for time series. One file per chart type in `components/charts/`
- Responsive via `ResponsiveContainer`
- Loading: skeleton, not spinner. Empty: a helpful message, not blank space

## Git

- Commits: `type(scope): message` — e.g., `feat(dashboard): add HRV trend chart`
- Types: `feat`, `fix`, `chore`, `refactor`, `test`, `docs`
- One logical change per commit. No WIP commits on main.

## Deployment

**Not Vercel.** Ships as the `web` service in the backend's
`deploy/docker-compose.yml`, built from `../../Heliolytics_Web`, reachable only via
the Cloudflare tunnel. Binds `127.0.0.1:3000`.

Deploy from this repo with `./deploy.sh` (`PULL=1 ./deploy.sh` to pull first). It
delegates to the backend's `deploy/deploy-web.sh`, rebuilding only the `web`
container so the API and strap sync stay up. Requires the sibling backend checkout.

Env vars come from the compose `.env`, never from code.

## Published vs. local-only

This repo is public. `CLAUDE.md` and `docs/features/` **are published** — write them
for an outside reader, not just for yourself.

Local-only (gitignored): everything else under `docs/`, plus `.claude/` and
`.github/`.

**Never cite a local-only path from a published file** — it's a broken link for
everyone who clones the repo.

## Attribution and legal hygiene

- No third-party project names in code comments, commit messages, or tracked markdown
- No "ported from" or file-path attribution to other repos
- **No competitor product names** anywhere in tracked files
