"use client";

import React from "react";
import { Priority, Task, TaskStatus } from "../types";
import { useProjects } from "./project";
import { useUser } from "./user";

export type TaskContextType = {
  createTask: (title: string, priority: Priority) => Promise<void>;
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  updateTaskPriority: (taskId: string, newPriority: Priority) => Promise<void>;
  tasks: Task[];
};

export const TaskContext = React.createContext<TaskContextType | null>(null);

export const TaskProvider = ({
  children,
  createTask,
  updateTaskStatus,
  updateTaskPriority,
}: {
  children: React.ReactNode;
  createTask: (
    title: string,
    priority: Priority,
    projectId: string,
    userId: string,
  ) => Promise<void>;
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  updateTaskPriority: (taskId: string, newPriority: Priority) => Promise<void>;
}) => {
  const { user } = useUser();
  const { projects, selectedProjectId } = useProjects();

  const tasks =
    projects.find((proj) => proj.id === selectedProjectId)?.tasks || [];

  const createTaskCtx = (title: string, priority: Priority) =>
    createTask(title, priority, selectedProjectId, user.id);

  return (
    <TaskContext.Provider
      value={{
        createTask: createTaskCtx,
        updateTaskStatus,
        updateTaskPriority,
        tasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = React.useContext(TaskContext);

  if (!context) {
    throw new Error(
      "useProjects должен использоваться строго внутри Project  Provider",
    );
  }
  return context;
};
