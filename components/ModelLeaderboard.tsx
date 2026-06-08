"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MetricCell } from "@/components/ui/MetricCell";
import { ModelSearchBar } from "@/components/ui/ModelSearchBar";
import { ModelSummaryTiles } from "@/components/ModelSummaryTiles";
import { SortButton } from "@/components/ui/SortButton";
import { cn } from "@/lib/cn";
import { sortLabels, type ModelRow, type SortDirection, type SortKey } from "@/components/types";
import { formatAccuracy, formatCurrency, formatDate } from "@/lib/format";
import { useLeaderboard } from "@/app/hooks/useLeaderboard";

export default function ModelLeaderboard({ initialModels }: { initialModels?: ModelRow[] }) {
  const [models, setModels] = useState<ModelRow[]>(initialModels ?? []);
  const [loading, setLoading] = useState(!initialModels);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("accuracy");
  const [direction, setDirection] = useState<SortDirection>("desc");
  const { best, summary, visibleModels } = useLeaderboard(models, query, sortKey, direction);
  
  useEffect(() => {
    if (initialModels) return;
    async function loadModels() {
      try {
        const response = await fetch("/api/models");
        if (!response.ok) return;
        const data = (await response.json()) as ModelRow[];
        setModels(data);
      } finally {
        setLoading(false);
      }
    }
    loadModels();
  }, [initialModels]);

  function handleSort(nextKey: SortKey) {
    if (nextKey === sortKey) {
      setDirection((d) => (d === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(nextKey);
    setDirection(nextKey === "accuracy" || nextKey === "evaluatedAt" ? "desc" : "asc");
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Model performance"
        description="See accuracy, response time, and estimated cost for each model."
      />

      <ModelSummaryTiles {...summary} />

      <Card padding="sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <ModelSearchBar value={query} onChange={setQuery} />
          <div className="flex flex-wrap gap-2">
            {(["accuracy", "latencyMs", "costPer1k", "evaluatedAt"] as SortKey[]).map((key) => (
              <SortButton key={key} sortKey={key} activeKey={sortKey} direction={direction} onClick={handleSort} />
            ))}
          </div>
        </div>
      </Card>

      <Card variant="elevated" padding="none" className="overflow-hidden">
        <CardHeader>
          <div>
            <h3 className="font-bold text-ink">Evaluation results</h3>
            <p className="mt-1 text-sm text-ink/55">
              Showing {visibleModels.length} of {models.length} models
            </p>
          </div>
          <Badge variant="accent">Sorted by {sortLabels[sortKey].toLowerCase()}</Badge>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-left text-sm">
            <thead className="sticky top-0 z-10 bg-surface-muted text-xs uppercase tracking-wide text-ink/55">
              <tr>
                {["Model", "Provider", "Accuracy", "Latency", "Cost / 1k", "Evaluated on"].map((col) => (
                  <th key={col} scope="col" className="px-5 py-3.5 font-semibold">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/8">
              {loading ? (
                <tr>
                  <td className="px-5 py-12 text-center text-ink/55" colSpan={6}>
                    <span className="inline-flex items-center gap-2">
                      <span className="h-4 w-4 animate-pulse rounded-full bg-accent/30" />
                      Loading models…
                    </span>
                  </td>
                </tr>
              ) : visibleModels.length === 0 ? (
                <tr>
                  <td className="px-5 py-12 text-center text-ink/55" colSpan={6}>
                    No models match your search.
                  </td>
                </tr>
              ) : (
                visibleModels.map((model, index) => (
                  <tr
                    key={model.id}
                    className={cn(
                      "transition duration-150 hover:bg-accent/[0.04]",
                      index % 2 === 0 ? "bg-white" : "bg-surface-muted/40",
                    )}
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold text-ink">{model.name}</div>
                      <div className="mt-0.5 font-mono text-xs text-ink/40">{model.id}</div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge>{model.provider}</Badge>
                    </td>
                    <td className="px-5 py-4">
                      <MetricCell
                        value={formatAccuracy(model.accuracy)}
                        percent={model.accuracy != null ? model.accuracy * 100 : null}
                        tone={model.accuracy === null ? "muted" : "good"}
                        badge={model.accuracy === best.accuracy ? "Best accuracy" : undefined}
                      />
                    </td>
                    <td className="px-5 py-4">
                      <MetricCell
                        value={model.latencyMs === null ? "Unknown" : `${model.latencyMs} ms`}
                        tone={model.latencyMs && model.latencyMs > 3000 ? "warn" : "neutral"}
                        badge={model.latencyMs === best.latencyMs ? "Fastest" : undefined}
                      />
                    </td>
                    <td className="px-5 py-4">
                      <MetricCell
                        value={formatCurrency(model.costPer1k)}
                        tone={model.costPer1k === null ? "muted" : "neutral"}
                        badge={model.costPer1k === best.costPer1k ? "Lowest cost" : undefined}
                      />
                    </td>
                    <td className="px-5 py-4 text-ink/65">{formatDate(model.evaluatedAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}