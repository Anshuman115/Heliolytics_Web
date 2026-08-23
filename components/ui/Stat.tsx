type StatProps = { label: string; value: string; accent?: string };

export function Stat({ label, value, accent = '#0a84ff' }: StatProps) {
  return (
    <div className="card relative overflow-hidden p-4 sm:p-5">
      <span className="absolute inset-x-0 top-0 h-1" style={{ background: accent }} />
      <p className="label">{label}</p>
      <p className="mt-2 text-2xl font-black tabular-nums text-white">{value}</p>
    </div>
  );
}
