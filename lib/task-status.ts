import type { TaskRow, TaskStatus } from "@/lib/data";

export const TASK_STATUSES: TaskStatus[] = ["pending", "in_progress", "done"];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: "Pending",
  in_progress: "In progress",
  done: "Done",
};

export const STATUS_DROPDOWN_STYLES: Record<TaskStatus, string> = {
  pending: "border-coral/25 bg-coral/8 text-coral",
  in_progress: "border-gold/30 bg-gold/10 text-ink",
  done: "border-accent/25 bg-accent/8 text-accent",
};

export const STATUS_ACCENT_STYLES: Record<
  TaskStatus,
  { border: string; bg: string; icon: string }
> = {
  pending: {
    border: "border-l-coral",
    bg: "from-coral/[0.07] to-white",
    icon: "bg-coral/12 text-coral",
  },
  in_progress: {
    border: "border-l-gold",
    bg: "from-gold/[0.09] to-white",
    icon: "bg-gold/15 text-gold",
  },
  done: {
    border: "border-l-accent",
    bg: "from-accent/[0.07] to-white",
    icon: "bg-accent/12 text-accent",
  },
};

export function getStatusCounts(tasks: TaskRow[]) {
  const counts = { pending: 0, in_progress: 0, done: 0 } satisfies Record<TaskStatus, number>;
  for (const task of tasks) counts[task.status] += 1;
  return counts;
}
