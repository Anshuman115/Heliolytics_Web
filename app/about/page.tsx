import Link from 'next/link';
import { PublicHeader } from '@/components/PublicHeader';

export const metadata = { title: 'Your health, clearly' };

const METRICS = [
  ['Recovery', 'Readiness against your baseline'],
  ['Sleep', 'Stages, duration, and score'],
  ['Activity', 'Workouts, steps, and movement'],
  ['Vitals', 'HRV, heart rate, SpO₂, stress'],
];

export default function AboutPage() {
  return (
    <main className="public-shell">
      <PublicHeader action="demo" />
      <section className="grid items-center gap-12 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div>
          <p className="eyebrow mb-4 text-emerald-200">A private health console</p>
          <h1 className="max-w-2xl text-5xl font-black leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl">
            Understand your day before it runs away.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-300">
            Heliolytics turns raw band data into a quiet, useful picture of your recovery, sleep, movement, and body signals.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/demo" className="button-primary">Explore the demo <span className="ml-2">→</span></Link>
            <Link href="/login" className="button-secondary">Open my console</Link>
          </div>
          <p className="mt-4 text-xs text-slate-500">No account needed for the demo. Your private console stays behind your password.</p>
        </div>
        <PreviewPanel />
      </section>

      <section className="border-t border-white/10 py-12 sm:py-16">
        <div className="mb-7 max-w-xl">
          <p className="eyebrow mb-2">The flow</p>
          <h2 className="text-3xl font-black tracking-tight text-white">From strap to signal.</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">The phone moves the data. Your server does the thinking.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          <FlowStep n="01" title="Sync" copy="The phone reads raw bytes over Bluetooth." />
          <FlowStep n="02" title="Upload" copy="Encrypted payloads reach your API." />
          <FlowStep n="03" title="Parse" copy="The server turns bytes into useful metrics." />
          <FlowStep n="04" title="See" copy="Your dashboard brings the day into focus." />
        </div>
      </section>

      <section className="grid gap-8 border-t border-white/10 py-12 sm:py-16 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="eyebrow mb-2">What you get</p>
          <h2 className="text-3xl font-black tracking-tight text-white">Less dashboard. More direction.</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {METRICS.map(([title, copy]) => <Metric key={title} title={title} copy={copy} />)}
        </div>
      </section>

      <footer className="flex flex-col gap-4 border-t border-white/10 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-400">Built for people who want their own health data.</p>
        <div className="flex gap-4 text-sm"><Link href="/demo" className="font-semibold text-emerald-200 hover:text-white">Try the demo</Link><Link href="/login" className="font-semibold text-slate-300 hover:text-white">Sign in</Link></div>
      </footer>
    </main>
  );
}

function PreviewPanel() {
  return (
    <div className="card grid-surface relative overflow-hidden p-5 sm:p-7">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-300/10 blur-3xl" />
      <div className="relative flex items-center justify-between border-b border-white/10 pb-5">
        <div><p className="eyebrow mb-1">Today</p><p className="text-lg font-bold text-white">A clearer baseline</p></div>
        <span className="rounded-full bg-emerald-300/10 px-2.5 py-1 text-xs font-bold text-emerald-200">Connected</span>
      </div>
      <div className="relative grid grid-cols-3 gap-2 py-7">
        <PreviewRing label="Sleep" value="78" color="#7fa8c2" />
        <PreviewRing label="Recovery" value="84" color="#00e6a3" />
        <PreviewRing label="Strain" value="64" color="#009de5" />
      </div>
      <div className="relative rounded-2xl border border-white/10 bg-black/15 p-4"><p className="eyebrow mb-1">Daily read</p><p className="text-lg font-bold text-white">You have room to build</p><p className="mt-1 text-sm text-slate-400">Recovery is in a good place. Use the capacity well.</p></div>
    </div>
  );
}

function PreviewRing({ label, value, color }: { label: string; value: string; color: string }) {
  return <div className="text-center"><div className="mx-auto grid h-24 w-24 place-items-center rounded-full border-[9px] text-2xl font-black text-white sm:h-28 sm:w-28" style={{ borderColor: color }}>{value}</div><p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{label}</p></div>;
}

function FlowStep({ n, title, copy }: { n: string; title: string; copy: string }) {
  return <div className="card p-5"><span className="text-xs font-black text-emerald-200">{n}</span><h3 className="mt-8 text-lg font-bold text-white">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-400">{copy}</p></div>;
}

function Metric({ title, copy }: { title: string; copy: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"><h3 className="font-bold text-white">{title}</h3><p className="mt-1 text-sm text-slate-400">{copy}</p></div>;
}
