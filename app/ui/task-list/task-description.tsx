import React from "react";

interface TaskDescriptionButtonProps {
  task: {
    description?: string | null;
  };
  onClick: () => void;
}

export const TaskDescription: React.FC<TaskDescriptionButtonProps> = ({
  task,
  onClick,
}) => {
  const hasDescription = Boolean(task.description);

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        title={hasDescription ? "Редактировать описание" : "Добавить описание"}
        className={`flex items-center justify-center w-7 h-7 bg-transparent border-0 transition-all ${
          hasDescription
            ? "text-white opacity-100 hover:opacity-80"
            : "text-slate-400 opacity-40 hover:opacity-70"
        }`}
      >
        ℹ️
      </button>

      <div className="absolute bottom-full right-0 mb-2 w-64 p-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 text-xs text-slate-300">
        {hasDescription ? (
          <div className="whitespace-pre-wrap break-words">
            {task.description}
          </div>
        ) : (
          <span className="italic opacity-50">Нет описания</span>
        )}
      </div>
    </div>
  );
};
