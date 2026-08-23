type ChipProps = {
  label: string;
  value?: number | string;
  suffix?: string;
};

export function Chip({ label, value, suffix = '' }: ChipProps) {
  return (
    <div className="rounded-lg border border-white/5 bg-elevated px-3 py-2">
      <p className="label">{label}</p>
      <p className="mt-0.5 font-semibold tabular-nums text-white">
        {value != null ? `${value}${suffix}` : 'n/a'}
      </p>
    </div>
  );
}
