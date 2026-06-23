import type { DayMetric, HealthSample, HeartRateSample, TempSample } from '@/lib/api';
import { HeartRateChart } from '@/components/charts/HeartRateChart';
import { TemperatureChart } from '@/components/charts/TemperatureChart';
import { VitalsSeriesChart } from '@/components/charts/VitalsSeriesChart';
import { Chip } from '@/components/ui/Chip';

export function VitalsView({
  dayHr,
  series,
  temperature,
  currentDay,
}: {
  dayHr: HeartRateSample[];
  series: HealthSample[];
  temperature: TempSample[];
  currentDay?: DayMetric;
}) {
  return (
    <>
      {currentDay && (
        <div className="mb-5 grid grid-cols-2 gap-3 fade-up sm:grid-cols-3 lg:grid-cols-6">
          <Chip label="HRV" value={currentDay.hrvRmssd} suffix=" ms" />
          <Chip label="Resting HR" value={currentDay.restingHr} suffix=" bpm" />
          <Chip label="SpO₂" value={currentDay.spo2Avg} suffix="%" />
          <Chip label="Stress" value={currentDay.stressAvg} />
          <Chip label="Resp rate" value={currentDay.respRateAvg} suffix="/min" />
          <Chip label="Skin temp" value={currentDay.tempAvgC} suffix=" °C" />
        </div>
      )}
      <div className="mb-4 fade-up">
        <HeartRateChart samples={dayHr} />
      </div>
      <div className="grid gap-4 fade-up lg:grid-cols-2">
        <VitalsSeriesChart samples={series} />
        <TemperatureChart samples={temperature} />
      </div>
    </>
  );
}
