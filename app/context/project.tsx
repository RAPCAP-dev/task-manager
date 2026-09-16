"use client";

import React, { useState } from "react";
import { Project } from "../types";

export type ProjectContextType = {
  projects: Project[];
  createProject: (formData: FormData) => Promise<void>;
  selectedProjectId: string;
  setSelectedProjectId: React.Dispatch<React.SetStateAction<string>>;
};

export const ProjectContext = React.createContext<ProjectContextType | null>(
  null,
);

export const ProjectProvider = ({
  children,
  projects,
  createProject,
}: {
  children: React.ReactNode;
  projects: Project[];
  createProject: (formData: FormData) => Promise<void>;
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    projects[0]?.id || "",
  );

  return (
    <ProjectContext.Provider
      value={{
        projects,
        createProject,
        selectedProjectId,
        setSelectedProjectId,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = React.useContext(ProjectContext);

  if (!context) {
    throw new Error(
      "useProjects должен использоваться строго внутри Project Provider",
    );
  }
  return context;
};
