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
import type { SleepStagePoint } from '@/lib/api/types';

type HypnogramChartProps = { stages?: SleepStagePoint[] };

// Stage type → vertical level (Awake top, Deep bottom) + label.
const LEVEL: Record<number, number> = { 7: 3, 8: 2, 4: 1, 5: 0 }; // wake, rem, light, deep
const LABEL = ['Deep', 'Light', 'REM', 'Awake'];

function hhmm(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

export function HypnogramChart({ stages }: HypnogramChartProps) {
  if (!stages || stages.length === 0) {
    return <div className="card p-8 text-center text-sm text-slate-500">No sleep stage timeline</div>;
  }
  const sorted = [...stages].sort((a, b) => a.start.localeCompare(b.start));
  const data = sorted.map((s) => ({ t: hhmm(s.start), level: LEVEL[s.type] ?? 1 }));
  // close the staircase at the final wake time
  const last = sorted[sorted.length - 1];
  data.push({ t: hhmm(last.end), level: LEVEL[last.type] ?? 1 });

  return (
    <div className="card p-4">
      <h3 className="mb-3 text-sm font-medium text-slate-300">Sleep stages (hypnogram)</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ left: 8, right: 8 }}>
          <defs>
            <linearGradient id="hypFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c8cff" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#7c8cff" stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
          <XAxis dataKey="t" tick={{ fill: '#94a3b8', fontSize: 11 }} minTickGap={40} />
          <YAxis
            type="number"
            domain={[0, 3]}
            ticks={[0, 1, 2, 3]}
            tickFormatter={(v: number) => LABEL[v] ?? ''}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            width={52}
          />
          <Tooltip
            contentStyle={{ background: '#141414', border: '1px solid #ffffff1a', borderRadius: 8 }}
            formatter={(v: number) => [LABEL[v] ?? '', 'Stage']}
          />
          <Area type="stepAfter" dataKey="level" stroke="#8b9bff" strokeWidth={2} fill="url(#hypFill)" dot={false} isAnimationActive />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
