'use client';

import Link from 'next/link';
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
import { BrandMark } from '@/components/BrandMark';
import { SignOutButton } from '@/components/SignOutButton';
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

type DashboardAppProps = DashboardData & { demo?: boolean };
const TABS = ['overview', 'sleep', 'activity', 'vitals'] as const;
type Tab = (typeof TABS)[number];
const RANGES = [7, 30, 90] as const;
type Range = (typeof RANGES)[number];

const TAB_LABELS: Record<Tab, string> = {
  overview: 'Overview',
  sleep: 'Sleep',
  activity: 'Activity',
  vitals: 'Vitals',
};

function dayLabel(key: string) {
  return new Date(`${key}T00:00:00Z`).toLocaleDateString('en-US', {
    timeZone: 'UTC', weekday: 'short', month: 'short', day: 'numeric',
  });
}

export function DashboardApp({ demo = false, ...data }: DashboardAppProps) {
  const sortedDays = useMemo(
    () => [...data.days].sort((a, b) => a.dayKey.localeCompare(b.dayKey)),
    [data.days],
  );
  const latest = sortedDays.at(-1)?.dayKey ?? '';
  const [tab, setTab] = useState<Tab>('overview');
  const [range, setRange] = useState<Range>(30);
  const [day, setDay] = useState<string>(latest);

  const filtered = useMemo(() => {
    const base = latest ? new Date(`${latest}T00:00:00Z`) : new Date();
    base.setUTCDate(base.getUTCDate() - (range - 1));
    const cut = base.toISOString().slice(0, 10);
    const inRange = (key: string) => key >= cut;
    const days = sortedDays.filter((item) => inRange(item.dayKey));
    return {
      days,
      sleep: data.sleep.filter((item) => inRange(item.dayKey)),
      series: data.series.filter((item) => inRange(item.dayKey)),
      temperature: data.temperature.filter((item) => inRange(item.dayKey)),
      workouts: data.workouts.filter((item) => inRange(item.dayKey)),
      sessions: data.activitySessions.filter((item) => inRange(item.dayKey)),
      dayKeys: days.map((item) => item.dayKey).reverse(),
    };
  }, [data, sortedDays, latest, range]);

  const currentDay = filtered.days.find((item) => item.dayKey === day) ?? filtered.days.at(-1);
  const currentNight = filtered.sleep.find((item) => item.dayKey === currentDay?.dayKey);
  const dayHr = data.heartRate.filter((item) => item.dayKey === currentDay?.dayKey);

  return (
    <div className="fade-up">
      {!demo ? (
        <header className="mb-6 flex flex-col gap-5 border-b border-white/10 pb-5 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/" aria-label="Heliolytics dashboard" className="rounded-lg"><BrandMark /></Link>
          <div className="flex items-center gap-2 lg:justify-end"><span className="hidden text-xs text-slate-500 sm:block">Private health console</span><SignOutButton /></div>
        </header>
      ) : null}

      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="eyebrow mb-2">Your health, clearly</p>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">The daily picture</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">One calm view of recovery, sleep, movement, and the signals behind them.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-1 rounded-2xl border border-white/10 bg-black/10 p-1">
            {TABS.map((item) => (
              <button key={item} type="button" onClick={() => setTab(item)} aria-pressed={tab === item} className="surface-button border-transparent px-3 py-2 text-xs sm:text-sm">
                {TAB_LABELS[item]}
              </button>
            ))}
          </div>
          <div className="flex gap-1 rounded-2xl border border-white/10 bg-black/10 p-1">
            {RANGES.map((days) => (
              <button key={days} type="button" onClick={() => setRange(days)} aria-pressed={range === days} className="surface-button border-transparent px-2.5 py-2 text-xs">
                {days}d
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-slate-400"><span className="h-2 w-2 rounded-full bg-emerald-300" /> Showing <strong className="text-white">{range} days</strong> of your trends</div>
        {filtered.dayKeys.length > 0 ? (
          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Day
            <select value={currentDay?.dayKey ?? ''} onChange={(event) => setDay(event.target.value)} className="rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-sm font-medium normal-case tracking-normal text-white outline-none focus:ring-2 focus:ring-emerald-300/60">
              {filtered.dayKeys.map((key) => <option key={key} value={key}>{dayLabel(key)}</option>)}
            </select>
          </label>
        ) : null}
      </div>

      {tab === 'overview' ? <OverviewView days={filtered.days} currentDay={currentDay} series={filtered.series} /> : null}
      {tab === 'sleep' ? <SleepView sleep={filtered.sleep} currentNight={currentNight} /> : null}
      {tab === 'activity' ? <ActivityView days={filtered.days} workouts={filtered.workouts} sessions={filtered.sessions} /> : null}
      {tab === 'vitals' ? <VitalsView dayHr={dayHr} series={filtered.series} temperature={filtered.temperature} currentDay={currentDay} /> : null}
    </div>
  );
}
