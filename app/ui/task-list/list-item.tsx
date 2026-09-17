"use client";

import { startTransition } from "react";
import { Priority, Task } from "@/app/types";

export const ListItem = ({
  task,
  toggleTask,
  updateTaskPriority,
}: {
  task: Task;
  toggleTask: (taskId: string) => Promise<void>;
  updateTaskPriority: (taskId: string, newPriority: Priority) => Promise<void>;
}) => (
  <div
    key={task.id}
    className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-800 rounded-xl hover:border-slate-700 transition group"
  >
    <div className="flex items-center gap-3">
      <div
        className={`w-5 h-5 rounded-md border flex items-center justify-center text-xs ${
          task.status === "DONE"
            ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
            : "border-slate-600"
        }`}
        onClick={() => {
          startTransition(async () => {
            await toggleTask(task.id);
          });
        }}
      >
        {task.status === "DONE" && "✓"}
      </div>
      <span
        className={`font-medium ${task.status === "DONE" ? "line-through text-slate-500" : "text-slate-200"}`}
      >
        {task.title}
      </span>
    </div>

    <div className="relative group z-30">
      <span
        className={`text-xs px-2 py-0.5 rounded font-semibold uppercase tracking-wider cursor-pointer block text-center min-w-[75px] ${
          task.priority === "HIGH"
            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
            : task.priority === "MEDIUM"
              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
              : "bg-slate-700/50 text-slate-400 border border-slate-700"
        }`}
      >
        {task.priority}
      </span>

      <div className="absolute left-full top-0 pl-2 hidden group-hover:block min-w-[110px] z-[9999]">
        <div className="bg-[#0b0f19] border border-slate-800 p-1.5 rounded-lg shadow-2xl space-y-1 relative z-[9999] opacity-100">
          <button
            onClick={() => {
              startTransition(async () => {
                await updateTaskPriority(task.id, "HIGH");
              });
            }}
            disabled={task.priority === "HIGH"}
            className={`w-full text-center text-[11px] px-2 py-1 rounded font-bold uppercase tracking-wider transition block ${
              task.priority === "HIGH"
                ? "bg-rose-500/20 text-rose-400/40 border border-rose-500/10 cursor-not-allowed"
                : "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 hover:brightness-110 active:scale-95"
            }`}
          >
            HIGH
          </button>

          <button
            onClick={() => {
              startTransition(async () => {
                await updateTaskPriority(task.id, "MEDIUM");
              });
            }}
            disabled={task.priority === "MEDIUM"}
            className={`w-full text-center text-[11px] px-2 py-1 rounded font-bold uppercase tracking-wider transition block ${
              task.priority === "MEDIUM"
                ? "bg-blue-500/20 text-blue-400/40 border border-blue-500/10 cursor-not-allowed"
                : "bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 hover:brightness-110 active:scale-95"
            }`}
          >
            MEDIUM
          </button>

          <button
            onClick={() => {
              startTransition(async () => {
                await updateTaskPriority(task.id, "LOW");
              });
            }}
            disabled={task.priority === "LOW"}
            className={`w-full text-center text-[11px] px-2 py-1 rounded font-bold uppercase tracking-wider transition block ${
              task.priority === "LOW"
                ? "bg-slate-700/40 text-slate-400/40 border border-slate-700/20 cursor-not-allowed"
                : "bg-slate-700/50 text-slate-400 border border-slate-700 hover:bg-slate-700/80 hover:brightness-110 active:scale-95"
            }`}
          >
            LOW
          </button>
        </div>
      </div>
    </div>
  </div>
);
