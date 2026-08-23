import type { SyncCoverage } from '@/lib/api';

type SyncStatusBarProps = {
  coverage: SyncCoverage | null;
  error?: string;
};

export function SyncStatusBar({ coverage, error }: SyncStatusBarProps) {
  if (error) {
    return (
      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
        <span className="h-2 w-2 rounded-full bg-amber-300" />
        <span><strong>Sync paused.</strong> {error}</span>
      </div>
    );
  }
  if (!coverage) return null;

  const synced = coverage.lastIngestAt ?? coverage.dataThrough;
  const typeCount = coverage.types ? Object.keys(coverage.types).length : 0;

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.06] px-4 py-3 text-sm">
      <div className="flex items-center gap-3">
        <span className={`h-2.5 w-2.5 rounded-full ${coverage.hasData ? 'bg-emerald-300 shadow-[0_0_12px_rgba(0,230,163,0.7)]' : 'bg-slate-500'}`} />
        <span className="font-semibold text-white">{coverage.hasData ? 'Data is current' : 'Waiting for strap data'}</span>
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-400">
        <span>Synced <strong className="text-slate-200">{fmtTime(synced)}</strong></span>
        {coverage.dataThrough ? <span>Through <strong className="text-slate-200">{fmtTime(coverage.dataThrough)}</strong></span> : null}
        {typeCount > 0 ? <span>{typeCount} data streams</span> : null}
      </div>
    </div>
  );
}

function fmtTime(iso?: string) {
  if (!iso) return 'n/a';
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}
