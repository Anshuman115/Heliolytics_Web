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
      <div className="card p-8 text-center text-sm text-slate-500">
        No workout data
      </div>
    );
  }

  return (
    <div className="card p-4">
      <h3 className="mb-3 text-sm font-medium text-slate-300">Workout minutes</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <defs>
            <linearGradient id="workoutsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#30d158" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#0f9d58" stopOpacity={0.5} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff12" vertical={false} />
          <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 11 }} minTickGap={24} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} width={36} />
          <Tooltip
            cursor={{ fill: '#ffffff08' }}
            contentStyle={{ background: '#141414', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10 }}
          />
          <Bar dataKey="mins" fill="url(#workoutsFill)" name="Minutes" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
