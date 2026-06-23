import { apiGet } from './client';
import { API_ENDPOINTS, METRICS_DAYS, WORKOUT_DAYS } from './endpoints';
import type {
  ActivitySessionMetric,
  DayMetric,
  HeartRateDayCompact,
  HeartRateSample,
  SeriesSample,
  SleepMetric,
  SyncCoverage,
  TemperatureSample,
  WorkoutMetric,
} from './types';

export type {
  ActivitySessionMetric,
  DayMetric,
  SleepMetric,
  WorkoutMetric,
  TemperatureSample,
  SeriesSample,
  HealthSample,
  TempSample,
  HeartRateSample,
  SyncCoverage,
} from './types';

export { METRICS_DAYS, WORKOUT_DAYS } from './endpoints';

function range(days: number) {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - days);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return { from: fmt(from), to: fmt(to) };
}

export async function fetchDays(): Promise<DayMetric[]> {
  const { from, to } = range(METRICS_DAYS);
  const body = await apiGet<{ days: DayMetric[] }>(
    `${API_ENDPOINTS.days}?from=${from}&to=${to}`,
  );
  return body.days ?? [];
}

export async function fetchSleep(): Promise<SleepMetric[]> {
  const { from, to } = range(METRICS_DAYS);
  const body = await apiGet<{ sleep: SleepMetric[] }>(
    `${API_ENDPOINTS.sleep}?from=${from}&to=${to}`,
  );
  return body.sleep ?? [];
}

export async function fetchWorkouts(): Promise<WorkoutMetric[]> {
  const { from, to } = range(WORKOUT_DAYS);
  const body = await apiGet<{ workouts: WorkoutMetric[] }>(
    `${API_ENDPOINTS.workouts}?from=${from}&to=${to}`,
  );
  return body.workouts ?? [];
}

export async function fetchTemperature(): Promise<TemperatureSample[]> {
  const { from, to } = range(METRICS_DAYS);
  const body = await apiGet<{ samples: TemperatureSample[] }>(
    `${API_ENDPOINTS.temperature}?from=${from}&to=${to}`,
  );
  return body.samples ?? [];
}

export async function fetchSeries(): Promise<SeriesSample[]> {
  const { from, to } = range(METRICS_DAYS);
  const body = await apiGet<{ samples: SeriesSample[] }>(
    `${API_ENDPOINTS.series}?from=${from}&to=${to}`,
  );
  return body.samples ?? [];
}

export async function fetchActivitySessions(): Promise<ActivitySessionMetric[]> {
  const { from, to } = range(WORKOUT_DAYS);
  const body = await apiGet<{ activitySessions: ActivitySessionMetric[] }>(
    `${API_ENDPOINTS.activitySessions}?from=${from}&to=${to}`,
  );
  return body.activitySessions ?? [];
}

export async function fetchHeartRate(): Promise<HeartRateSample[]> {
  const { from, to } = range(METRICS_DAYS);
  const body = await apiGet<{ days: HeartRateDayCompact[] }>(
    `${API_ENDPOINTS.hr}?from=${from}&to=${to}`,
  );
  const out: HeartRateSample[] = [];
  for (const d of body.days ?? []) {
    const start = new Date(d.startTime).getTime();
    for (let i = 0; i < d.offsets.length; i++) {
      out.push({
        dayKey: d.dayKey,
        sampledAt: new Date(start + d.offsets[i] * 1000).toISOString(),
        bpm: d.values[i],
      });
    }
  }
  return out;
}

export async function fetchCoverage(): Promise<SyncCoverage> {
  return apiGet<SyncCoverage>(API_ENDPOINTS.coverage);
}
