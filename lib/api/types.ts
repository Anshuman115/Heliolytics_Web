export type DayMetric = {
  dayKey: string;
  steps: number;
  paiScore?: number;
  readiness?: number;
  spo2Avg?: number;
  hrvRmssd?: number;
  restingHr?: number;
  respRateAvg?: number;
  stressAvg?: number;
  sleepScore?: number;
  sleepMins?: number;
  sleepDeepMins?: number;
  sleepRemMins?: number;
  sleepLightMins?: number;
  tempAvgC?: number;
  napCount?: number;
  workoutCount?: number;
  updatedAt?: string;
};

export type SleepStagePoint = {
  start: string; // ISO
  end: string; // ISO
  type: number; // 5=deep, 4=light, 8=REM, 7=wake
};

export type SleepMetric = {
  dayKey: string;
  startedAt: string;
  score: number;
  totalMins: number;
  deepMins: number;
  remMins: number;
  lightMins: number;
  stages?: SleepStagePoint[];
};

export type WorkoutMetric = {
  dayKey: string;
  startedAt: string;
  sportType: number;
  sportName?: string;
  durationSec: number;
  calories?: number;
  avgHr?: number;
  maxHr?: number;
};

export type TemperatureSample = {
  dayKey: string;
  sampledAt: string;
  celsius: number;
};

export type SeriesSample = {
  metric: string;
  dayKey: string;
  sampledAt: string;
  value: number;
};

/** Alias of SeriesSample — the canonical name used across the dashboard. */
export type HealthSample = SeriesSample;

/** Alias of TemperatureSample — the canonical name used across the dashboard. */
export type TempSample = TemperatureSample;

export type ActivitySessionMetric = {
  dayKey: string;
  startedAt: string;
  sportType: number;
  sportName?: string;
  durationSec: number;
  calories?: number;
  avgHr?: number;
  maxHr?: number;
};

export type SyncCoverage = {
  dataThrough?: string;
  lastIngestAt?: string;
  hasData: boolean;
  types?: Record<string, string | null>;
};

export type HeartRateSample = {
  dayKey: string;
  sampledAt: string; // ISO
  bpm: number;
};

/** Compact per-day HR as returned by GET /api/v1/metrics/hr. */
export type HeartRateDayCompact = {
  dayKey: string;
  startTime: string;
  offsets: number[]; // seconds from startTime
  values: number[]; // bpm
};
