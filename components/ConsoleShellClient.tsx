"use client";

import { ClipboardList, Layers, ShieldCheck } from "lucide-react";
import { ActiveView, viewOptions } from "@/components/constants";
import { useState } from "react";
import ModelLeaderboard from "@/components/features/ModelLeaderboard";
import TaskBoard from "@/components/TaskBoard";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import type { ModelRow, TaskRow } from "@/components/types";
import { StatPill } from "./ui/StatPill";

export default function ConsoleShellClient({
  initialModels,
  initialTasks
}: {
  initialModels: ModelRow[];
  initialTasks: TaskRow[];
}) {
  
  const [activeView, setActiveView] = useState<ActiveView>("leaderboard");

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="mesh-orb -left-32 top-0 h-72 w-72 bg-accent/25 animate-float" aria-hidden="true" />
      <div
        className="mesh-orb -right-24 top-32 h-64 w-64 bg-violet/20 animate-float"
        style={{ animationDelay: "-2s" }}
        aria-hidden="true"
      />
      <div
        className="mesh-orb bottom-0 left-1/3 h-56 w-56 bg-accent-light/15 animate-float"
        style={{ animationDelay: "-4s" }}
        aria-hidden="true"
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="glass-panel page-enter p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-violet text-white shadow-lg shadow-accent/25">
                <ShieldCheck className="h-7 w-7" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
                  Saytica Eval Console
                </p>
                <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-ink lg:text-4xl">
                  Model quality &amp; annotation ops
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/65">
                  Compare evaluation metrics, surface incomplete data, and track annotation
                  delivery.
                </p>
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 lg:w-auto lg:min-w-[11rem]">
              <div className="flex gap-2">
                <StatPill label="Models" value={initialModels.length} icon={<Layers className="h-4 w-4" aria-hidden="true" />} />
                <StatPill label="Tasks" value={initialTasks.length} icon={<ClipboardList className="h-4 w-4" aria-hidden="true" />} />
              </div>
              <SegmentedControl
                options={viewOptions}
                value={activeView}
                onChange={setActiveView}
                aria-label="Switch between leaderboard and task board"
                className="w-full"
              />
            </div>
          </div>
        </header>

        <section className="flex-1 py-6">
          <div
            key={activeView}
            className="card-surface page-enter shadow-soft"
            style={{ animationDelay: "0.1s" }}
          >
            {activeView === "leaderboard" ? (
              <ModelLeaderboard initialModels={initialModels} />
            ) : (
              <TaskBoard initialTasks={initialTasks} />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

