"use client";

import {
  CheckCircle2,
  CircleDot,
  Clock3,
  Lock,
  MoveRight,
  RefreshCw,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { TaskRow, TaskStatus } from "@/components/types";

type Role = "annotator" | "client";

const CURRENT_ANNOTATOR = "u_annotator";
const CURRENT_CLIENT = "c1";

const statusLabels: Record<TaskStatus, string> = {
  pending: "Pending",
  in_progress: "In progress",
  done: "Done",
};

const statusStyles: Record<TaskStatus, string> = {
  pending: "bg-coral/10 text-coral",
  in_progress: "bg-gold/15 text-ink",
  done: "bg-moss/12 text-moss",
};

const nextStatus: Record<TaskStatus, TaskStatus> = {
  pending: "in_progress",
  in_progress: "done",
  done: "done",
};

export default function TaskBoard() {
  const [role, setRole] = useState<Role>("annotator");
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setLoading(true);
    const response = await fetch("/api/tasks");
    const data = (await response.json()) as TaskRow[];
    setTasks(data);
    setLoading(false);
  }

  async function advanceTask(task: TaskRow) {
    const status = nextStatus[task.status];
    if (status === task.status) return;

    setSavingId(task.id);
    const response = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (response.ok) {
      setTasks((current) =>
        current.map((item) => (item.id === task.id ? { ...item, status } : item)),
      );
    }

    setSavingId(null);
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
    <div className="space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-ink">Task Board</h2>
          <p className="mt-1 text-sm text-ink/65">
            Switch roles to compare editable annotation work with a read-only
            client summary.
          </p>
        </div>

        <div className="grid grid-cols-2 rounded-lg border border-ink/10 bg-white p-1 shadow-sm">
          <button
            className={`flex min-h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition ${
              role === "annotator"
                ? "bg-ink text-white"
                : "text-ink/70 hover:bg-field"
            }`}
            type="button"
            onClick={() => setRole("annotator")}
          >
            <UserRound className="h-4 w-4" aria-hidden="true" />
            Annotator
          </button>
          <button
            className={`flex min-h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition ${
              role === "client" ? "bg-ink text-white" : "text-ink/70 hover:bg-field"
            }`}
            type="button"
            onClick={() => setRole("client")}
          >
            <Lock className="h-4 w-4" aria-hidden="true" />
            Client
          </button>
        </div>
      </div>

      {role === "annotator" ? (
        <AnnotatorView
          tasks={annotatorTasks}
          loading={loading}
          savingId={savingId}
          onAdvance={advanceTask}
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
  onAdvance,
  onRefresh,
}: {
  tasks: TaskRow[];
  loading: boolean;
  savingId: string | null;
  onAdvance: (task: TaskRow) => void;
  onRefresh: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-lg border border-ink/10 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">
            Assigned to `u_annotator`
          </p>
          <p className="mt-1 text-sm text-ink/60">
            Move each task forward through pending, in progress, and done.
          </p>
        </div>
        <button
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-ink/10 px-4 text-sm font-semibold text-ink/70 transition hover:bg-field"
          type="button"
          onClick={onRefresh}
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Refresh
        </button>
      </div>

      <div className="grid gap-3">
        {loading ? (
          <div className="rounded-lg border border-ink/10 bg-white p-6 text-sm text-ink/60">
            Loading assigned tasks...
          </div>
        ) : (
          tasks.map((task) => (
            <article
              key={task.id}
              className="grid gap-4 rounded-lg border border-ink/10 bg-white p-4 shadow-sm md:grid-cols-[1fr_auto] md:items-center"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-semibold text-ink">{task.title}</h3>
                  <StatusBadge status={task.status} />
                </div>
                <p className="mt-2 text-sm text-ink/60">{task.projectName}</p>
              </div>
              <button
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-moss px-4 text-sm font-semibold text-white transition hover:bg-moss/90 disabled:cursor-not-allowed disabled:bg-ink/20"
                type="button"
                disabled={task.status === "done" || savingId === task.id}
                onClick={() => onAdvance(task)}
              >
                {task.status === "done" ? "Complete" : statusLabels[nextStatus[task.status]]}
                <MoveRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

function ClientView({ tasks, loading }: { tasks: TaskRow[]; loading: boolean }) {
  const summary = useMemo(() => {
    const counts = {
      pending: 0,
      in_progress: 0,
      done: 0,
    } satisfies Record<TaskStatus, number>;

    for (const task of tasks) {
      counts[task.status] += 1;
    }

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
      <div className="rounded-lg border border-ink/10 bg-white p-6 text-sm text-ink/60">
        Loading client summary...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-ink/60">Project Atlas</p>
              <h3 className="mt-1 text-2xl font-semibold text-ink">
                {summary.progress}% complete
              </h3>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-moss/12 text-lg font-semibold text-moss">
              {summary.counts.done}/{summary.total}
            </div>
          </div>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-field">
            <div
              className="h-full rounded-full bg-moss transition-all"
              style={{ width: `${summary.progress}%` }}
            />
          </div>
        </section>

        <section className="grid grid-cols-3 gap-3">
          {(["pending", "in_progress", "done"] as TaskStatus[]).map((status) => (
            <div
              key={status}
              className="rounded-lg border border-ink/10 bg-white p-4 shadow-sm"
            >
              <StatusIcon status={status} />
              <p className="mt-3 text-2xl font-semibold text-ink">
                {summary.counts[status]}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase text-ink/55">
                {statusLabels[status]}
              </p>
            </div>
          ))}
        </section>
      </div>

      <section className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-soft">
        <div className="border-b border-ink/10 bg-field px-5 py-4">
          <h3 className="font-semibold text-ink">Read-only project tasks</h3>
        </div>
        <div className="divide-y divide-ink/10">
          {summary.projects.map(([projectName, rows]) => (
            <div key={projectName} className="p-5">
              <h4 className="font-semibold text-ink">{projectName}</h4>
              <div className="mt-3 grid gap-2">
                {rows.map((task) => (
                  <div
                    key={task.id}
                    className="flex flex-col gap-2 rounded-md bg-mist px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-ink">{task.title}</p>
                      <p className="mt-1 text-xs text-ink/55">
                        {task.assignedTo ?? "Unassigned"}
                      </p>
                    </div>
                    <StatusBadge status={task.status} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span
      className={`inline-flex w-fit items-center rounded-md px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}

function StatusIcon({ status }: { status: TaskStatus }) {
  const iconClass = "h-5 w-5";

  if (status === "done") {
    return <CheckCircle2 className={`${iconClass} text-moss`} aria-hidden="true" />;
  }

  if (status === "in_progress") {
    return <Clock3 className={`${iconClass} text-gold`} aria-hidden="true" />;
  }

  return <CircleDot className={`${iconClass} text-coral`} aria-hidden="true" />;
}
