'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { HeartRateSample } from '@/lib/api/types';

type HeartRateChartProps = { samples: HeartRateSample[] };

/** Continuous heart rate for the most recent day with data (time-of-day x-axis). */
export function HeartRateChart({ samples }: HeartRateChartProps) {
  if (!samples.length) {
    return <div className="card p-8 text-center text-sm text-slate-500">No continuous HR data</div>;
  }

  const latestDay = samples.reduce((m, s) => (s.dayKey > m ? s.dayKey : m), samples[0].dayKey);
  const data = samples
    .filter((s) => s.dayKey === latestDay)
    .sort((a, b) => a.sampledAt.localeCompare(b.sampledAt))
    .map((s) => ({
      t: new Date(s.sampledAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
      bpm: s.bpm,
    }));

  return (
    <div className="card p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-slate-200">Heart rate</h3>
        <span className="text-xs text-slate-500">{latestDay}</span>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="hrFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff453a" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#ff453a" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="t" tick={{ fill: '#94a3b8', fontSize: 11 }} minTickGap={48} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[40, 'dataMax + 10']} />
          <Tooltip contentStyle={{ background: '#141414', border: '1px solid #ffffff1a', borderRadius: 8 }} />
          <Area type="monotone" dataKey="bpm" stroke="#ff453a" strokeWidth={2} fill="url(#hrFill)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
