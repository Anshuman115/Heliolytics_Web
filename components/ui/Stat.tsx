type StatProps = { label: string; value: string; accent?: string };

export function Stat({ label, value, accent = '#0a84ff' }: StatProps) {
  return (
    <div className="card relative overflow-hidden p-4">
      <span className="absolute inset-y-0 left-0 w-[3px]" style={{ background: accent }} />
      <p className="label">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-white">{value}</p>
    </div>
  );
}
