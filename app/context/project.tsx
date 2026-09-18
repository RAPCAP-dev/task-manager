"use client";

import React, { useMemo, useState } from "react";
import { Project, ProjectMemberWithUser, ProjectRole } from "../types";
import { useUser } from "./user";

export type ProjectContextType = {
  projects: Project[];
  selectedProjectId: string;
  setSelectedProjectId: React.Dispatch<React.SetStateAction<string>>;
  createProject: (formData: FormData) => Promise<void | string | true>;
  addUserToProject: (email: string) => Promise<void | string | true>;
  getProjectMembers: (search?: string) => Promise<ProjectMemberWithUser[]>;
  removeProjectMember: (userId: string) => Promise<void | string | true>;
  updateProjectMemberRole: (
    role: ProjectRole,
    targetUserId: string,
  ) => Promise<void | string | true>;
  updateProjectName: (title: string) => Promise<void | string | true>;
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
  updateProjectMemberRole,
  updateProjectName,
}: {
  children: React.ReactNode;
  projects: Project[];
  createProject: (
    formData: FormData,
    userId: string,
  ) => Promise<void | string | true>;
  addUserToProject: (
    email: string,
    projectId: string,
  ) => Promise<void | string | true>;
  getProjectMembers: (
    projectId: string,
    search?: string | undefined,
  ) => Promise<ProjectMemberWithUser[]>;
  removeProjectMember: (
    userId: string,
    projectId: string,
  ) => Promise<void | string | true>;
  updateProjectMemberRole: (
    role: ProjectRole,
    userId: string,
    projectId: string,
  ) => Promise<void | string | true>;
  updateProjectName: (
    title: string,
    projectId: string,
    userId: string,
  ) => Promise<void | string | true>;
}) => {
  const { user } = useUser();

  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    projects[0]?.id || "",
  );

  const createProjectCtx = (formData: FormData) =>
    createProject(formData, user.id);

  const addUserToProjectCtx = (email: string) =>
    addUserToProject(email, selectedProjectId);

  const getProjectMembersCtx = (search?: string) =>
    getProjectMembers(selectedProjectId, search);

  const removeProjectMemberCtx = (targetUserId: string) =>
    removeProjectMember(targetUserId, selectedProjectId);

  const updateProjectMemberRoleCtx = (
    role: ProjectRole,
    targetUserId: string,
  ) => updateProjectMemberRole(role, targetUserId, selectedProjectId);

  const updateProjectNameCtx = (title: string) =>
    updateProjectName(title, selectedProjectId, user.id);

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
        updateProjectMemberRole: updateProjectMemberRoleCtx,
        updateProjectName: updateProjectNameCtx,
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
