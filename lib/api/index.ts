import { apiGet } from './client';
import { API_ENDPOINTS, METRICS_DAYS, WORKOUT_DAYS } from './endpoints';
import type {
  DayMetric,
  SeriesSample,
  SleepMetric,
  TemperatureSample,
  WorkoutMetric,
} from './types';

export type {
  DayMetric,
  SleepMetric,
  WorkoutMetric,
  TemperatureSample,
  SeriesSample,
  HealthSample,
  TempSample,
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
