"use client";

import { Priority } from "@/app/types";
import { useState } from "react";
import { List } from "../list";
import { useProjects } from "@/app/context/project";
import { useTask } from "@/app/context/task";

export const Form = ({}) => {
  const { projects, createProject, selectedProjectId, setSelectedProjectId } =
    useProjects();

  const { createTask } = useTask();

  const [priority, setPriority] = useState<Priority>("MEDIUM");

  const [isCreatingProject, setIsCreatingProject] = useState(false);

  const handleCreateProject = async (formData: FormData) => {
    await createProject(formData);
    setIsCreatingProject(false);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              {isCreatingProject ? "Новый проект" : "Выбор проекта"}
            </h2>
            <button
              type="button"
              onClick={() => setIsCreatingProject(!isCreatingProject)}
              className="text-xs text-blue-400 hover:text-blue-300 underline cursor-pointer"
            >
              {isCreatingProject ? "К выбору проектов" : "+ Создать проект"}
            </button>
          </div>

          {isCreatingProject ? (
            <form
              action={handleCreateProject}
              className="flex gap-2 items-center"
            >
              <input
                type="text"
                name="title"
                placeholder="Название проекта"
                required
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
              />
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-500 text-white font-medium px-5 py-2 h-[40px] rounded-lg transition active:scale-95 flex items-center justify-center text-sm"
              >
                Создать
              </button>
            </form>
          ) : (
            <div className="w-full">
              {projects.length > 0 ? (
                <div className="relative w-full group">
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    /* Добавили appearance-none (скрыть старую стрелку) и pr-10 (отступ справа) */
                    className="w-full appearance-none bg-slate-950 border border-slate-700 rounded-lg px-4 pr-10 py-2 text-slate-200 focus:outline-none focus:border-blue-500 transition cursor-pointer"
                  >
                    {projects.map((proj) => (
                      <option
                        key={proj.id}
                        value={proj.id}
                        className="bg-slate-950 text-slate-200"
                      >
                        {proj.title}
                      </option>
                    ))}
                  </select>

                  {/* Кастомная SVG стрелочка, спозиционированная идеально ровно */}
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              ) : (
                <p className="text-amber-400 bg-amber-950/30 border border-amber-900 p-3 rounded-lg text-sm">
                  ⚠ Нет доступных проектов. Создайте первый проект.
                </p>
              )}
            </div>
          )}
        </div>

        {projects.length > 0 && !isCreatingProject ? (
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl space-y-4">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Быстрое добавление задачи
            </h2>
            <form
              action={(formData) => createTask(formData)}
              className="flex gap-2 items-center"
            >
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
                    <button
                      type="button"
                      disabled={priority === "HIGH"}
                      onClick={() => setPriority("HIGH")}
                      className={`w-full text-center text-[11px] px-2 py-1 rounded font-bold uppercase tracking-wider transition block ${
                        priority === "HIGH"
                          ? "bg-rose-500/20 text-rose-400/40 border border-rose-500/10 cursor-not-allowed"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 hover:brightness-110 active:scale-95"
                      }`}
                    >
                      HIGH
                    </button>
                    <button
                      type="button"
                      disabled={priority === "MEDIUM"}
                      onClick={() => setPriority("MEDIUM")}
                      className={`w-full text-center text-[11px] px-2 py-1 rounded font-bold uppercase tracking-wider transition block ${
                        priority === "MEDIUM"
                          ? "bg-blue-500/20 text-blue-400/40 border border-blue-500/10 cursor-not-allowed"
                          : "bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 hover:brightness-110 active:scale-95"
                      }`}
                    >
                      MEDIUM
                    </button>
                    <button
                      type="button"
                      disabled={priority === "LOW"}
                      onClick={() => setPriority("LOW")}
                      className={`w-full text-center text-[11px] px-2 py-1 rounded font-bold uppercase tracking-wider transition block ${
                        priority === "LOW"
                          ? "bg-slate-700/40 text-slate-400/40 border border-slate-700/20 cursor-not-allowed"
                          : "bg-slate-700/50 text-slate-400 border border-slate-700 hover:bg-slate-700/80 hover:brightness-110 active:scale-95"
                      }`}
                    >
                      LOW
                    </button>
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
        ) : null}
      </div>

      <List />
    </>
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
