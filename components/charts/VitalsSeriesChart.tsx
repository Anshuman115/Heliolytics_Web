'use client';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { HealthSample } from '@/lib/api';

type VitalsSeriesChartProps = {
  samples: HealthSample[];
};

const SERIES = [
  { metric: 'stress', key: 'stress', color: '#f97316', label: 'Stress' },
  { metric: 'hrv', key: 'hrv', color: '#a78bfa', label: 'HRV' },
  { metric: 'spo2', key: 'spo2', color: '#34d399', label: 'SpO₂' },
  { metric: 'spo2_sleep', key: 'spo2Sleep', color: '#10b981', label: 'SpO₂ sleep' },
  { metric: 'rhr', key: 'rhr', color: '#f472b6', label: 'Resting HR' },
  { metric: 'max_hr', key: 'maxHr', color: '#ef4444', label: 'Max HR' },
  { metric: 'resp_rate', key: 'respRate', color: '#38bdf8', label: 'Resp rate' },
] as const;

export function VitalsSeriesChart({ samples }: VitalsSeriesChartProps) {
  const byDay = new Map<string, Record<string, number | string>>();
  for (const s of samples) {
    const day = s.dayKey.slice(5);
    const row = byDay.get(day) ?? { day };
    const spec = SERIES.find((x) => x.metric === s.metric);
    if (spec) row[spec.key] = Math.round(s.value);
    byDay.set(day, row);
  }
  const data = Array.from(byDay.values()).sort((a, b) =>
    String(a.day).localeCompare(String(b.day)),
  );

  if (!data.length) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center text-sm text-slate-500">
        No vitals series data
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <h3 className="mb-3 text-sm font-medium text-slate-300">
        Stress · HRV · SpO₂ · HR · resp rate
      </h3>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <Tooltip
            contentStyle={{ background: '#0f172a', border: '1px solid #334155' }}
          />
          <Legend />
          {SERIES.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color}
              dot={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
