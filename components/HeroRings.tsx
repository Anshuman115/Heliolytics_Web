import type { DayMetric } from '@/lib/api';
import { ScoreRing } from '@/components/ui/ScoreRing';

function recoveryColor(value?: number | null): string {
  if (value == null) return '#707b81';
  if (value >= 67) return '#00e6a3';
  if (value >= 34) return '#ffd400';
  return '#ff003c';
}

function dateLabel(key: string) {
  return new Date(`${key}T00:00:00Z`).toLocaleDateString('en-US', {
    timeZone: 'UTC', weekday: 'long', month: 'long', day: 'numeric',
  });
}

export function HeroRings({ day }: { day?: DayMetric }) {
  if (!day) return <EmptyOverview />;
  const stepGoal = 10000;
  const rings = [
    { label: 'Sleep', value: day.sleepScore, color: '#7fa8c2', sub: 'score' },
    { label: 'Recovery', value: day.readiness, color: recoveryColor(day.readiness), sub: 'readiness' },
    { label: 'Strain', value: day.paiScore, color: '#009de5', sub: 'PAI' },
  ];

  return (
    <section className="card grid-surface mb-6 overflow-hidden p-5 sm:p-7">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow mb-2">Today</p>
          <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">{dateLabel(day.dayKey)}</h2>
        </div>
        <p className="text-sm text-slate-400">A quick read on your capacity today.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-3">
        {rings.map((ring) => (
          <div key={ring.label} className="flex items-center justify-center rounded-2xl bg-black/10 py-4 sm:py-5">
            <ScoreRing value={ring.value} label={ring.label} color={ring.color} sub={ring.sub} />
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-sm">
        <span className="text-slate-400">Movement goal <strong className="text-white">{day.steps.toLocaleString()} / {stepGoal.toLocaleString()} steps</strong></span>
        <span className="font-semibold text-emerald-200">{Math.round((day.steps / stepGoal) * 100)}% complete</span>
      </div>
    </section>
  );
}

function EmptyOverview() {
  return <section className="card mb-6 p-10 text-center text-sm text-slate-400">No health data for this range yet.</section>;
}
