import { sortLabels, type SortDirection, type SortKey } from "@/components/types";
import { cn } from "@/lib/cn";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

export function SortButton({
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
  const Icon = !isActive ? ChevronsUpDown : direction === "asc" ? ArrowUp : ArrowDown;

  return (
    <button
      type="button"
      aria-pressed={isActive}
      className={cn(
        "inline-flex min-h-9 items-center justify-center gap-2 rounded-full border px-3.5 text-sm font-semibold transition duration-200",
        isActive
          ? "border-accent bg-accent text-white shadow-sm shadow-accent/25"
          : "border-ink/10 bg-white text-ink/70 hover:border-accent/30 hover:bg-field",
      )}
      onClick={() => onClick(sortKey)}
    >
      {sortLabels[sortKey]}
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}