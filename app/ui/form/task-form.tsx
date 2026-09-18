import { useTask } from "@/app/context/task";
import { Priority } from "@/app/types";
import { useState } from "react";
import { PrioritySelector } from "../priority-selector";

export const TaskForm = ({}) => {
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const { createTask } = useTask();

  const submit = (formData: FormData) => {
    const title = formData.get("taskTitle") as string;
    const priority = (formData.get("taskPriority") as Priority) || "MEDIUM";
    createTask(title, priority);
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl space-y-4">
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
        Быстрое добавление задачи
      </h2>
      <form action={submit} className="flex gap-2 items-center">
        <input
          type="text"
          name="taskTitle"
          placeholder="Что нужно сделать?"
          required
          className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
        />
        <input type="hidden" name="taskPriority" value={priority} />

        <div className="relative group z-30">
          <button
            type="button"
            className={`text-xs px-3 py-2 rounded-lg font-bold uppercase tracking-wider cursor-pointer text-center min-w-[85px] transition h-[40px] flex items-center justify-center ${getPriorityStyles(priority)}`}
          >
            {priority}
          </button>
          <div className="absolute left-full top-0 pl-2 hidden group-hover:block min-w-[110px]">
            <div className="bg-[#0b0f19] border border-slate-800 p-1.5 rounded-lg shadow-2xl space-y-1 relative opacity-100">
              <PrioritySelector value={priority} onChange={setPriority} />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2 h-[40px] rounded-lg transition active:scale-95 flex items-center justify-center"
        >
          Добавить
        </button>
      </form>
    </div>
  );
};

const getPriorityStyles = (p: Priority) => {
  switch (p) {
    case "HIGH":
      return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
    case "MEDIUM":
      return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
    case "LOW":
      return "bg-slate-700/50 text-slate-400 border border-slate-700";
  }
};
