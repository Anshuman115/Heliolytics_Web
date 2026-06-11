type StageBarProps = {
  deep: number;
  rem: number;
  light: number;
};

export function StageBar({ deep, rem, light }: StageBarProps) {
  const total = deep + rem + light || 1;
  const pct = (n: number) => `${Math.round((n / total) * 100)}%`;
  return (
    <div className="flex h-3 overflow-hidden rounded-full text-[10px]">
      <div className="bg-indigo-600" style={{ width: pct(deep) }} title={`Deep ${deep}m`} />
      <div className="bg-violet-500" style={{ width: pct(rem) }} title={`REM ${rem}m`} />
      <div className="bg-sky-600" style={{ width: pct(light) }} title={`Light ${light}m`} />
    </div>
  );
}
