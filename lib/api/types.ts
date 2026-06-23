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

export type SleepMetric = {
  dayKey: string;
  startedAt: string;
  score: number;
  totalMins: number;
  deepMins: number;
  remMins: number;
  lightMins: number;
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

/** @deprecated use SeriesSample */
export type HealthSample = SeriesSample;

/** @deprecated use TemperatureSample */
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
