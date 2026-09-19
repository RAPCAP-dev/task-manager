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
  const getInitials = (name: string | null | undefined) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  };

  return (
    <div className="relative group">
      <div
        onClick={onToggle}
        className="text-[11px] w-5 h-5 flex items-center justify-center rounded font-bold border border-slate-700/60 bg-slate-800/40 text-slate-400 hover:text-slate-300 hover:border-slate-600 cursor-pointer transition select-none shrink-0"
      >
        {assigned ? getInitials(assigned.name) : "—"}
      </div>

      {!isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-max max-w-xs p-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-[1000] text-xs text-slate-300 whitespace-nowrap">
          {assigned ? (
            <div className="flex flex-col gap-0.5">
              <span className="font-medium">
                {assigned.name || "Без имени"}
              </span>
              <span className="text-[10px] text-slate-500">
                {assigned.email}
              </span>
            </div>
          ) : (
            <span className="italic opacity-50">Не назначено</span>
          )}
        </div>
      )}

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 min-w-[150px] z-[999] bg-[#0f172a] border border-slate-700 p-1 rounded-lg shadow-2xl space-y-1 backdrop-blur-md">
          {members.map(({ user }) => (
            <button
              key={user.id}
              onClick={() => onSelect(user.id)}
              className="w-full text-left text-[11px] px-2 py-1 rounded text-slate-300 hover:bg-slate-800 transition"
            >
              <div className="font-medium truncate">{user.name}</div>
              <div className="text-[10px] text-slate-500 truncate">
                {user.email}
              </div>
            </button>
          ))}

          <button
            onClick={() => onSelect(null)}
            className="w-full text-left text-[11px] px-2 py-1 rounded text-rose-400 hover:bg-rose-500/10 transition border-t border-slate-800 mt-1 pt-1"
          >
            Сбросить
          </button>
        </div>
      )}
    </div>
  );
};
