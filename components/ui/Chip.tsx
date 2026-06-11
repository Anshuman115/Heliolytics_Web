type ChipProps = {
  label: string;
  value?: number | string;
  suffix?: string;
};

export function Chip({ label, value, suffix = '' }: ChipProps) {
  return (
    <div className="rounded-lg bg-slate-800/60 px-3 py-2">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-medium tabular-nums">
        {value != null ? `${value}${suffix}` : '—'}
      </p>
    </div>
  );
}
