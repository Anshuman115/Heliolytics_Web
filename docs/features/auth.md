# Feature — Auth

Single shared password. No user accounts, no Firebase, no OAuth — this is a
one-owner dashboard.

> Any note claiming Firebase Auth is wrong. There is no `firebase` dependency.

## Two different secrets

Don't confuse them:

| Secret | Guards | Used by |
|---|---|---|
| `HELIOLYTICS_WEB_PASSWORD` | Human → dashboard | `lib/auth/` |
| `HELIOLYTICS_SIGNING_SECRET` | Server → Go API | `lib/api/signing.ts` |

The password logs a person in. The signing secret authenticates the Next.js server
to the backend. A browser never sees either.

## Session cookie

`lib/auth/session.ts`:

```
SESSION_COOKIE   = 'heliolytics_session'
SESSION_MAX_AGE_SEC = 7 * 24 * 60 * 60   // 7 days
```

The cookie value is an **HMAC-signed expiry**, not a random session ID — there's no
session store. The server signs `exp` with the password via `crypto.subtle` HMAC-
SHA256; verification recomputes and compares. Tampering with `exp` invalidates the
signature.

Comparison is `timingSafeEqual` — a hand-rolled constant-time compare, because a
naive `===` on the signature leaks bytes through timing.

This runs on the **Edge runtime** (middleware), which is why it uses `crypto.subtle`
rather than Node's `crypto`.

## Middleware

`middleware.ts` gates everything by default. Public prefixes:

- `/api/auth` — login/logout must be reachable while logged out
- `/_next` — framework assets
- `/demo`, `/about` — deliberately public

Behavior:

- Authed + hitting `/login` → redirect to `from` (or `/`)
- Unauthed + hitting anything else → redirect to `/login?from=<path>`
- The `from` param passes through `safeRedirectPath` (`lib/auth/login_guard.ts`)

### Why `safeRedirectPath` exists

It's an **open-redirect guard**. Without it, `/login?from=https://evil.example` would
bounce a freshly-authenticated user to an attacker's site. It only accepts a path
starting with a single `/` — rejecting both absolute URLs and protocol-relative
`//evil.example`, which browsers resolve as a remote host. Don't route around it.

Matcher: `['/((?!_next/static|_next/image|favicon.ico).*)']`.

## Login rate limiting

`lib/auth/login_guard.ts` — 10 attempts per IP per 15 minutes, returning 429 from
`app/api/auth/login/route.ts`. With one shared password and no username, throttling
guessing is the only thing standing between the dashboard and a brute-force.

Client IP comes from `x-forwarded-for` (first entry), falling back to `x-real-ip`.
That's trustworthy **only because Cloudflare sets it**; exposed directly, a client
could spoof the header and reset its own budget.

Counters live in an in-process `Map`, so they reset on redeploy and don't span
replicas. Fine for a single-container deployment — revisit if it ever scales out.

## API request signing

`lib/api/signing.ts` mints `X-Heliolytics-Token`:

```
ts    = unix seconds
nonce = 16 random bytes hex
sig   = HMAC-SHA256(HELIOLYTICS_SIGNING_SECRET, "ts:nonce")
token = "ts.nonce.sig"
```

**Must stay byte-identical to Go `auth.SignToken` and the Flutter
`mintHeliolyticsToken`.** Three implementations, one format.

Throws if `HELIOLYTICS_SIGNING_SECRET` is unset — fails closed, loudly, rather than
sending unsigned requests.

## API client

`lib/api/client.ts` — 16 lines:

```ts
const res = await fetch(`${baseUrl()}${path}`, {
  headers: { 'X-Heliolytics-Token': mintHeliolyticsToken() },
  cache: 'no-store',
});
```

- `baseUrl()` = `API_INTERNAL_URL` (in Docker: `http://api:8080`), else localhost
- `cache: 'no-store'` — health data must never be served stale from the fetch cache
- Maps 429 → "Rate limit exceeded", 401 → "Unauthorized"

`apiGet` is **server-only**. Calling it from a client component would ship the
signing secret to the browser. Fetch in `page.tsx` and pass data down.

## Key files

| File | Role |
|---|---|
| `middleware.ts` | Route gate |
| `lib/auth/session.ts` | Cookie sign/verify |
| `lib/auth/login_guard.ts` | Open-redirect guard |
| `lib/auth/cookie_options.ts` | Cookie flags |
| `app/api/auth/login/route.ts` | Set cookie |
| `app/api/auth/logout/route.ts` | Clear cookie |
| `lib/api/signing.ts` | Token minting |
| `lib/api/client.ts` | Fetch wrapper |
| `lib/api/endpoints.ts` | Path constants |
| `lib/api/types.ts` | Response types |
