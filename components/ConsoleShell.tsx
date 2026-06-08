"use client";

import { BarChart3, ClipboardList } from "lucide-react";
import { useState } from "react";
import ModelLeaderboard from "@/components/ModelLeaderboard";
import TaskBoard from "@/components/TaskBoard";

type ActiveView = "leaderboard" | "tasks";

export default function ConsoleShell() {
  const [activeView, setActiveView] = useState<ActiveView>("leaderboard");

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-5 border-b border-ink/10 pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-moss">
            Saytica
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal text-ink sm:text-4xl">
            Eval Console
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/70">
            Compare AI model evaluations and review annotation work from the
            same operational dashboard.
          </p>
        </div>

        <div className="grid grid-cols-2 rounded-lg border border-ink/10 bg-white p-1 shadow-sm">
          <button
            className={`flex min-h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition ${
              activeView === "leaderboard"
                ? "bg-ink text-white shadow-sm"
                : "text-ink/70 hover:bg-field"
            }`}
            type="button"
            onClick={() => setActiveView("leaderboard")}
          >
            <BarChart3 className="h-4 w-4" aria-hidden="true" />
            Leaderboard
          </button>
          <button
            className={`flex min-h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition ${
              activeView === "tasks"
                ? "bg-ink text-white shadow-sm"
                : "text-ink/70 hover:bg-field"
            }`}
            type="button"
            onClick={() => setActiveView("tasks")}
          >
            <ClipboardList className="h-4 w-4" aria-hidden="true" />
            Task Board
          </button>
        </div>
      </header>

      <section className="flex-1 py-6">
        {activeView === "leaderboard" ? <ModelLeaderboard /> : <TaskBoard />}
      </section>
    </main>
  );
}
