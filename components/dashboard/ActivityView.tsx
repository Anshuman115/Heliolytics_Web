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
      <div className="mb-6 grid gap-4 fade-up lg:grid-cols-2">
        <StepsChart days={days} />
        <WorkoutsChart workouts={workouts} />
      </div>

      {workouts.length > 0 && (
        <div className="card mb-6 divide-y divide-white/10 fade-up">
          <p className="label px-4 pt-4">Workouts</p>
          {workouts.map((w) => (
            <div key={w.startedAt} className="flex justify-between px-4 py-3 text-sm">
              <span className="text-slate-200">
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
      )}

      <div className="fade-up">
        <ActivitySessionsList sessions={sessions} />
      </div>
    </>
  );
}
