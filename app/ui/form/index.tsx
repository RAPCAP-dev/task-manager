"use client";

import { useState } from "react";
import { TaskList } from "../task-list";
import { useProjects } from "@/app/context/project";
import { FormHeader } from "./form-header";
import { CreatingForm } from "./creating-form";
import { ProjectList } from "./project-list";
import { TaskForm } from "./task-form";
import { useNotification } from "@/app/context/notification";
import { SUCCESS_MESSAGE } from "@/app/consts";

export const Form = ({}) => {
  const { projects, createProject, selectedProjectId, setSelectedProjectId } =
    useProjects();

  const { addNotification, ifErrorCode } = useNotification();

  const [isCreatingProject, setIsCreatingProject] = useState(false);

  const handleCreateProject = async (formData: FormData) => {
    const result = await createProject(formData);
    if (result === true) {
      addNotification(SUCCESS_MESSAGE.CREATE_PROJECT);
    } else {
      ifErrorCode(result);
    }
    setIsCreatingProject(false);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl space-y-4">
          <FormHeader
            setIsCreatingProject={setIsCreatingProject}
            isCreatingProject={isCreatingProject}
          />

          {isCreatingProject ? (
            <CreatingForm handleCreateProject={handleCreateProject} />
          ) : (
            <ProjectList
              projects={projects}
              setSelectedProjectId={setSelectedProjectId}
              selectedProjectId={selectedProjectId}
            />
          )}
        </div>

        {projects.length && !isCreatingProject ? <TaskForm /> : null}
      </div>

      <TaskList />
    </>
  );
};
