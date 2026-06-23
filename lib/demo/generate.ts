import type {
  ActivitySessionMetric,
  DayMetric,
  HeartRateSample,
  SeriesSample,
  SleepMetric,
  SleepStagePoint,
  SyncCoverage,
  TemperatureSample,
  WorkoutMetric,
} from '@/lib/api/types';

export type DemoData = {
  days: DayMetric[];
  sleep: SleepMetric[];
  workouts: WorkoutMetric[];
  activitySessions: ActivitySessionMetric[];
  temperature: TemperatureSample[];
  series: SeriesSample[];
  heartRate: HeartRateSample[];
  coverage: SyncCoverage;
};

// Deterministic PRNG (mulberry32) so the demo is stable per day-of-month.
function rng(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

const DAYS = 30;
const round = (n: number) => Math.round(n);
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

const SPORTS = [
  { type: 92, name: 'Badminton' },
  { type: 1, name: 'Running' },
  { type: 9, name: 'Cycling' },
  { type: 6, name: 'Walking' },
  { type: 16, name: 'Strength' },
];

function dayKeyFor(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

// Build a valid UTC ISO timestamp from a dayKey + hour/minute, avoiding
// unpadded-hour ISO strings (e.g. "T9:15" is invalid → Invalid Date).
function atUTC(dayKey: string, hour: number, minute = 0): string {
  const d = new Date(`${dayKey}T00:00:00Z`);
  d.setUTCHours(hour, minute, 0, 0);
  return d.toISOString();
}

export function generateDemoData(): DemoData {
  const days: DayMetric[] = [];
  const sleep: SleepMetric[] = [];
  const workouts: WorkoutMetric[] = [];
  const activitySessions: ActivitySessionMetric[] = [];
  const temperature: TemperatureSample[] = [];
  const series: SeriesSample[] = [];

  for (let i = DAYS - 1; i >= 0; i--) {
    const dayKey = dayKeyFor(i);
    const date = new Date(`${dayKey}T00:00:00Z`);
    const weekend = [0, 6].includes(date.getUTCDay());
    const r = rng(Number(dayKey.replace(/-/g, '')) + 7);

    // Sleep (previous night → this dayKey)
    const total = round(360 + r() * 110); // 6h–7h50
    const deep = round(total * (0.16 + r() * 0.07));
    const rem = round(total * (0.19 + r() * 0.08));
    const wake = round(6 + r() * 22);
    const light = clamp(total - deep - rem - wake, 0, total);
    const sleepScore = clamp(round(62 + r() * 32), 0, 100);

    // Vitals
    const hrv = round(42 + r() * 32); // 42–74 ms
    const rhr = round(49 + r() * 9); // 49–58
    const spo2 = round(96 + r() * 3);
    const stress = round(26 + r() * 24);
    const resp = round(13 + r() * 4);
    const tempAvg = +(32.4 + r() * 1.2).toFixed(1);
    const pai = round(70 + r() * 70);

    // Readiness: sleep + HRV led, RHR drag, with noise → 52–95
    const readiness = clamp(
      round(0.4 * sleepScore + 0.35 * (hrv + 20) + 0.25 * (110 - rhr) - 12 + (r() - 0.5) * 10),
      48,
      96,
    );

    const steps = round((weekend ? 9000 : 6500) + r() * 6500);
    const hasWorkout = r() > (weekend ? 0.45 : 0.7);
    const napCount = r() > 0.85 ? 1 : 0;
    const activityCount = round(1 + r() * 3);

    days.push({
      dayKey,
      steps,
      paiScore: pai,
      readiness,
      spo2Avg: spo2,
      hrvRmssd: hrv,
      restingHr: rhr,
      respRateAvg: resp,
      stressAvg: stress,
      sleepScore,
      sleepMins: total,
      sleepDeepMins: deep,
      sleepRemMins: rem,
      sleepLightMins: light,
      tempAvgC: tempAvg,
      napCount,
      workoutCount: hasWorkout ? 1 : 0,
      updatedAt: new Date().toISOString(),
    });

    const bedtime = new Date(`${dayKey}T00:00:00Z`);
    bedtime.setUTCHours(-1 - round(r() * 2), round(r() * 59));
    sleep.push({
      dayKey,
      startedAt: bedtime.toISOString(),
      score: sleepScore,
      totalMins: total,
      deepMins: deep,
      remMins: rem,
      lightMins: light,
      stages: buildStages(bedtime, total, r),
    });

    // Per-day series points (one per metric → VitalsSeriesChart shows a daily line)
    const at = `${dayKey}T08:00:00Z`;
    series.push(
      { metric: 'stress', dayKey, sampledAt: at, value: stress },
      { metric: 'hrv', dayKey, sampledAt: at, value: hrv },
      { metric: 'spo2_sleep', dayKey, sampledAt: at, value: spo2 },
      { metric: 'rhr', dayKey, sampledAt: at, value: rhr },
      { metric: 'resp_rate', dayKey, sampledAt: at, value: resp },
    );
    temperature.push({ dayKey, sampledAt: at, celsius: tempAvg });

    if (hasWorkout) {
      const s = SPORTS[round(r() * (SPORTS.length - 1))];
      const dur = round(1500 + r() * 4000);
      workouts.push({
        dayKey,
        startedAt: atUTC(dayKey, 17, 30),
        sportType: s.type,
        sportName: s.name,
        durationSec: dur,
        calories: round(dur / 60 * (6 + r() * 6)),
        avgHr: round(118 + r() * 28),
        maxHr: round(155 + r() * 30),
      });
    }
    for (let k = 0; k < activityCount; k++) {
      activitySessions.push({
        dayKey,
        startedAt: atUTC(dayKey, 9 + k * 3, 15),
        sportType: 6,
        sportName: 'Walk',
        durationSec: round(600 + r() * 1500),
        calories: round(30 + r() * 90),
        avgHr: round(95 + r() * 25),
      });
    }
  }

  return {
    days,
    sleep,
    workouts,
    activitySessions,
    temperature,
    series,
    heartRate: days.slice(-5).flatMap((d) => generateDayHeartRate(d)),
    coverage: {
      dataThrough: new Date().toISOString(),
      lastIngestAt: new Date().toISOString(),
      hasData: true,
      types: {
        '0x01': dayKeyFor(0),
        '0x48': dayKeyFor(0),
        '0x49': dayKeyFor(0),
        '0x2E': dayKeyFor(0),
        '0x13': dayKeyFor(0),
      },
    },
  };
}

// A realistic hypnogram: ~90-min cycles of light → deep → light → REM, with
// brief wakes. Stage types: 5=deep, 4=light, 8=REM, 7=wake.
function buildStages(start: Date, totalMins: number, r: () => number): SleepStagePoint[] {
  const out: SleepStagePoint[] = [];
  let t = start.getTime();
  let used = 0;
  const push = (type: number, mins: number) => {
    const end = t + mins * 60_000;
    out.push({ start: new Date(t).toISOString(), end: new Date(end).toISOString(), type });
    t = end;
    used += mins;
  };
  while (used < totalMins - 5) {
    const remaining = totalMins - used;
    push(4, Math.min(15 + round(r() * 10), remaining)); // light
    if (used >= totalMins) break;
    push(5, Math.min(20 + round(r() * 20), totalMins - used)); // deep
    if (used >= totalMins) break;
    push(4, Math.min(10 + round(r() * 10), totalMins - used)); // light
    if (used >= totalMins) break;
    if (r() > 0.7) push(7, Math.min(3 + round(r() * 5), totalMins - used)); // wake
    if (used >= totalMins) break;
    push(8, Math.min(15 + round(r() * 20), totalMins - used)); // REM
  }
  return out;
}

// A realistic single-day continuous HR curve (~5-min cadence): night dip,
// morning rise, a workout spike if the day had one, evening taper.
function generateDayHeartRate(day: DayMetric): HeartRateSample[] {
  const r = rng(Number(day.dayKey.replace(/-/g, '')) + 99);
  const out: HeartRateSample[] = [];
  const base = day.restingHr ?? 52;
  const workoutHour = day.workoutCount ? 17.5 : -1;
  for (let m = 0; m < 24 * 60; m += 5) {
    const h = m / 60;
    let bpm = base + 8 + Math.sin((h / 24) * Math.PI * 2 - 1.5) * 10;
    if (h < 6.5) bpm = base + r() * 4; // asleep
    if (h >= 8 && h <= 21) bpm += 6 + r() * 14; // active daytime
    if (workoutHour > 0 && Math.abs(h - workoutHour) < 0.6) {
      bpm = 130 + r() * 40; // workout spike
    }
    const t = new Date(`${day.dayKey}T00:00:00Z`);
    t.setUTCMinutes(m);
    out.push({ dayKey: day.dayKey, sampledAt: t.toISOString(), bpm: clamp(round(bpm), 42, 185) });
  }
  return out;
}
