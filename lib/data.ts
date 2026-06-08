import { promises as fs } from "fs";
import path from "path";

export type ModelRow = {
  id: string;
  name: string;
  provider: string;
  accuracy: number | null;
  latencyMs: number | null;
  costPer1k: number | null;
  evaluatedAt: string | null;
};

export type TaskStatus = "pending" | "in_progress" | "done";

export type TaskRow = {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  clientId: string;
  assignedTo: string | null;
  status: TaskStatus;
  originalStatus?: string;
};

type RawModel = Omit<ModelRow, "name" | "provider"> & {
  name: string | null;
  provider: string | null;
};

type RawTask = Omit<TaskRow, "status"> & {
  status: string | null;
};

const dataDir = path.join(process.cwd(), "data");
const modelsPath = path.join(dataDir, "models.json");
const tasksPath = path.join(dataDir, "tasks.json");
const statusOrder: TaskStatus[] = ["pending", "in_progress", "done"];

function titleCase(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function normalizeDate(value: string | null) {
  if (!value) return null;

  const isoDate = /^\d{4}-\d{2}-\d{2}$/;
  if (isoDate.test(value)) return value;

  const slashDate = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!slashDate) return value;

  const [, day, month, year] = slashDate;
  return `${year}-${month}-${day}`;
}

function normalizeStatus(value: string | null): TaskStatus {
  if (value === "in_progress" || value === "done" || value === "pending") {
    return value;
  }

  return "pending";
}

export function getNextStatus(status: TaskStatus) {
  const index = statusOrder.indexOf(status);
  return statusOrder[Math.min(index + 1, statusOrder.length - 1)];
}

export async function readModels(): Promise<ModelRow[]> {
  const content = await fs.readFile(modelsPath, "utf8");
  const rows = JSON.parse(content) as RawModel[];

  return rows.map((model) => ({
    id: model.id,
    name: model.name?.trim() || "Unnamed model",
    provider: titleCase(model.provider?.trim() || "Unknown"),
    accuracy: model.accuracy,
    latencyMs: model.latencyMs,
    costPer1k: model.costPer1k,
    evaluatedAt: normalizeDate(model.evaluatedAt),
  }));
}

export async function readTasks(): Promise<TaskRow[]> {
  const content = await fs.readFile(tasksPath, "utf8");
  const rows = JSON.parse(content) as RawTask[];

  return rows.map((task) => ({
    id: task.id,
    title: task.title,
    projectId: task.projectId,
    projectName: task.projectName,
    clientId: task.clientId,
    assignedTo: task.assignedTo,
    status: normalizeStatus(task.status),
    originalStatus: task.status || undefined,
  }));
}

export async function updateTaskStatus(id: string, status: TaskStatus) {
  const content = await fs.readFile(tasksPath, "utf8");
  const rows = JSON.parse(content) as RawTask[];
  const task = rows.find((row) => row.id === id);

  if (!task) return null;

  task.status = status;
  await fs.writeFile(tasksPath, `${JSON.stringify(rows, null, 2)}\n`);

  return {
    ...task,
    status,
  };
}

export function isTaskStatus(value: unknown): value is TaskStatus {
  return value === "pending" || value === "in_progress" || value === "done";
}
