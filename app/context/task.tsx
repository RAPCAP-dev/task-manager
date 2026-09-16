"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { Priority, Task } from "../types";
import { useProjects } from "./project";

export type TaskContextType = {
  createTask: (
    formData: FormData,
    projectId: string,
    userId: string,
  ) => Promise<void>;
  toggleTask: (taskId: string) => Promise<void>;
  updateTaskPriority: (taskId: string, newPriority: Priority) => Promise<void>;
  tasks: Task[];
};

export const TaskContext = React.createContext<TaskContextType | null>(null);

export const TaskProvider = ({
  children,
  createTask,
  toggleTask,
  updateTaskPriority,
}: {
  children: React.ReactNode;
  createTask: (
    formData: FormData,
    projectId: string,
    userId: string,
  ) => Promise<void>;
  toggleTask: (taskId: string) => Promise<void>;
  updateTaskPriority: (taskId: string, newPriority: Priority) => Promise<void>;
}) => {
  const { projects, selectedProjectId } = useProjects();

  const tasks =
    projects.find((proj) => proj.id === selectedProjectId)?.tasks || [];

  return (
    <TaskContext.Provider
      value={{
        createTask,
        toggleTask,
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
