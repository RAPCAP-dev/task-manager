"use client";

import { ProjectMemberWithUser } from "@/app/types";

interface TaskAssigneeSelectorProps {
  isOpen: boolean;
  onToggle: () => void;
  assigned: ProjectMemberWithUser["user"] | undefined;
  members: ProjectMemberWithUser[];
  onSelect: (userId: string | null) => void;
}

export const TaskAssigneeSelector = ({
  isOpen,
  onToggle,
  assigned,
  members,
  onSelect,
}: TaskAssigneeSelectorProps) => {
  return (
    <>
      <div
        onClick={onToggle}
        className="text-xs px-2 py-1 rounded font-medium border border-slate-700/60 bg-slate-800/40 text-slate-400 hover:text-slate-300 hover:border-slate-600 cursor-pointer transition select-none min-w-[90px] text-center"
      >
        {assigned ? (
          <>
            <div className="text-right w-full">{assigned.name}</div>
            <div className="text-right w-full opacity-60">{assigned.email}</div>
          </>
        ) : (
          <div className="text-center w-full italic opacity-60">
            Не назначено
          </div>
        )}
      </div>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 min-w-[150px] z-[999] bg-[#0f172a] border border-slate-700 p-1.5 rounded-lg shadow-2xl space-y-1 backdrop-blur-md">
          {members.map(({ user }) => (
            <button
              key={user.id}
              onClick={() => onSelect(user.id)}
              className="w-full text-right text-[11px] px-2 py-1.5 rounded text-slate-300 hover:bg-slate-800 transition"
            >
              <div>{user.name}</div>
              <div>{user.email}</div>
            </button>
          ))}

          <button
            onClick={() => onSelect(null)}
            className="w-full text-right text-[11px] px-2 py-1.5 rounded text-rose-400 hover:bg-rose-500/10 transition border-t border-slate-800 mt-1 pt-1"
          >
            Сбросить
          </button>
        </div>
      )}
    </>
  );
};
