import { useMemo } from "react";
import type { ModelRow, SortDirection, SortKey } from "@/components/types";
import { compareNullable } from "@/lib/format";

export function useLeaderboard(
    models: ModelRow[],
    query: string,
    sortKey: SortKey,
    direction: SortDirection,
) {
    const best = useMemo(() => ({
        accuracy: Math.max(...models.map((m) => m.accuracy ?? Number.NEGATIVE_INFINITY)),
        latencyMs: Math.min(...models.map((m) => m.latencyMs ?? Number.POSITIVE_INFINITY)),
        costPer1k: Math.min(...models.map((m) => m.costPer1k ?? Number.POSITIVE_INFINITY)),
    }), [models]);

    const summary = useMemo(() => {
        const evaluated = models.filter((m) => m.accuracy !== null).length;
        const fastest = models.reduce<ModelRow | null>((w, m) => {
            if (m.latencyMs === null) return w;
            return !w || w.latencyMs === null || m.latencyMs < w.latencyMs ? m : w;
        }, null);
        const bestAccuracy = models.reduce<ModelRow | null>((w, m) => {
            if (m.accuracy === null) return w;
            return !w || w.accuracy === null || m.accuracy > w.accuracy ? m : w;
        }, null);
        const freeModel = models.find((m) => m.costPer1k === 0);
        return { evaluated, total: models.length, fastest, bestAccuracy, freeModel };
    }, [models]);

    const visibleModels = useMemo(() => {
        const q = query.trim().toLowerCase();
        return models
            .filter((m) => !q || `${m.name} ${m.provider}`.toLowerCase().includes(q))
            .sort((a, b) => compareNullable(a[sortKey], b[sortKey], direction));
    }, [direction, models, query, sortKey]);

    return { best, summary, visibleModels };
}