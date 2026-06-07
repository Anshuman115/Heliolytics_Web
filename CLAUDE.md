# Heliolytics_Web — Coding Rules

This is the Next.js webapp for the Heliolytics health analytics platform.
These rules apply to every file in this repo, for every session.

---

## Project Identity

- **App name:** Heliolytics Web
- **Framework:** Next.js 14+ (App Router)
- **Deployment:** Vercel
- **Tech stack:** Next.js · TypeScript · Tailwind CSS · Recharts (or Tremor) · ShadCN UI · React Query · Firebase Auth
- **Part of:** 3-repo system (App + Server + Web). Backend is Go at `Heliolytics/`.

---

## Folder Structure

```
Heliolytics_Web/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Auth-gated routes
│   │   ├── dashboard/          # Main dashboard
│   │   ├── metrics/            # Individual metric views
│   │   └── settings/           # User settings
│   ├── login/                  # Public login page
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing page
├── components/
│   ├── charts/                 # One file per chart type
│   ├── ui/                     # ShadCN components (auto-generated, don't edit)
│   └── layout/                 # Nav, sidebar, header
├── lib/
│   ├── api/                    # Go server HTTP client, typed endpoints
│   ├── auth/                   # Firebase auth helpers
│   ├── hooks/                  # Custom React hooks
│   └── utils/                  # Pure utility functions
├── types/                      # Shared TypeScript types
└── public/                     # Static assets
```

---

## The Single Most Important Rule

**One responsibility per file. No file should exceed ~150 lines.**

A chart component renders a chart. An API file calls one endpoint.
A hook manages one piece of state. If a file grows past 150 lines, split it.

---

## Naming

- Files: `kebab-case.tsx` for components, `camelCase.ts` for utilities
- Components: `PascalCase`
- Hooks: `useXxx`
- API functions: `fetchXxx`, `postXxx`
- Types: `PascalCase` in `types/`

---

## Code Style

- **TypeScript strict mode.** No `any`. No `as any`. No `// @ts-ignore` without a comment.
- **No magic strings.** All API endpoints in `lib/api/endpoints.ts`.
- **No inline styles.** Tailwind classes only.
- **Server components by default.** Use `"use client"` only when needed (interactivity, hooks).
- **React Query for all data fetching.** No `useEffect` + `fetch` patterns.
- Run `eslint` and `tsc --noEmit` before every commit.

---

## API / Networking

- All calls to the Go backend go through `lib/api/`.
- Every request includes:
  - `Authorization: Bearer <firebase_jwt>` for user identity
  - `X-Heliolytics-Token: <hmac_token>` for API-level auth
  - `X-Request-ID: <uuid>` for tracing
- Responses are typed — define a TypeScript type for every endpoint response.
- Handle 401 (redirect to login) and 429 (show rate limit message) globally in the API client.

---

## Auth

- **Firebase Auth** for user identity (email/password + Google OAuth).
- Auth state managed in `lib/auth/` — never in component state.
- Protected routes use Next.js middleware (`middleware.ts`) to check the Firebase session cookie.
- No client-side auth checks in page components — the middleware handles it.

---

## Charts & Visualization

- Use **Recharts** for time-series data (HR, HRV, SpO2 over time).
- Chart components live in `components/charts/` — one file per chart type.
- All charts are responsive (use `ResponsiveContainer`).
- Loading states: show skeleton, not spinner.
- Empty states: show a helpful message, not blank space.

---

## Testing

- Unit tests for: utility functions, API client, hooks.
- No snapshot tests. No testing implementation details.
- E2E: Playwright for critical paths (login, dashboard load, data display).

---

## Git

- Commits: `type(scope): message` — e.g., `feat(dashboard): add HRV trend chart`
- Types: `feat`, `fix`, `chore`, `refactor`, `test`, `docs`
- One logical change per commit.
- No WIP commits on main.

---

## Deployment

- **Vercel** via GitHub integration. Every PR gets a preview deployment.
- Environment variables set in Vercel dashboard. Never in code.
- `NEXT_PUBLIC_API_URL` points to the Go server (prod: Oracle instance, dev: localhost:8080).
- `NEXT_PUBLIC_FIREBASE_*` — Firebase config vars.

---

## Phase Reference

| Phase | Goal | Status |
|-------|------|--------|
| 1 | Not started (BLE discovery is app-only) | N/A |
| 2 | Dashboard — auth, data display, basic charts | Planned |
| 3 | Advanced analytics — derived metrics, real age, trends | Planned |
