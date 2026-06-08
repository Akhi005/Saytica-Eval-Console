export function StatPill({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex w-full items-center gap-2.5 rounded-xl border border-ink/8 bg-white/80 px-3.5 py-2 shadow-sm">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 text-accent">
        {icon}
      </span>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink/50">{label}</p>
        <p className="text-lg font-bold leading-none text-ink">{value}</p>
      </div>
    </div>
  );
}
