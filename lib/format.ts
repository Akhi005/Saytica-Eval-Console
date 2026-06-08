import { SortDirection } from "@/components/types";

export function compareNullable(
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

export function formatAccuracy(value: number | null) {
  if (value === null) return "Not evaluated";
  return `${(value * 100).toFixed(1)}%`;
}

export function formatCurrency(value: number | null) {
  if (value === null) return "Unknown";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatDate(value: string | null) {
  if (!value) return "No date";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}