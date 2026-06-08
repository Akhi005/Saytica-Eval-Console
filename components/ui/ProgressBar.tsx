import { cn } from "@/lib/cn";

type ProgressBarProps = {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  variant?: "accent" | "gold" | "coral";
};

const fillStyles = {
  accent: "bg-gradient-to-r from-accent to-accent-light",
  gold: "bg-gradient-to-r from-gold to-gold/70",
  coral: "bg-gradient-to-r from-coral to-coral/70",
} as const;

export function ProgressBar({
  value,
  max = 100,
  className,
  showLabel = false,
  variant = "accent",
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-field">
        <div
          className={cn("h-full rounded-full transition-all duration-500", fillStyles[variant])}
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
      {showLabel ? (
        <span className="min-w-[3rem] text-right text-sm font-semibold text-ink">
          {percent.toFixed(0)}%
        </span>
      ) : null}
    </div>
  );
}
