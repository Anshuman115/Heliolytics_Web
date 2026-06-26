import Link from 'next/link';

export const metadata = { title: 'Heliolytics — How it works' };

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      {/* Hero */}
      <header className="mb-12">
        <p className="label mb-3">How it works</p>
        <h1 className="text-4xl font-bold tracking-tight text-white">Heliolytics</h1>
        <p className="mt-3 max-w-2xl text-lg text-slate-300">
          A self-hosted health platform for the <Strong>Amazfit Helio Strap</Strong>. It pulls
          your raw data off the band over Bluetooth, stores it on a server <em>you</em> own, and
          turns it into sleep, recovery, and activity insights — phone and web.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/demo" className="rounded-lg bg-brand px-4 py-2 font-medium text-white hover:bg-brand-dark">
            Explore the demo →
          </Link>
          <Link href="/login" className="rounded-lg border border-white/15 px-4 py-2 font-medium text-slate-200 hover:bg-white/5">
            Sign in
          </Link>
        </div>
      </header>

      {/* What is the strap */}
      <Section title="What is the Helio Strap?">
        <p>
          The <Strong>Amazfit Helio Strap</Strong> is a small, screenless fitness band that tracks
          heart rate, HRV, SpO₂, skin temperature, steps, sleep stages, and workouts. Normally it
          syncs only to the vendor&apos;s phone app and cloud.
        </p>
        <p className="mt-3">
          Heliolytics talks to the strap <Strong>directly over Bluetooth Low Energy</Strong> — no
          vendor cloud — so the raw data lands in your own database and is fully yours.
        </p>
      </Section>

      {/* Pipeline */}
      <Section title="The pipeline">
        <Pipeline />
        <ol className="mt-6 space-y-3 text-slate-300">
          <Step n="1" t="Pair">
            You paste the strap&apos;s auth key once. It&apos;s used only over Bluetooth, never sent
            to any server.
          </Step>
          <Step n="2" t="Sync (BLE)">
            The phone performs an encrypted handshake, then fetches each data type in small chunks
            over Bluetooth.
          </Step>
          <Step n="3" t="Upload">
            Raw session bytes are uploaded to your Go API with a short-lived signed token.
          </Step>
          <Step n="4" t="Parse &amp; store">
            The server decodes ~20 binary health streams into typed time-series in
            PostgreSQL/TimescaleDB and computes daily rollups.
          </Step>
          <Step n="5" t="View">
            Phone and web read clean metrics back — rings, charts, sleep stages, recovery.
          </Step>
        </ol>
      </Section>

      {/* Engineering */}
      <Section title="The hard parts">
        <ul className="grid gap-3 sm:grid-cols-2">
          <Card t="Bluetooth protocol">
            The band&apos;s protocol is implemented from scratch — an ECDH key exchange on the
            binary curve <Code>sect163k1</Code>, an AES-128 challenge-response handshake, and a
            custom chunked transport over GATT.
          </Card>
          <Card t="Binary decoding">
            One parser per data-type code turns opaque flash bytes into steps, HR, sleep stages,
            HRV, SpO₂, temperature, and workouts.
          </Card>
          <Card t="Idempotent ingest">
            Per-minute samples are keyed by timestamp; re-syncing overlapping windows never
            double-counts. Daily steps are recomputed, not accumulated.
          </Card>
          <Card t="Server-authoritative sync">
            The server tracks how far each data type has been ingested, so the phone stays a thin
            client and fetch state survives reinstalls.
          </Card>
        </ul>
      </Section>

      {/* Recovery score */}
      <Section title="How the recovery score is calculated">
        <p>
          Recovery (readiness) is a <Strong>0–100</Strong> score for how recovered you are today
          versus <em>your own</em> baseline — the standard approach in HRV-guided training and
          consumer wearables. It blends four signals:
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          <Weight pct="50%" label="HRV" note="ln(RMSSD)" />
          <Weight pct="25%" label="Resting HR" note="lower = better" />
          <Weight pct="15%" label="Sleep" note="0–100 score" />
          <Weight pct="10%" label="Respiratory" note="breaths/min" />
        </div>
        <div className="card mt-4 p-5">
          <p className="label mb-2">Method</p>
          <p className="text-sm text-slate-300">
            For each metric we take a <Strong>z-score</Strong> versus a personal baseline (7-day
            rolling mean, 60-day standard deviation of <Code>ln(RMSSD)</Code>), map it to 0–100 with{' '}
            <Code>clamp(50 ± 25·z)</Code>, then take the weighted average. HRV uses the natural log
            because RMSSD is log-normally distributed.
          </p>
          <p className="label mb-2 mt-5">Worked example</p>
          <pre className="overflow-x-auto rounded-lg bg-black/40 p-3 text-xs text-slate-300">
{`baseline ln(RMSSD) = 3.9   today = 4.05   sd = 0.18
  z_hrv = (4.05 − 3.9) / 0.18  = +0.83  → 50 + 25·0.83 ≈ 71
  RHR 1.0 sd below baseline    → 50 + 25      = 75
  sleep score                  → 80
  respiratory at baseline      → 50
recovery = .50·71 + .25·75 + .15·80 + .10·50 = 71  ✅ green`}
          </pre>
          <p className="mt-3 text-xs text-slate-500">
            Needs ~3 nights to show a provisional score and ~14 to fully calibrate. If the strap
            reports its own readiness, that takes priority.
          </p>
        </div>
      </Section>

      {/* Metrics */}
      <Section title="What it tracks">
        <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {METRICS.map((m) => (
            <div key={m.k} className="flex justify-between border-b border-white/5 py-2 text-sm">
              <span className="text-slate-200">{m.k}</span>
              <span className="text-slate-500">{m.v}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Stack */}
      <Section title="Built with">
        <p className="text-slate-300">
          <Strong>Flutter</Strong> (BLE client) · <Strong>Go</Strong> + PostgreSQL/TimescaleDB
          (ingest, parsing, metrics API) · <Strong>Next.js</Strong> (this dashboard) ·
          ECDH / AES / HMAC for the crypto and auth.
        </p>
      </Section>

      <footer className="mt-12 flex flex-wrap items-center gap-3 border-t border-white/10 pt-8">
        <Link href="/demo" className="rounded-lg bg-brand px-4 py-2 font-medium text-white hover:bg-brand-dark">
          See it with sample data →
        </Link>
        <span className="text-sm text-slate-500">No device or login needed for the demo.</span>
      </footer>
    </main>
  );
}

