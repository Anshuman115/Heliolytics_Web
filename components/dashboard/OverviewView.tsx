import type { DayMetric, HealthSample } from '@/lib/api';
import { HeroRings } from '@/components/HeroRings';
import { Stat } from '@/components/ui/Stat';
import { StepsChart } from '@/components/charts/StepsChart';
import { VitalsSeriesChart } from '@/components/charts/VitalsSeriesChart';

function avg(xs: (number | undefined)[]): string {
  const v = xs.filter((n): n is number => n != null);
  return v.length ? String(Math.round(v.reduce((a, b) => a + b, 0) / v.length)) : '—';
}

export function OverviewView({
  days,
  currentDay,
  series,
}: {
  days: DayMetric[];
  currentDay?: DayMetric;
  series: HealthSample[];
}) {
  const total = days.reduce((s, d) => s + d.steps, 0);
  return (
    <>
      <HeroRings day={currentDay} />
      <div className="mb-6 grid gap-4 fade-up sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total steps" value={total.toLocaleString()} />
        <Stat label="Avg readiness" value={avg(days.map((d) => d.readiness))} />
        <Stat label="Avg sleep" value={avg(days.map((d) => d.sleepScore))} />
        <Stat label="Avg stress" value={avg(days.map((d) => d.stressAvg))} />
      </div>
      <div className="grid gap-4 fade-up lg:grid-cols-2">
        <StepsChart days={days} />
        <VitalsSeriesChart samples={series} />
      </div>
    </>
  );
}
