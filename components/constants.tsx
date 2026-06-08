import { BarChart3, ClipboardList } from "lucide-react";

export type ActiveView = "leaderboard" | "tasks";

export const viewOptions = [
  {
    value: "leaderboard" as const,
    label: "Leaderboard",
    icon: <BarChart3 className="h-4 w-4" aria-hidden="true" />,
  },
  {
    value: "tasks" as const,
    label: "Task Board",
    icon: <ClipboardList className="h-4 w-4" aria-hidden="true" />,
  },
];
