export const API_ENDPOINTS = {
  days: '/api/v1/metrics/days',
  sleep: '/api/v1/metrics/sleep',
  workouts: '/api/v1/metrics/workouts',
  activitySessions: '/api/v1/metrics/activity-sessions',
  temperature: '/api/v1/metrics/temperature',
  series: '/api/v1/metrics/series',
  hr: '/api/v1/metrics/hr',
  coverage: '/api/v1/metrics/coverage',
} as const;

export const METRICS_DAYS = 30;
export const WORKOUT_DAYS = 90;
