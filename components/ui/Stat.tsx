type StatProps = { label: string; value: string };

export function Stat({ label, value }: StatProps) {
  return (
    <div className="card p-4">
      <p className="label">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-white">{value}</p>
    </div>
  );
}
