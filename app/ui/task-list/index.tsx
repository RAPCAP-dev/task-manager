"use client";

import { TaskItem } from "./task-item";
import { useTask } from "@/app/context/task";
import { SortOption, useSettings } from "@/app/context/settings";

export const TaskList = () => {
  const { tasks } = useTask();
  const { setSort, setFilter, params } = useSettings();
  const { sort, filter } = params;

  const toggleFilter = () => {
    setFilter(filter === "all" ? "my" : "all");
  };

  const toggleDateSort = () => {
    setSort(sort === "newest" ? "oldest" : "newest");
  };

  const togglePrioritySort = () => {
    const getNewSort = (): SortOption => {
      if (sort === "priority-desc") return "priority-asc";
      if (sort === "priority-asc") return "none";
      return "priority-desc";
    };
    setSort(getNewSort());
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h2 className="text-xl font-bold text-slate-200 flex items-center gap-3">
          <span>Список задач</span>
          <span className="text-xs bg-slate-800 px-2 py-1 rounded-full text-slate-400 font-mono">
            всего: {tasks.length || 0}
          </span>
        </h2>

        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleFilter}
            title={
              filter === "my"
                ? "Показывать только мои"
                : "Показывать все задачи"
            }
            className={`w-8 h-8 flex items-center justify-center rounded text-base border transition-all relative group ${
              filter === "my"
                ? "bg-indigo-950/40 border-indigo-500 text-indigo-400"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            <span>{filter === "my" ? "🙋‍♂️" : "👥"}</span>
            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-950 text-slate-200 text-[10px] px-2 py-1 rounded border border-slate-800 whitespace-nowrap z-10">
              {filter === "my" ? "Только мои" : "Все задачи"}
            </span>
          </button>

          <button
            onClick={toggleDateSort}
            title={sort === "oldest" ? "Сначала старые" : "Сначала новые"}
            className={`w-8 h-8 flex items-center justify-center rounded text-base border transition-all relative group ${
              sort === "newest" || sort === "oldest"
                ? "bg-slate-800 border-slate-600 text-slate-200"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            <span className="relative flex items-center justify-center">
              📅
              <span className="absolute -bottom-1 -right-1 text-[9px] font-bold leading-none bg-slate-950 border border-slate-700 rounded-sm px-0.5 scale-90">
                {sort === "oldest" ? "↑" : "↓"}
              </span>
            </span>
            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-950 text-slate-200 text-[10px] px-2 py-1 rounded border border-slate-800 whitespace-nowrap z-10">
              {sort === "oldest"
                ? "Дата: сначала старые"
                : "Дата: сначала новые"}
            </span>
          </button>

          <button
            onClick={togglePrioritySort}
            title={
              sort === "priority-desc"
                ? "Важные сверху"
                : sort === "priority-asc"
                  ? "Низкий приоритет сверху"
                  : "Без учета приоритета"
            }
            className={`w-8 h-8 flex items-center justify-center rounded text-base border transition-all relative group ${
              sort === "priority-desc" || sort === "priority-asc"
                ? "bg-slate-800 border-slate-600 text-slate-200"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            <span className="relative flex items-center justify-center">
              {sort === "priority-desc" && "🔥"}
              {sort === "priority-asc" && "⏳"}
              {(sort === "none" || sort === "newest" || sort === "oldest") &&
                "⚡️"}

              {sort !== "none" && sort !== "newest" && sort !== "oldest" && (
                <span className="absolute -bottom-1 -right-1 text-[9px] font-bold leading-none bg-slate-950 border border-slate-700 rounded-sm px-0.5 scale-90">
                  {sort === "priority-desc" ? "↑" : "↓"}
                </span>
              )}
            </span>
            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-950 text-slate-200 text-[10px] px-2 py-1 rounded border border-slate-800 whitespace-nowrap z-10">
              {sort === "priority-desc" && "Приоритет: важные сверху"}
              {sort === "priority-asc" && "Приоритет: легкие сверху"}
              {(sort === "none" || sort === "newest" || sort === "oldest") &&
                "Без сортировки приоритета"}
            </span>
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {tasks.length === 0 ? (
          <p className="text-slate-500 text-sm italic">Задач пока нет.</p>
        ) : (
          tasks.map((task) => <TaskItem key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
};
