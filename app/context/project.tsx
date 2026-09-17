"use client";

import React, { useState } from "react";
import { Project, ProjectMemberWithUser } from "../types";
import { useUser } from "./user";

export type ProjectContextType = {
  projects: Project[];
  selectedProjectId: string;
  setSelectedProjectId: React.Dispatch<React.SetStateAction<string>>;
  createProject: (formData: FormData) => Promise<void>;
  addUserToProject: (formData: FormData) => Promise<void | string>;
  getProjectMembers: (search?: string) => Promise<ProjectMemberWithUser[]>;
  removeProjectMember: (userId: string) => Promise<void>;
};

export const ProjectContext = React.createContext<ProjectContextType | null>(
  null,
);

export const ProjectProvider = ({
  children,
  projects,
  createProject,
  addUserToProject,
  getProjectMembers,
  removeProjectMember,
}: {
  children: React.ReactNode;
  projects: Project[];
  createProject: (formData: FormData, userId: string) => Promise<void>;
  addUserToProject: (
    formData: FormData,
    projectId: string,
  ) => Promise<void | string>;
  getProjectMembers: (
    projectId: string,
    search?: string | undefined,
  ) => Promise<ProjectMemberWithUser[]>;
  removeProjectMember: (userId: string, projectId: string) => Promise<void>;
}) => {
  const { user } = useUser();

  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    projects[0]?.id || "",
  );

  const createProjectCtx = (formData: FormData) =>
    createProject(formData, user.id);

  const addUserToProjectCtx = (formData: FormData) =>
    addUserToProject(formData, selectedProjectId);

  const getProjectMembersCtx = (search?: string) =>
    getProjectMembers(selectedProjectId, search);

  const removeProjectMemberCtx = (userId: string) =>
    removeProjectMember(userId, selectedProjectId);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        selectedProjectId,
        setSelectedProjectId,
        createProject: createProjectCtx,
        addUserToProject: addUserToProjectCtx,
        getProjectMembers: getProjectMembersCtx,
        removeProjectMember: removeProjectMemberCtx,
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
