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
import type { DayMetric } from '@/lib/api';

type StepsChartProps = {
  days: DayMetric[];
};

export function StepsChart({ days }: StepsChartProps) {
  const data = [...days]
    .sort((a, b) => a.dayKey.localeCompare(b.dayKey))
    .map((d) => ({ day: d.dayKey.slice(5), steps: d.steps }));

  if (!data.length) {
    return <Empty label="No step data" />;
  }

  return (
    <ChartShell title="Steps trend">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <defs>
            <linearGradient id="stepsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#64d2ff" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#0a84ff" stopOpacity={0.55} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff12" vertical={false} />
          <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 11 }} minTickGap={24} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} width={36} />
          <Tooltip
            cursor={{ fill: '#ffffff08' }}
            contentStyle={{ background: '#141414', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10 }}
          />
          <Bar dataKey="steps" fill="url(#stepsFill)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

function ChartShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-4">
      <h3 className="mb-3 text-sm font-bold text-slate-200">{title}</h3>
      {children}
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div className="card p-8 text-center text-sm text-slate-500">
      {label}
    </div>
  );
}
