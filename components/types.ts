export type { ModelRow, TaskRow, TaskStatus } from "@/lib/data";

export type SortKey = "accuracy" | "latencyMs" | "costPer1k" | "evaluatedAt";
export type SortDirection = "asc" | "desc";
export const sortLabels: Record<SortKey, string> = {
  accuracy: "Accuracy",
  latencyMs: "Latency",
  costPer1k: "Cost",
  evaluatedAt: "Evaluated",
};