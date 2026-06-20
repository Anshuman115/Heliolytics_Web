import type { SyncCoverage } from '@/lib/api';

type SyncStatusBarProps = {
  coverage: SyncCoverage | null;
  error?: string;
};

export function SyncStatusBar({ coverage, error }: SyncStatusBarProps) {
  if (error) {
    return (
      <div className="mb-6 rounded-xl border border-amber-800 bg-amber-950/30 px-4 py-3 text-sm text-amber-100">
        Sync status unavailable — {error}
      </div>
    );
  }
  if (!coverage) return null;

  const synced = coverage.lastIngestAt ?? coverage.dataThrough;
  const typeCount = coverage.types ? Object.keys(coverage.types).length : 0;

  return (
    <div className="mb-6 flex flex-wrap gap-x-6 gap-y-2 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm text-slate-300">
      <span>
        Last sync{' '}
        <strong className="text-white">{fmtTime(synced)}</strong>
      </span>
      {coverage.dataThrough ? (
        <span>
          Data through{' '}
          <strong className="text-white">{fmtTime(coverage.dataThrough)}</strong>
        </span>
      ) : null}
      {typeCount > 0 ? (
        <span>
          Per-type coverage{' '}
          <strong className="text-white">{typeCount} types</strong>
        </span>
      ) : null}
      {!coverage.hasData ? (
        <span className="text-slate-500">No strap data ingested yet</span>
      ) : null}
    </div>
  );
}

function fmtTime(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}
