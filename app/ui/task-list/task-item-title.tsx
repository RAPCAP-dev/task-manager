import { useState } from "react";
import { Task } from "@/prisma/generated";

interface TaskItemTitleProps {
  task: Task;
  onClickStatus: () => void;
  updateTitle: (title: string) => void;
}

export const TaskItemTitle = ({
  task,
  onClickStatus,
  updateTitle,
}: TaskItemTitleProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);

  const handleSave = () => {
    if (title.trim() && title !== task.title) {
      updateTitle(title.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(task.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") handleCancel();
  };

  return (
    <div className="flex items-center gap-3 flex-1 min-w-0 mr-3">
      <div
        className={`w-5 h-5 rounded-md border flex items-center justify-center text-xs cursor-pointer select-none shrink-0 ${
          task.status === "DONE"
            ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
            : "border-slate-600 hover:border-slate-500"
        }`}
        onClick={onClickStatus}
      >
        {task.status === "DONE" && "✓"}
      </div>

      {isEditing ? (
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleCancel}
            className="flex-1 bg-slate-800 border border-slate-600 rounded px-2 py-0.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 min-w-0"
            autoFocus
          />
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleSave}
            className="w-6 h-6 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/10 rounded transition-colors shrink-0"
          >
            ✓
          </button>
        </div>
      ) : (
        <div className="flex-1 min-w-0 overflow-x-auto scrollbar-none select-none">
          <span
            onClick={() => setIsEditing(true)}
            className={`font-medium whitespace-nowrap cursor-pointer hover:text-slate-100 block pr-4 ${
              task.status === "DONE"
                ? "line-through text-slate-500"
                : "text-slate-200"
            }`}
          >
            {task.title}
          </span>
        </div>
      )}
    </div>
  );
};