const METRICS = [
  { k: 'Recovery / readiness', v: 'HRV + RHR + sleep + resp' },
  { k: 'Sleep', v: 'stages, duration, score' },
  { k: 'Heart rate', v: 'continuous + resting' },
  { k: 'HRV', v: 'nightly RMSSD' },
  { k: 'SpO₂', v: 'overnight blood oxygen' },
  { k: 'Steps & activity', v: 'per-minute + daily' },
  { k: 'Skin temperature', v: 'nightly trend' },
  { k: 'Stress', v: 'auto 0–100' },
  { k: 'Respiratory rate', v: 'breaths/min' },
  { k: 'Workouts', v: 'sport, duration, HR, calories' },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="mb-4 text-xl font-semibold text-white">{title}</h2>
      <div className="text-slate-300">{children}</div>
    </section>
  );
}

function Pipeline() {
  const nodes = ['Helio Strap', 'Phone (BLE)', 'Go API', 'TimescaleDB', 'Dashboard'];
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      {nodes.map((n, i) => (
        <div key={n} className="flex items-center gap-2">
          <div className="card px-4 py-3 text-center text-sm font-medium text-white">{n}</div>
          {i < nodes.length - 1 && <span className="hidden text-brand sm:inline">→</span>}
          {i < nodes.length - 1 && <span className="text-brand sm:hidden">↓</span>}
        </div>
      ))}
    </div>
  );
}

function Step({ n, t, children }: { n: string; t: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/20 text-xs font-bold text-brand">
        {n}
      </span>
      <span>
        <Strong>{t}.</Strong> {children}
      </span>
    </li>
  );
}

function Card({ t, children }: { t: string; children: React.ReactNode }) {
  return (
    <li className="card p-4">
      <p className="mb-1 font-semibold text-white">{t}</p>
      <p className="text-sm text-slate-400">{children}</p>
    </li>
  );
}

function Weight({ pct, label, note }: { pct: string; label: string; note: string }) {
  return (
    <div className="card p-4 text-center">
      <p className="text-2xl font-bold text-brand">{pct}</p>
      <p className="mt-1 text-sm font-medium text-white">{label}</p>
      <p className="text-xs text-slate-500">{note}</p>
    </div>
  );
}

function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-white">{children}</strong>;
}

function Code({ children }: { children: React.ReactNode }) {
  return <code className="rounded bg-white/10 px-1 py-0.5 text-[0.85em] text-sky-300">{children}</code>;
}
