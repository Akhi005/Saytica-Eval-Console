import { CalendarClock, Coins, Gauge, Zap } from "lucide-react";
import { StatTile } from "@/components/ui/StatTile";
import { formatAccuracy } from "@/lib/format";
import type { ModelRow } from "@/components/types";

export function ModelSummaryTiles({
  bestAccuracy,
  fastest,
  freeModel,
  evaluated,
  total,
}: {
  bestAccuracy: ModelRow | null;
  fastest: ModelRow | null;
  freeModel: ModelRow | undefined;
  evaluated: number;
  total: number;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <StatTile
        icon={<Gauge className="h-4 w-4" aria-hidden="true" />}
        label="Highest accuracy"
        value={bestAccuracy ? formatAccuracy(bestAccuracy.accuracy) : "—"}
        detail={bestAccuracy?.name ?? "Waiting for evaluation"}
        accent="blue"
      />
      <StatTile
        icon={<Zap className="h-4 w-4" aria-hidden="true" />}
        label="Lowest latency"
        value={fastest?.latencyMs != null ? `${fastest.latencyMs} ms` : "—"}
        detail={fastest?.name ?? "No latency recorded"}
        accent="violet"
      />
      <StatTile
        icon={<Coins className="h-4 w-4" aria-hidden="true" />}
        label="Lowest cost"
        value={freeModel ? "$0.00" : "—"}
        detail={freeModel?.name ?? "Missing cost data remains visible"}
        accent="amber"
      />
      <StatTile
        icon={<CalendarClock className="h-4 w-4" aria-hidden="true" />}
        label="Evaluated"
        value={`${evaluated}/${total}`}
        detail="Models with accuracy scores"
        accent="emerald"
      />
    </div>
  );
}