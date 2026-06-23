import { ActivitySessionsList } from '@/components/ActivitySessionsList';
import { Dashboard, METRICS_DAYS } from '@/components/Dashboard';
import { SignOutButton } from '@/components/SignOutButton';
import { SyncStatusBar } from '@/components/SyncStatusBar';
import {
  fetchActivitySessions,
  fetchCoverage,
  fetchDays,
  fetchHeartRate,
  fetchSeries,
  fetchSleep,
  fetchTemperature,
  fetchWorkouts,
  WORKOUT_DAYS,
} from '@/lib/api';
import type {
  ActivitySessionMetric,
  DayMetric,
  HealthSample,
  HeartRateSample,
  SleepMetric,
  SyncCoverage,
  TempSample,
  WorkoutMetric,
} from '@/lib/api/types';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const errors: string[] = [];
  let days: DayMetric[] = [];
  let sleep: SleepMetric[] = [];
  let workouts: WorkoutMetric[] = [];
  let activitySessions: ActivitySessionMetric[] = [];
  let temperature: TempSample[] = [];
  let series: HealthSample[] = [];
  let heartRate: HeartRateSample[] = [];
  let coverage: SyncCoverage | null = null;
  let coverageError: string | undefined;

  await Promise.all([
    fetchDays().then((d) => { days = d; }).catch((e) => {
      errors.push(`Days: ${e instanceof Error ? e.message : 'failed'}`);
    }),
    fetchSleep().then((d) => { sleep = d; }).catch((e) => {
      errors.push(`Sleep: ${e instanceof Error ? e.message : 'failed'}`);
    }),
    fetchWorkouts().then((d) => { workouts = d; }).catch((e) => {
      errors.push(`Workouts: ${e instanceof Error ? e.message : 'failed'}`);
    }),
    fetchActivitySessions().then((d) => { activitySessions = d; }).catch((e) => {
      errors.push(`Activities: ${e instanceof Error ? e.message : 'failed'}`);
    }),
    fetchTemperature().then((d) => { temperature = d; }).catch((e) => {
      errors.push(`Temperature: ${e instanceof Error ? e.message : 'failed'}`);
    }),
    fetchSeries().then((d) => { series = d; }).catch((e) => {
      errors.push(`Series: ${e instanceof Error ? e.message : 'failed'}`);
    }),
    fetchHeartRate().then((d) => { heartRate = d; }).catch((e) => {
      errors.push(`Heart rate: ${e instanceof Error ? e.message : 'failed'}`);
    }),
    fetchCoverage().then((d) => { coverage = d; }).catch((e) => {
      coverageError = e instanceof Error ? e.message : 'failed';
    }),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Heliolytics
          </h1>
          <p className="mt-2 text-slate-400">
            Last {METRICS_DAYS} days metrics · {WORKOUT_DAYS} days workouts
          </p>
        </div>
        <SignOutButton />
      </header>

      <SyncStatusBar coverage={coverage} error={coverageError} />

      {errors.length > 0 ? (
        <div className="mb-6 space-y-2 rounded-xl border border-amber-800 bg-amber-950/30 p-4 text-amber-100">
          <p className="font-medium">Some data could not be loaded</p>
          {errors.map((e) => (
            <p key={e} className="text-sm text-amber-200/90">
              {e}
            </p>
          ))}
        </div>
      ) : null}

      <Dashboard
        days={days}
        sleep={sleep}
        workouts={workouts}
        temperature={temperature}
        series={series}
        heartRate={heartRate}
      />

      <ActivitySessionsList sessions={activitySessions} />
    </main>
  );
}
