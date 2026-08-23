import { DashboardApp } from '@/components/dashboard/DashboardApp';
import { PublicHeader } from '@/components/PublicHeader';
import { SyncStatusBar } from '@/components/SyncStatusBar';
import { generateDemoData } from '@/lib/demo/generate';

export const metadata = { title: 'Demo' };
export const dynamic = 'force-dynamic';

export default function DemoPage() {
  const data = generateDemoData();

  return (
    <main className="public-shell">
      <PublicHeader action="demo" />
      <section className="mb-7 flex flex-col gap-4 pt-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow mb-2">A live preview with sample data</p>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">See the signal, not the noise.</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">Move through a month of sleep, recovery, activity, and body signals. Nothing here is connected to a device.</p>
        </div>
        <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.06] px-4 py-3 text-xs text-emerald-100">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-300" />
          Sample workspace · safe to explore
        </div>
      </section>
      <SyncStatusBar coverage={data.coverage} />
      <DashboardApp {...data} demo />
    </main>
  );
}
