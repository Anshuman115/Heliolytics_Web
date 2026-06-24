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
      <div className="card p-8 text-center text-sm text-slate-500">
        No temperature samples
      </div>
    );
  }

  return (
    <div className="card p-4">
      <h3 className="mb-3 text-sm font-medium text-slate-300">Temperature</h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fb7185" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#fb7185" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff12" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            interval="preserveStartEnd"
            minTickGap={24}
          />
          <YAxis domain={['auto', 'auto']} tick={{ fill: '#94a3b8', fontSize: 11 }} unit="°C" width={48} />
          <Tooltip
            contentStyle={{ background: '#141414', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10 }}
          />
          <Area type="monotone" dataKey="celsius" stroke="#fb7185" strokeWidth={2} fill="url(#tempFill)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
