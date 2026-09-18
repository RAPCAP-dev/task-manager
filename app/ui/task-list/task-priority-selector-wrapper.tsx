"use client";

import { Priority } from "@/app/types";
import { PrioritySelector } from "../priority-selector";

interface TaskPrioritySelectorWrapperProps {
  isOpen: boolean;
  onToggle: () => void;
  priority: Priority;
  onChangePriority: (newPriority: Priority) => void;
}

export const TaskPrioritySelectorWrapper = ({
  isOpen,
  onToggle,
  priority,
  onChangePriority,
}: TaskPrioritySelectorWrapperProps) => {
  return (
    <>
      <span
        onClick={onToggle}
        className={`text-xs px-2 py-0.5 rounded font-semibold uppercase tracking-wider cursor-pointer block text-center min-w-[75px] transition select-none ${
          priority === "HIGH"
            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20"
            : priority === "MEDIUM"
              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20"
              : "bg-slate-700/50 text-slate-400 border border-slate-700 hover:bg-slate-700/80"
        }`}
      >
        {priority}
      </span>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 min-w-[110px] z-[999] bg-[#0f172a] border border-slate-700 p-1.5 rounded-lg shadow-2xl space-y-1 backdrop-blur-md">
          <PrioritySelector value={priority} onChange={onChangePriority} />
        </div>
      )}
    </>
  );
};
