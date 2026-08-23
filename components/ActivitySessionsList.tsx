import type { ActivitySessionMetric } from '@/lib/api';
import { WORKOUT_DAYS } from '@/lib/api';

type ActivitySessionsListProps = {
  sessions: ActivitySessionMetric[];
};

export function ActivitySessionsList({ sessions }: ActivitySessionsListProps) {
  if (!sessions.length) return null;

  return (
    <section className="mt-10">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-white">Detected movement</h2>
        <span className="text-xs text-slate-500">Last {WORKOUT_DAYS} days</span>
      </div>
      <div className="card divide-y divide-white/10">
        {sessions.map((s) => (
          <div key={`${s.startedAt}-${s.sportType}`} className="flex flex-wrap justify-between gap-2 px-4 py-3 text-sm">
            <span className="text-slate-200">
              <strong>{s.sportName || `Sport ${s.sportType}`}</strong>
              <span className="ml-2 text-slate-500">{s.dayKey}</span>
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
