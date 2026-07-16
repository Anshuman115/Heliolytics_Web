# Feature — Dashboard

The whole app is essentially one page. `app/page.tsx` is a **server component** that
fetches everything, then hands it to one client component.

## The pattern

```
app/page.tsx                    ← server component, fetches ALL data
  └─ <DashboardApp data={...}/> ← 'use client', owns tab state only
       ├─ OverviewView
       ├─ SleepView
       ├─ ActivityView
       └─ VitalsView
```

This is deliberate and worth preserving:

- **One fetch pass, server-side.** Eight parallel `fetch*` calls in `page.tsx`, all
  on the server. The browser never talks to the Go API, so the signing secret never
  reaches the client.
- **The client component holds no data-fetching logic.** `DashboardApp` takes a
  `DashboardData` prop and manages tab selection with `useState`/`useMemo`. Nothing
  else.
- **No client-side data library.** There is no React Query and no `useEffect` +
  `fetch`. Switching tabs is pure local state over already-loaded data.

`page.tsx` pulls: `fetchDays`, `fetchSleep`, `fetchWorkouts`,
`fetchActivitySessions`, `fetchTemperature`, `fetchSeries`, `fetchHeartRate`,
`fetchCoverage`. Windows are constants — `METRICS_DAYS`, `WORKOUT_DAYS`.

## Views

| View | Shows |
|---|---|
| `OverviewView` | Rings + day summary (`HeroRings`) |
| `SleepView` | Hypnogram, stages, nightly list |
| `ActivityView` | Workouts + auto sessions |
| `VitalsView` | HR, temperature, vitals series |

`SyncStatusBar` renders coverage — when the strap last uploaded. `SignOutButton`
clears the session cookie.

## Charts

**Recharts only.** No Tremor, no ShadCN — `components/ui/` is hand-written
(`Chip`, `ScoreRing`, `StageBar`, `Stat`).

| Chart | File |
|---|---|
| Heart rate | `charts/HeartRateChart.tsx` |
| Hypnogram | `charts/HypnogramChart.tsx` |
| Sleep stages | `charts/SleepStagesChart.tsx` |
| Steps | `charts/StepsChart.tsx` |
| Temperature | `charts/TemperatureChart.tsx` |
| Vitals series | `charts/VitalsSeriesChart.tsx` |
| Workouts | `charts/WorkoutsChart.tsx` |

One file per chart type. All responsive via `ResponsiveContainer`.

## Routes

| Route | Auth | Purpose |
|---|---|---|
| `/` | required | The dashboard |
| `/login` | public | Password form |
| `/demo` | **public** | Dashboard with generated data (`lib/demo/generate.ts`) |
| `/about` | **public** | Marketing page |
| `/api/auth/login`, `/api/auth/logout` | public | Session cookie |

`app/layout.tsx`, `error.tsx`, `loading.tsx`, `not-found.tsx` are the framework
shell.

> `/demo` exists so the dashboard can be shown without exposing real health data —
> it renders synthetic data through the same components.

## Styling

Tailwind only. No inline styles, no CSS modules.

## Key files

| File | Role |
|---|---|
| `app/page.tsx` | Server fetch + compose |
| `components/dashboard/DashboardApp.tsx` | Client tab shell |
| `components/HeroRings.tsx` | Overview rings |
| `components/SyncStatusBar.tsx` | Coverage display |
| `lib/demo/generate.ts` | Synthetic data for `/demo` |
