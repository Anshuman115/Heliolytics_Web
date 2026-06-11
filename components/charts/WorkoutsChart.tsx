'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { WorkoutMetric } from '@/lib/api';

type WorkoutsChartProps = {
  workouts: WorkoutMetric[];
};

export function WorkoutsChart({ workouts }: WorkoutsChartProps) {
  const byDay = new Map<string, number>();
  for (const w of workouts) {
    byDay.set(w.dayKey, (byDay.get(w.dayKey) ?? 0) + Math.round(w.durationSec / 60));
  }
  const data = Array.from(byDay.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, mins]) => ({ day: day.slice(5), mins }));

  if (!data.length) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center text-sm text-slate-500">
        No workout data
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <h3 className="mb-3 text-sm font-medium text-slate-300">Workout minutes</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <Tooltip
            contentStyle={{ background: '#0f172a', border: '1px solid #334155' }}
          />
          <Bar dataKey="mins" fill="#0d9488" name="Minutes" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
