type StatProps = { label: string; value: string };

export function Stat({ label, value }: StatProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="text-2xl font-bold text-brand">{value}</p>
    </div>
  );
}
