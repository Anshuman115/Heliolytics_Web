import type { DayMetric } from '@/lib/api';

export function DailyInsight({ day }: { day?: DayMetric }) {
  if (!day) return null;
  const recovery = day.readiness;
  const shortSleep = day.sleepMins != null && day.sleepMins < 420;
  const highRecovery = recovery != null && recovery >= 67;
  const lowRecovery = recovery != null && recovery <= 33;
  const title = highRecovery ? 'You have room to build' : lowRecovery ? 'Make recovery the plan' : shortSleep ? 'Protect tonight' : 'Keep the day intentional';
  const copy = highRecovery
    ? 'Recovery is in a good place. Use the capacity, then watch strain as the day builds.'
    : lowRecovery
      ? 'Your baseline is asking for less intensity. Keep movement easy and prioritise sleep.'
      : shortSleep
        ? 'Sleep was shorter than target. Keep the next hard session flexible.'
        : 'Read recovery, sleep, and strain together before you decide how hard to push.';
  const tone = highRecovery ? 'text-emerald-200' : lowRecovery ? 'text-rose-200' : 'text-sky-200';

  return (
    <section className="card mb-6 flex items-start gap-4 p-5 sm:p-6">
      <span className={`mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-xl ${tone}`} aria-hidden="true">✦</span>
      <div>
        <p className="eyebrow mb-1">Daily read</p>
        <h2 className="text-xl font-bold tracking-tight text-white">{title}</h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">{copy}</p>
      </div>
    </section>
  );
}
