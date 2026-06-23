import Link from 'next/link';
import { DashboardApp } from '@/components/dashboard/DashboardApp';
import { SyncStatusBar } from '@/components/SyncStatusBar';
import { METRICS_DAYS, WORKOUT_DAYS } from '@/lib/api';
import { generateDemoData } from '@/lib/demo/generate';

export const metadata = { title: 'Heliolytics — Demo' };
export const dynamic = 'force-dynamic';

export default function DemoPage() {
  const data = generateDemoData();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-brand/30 bg-brand/10 px-4 py-3 text-sm">
        <span className="text-brand">
          <strong>Demo mode</strong> — sample data for a month. No device or login required.
        </span>
        <span className="flex shrink-0 gap-4">
          <Link href="/about" className="text-slate-300 underline-offset-4 hover:underline">
            How it works
          </Link>
          <Link href="/login" className="text-slate-300 underline-offset-4 hover:underline">
            Sign in →
          </Link>
        </span>
      </div>

      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-white">Heliolytics</h1>
        <p className="mt-2 text-slate-400">
          Last {METRICS_DAYS} days · {WORKOUT_DAYS} days workouts · demo dataset
        </p>
      </header>

      <SyncStatusBar coverage={data.coverage} />

      <DashboardApp
        days={data.days}
        sleep={data.sleep}
        workouts={data.workouts}
        activitySessions={data.activitySessions}
        temperature={data.temperature}
        series={data.series}
        heartRate={data.heartRate}
      />
    </main>
  );
}
