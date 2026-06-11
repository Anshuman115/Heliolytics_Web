'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { TempSample } from '@/lib/api';

type TemperatureChartProps = {
  samples: TempSample[];
};

export function TemperatureChart({ samples }: TemperatureChartProps) {
  const data = samples.map((s) => ({
    time: s.sampledAt.slice(5, 16).replace('T', ' '),
    celsius: s.celsius,
  }));

  if (!data.length) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center text-sm text-slate-500">
        No temperature samples
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <h3 className="mb-3 text-sm font-medium text-slate-300">Temperature</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="time"
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={['auto', 'auto']}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            unit="°C"
          />
          <Tooltip
            contentStyle={{ background: '#0f172a', border: '1px solid #334155' }}
          />
          <Line
            type="monotone"
            dataKey="celsius"
            stroke="#fb7185"
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
