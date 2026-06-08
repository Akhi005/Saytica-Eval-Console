import { cn } from "@/lib/cn";

type BadgeVariant = "default" | "accent" | "success" | "warning" | "danger" | "gold";

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-ink/5 text-ink/70 ring-ink/10",
  accent: "bg-accent/10 text-accent ring-accent/15",
  success: "bg-accent/12 text-accent ring-accent/18",
  warning: "bg-gold/15 text-ink ring-gold/20",
  danger: "bg-coral/10 text-coral ring-coral/15",
  gold: "bg-gold/15 text-ink ring-gold/25",
};

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
