'use client';

import { useMemo, useState } from 'react';
import type {
  ActivitySessionMetric,
  DayMetric,
  HealthSample,
  HeartRateSample,
  SleepMetric,
  TempSample,
  WorkoutMetric,
} from '@/lib/api';
import { OverviewView } from './OverviewView';
import { SleepView } from './SleepView';
import { ActivityView } from './ActivityView';
import { VitalsView } from './VitalsView';

export type DashboardData = {
  days: DayMetric[];
  sleep: SleepMetric[];
  workouts: WorkoutMetric[];
  activitySessions: ActivitySessionMetric[];
  temperature: TempSample[];
  series: HealthSample[];
  heartRate: HeartRateSample[];
};

const TABS = ['overview', 'sleep', 'activity', 'vitals'] as const;
type Tab = (typeof TABS)[number];
const RANGES = [7, 30, 90] as const;
type Range = (typeof RANGES)[number];

function dayLabel(key: string) {
  return new Date(`${key}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function DashboardApp(data: DashboardData) {
  const sortedDays = useMemo(
    () => [...data.days].sort((a, b) => a.dayKey.localeCompare(b.dayKey)),
    [data.days],
  );
  const latest = sortedDays.at(-1)?.dayKey ?? '';

  const [tab, setTab] = useState<Tab>('overview');
  const [range, setRange] = useState<Range>(30);
  const [day, setDay] = useState<string>(latest);

  const f = useMemo(() => {
    const base = latest ? new Date(`${latest}T00:00:00Z`) : new Date();
    base.setUTCDate(base.getUTCDate() - (range - 1));
    const cut = base.toISOString().slice(0, 10);
    const inRange = (k: string) => k >= cut;
    const days = sortedDays.filter((d) => inRange(d.dayKey));
    return {
      days,
      sleep: data.sleep.filter((s) => inRange(s.dayKey)),
      series: data.series.filter((s) => inRange(s.dayKey)),
      temperature: data.temperature.filter((t) => inRange(t.dayKey)),
      workouts: data.workouts.filter((w) => inRange(w.dayKey)),
      sessions: data.activitySessions.filter((s) => inRange(s.dayKey)),
      dayKeys: days.map((d) => d.dayKey).reverse(),
    };
  }, [data, sortedDays, latest, range]);

  const currentDay = f.days.find((d) => d.dayKey === day) ?? f.days.at(-1);
  const currentNight = f.sleep.find((s) => s.dayKey === currentDay?.dayKey);
  const dayHr = data.heartRate.filter((h) => h.dayKey === currentDay?.dayKey);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <nav className="flex gap-1 rounded-xl border border-white/10 bg-surface p-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition ${
                tab === t ? 'bg-brand text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 rounded-lg border border-white/10 bg-surface p-1">
            {RANGES.map((rdays) => (
              <button
                key={rdays}
                onClick={() => setRange(rdays)}
                className={`rounded px-2.5 py-1 text-xs font-medium transition ${
                  range === rdays ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {rdays}d
              </button>
            ))}
          </div>
          {(tab === 'overview' || tab === 'sleep' || tab === 'vitals') && f.dayKeys.length > 0 && (
            <select
              value={currentDay?.dayKey ?? ''}
              onChange={(e) => setDay(e.target.value)}
              className="rounded-lg border border-white/10 bg-surface px-3 py-1.5 text-sm text-white outline-none"
            >
              {f.dayKeys.map((k) => (
                <option key={k} value={k}>
                  {dayLabel(k)}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {tab === 'overview' && <OverviewView days={f.days} currentDay={currentDay} series={f.series} />}
      {tab === 'sleep' && <SleepView sleep={f.sleep} currentNight={currentNight} />}
      {tab === 'activity' && <ActivityView days={f.days} workouts={f.workouts} sessions={f.sessions} />}
      {tab === 'vitals' && (
        <VitalsView dayHr={dayHr} series={f.series} temperature={f.temperature} currentDay={currentDay} />
      )}
    </>
  );
}
