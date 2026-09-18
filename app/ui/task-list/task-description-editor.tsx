"use client";

import { useState } from "react";
import { Task } from "@/app/types";

interface TaskDescriptionEditorProps {
  task: Task;
  onSave: (text: string) => Promise<void>;
  onCancel: () => void;
}

export const TaskDescriptionEditor = ({
  task,
  onSave,
  onCancel,
}: TaskDescriptionEditorProps) => {
  const [descriptionText, setDescriptionText] = useState(
    task.description || "",
  );

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between border-b border-slate-700/50 pb-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Редактирование описания задачи
        </span>
        <span className="text-xs text-slate-500 max-w-[70%] truncate italic">
          {task.title}
        </span>
      </div>

      <textarea
        value={descriptionText}
        onChange={(e) => setDescriptionText(e.target.value)}
        placeholder="Нет описания"
        className="w-full h-28 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200 placeholder:italic placeholder:opacity-50 focus:outline-none focus:border-slate-500 resize-none block"
        autoFocus
      />

      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="text-xs px-3 py-1.5 rounded-md text-slate-400 hover:bg-slate-800 transition font-medium"
        >
          Отмена
        </button>
        <button
          onClick={() => onSave(descriptionText)}
          className="text-xs px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-500 transition font-medium shadow-sm"
        >
          Сохранить
        </button>
      </div>
    </div>
  );
};
