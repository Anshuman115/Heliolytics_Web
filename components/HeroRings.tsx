import type { DayMetric } from '@/lib/api';
import { ScoreRing, recoveryColor } from '@/components/ui/ScoreRing';

/** Headline rings for the most recent day: recovery, sleep, steps. */
export function HeroRings({ day }: { day?: DayMetric }) {
  if (!day) return null;
  const stepGoal = 10000;
  return (
    <div className="card mb-8 grid grid-cols-1 gap-6 p-6 sm:grid-cols-3 fade-up">
      <div className="flex justify-center">
        <ScoreRing
          value={day.readiness}
          label="Recovery"
          color={recoveryColor(day.readiness)}
          sub="readiness"
        />
      </div>
      <div className="flex justify-center">
        <ScoreRing value={day.sleepScore} label="Sleep" color="#0a84ff" sub="score" />
      </div>
      <div className="flex justify-center">
        <ScoreRing
          value={day.steps}
          max={stepGoal}
          label="Steps"
          color="#64d2ff"
          sub={`${Math.round((day.steps / stepGoal) * 100)}% of ${stepGoal / 1000}k`}
        />
      </div>
    </div>
  );
}
