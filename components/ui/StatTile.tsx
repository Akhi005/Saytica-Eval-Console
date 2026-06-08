import { cn } from "@/lib/cn";

type StatTileProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
  accent?: "blue" | "violet" | "amber" | "emerald";
  className?: string;
};

const accentStyles = {
  blue: "from-accent/15 to-accent/5 text-accent",
  violet: "from-violet/15 to-violet/5 text-violet",
  amber: "from-gold/20 to-gold/5 text-gold",
  emerald: "from-emerald/15 to-emerald/5 text-emerald",
} as const;

export function StatTile({
  icon,
  label,
  value,
  detail,
  accent = "blue",
  className,
}: StatTileProps) {
  return (
    <section
      className={cn(
        "group relative overflow-hidden rounded-xl border border-ink/10 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md",
        className,
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br opacity-60 blur-2xl transition group-hover:opacity-80",
          accentStyles[accent],
        )}
        aria-hidden="true"
      />
      <div className="relative">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink/48">
          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br shadow-sm",
              accentStyles[accent],
            )}
          >
            {icon}
          </span>
          {label}
        </div>
        <p className="mt-4 text-2xl font-bold tracking-tight text-ink">{value}</p>
        <p className="mt-1 truncate text-sm text-ink/58" title={detail}>
          {detail}
        </p>
      </div>
    </section>
  );
}
