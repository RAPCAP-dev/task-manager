import { Priority } from "@/app/types";
import React from "react";

export type PriorityType = (typeof Priority)[keyof typeof Priority];

const PRIORITY_STYLES: Record<
  PriorityType,
  { active: string; inactive: string }
> = {
  [Priority.HIGH]: {
    active:
      "bg-rose-500/20 text-rose-400/40 border border-rose-500/10 cursor-not-allowed",
    inactive:
      "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20",
  },
  [Priority.MEDIUM]: {
    active:
      "bg-blue-500/20 text-blue-400/40 border border-blue-500/10 cursor-not-allowed",
    inactive:
      "bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20",
  },
  [Priority.LOW]: {
    active:
      "bg-slate-700/40 text-slate-400/40 border border-slate-700/20 cursor-not-allowed",
    inactive:
      "bg-slate-700/50 text-slate-400 border border-slate-700 hover:bg-slate-700/80",
  },
};

const PRIORITIES = Object.values(Priority) as PriorityType[];

interface PrioritySelectorProps {
  value: PriorityType;
  onChange: (newPriority: Priority) => Promise<void>;
  disabled?: boolean;
}

export const PrioritySelector: React.FC<PrioritySelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {PRIORITIES.map((priority) => {
        const isActive = value === priority;
        const styles = PRIORITY_STYLES[priority];

        return (
          <button
            key={priority}
            type="button"
            disabled={isActive || disabled}
            onClick={() => onChange(priority)}
            className={`w-full text-center text-[11px] px-2 py-1 rounded font-bold uppercase tracking-wider transition block hover:brightness-110 active:scale-95 ${
              isActive ? styles.active : styles.inactive
            }`}
          >
            {priority}
          </button>
        );
      })}
    </div>
  );
};
