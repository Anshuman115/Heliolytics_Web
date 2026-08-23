import { DashboardApp } from '@/components/dashboard/DashboardApp';
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
    <main className="page-shell">
      <SyncStatusBar coverage={coverage} error={coverageError} />

      {errors.length > 0 ? (
        <div className="mb-6 space-y-2 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-amber-100">
          <p className="font-bold">Some signals are unavailable</p>
          {errors.map((e) => (
            <p key={e} className="text-sm text-amber-200/90">
              {e}
            </p>
          ))}
        </div>
      ) : null}

      <DashboardApp
        days={days}
        sleep={sleep}
        workouts={workouts}
        activitySessions={activitySessions}
        temperature={temperature}
        series={series}
        heartRate={heartRate}
      />
    </main>
  );
}
