"use client";

import {
  CheckCircle2,
  CircleDot,
  Clock3,
  Lock,
  PanelRight,
  RefreshCw,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { StatusDropdown } from "@/components/ui/StatusDropdown";
import { cn } from "@/lib/cn";
import type { TaskRow, TaskStatus } from "@/lib/data";
import {
  getStatusCounts,
  STATUS_ACCENT_STYLES,
  STATUS_LABELS,
  TASK_STATUSES,
} from "@/lib/task-status";

type Role = "annotator" | "client";

const CURRENT_ANNOTATOR = "u_annotator";
const CURRENT_CLIENT = "c1";

const roleOptions = [
  {
    value: "annotator" as const,
    label: "Annotator",
    icon: <UserRound className="h-4 w-4" aria-hidden="true" />,
  },
  {
    value: "client" as const,
    label: "Client",
    icon: <Lock className="h-4 w-4" aria-hidden="true" />,
  },
];

export default function TaskBoard({ initialTasks }: { initialTasks?: TaskRow[] }) {
  const [role, setRole] = useState<Role>("annotator");
  const [tasks, setTasks] = useState<TaskRow[]>(initialTasks ?? []);
  const [loading, setLoading] = useState(!initialTasks);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    if (initialTasks) return;
    loadTasks();
  }, [initialTasks]);

  async function loadTasks() {
    setLoading(true);
    try {
      const response = await fetch("/api/tasks");
      if (!response.ok) return;
      const data = (await response.json()) as TaskRow[];
      setTasks(data);
    } finally {
      setLoading(false);
    }
  }

  async function updateTaskStatus(taskId: string, status: TaskStatus) {
    setSavingId(taskId);
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setTasks((current) =>
          current.map((item) => (item.id === taskId ? { ...item, status } : item)),
        );
      }
    } finally {
      setSavingId(null);
    }
  }

  const annotatorTasks = useMemo(
    () => tasks.filter((task) => task.assignedTo === CURRENT_ANNOTATOR),
    [tasks],
  );

  const clientTasks = useMemo(
    () => tasks.filter((task) => task.clientId === CURRENT_CLIENT),
    [tasks],
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Tasks"
        description="View and update annotation task status."
        action={
          <SegmentedControl
            options={roleOptions}
            value={role}
            onChange={setRole}
            aria-label="Switch between annotator and client view"
          />
        }
      />

      {role === "annotator" ? (
        <AnnotatorView
          tasks={annotatorTasks}
          loading={loading}
          savingId={savingId}
          onStatusChange={updateTaskStatus}
          onRefresh={loadTasks}
        />
      ) : (
        <ClientView tasks={clientTasks} loading={loading} />
      )}
    </div>
  );
}

