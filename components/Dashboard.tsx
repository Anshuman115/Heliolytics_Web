import type {
  DayMetric,
  HealthSample,
  SleepMetric,
  TempSample,
  WorkoutMetric,
} from '@/lib/api';
import { METRICS_DAYS, WORKOUT_DAYS } from '@/lib/api';
import { SleepStagesChart } from '@/components/charts/SleepStagesChart';
import { StepsChart } from '@/components/charts/StepsChart';
import { TemperatureChart } from '@/components/charts/TemperatureChart';
import { VitalsSeriesChart } from '@/components/charts/VitalsSeriesChart';
import { WorkoutsChart } from '@/components/charts/WorkoutsChart';
import { Chip } from '@/components/ui/Chip';
import { StageBar } from '@/components/ui/StageBar';
import { Stat } from '@/components/ui/Stat';

type DashboardProps = {
  days: DayMetric[];
  sleep: SleepMetric[];
  workouts: WorkoutMetric[];
  temperature: TempSample[];
  series: HealthSample[];
};

export function Dashboard({
  days,
  sleep,
  workouts,
  temperature,
  series,
}: DashboardProps) {
  const total = days.reduce((s, d) => s + d.steps, 0);
  const avgStress = avg(days.map((d) => d.stressAvg));
  const avgSleep = avg(days.map((d) => d.sleepScore));
  const avgReadiness = avg(days.map((d) => d.readiness));

  return (
    <>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="Total steps" value={total.toLocaleString()} />
        <Stat label="Days synced" value={String(days.length)} />
        <Stat label="Avg readiness" value={avgReadiness ?? '—'} />
        <Stat label="Avg stress" value={avgStress ?? '—'} />
        <Stat label="Avg sleep score" value={avgSleep ?? '—'} />
      </div>

      <div className="mb-8 grid gap-4 lg:grid-cols-2">
        <StepsChart days={days} />
        <VitalsSeriesChart samples={series} />
        <TemperatureChart samples={temperature} />
        <SleepStagesChart sleep={sleep} />
        <WorkoutsChart workouts={workouts} />
      </div>

      <section className="space-y-4">
        {days.map((d) => {
          const night = sleep.find((s) => s.dayKey === d.dayKey);
          return (
            <article
              key={d.dayKey}
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-lg font-medium">{d.dayKey}</h2>
                <span className="text-2xl font-bold text-brand tabular-nums">
                  {d.steps.toLocaleString()} steps
                </span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-4 lg:grid-cols-8">
                <Chip label="Readiness" value={d.readiness} />
                <Chip label="Stress" value={d.stressAvg} />
                <Chip label="HRV" value={d.hrvRmssd} suffix=" ms" />
                <Chip label="SpO₂" value={d.spo2Avg} suffix="%" />
                <Chip label="PAI" value={d.paiScore} />
                <Chip label="RHR" value={d.restingHr} suffix=" bpm" />
                <Chip label="Max HR" value={d.maxHr} suffix=" bpm" />
                <Chip label="Resp rate" value={d.respRateAvg} suffix="/min" />
                <Chip label="Temp avg" value={d.tempAvgC} suffix=" °C" />
                <Chip label="Naps" value={d.napCount} />
                <Chip label="Workouts" value={d.workoutCount} />
              </div>
              {(d.sleepMins || night) && (
                <div className="mt-4">
                  <p className="mb-2 text-sm text-slate-400">
                    Sleep {d.sleepScore ?? night?.score ?? '—'} ·{' '}
                    {fmtMins(d.sleepMins ?? night?.totalMins)}
                  </p>
                  <StageBar
                    deep={d.sleepDeepMins ?? night?.deepMins ?? 0}
                    rem={d.sleepRemMins ?? night?.remMins ?? 0}
                    light={d.sleepLightMins ?? night?.lightMins ?? 0}
                  />
                </div>
              )}
            </article>
          );
        })}
        {days.length === 0 && (
          <p className="py-12 text-center text-slate-500">
            No data yet. Sync from the Flutter app.
          </p>
        )}
      </section>

      {workouts.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 text-lg font-medium">
            Activities <span className="text-sm text-slate-500">({WORKOUT_DAYS}d)</span>
          </h2>
          <div className="divide-y divide-slate-800 rounded-xl border border-slate-800">
            {workouts.map((w) => (
              <div
                key={w.startedAt}
                className="flex justify-between px-4 py-3 text-sm"
              >
                <span>
                  {w.dayKey} · {w.sportName || `sport ${w.sportType}`}
                </span>
                <span className="text-slate-400">
                  {Math.round(w.durationSec / 60)} min
                  {w.calories ? ` · ${w.calories} kcal` : ''}
                  {w.avgHr ? ` · ${w.avgHr} bpm` : ''}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function avg(nums: (number | undefined)[]): string | null {
  const v = nums.filter((n): n is number => n != null);
  if (!v.length) return null;
  return String(Math.round(v.reduce((a, b) => a + b, 0) / v.length));
}

function fmtMins(m?: number) {
  if (!m) return '—';
  const h = Math.floor(m / 60);
  const r = m % 60;
  return h ? `${h}h ${r}m` : `${r}m`;
}

export { METRICS_DAYS };
