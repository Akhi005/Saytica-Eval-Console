"use client";

import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  Search,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ModelRow } from "@/components/types";

type SortKey = "accuracy" | "latencyMs" | "costPer1k" | "evaluatedAt";
type SortDirection = "asc" | "desc";

const sortLabels: Record<SortKey, string> = {
  accuracy: "Accuracy",
  latencyMs: "Latency",
  costPer1k: "Cost",
  evaluatedAt: "Evaluated",
};

function compareNullable(
  a: number | string | null,
  b: number | string | null,
  direction: SortDirection,
) {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;

  const result = a > b ? 1 : a < b ? -1 : 0;
  return direction === "asc" ? result : -result;
}

function formatAccuracy(value: number | null) {
  if (value === null) return "Not evaluated";
  return `${(value * 100).toFixed(1)}%`;
}

function formatCurrency(value: number | null) {
  if (value === null) return "Unknown";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string | null) {
  if (!value) return "No date";

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function SortButton({
  sortKey,
  activeKey,
  direction,
  onClick,
}: {
  sortKey: SortKey;
  activeKey: SortKey;
  direction: SortDirection;
  onClick: (key: SortKey) => void;
}) {
  const isActive = sortKey === activeKey;
  const Icon = !isActive
    ? ChevronsUpDown
    : direction === "asc"
      ? ArrowUp
      : ArrowDown;

  return (
    <button
      className={`inline-flex min-h-9 items-center justify-center gap-2 rounded-md border px-3 text-sm font-semibold transition ${
        isActive
          ? "border-ink bg-ink text-white"
          : "border-ink/10 bg-white text-ink/70 hover:border-moss/40 hover:bg-field"
      }`}
      type="button"
      onClick={() => onClick(sortKey)}
    >
      {sortLabels[sortKey]}
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

export default function ModelLeaderboard() {
  const [models, setModels] = useState<ModelRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("accuracy");
  const [direction, setDirection] = useState<SortDirection>("desc");

  useEffect(() => {
    async function loadModels() {
      const response = await fetch("/api/models");
      const data = (await response.json()) as ModelRow[];
      setModels(data);
      setLoading(false);
    }

    loadModels();
  }, []);

  const best = useMemo(
    () => ({
      accuracy: Math.max(
        ...models.map((model) => model.accuracy ?? Number.NEGATIVE_INFINITY),
      ),
      latencyMs: Math.min(
        ...models.map((model) => model.latencyMs ?? Number.POSITIVE_INFINITY),
      ),
      costPer1k: Math.min(
        ...models.map((model) => model.costPer1k ?? Number.POSITIVE_INFINITY),
      ),
    }),
    [models],
  );

  const visibleModels = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return models
      .filter((model) => {
        if (!normalizedQuery) return true;
        return `${model.name} ${model.provider}`
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .sort((a, b) => compareNullable(a[sortKey], b[sortKey], direction));
  }, [direction, models, query, sortKey]);

  function handleSort(nextKey: SortKey) {
    if (nextKey === sortKey) {
      setDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(nextKey);
    setDirection(nextKey === "accuracy" || nextKey === "evaluatedAt" ? "desc" : "asc");
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-ink">Model Leaderboard</h2>
          <p className="mt-1 text-sm text-ink/65">
            Sort metrics with missing values kept at the bottom.
          </p>
        </div>
        <label className="relative block w-full max-w-md">
          <span className="sr-only">Find a model</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/45" />
          <input
            className="min-h-11 w-full rounded-lg border border-ink/10 bg-white py-2 pl-10 pr-3 text-sm text-ink shadow-sm placeholder:text-ink/40"
            placeholder="Search model or provider"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["accuracy", "latencyMs", "costPer1k", "evaluatedAt"] as SortKey[]).map(
          (key) => (
            <SortButton
              key={key}
              sortKey={key}
              activeKey={sortKey}
              direction={direction}
              onClick={handleSort}
            />
          ),
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-left text-sm">
            <thead className="bg-field text-xs uppercase text-ink/60">
              <tr>
                <th className="px-5 py-4 font-semibold">Model</th>
                <th className="px-5 py-4 font-semibold">Provider</th>
                <th className="px-5 py-4 font-semibold">Accuracy</th>
                <th className="px-5 py-4 font-semibold">Latency</th>
                <th className="px-5 py-4 font-semibold">Cost / 1k</th>
                <th className="px-5 py-4 font-semibold">Evaluated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {loading ? (
                <tr>
                  <td className="px-5 py-8 text-center text-ink/60" colSpan={6}>
                    Loading model evaluations...
                  </td>
                </tr>
              ) : (
                visibleModels.map((model) => (
                  <tr key={model.id} className="bg-white transition hover:bg-mist/70">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-ink">{model.name}</div>
                    </td>
                    <td className="px-5 py-4 text-ink/70">{model.provider}</td>
                    <td className="px-5 py-4">
                      <MetricCell
                        value={formatAccuracy(model.accuracy)}
                        tone={model.accuracy === null ? "muted" : "good"}
                        badge={model.accuracy === best.accuracy ? "Best accuracy" : undefined}
                      />
                    </td>
                    <td className="px-5 py-4">
                      <MetricCell
                        value={
                          model.latencyMs === null ? "Unknown" : `${model.latencyMs} ms`
                        }
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
                    <td className="px-5 py-4 text-ink/70">
                      {formatDate(model.evaluatedAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCell({
  value,
  tone,
  badge,
}: {
  value: string;
  tone: "good" | "neutral" | "muted" | "warn";
  badge?: string;
}) {
  const color = {
    good: "text-moss",
    neutral: "text-ink",
    muted: "text-ink/45",
    warn: "text-coral",
  }[tone];

  return (
    <div className="flex flex-col gap-1">
      <span className={`font-semibold ${color}`}>{value}</span>
      {badge ? (
        <span className="inline-flex w-fit items-center gap-1 rounded-md bg-gold/15 px-2 py-1 text-xs font-semibold text-ink">
          <Sparkles className="h-3 w-3" aria-hidden="true" />
          {badge}
        </span>
      ) : null}
    </div>
  );
}
