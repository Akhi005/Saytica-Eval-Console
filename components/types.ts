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
