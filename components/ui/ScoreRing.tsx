'use client';

import { useEffect, useState } from 'react';

type ScoreRingProps = {
  value: number | null | undefined;
  max?: number;
  label: string;
  color: string;
  size?: number;
  sub?: string;
};

/** Animated SVG progress ring — fills from 0 on mount. */
export function ScoreRing({ value, max = 100, label, color, size = 140, sub }: ScoreRingProps) {
  const target = value == null ? 0 : Math.min(1, Math.max(0, value / max));
  const [p, setP] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setP(target));
    return () => cancelAnimationFrame(id);
  }, [target]);

  const stroke = 11;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - p)}
            style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(0.22, 1, 0.36, 1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold tabular-nums text-white">
            {value == null ? '—' : Math.round(value)}
          </span>
          {sub ? <span className="text-[11px] text-slate-400">{sub}</span> : null}
        </div>
      </div>
      <span className="label">{label}</span>
    </div>
  );
}
