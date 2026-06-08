import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { STATUS_DROPDOWN_STYLES, STATUS_LABELS, TASK_STATUSES } from "@/lib/task-status";
import type { TaskStatus } from "@/lib/data";

type StatusDropdownProps = {
  value: TaskStatus;
  onChange?: (status: TaskStatus) => void;
  disabled?: boolean;
  saving?: boolean;
  id?: string;
  ariaLabel?: string;
};

export function StatusDropdown({
  value,
  onChange,
  disabled = false,
  saving = false,
  id,
  ariaLabel = "Task status",
}: StatusDropdownProps) {
  const isInteractive = !disabled && !saving && Boolean(onChange);

  return (
    <div className="relative w-full min-w-[10.5rem] sm:w-auto">
      <select
        id={id}
        value={value}
        disabled={!isInteractive}
        aria-label={ariaLabel}
        className={cn(
          "w-full appearance-none rounded-xl border py-2 pl-3 pr-9 text-sm font-semibold shadow-sm transition duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30",
          STATUS_DROPDOWN_STYLES[value],
          isInteractive
            ? "cursor-pointer hover:brightness-95"
            : "cursor-default opacity-80",
          saving && "animate-pulse",
        )}
        onChange={(event) => {
          const next = event.target.value;
          if (TASK_STATUSES.includes(next as TaskStatus)) {
            onChange?.(next as TaskStatus);
          }
        }}
      >
        {TASK_STATUSES.map((status) => (
          <option key={status} value={status}>
            {STATUS_LABELS[status]}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40"
        aria-hidden="true"
      />
    </div>
  );
}
