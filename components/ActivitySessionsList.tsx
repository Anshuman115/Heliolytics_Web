import type { ActivitySessionMetric } from '@/lib/api';
import { WORKOUT_DAYS } from '@/lib/api';

type ActivitySessionsListProps = {
  sessions: ActivitySessionMetric[];
};

export function ActivitySessionsList({ sessions }: ActivitySessionsListProps) {
  if (!sessions.length) return null;

  return (
    <section className="mt-10">
      <h2 className="mb-3 text-lg font-medium">
        Auto-detected activities{' '}
        <span className="text-sm text-slate-500">({WORKOUT_DAYS}d)</span>
      </h2>
      <div className="divide-y divide-slate-800 rounded-xl border border-slate-800">
        {sessions.map((s) => (
          <div
            key={`${s.startedAt}-${s.sportType}`}
            className="flex justify-between px-4 py-3 text-sm"
          >
            <span>
              {s.dayKey} · {s.sportName || `sport ${s.sportType}`}
              <span className="ml-2 rounded bg-slate-800 px-1.5 py-0.5 text-xs text-slate-400">
                auto
              </span>
            </span>
            <span className="text-slate-400">
              {Math.round(s.durationSec / 60)} min
              {s.calories ? ` · ${s.calories} kcal` : ''}
              {s.avgHr ? ` · ${s.avgHr} bpm` : ''}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
