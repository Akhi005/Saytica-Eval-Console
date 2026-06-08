import { NextResponse } from "next/server";
import { isTaskStatus, updateTaskStatus } from "@/lib/data";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = (await request.json()) as { status?: unknown };

  if (!isTaskStatus(body.status)) {
    return NextResponse.json(
      { error: "Status must be pending, in_progress, or done." },
      { status: 400 },
    );
  }

  const task = await updateTaskStatus(id, body.status);

  if (!task) {
    return NextResponse.json({ error: "Task not found." }, { status: 404 });
  }

  return NextResponse.json(task);
}
