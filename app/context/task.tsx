"use client";

import React from "react";
import { Priority, Task, TaskStatus } from "../types";
import { useProjects } from "./project";
import { useUser } from "./user";

export type TaskContextType = {
  tasks: Task[];
  createTask: (
    title: string,
    priority: Priority,
  ) => Promise<void | string | true>;
  updateTaskStatus: (
    taskId: string,
    status: TaskStatus,
  ) => Promise<void | string | true>;
  updateTaskPriority: (
    taskId: string,
    newPriority: Priority,
  ) => Promise<void | string | true>;
  updateAssignedTask: (
    taskId: string,
    targetUserId: string | null,
  ) => Promise<void | string | true>;
  updateDescriptionTask: (
    taskId: string,
    description: string | null,
  ) => Promise<void | string | true>;
};

export const TaskContext = React.createContext<TaskContextType | null>(null);

export const TaskProvider = ({
  children,
  createTask,
  updateTaskStatus,
  updateTaskPriority,
  updateAssignedTask,
  updateDescriptionTask,
}: {
  children: React.ReactNode;
  createTask: (
    title: string,
    priority: Priority,
    projectId: string,
    userId: string,
  ) => Promise<void | string | true>;
  updateTaskStatus: (
    taskId: string,
    status: TaskStatus,
  ) => Promise<void | string | true>;
  updateTaskPriority: (
    taskId: string,
    newPriority: Priority,
  ) => Promise<void | string | true>;
  updateAssignedTask: (
    taskId: string,
    userId: string | null,
  ) => Promise<void | string | true>;
  updateDescriptionTask: (
    taskId: string,
    description: string | null,
  ) => Promise<void | string | true>;
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
        tasks,
        createTask: createTaskCtx,
        updateTaskStatus,
        updateTaskPriority,
        updateAssignedTask,
        updateDescriptionTask,
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
