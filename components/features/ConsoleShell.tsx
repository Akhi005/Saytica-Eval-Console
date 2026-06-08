import { readModels, readTasks } from "@/lib/data";
import ConsoleShellClient from "../ConsoleShellClient";

export default async function ConsoleShell() {
  const [models, tasks] = await Promise.all([readModels(), readTasks()]);

  return <ConsoleShellClient initialModels={models} initialTasks={tasks} />;
}
