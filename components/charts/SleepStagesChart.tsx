'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { SleepMetric } from '@/lib/api';

type SleepStagesChartProps = {
  sleep: SleepMetric[];
};

export function SleepStagesChart({ sleep }: SleepStagesChartProps) {
  const byDay = new Map<string, SleepMetric>();
  for (const s of sleep) {
    const prev = byDay.get(s.dayKey);
    if (!prev || s.score > prev.score) byDay.set(s.dayKey, s);
  }
  const data = Array.from(byDay.values())
    .sort((a, b) => a.dayKey.localeCompare(b.dayKey))
    .map((s) => ({
      day: s.dayKey.slice(5),
      deep: s.deepMins,
      rem: s.remMins,
      light: s.lightMins,
    }));

  if (!data.length) {
    return (
      <div className="card p-8 text-center text-sm text-slate-500">
        No sleep stage data
      </div>
    );
  }

  return (
    <div className="card p-4">
      <h3 className="mb-3 text-sm font-medium text-slate-300">Sleep stages</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff12" vertical={false} />
          <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 11 }} minTickGap={24} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} unit=" min" width={48} />
          <Tooltip
            cursor={{ fill: '#ffffff08' }}
            contentStyle={{ background: '#141414', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10 }}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="deep" stackId="s" fill="#6366f1" name="Deep" />
          <Bar dataKey="rem" stackId="s" fill="#a78bfa" name="REM" />
          <Bar dataKey="light" stackId="s" fill="#38bdf8" name="Light" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
