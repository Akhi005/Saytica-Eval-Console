import { cn } from "@/lib/cn";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "glass";
  padding?: "none" | "sm" | "md" | "lg";
};

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
} as const;

const variantStyles = {
  default: "border border-ink/10 bg-white shadow-sm",
  elevated: "border border-ink/8 bg-white shadow-soft",
  glass:
    "border border-white/60 bg-white/70 shadow-lg backdrop-blur-xl backdrop-saturate-150",
} as const;

export function Card({
  children,
  className,
  variant = "default",
  padding = "md",
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl",
        variantStyles[variant],
        paddingStyles[padding],
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 border-b border-ink/10 bg-surface-muted px-5 py-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
}
