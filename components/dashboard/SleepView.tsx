import type { SleepMetric } from '@/lib/api';
import { HypnogramChart } from '@/components/charts/HypnogramChart';
import { SleepStagesChart } from '@/components/charts/SleepStagesChart';
import { StageBar } from '@/components/ui/StageBar';
import { Stat } from '@/components/ui/Stat';

function fmt(m?: number) {
  if (!m) return 'n/a';
  const h = Math.floor(m / 60);
  const r = m % 60;
  return h ? `${h}h ${r}m` : `${r}m`;
}

export function SleepView({
  sleep,
  currentNight,
}: {
  sleep: SleepMetric[];
  currentNight?: SleepMetric;
}) {
  return (
    <>
      {currentNight ? (
        <div className="mb-6 space-y-4 fade-up">
          <div className="mb-2">
            <p className="eyebrow mb-1">Nightly recovery</p>
            <h2 className="text-2xl font-black tracking-tight text-white">Sleep that supports the day</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat label="Sleep score" value={String(currentNight.score)} accent="#7fa8c2" />
            <Stat label="Time asleep" value={fmt(currentNight.totalMins)} accent="#8d9fe8" />
            <Stat label="Deep + REM" value={fmt(currentNight.deepMins + currentNight.remMins)} accent="#d56be9" />
          </div>
          <HypnogramChart stages={currentNight.stages} />
          <div className="card p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="label">Stage breakdown</p>
              <span className="text-xs text-slate-500">{fmt(currentNight.totalMins)} total</span>
            </div>
            <StageBar deep={currentNight.deepMins} rem={currentNight.remMins} light={currentNight.lightMins} />
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-400">
              <span><span className="text-indigo-400">●</span> Deep {fmt(currentNight.deepMins)}</span>
              <span><span className="text-violet-400">●</span> REM {fmt(currentNight.remMins)}</span>
              <span><span className="text-sky-400">●</span> Light {fmt(currentNight.lightMins)}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="card mb-6 p-10 text-center text-sm text-slate-400 fade-up">
          No sleep recorded for this day.
        </div>
      )}
      <div className="fade-up">
        <SleepStagesChart sleep={sleep} />
      </div>
    </>
  );
}
