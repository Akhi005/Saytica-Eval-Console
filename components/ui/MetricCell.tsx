import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/cn";

export function MetricCell({
  value,
  percent,
  tone,
  badge,
}: {
  value: string;
  percent?: number | null;
  tone: "good" | "neutral" | "muted" | "warn";
  badge?: string;
}) {
  const color = {
    good: "text-accent",
    neutral: "text-ink",
    muted: "text-ink/45",
    warn: "text-coral",
  }[tone];

  return (
    <div className="flex flex-col gap-1.5">
      <span className={cn("font-semibold", color)}>{value}</span>
      {percent != null ? (
        <ProgressBar
          value={percent}
          variant={tone === "good" ? "accent" : "gold"}
          className="max-w-[120px]"
        />
      ) : null}
      {badge ? (
        <Badge variant="gold" className="gap-1">
          <Sparkles className="h-3 w-3" aria-hidden="true" />
          {badge}
        </Badge>
      ) : null}
    </div>
  );
}