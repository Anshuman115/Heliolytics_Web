type BrandMarkProps = {
  compact?: boolean;
};

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="relative grid h-9 w-9 place-items-center rounded-full border-2 border-emerald-300/70 bg-emerald-300/10 text-xs font-black text-emerald-200">
        H
        <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(0,230,163,0.8)]" />
      </span>
      {!compact ? (
        <span>
          <span className="block text-sm font-black tracking-[0.16em] text-white">HELIO</span>
          <span className="block text-[9px] font-semibold uppercase tracking-[0.22em] text-slate-400">
            health console
          </span>
        </span>
      ) : null}
    </span>
  );
}
