import type { ActivitySessionMetric, DayMetric, WorkoutMetric } from '@/lib/api';
import { ActivitySessionsList } from '@/components/ActivitySessionsList';
import { StepsChart } from '@/components/charts/StepsChart';
import { WorkoutsChart } from '@/components/charts/WorkoutsChart';

export function ActivityView({
  days,
  workouts,
  sessions,
}: {
  days: DayMetric[];
  workouts: WorkoutMetric[];
  sessions: ActivitySessionMetric[];
}) {
  return (
    <>
      <div className="mb-5">
        <p className="eyebrow mb-1">Movement</p>
        <h2 className="text-2xl font-black tracking-tight text-white">Activity with context</h2>
      </div>
      <div className="mb-6 grid gap-4 fade-up lg:grid-cols-2">
        <StepsChart days={days} />
        <WorkoutsChart workouts={workouts} />
      </div>

      {workouts.length > 0 && (
        <div className="card mb-6 divide-y divide-white/10 fade-up">
          <div className="flex items-center justify-between px-4 pb-3 pt-4">
            <p className="label">Workouts</p>
            <span className="text-xs text-slate-500">{workouts.length} logged</span>
          </div>
          {workouts.map((w) => (
            <div key={w.startedAt} className="flex flex-wrap justify-between gap-2 px-4 py-3 text-sm">
              <span className="text-slate-200">
                <strong>{w.sportName || `Sport ${w.sportType}`}</strong><span className="ml-2 text-slate-500">{w.dayKey}</span>
              </span>
              <span className="text-slate-400">
                {Math.round(w.durationSec / 60)} min
                {w.calories ? ` · ${w.calories} kcal` : ''}
                {w.avgHr ? ` · ${w.avgHr} bpm` : ''}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="fade-up">
        <ActivitySessionsList sessions={sessions} />
      </div>
    </>
  );
}