function AnnotatorView({
  tasks,
  loading,
  savingId,
  onStatusChange,
  onRefresh,
}: {
  tasks: TaskRow[];
  loading: boolean;
  savingId: string | null;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onRefresh: () => void;
}) {
  const counts = useMemo(() => getStatusCounts(tasks), [tasks]);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        {TASK_STATUSES.map((status) => (
          <StatusCountCard key={status} status={status} count={counts[status]} />
        ))}
      </div>

      <Card variant="elevated" padding="none" className="overflow-hidden">
        <CardHeader>
          <div>
            <h3 className="font-bold text-ink">Assigned tasks</h3>
            <p className="mt-1 text-sm text-ink/55">{tasks.length} tasks in queue</p>
          </div>
          <button
            type="button"
            className="inline-flex min-h-9 items-center justify-center gap-2 rounded-xl border border-ink/10 bg-white px-3.5 text-sm font-semibold text-ink/70 shadow-sm transition hover:border-accent/20 hover:bg-field hover:text-ink"
            onClick={onRefresh}
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Refresh
          </button>
        </CardHeader>

        {loading ? (
          <div className="p-8 text-center text-sm text-ink/55">Loading assigned tasks…</div>
        ) : tasks.length === 0 ? (
          <div className="p-8 text-center text-sm text-ink/55">No tasks in your queue.</div>
        ) : (
          <div className="divide-y divide-ink/8">
            {tasks.map((task) => (
              <article
                key={task.id}
                className="grid gap-4 px-5 py-4 transition duration-150 hover:bg-accent/[0.03] md:grid-cols-[1fr_auto] md:items-center"
              >
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-ink">{task.title}</h3>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-ink/55">
                    <span>{task.projectName}</span>
                    <span className="h-1 w-1 rounded-full bg-ink/25" aria-hidden="true" />
                    <span className="font-mono text-xs">{task.id}</span>
                  </div>
                </div>
                <StatusDropdown
                  value={task.status}
                  saving={savingId === task.id}
                  ariaLabel={`Status for ${task.title}`}
                  onChange={(status) => {
                    if (status !== task.status) onStatusChange(task.id, status);
                  }}
                />
              </article>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function ClientView({ tasks, loading }: { tasks: TaskRow[]; loading: boolean }) {
  const summary = useMemo(() => {
    const counts = getStatusCounts(tasks);
    const total = tasks.length;
    const progress = total === 0 ? 0 : Math.round((counts.done / total) * 100);
    const projects = Array.from(
      tasks.reduce((map, task) => {
        const rows = map.get(task.projectName) ?? [];
        rows.push(task);
        map.set(task.projectName, rows);
        return map;
      }, new Map<string, TaskRow[]>()),
    );

    return { counts, progress, projects, total };
  }, [tasks]);

  if (loading) {
    return (
      <Card padding="md" className="text-center text-sm text-ink/55">
        Loading client summary…
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4">
        <ClientOverviewCard
          progress={summary.progress}
          done={summary.counts.done}
          total={summary.total}
          remaining={summary.total - summary.counts.done}
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {TASK_STATUSES.map((status) => (
            <StatusCountCard key={status} status={status} count={summary.counts[status]} />
          ))}
        </div>
      </div>

      <Card variant="elevated" padding="none" className="overflow-hidden">
        <CardHeader>
          <div>
            <h3 className="font-bold text-ink">Project task summary</h3>
            <p className="mt-1 text-sm text-ink/55">Actions are disabled for clients.</p>
          </div>
          <Badge variant="default" className="gap-1.5">
            <PanelRight className="h-3.5 w-3.5" aria-hidden="true" />
            Read only
          </Badge>
        </CardHeader>

        <div className="divide-y divide-ink/8">
          {summary.projects.map(([projectName, rows]) => (
            <div key={projectName} className="p-5">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <h4 className="font-semibold text-ink">{projectName}</h4>
                <span className="text-sm text-ink/55">{rows.length} tasks</span>
              </div>
              <div className="mt-3 grid gap-2">
                {rows.map((task) => (
                  <div
                    key={task.id}
                    className="grid gap-2 rounded-xl border border-ink/8 bg-field/50 px-4 py-3 transition hover:border-accent/15 hover:bg-white sm:grid-cols-[1fr_auto] sm:items-center"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">{task.title}</p>
                      <p className="mt-0.5 text-xs text-ink/50">
                        {task.assignedTo ?? "Unassigned"} · {task.id}
                      </p>
                    </div>
                    <StatusDropdown
                      value={task.status}
                      disabled
                      ariaLabel={`Status for ${task.title}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ClientOverviewCard({
  progress,
  done,
  total,
  remaining,
}: {
  progress: number;
  done: number;
  total: number;
  remaining: number;
}) {
  const size = 112;
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <Card className="relative overflow-hidden border-accent/15 bg-gradient-to-br from-white via-white to-accent/[0.05] p-0">
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-violet/12 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:gap-8 sm:p-6">
        <div
          className="relative mx-auto shrink-0 sm:mx-0"
          style={{ width: size, height: size }}
          role="img"
          aria-label={`${progress}% complete, ${done} of ${total} tasks done`}
        >
          <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={stroke}
              className="text-field"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="text-accent transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-extrabold tracking-tight text-ink">{progress}%</span>
          </div>
        </div>

        <div className="min-w-0 flex-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Client overview
          </div>
          <p className="mt-3 text-xl font-bold text-ink sm:text-2xl">
            {done} of {total} tasks complete
          </p>
          <p className="mt-1.5 text-sm text-ink/55">
            Project Atlas · client <span className="font-mono text-xs">c1</span>
            {remaining > 0 ? (
              <span className="text-ink/40"> · {remaining} remaining</span>
            ) : null}
          </p>
        </div>
      </div>
    </Card>
  );
}

function StatusCountCard({ status, count }: { status: TaskStatus; count: number }) {
  const accent = STATUS_ACCENT_STYLES[status];

  return (
    <section
      className={cn(
        "flex items-center gap-3 rounded-xl border border-ink/10 border-l-4 bg-gradient-to-r p-4 shadow-sm",
        accent.border,
        accent.bg,
      )}
    >
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
          accent.icon,
        )}
      >
        <StatusIcon status={status} />
      </span>
      <div className="min-w-0">
        <p className="text-xl font-bold leading-none text-ink">{count}</p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-ink/45">
          {STATUS_LABELS[status]}
        </p>
      </div>
    </section>
  );
}

function StatusIcon({ status }: { status: TaskStatus }) {
  const iconClass = "h-5 w-5";

  if (status === "done") {
    return <CheckCircle2 className={cn(iconClass, "text-accent")} aria-hidden="true" />;
  }
  if (status === "in_progress") {
    return <Clock3 className={cn(iconClass, "text-gold")} aria-hidden="true" />;
  }
  return <CircleDot className={cn(iconClass, "text-coral")} aria-hidden="true" />;
}
