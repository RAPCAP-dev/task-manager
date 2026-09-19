"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Priority, ProjectMemberWithUser, Task, TaskStatus } from "@/app/types";
import { useProjects } from "@/app/context/project";
import { useTask } from "@/app/context/task";
import { TaskItemTitle } from "./task-item-title";
import { useNotification } from "@/app/context/notification";
import { SUCCESS_MESSAGE } from "@/app/consts";

import { TaskDescriptionEditor } from "./task-description-editor";
import { TaskAssigneeSelector } from "./task-assignee-selector";
import { TaskPrioritySelectorWrapper } from "./task-priority-selector-wrapper";
import { TaskDescription } from "./task-description";

interface ListItemProps {
  task: Task;
}

export const TaskItem = ({ task }: ListItemProps) => {
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isAssigneeOpen, setIsAssigneeOpen] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const priorityRef = useRef<HTMLDivElement>(null);
  const assigneeRef = useRef<HTMLDivElement>(null);

  const isAnyMenuOpen = isPriorityOpen || isAssigneeOpen;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        priorityRef.current &&
        !priorityRef.current.contains(event.target as Node)
      ) {
        setIsPriorityOpen(false);
      }
      if (
        assigneeRef.current &&
        !assigneeRef.current.contains(event.target as Node)
      ) {
        setIsAssigneeOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { getProjectMembers } = useProjects();
  const {
    updateAssignedTask,
    updateTaskStatus,
    updateTaskPriority,
    updateDescriptionTask,
    updateTitleTask,
  } = useTask();

  const { addNotification, ifErrorCode } = useNotification();
  const [members, setMembers] = useState<ProjectMemberWithUser[]>([]);

  useEffect(() => {
    const update = async () => {
      const result = await getProjectMembers();
      setMembers(result);
    };
    update();
  }, [getProjectMembers]);

  const assigned = useMemo(() => {
    return members.find(({ user }) => user.id === task.assigneeId)?.user;
  }, [members, task.assigneeId]);

  const handleApiCall = async (
    apiFunc: () => Promise<void | string | true>,
  ) => {
    const result = await apiFunc();
    if (result === true) {
      addNotification(SUCCESS_MESSAGE.UPDATE_TASK);
    } else if (result) {
      ifErrorCode(result);
    }
  };

  const updateStatus = () => {
    const newStatus: TaskStatus = task.status === "DONE" ? "TODO" : "DONE";
    handleApiCall(() => updateTaskStatus(task.id, newStatus));
  };

  const updatePriority = (newPriority: Priority) => {
    setIsPriorityOpen(false);
    handleApiCall(() => updateTaskPriority(task.id, newPriority));
  };

  const updateAssigned = (taskId: string, userId: string | null) => {
    setIsAssigneeOpen(false);
    handleApiCall(() => updateAssignedTask(taskId, userId));
  };

  const saveDescription = async (text: string) => {
    setIsEditingDescription(false);
    handleApiCall(() => updateDescriptionTask(task.id, text));
  };

  const updateTitle = async (title: string) => {
    handleApiCall(() => updateTitleTask(task.id, title));
  };

  return (
    <div
      className={`p-4 bg-slate-800/50 border border-slate-800 rounded-xl hover:border-slate-700 transition relative ${
        isAnyMenuOpen ? "z-40 shadow-xl border-slate-700" : "z-10"
      }`}
    >
      {isEditingDescription ? (
        <TaskDescriptionEditor
          task={task}
          onSave={saveDescription}
          onCancel={() => setIsEditingDescription(false)}
        />
      ) : (
        <div className="flex items-center justify-between w-full">
          <TaskItemTitle
            task={task}
            onClickStatus={updateStatus}
            updateTitle={updateTitle}
          />

          <div className="flex items-center gap-3 shrink-0 ml-4 relative">
            <div className="relative" ref={assigneeRef}>
              <TaskAssigneeSelector
                isOpen={isAssigneeOpen}
                onToggle={() => {
                  setIsAssigneeOpen(!isAssigneeOpen);
                  setIsPriorityOpen(false);
                }}
                assigned={assigned}
                members={members}
                onSelect={(userId) => updateAssigned(task.id, userId)}
              />
            </div>

            <TaskDescription
              onClick={() => setIsEditingDescription(true)}
              task={task}
            />

            <div className="relative" ref={priorityRef}>
              <TaskPrioritySelectorWrapper
                isOpen={isPriorityOpen}
                onToggle={() => {
                  setIsPriorityOpen(!isPriorityOpen);
                  setIsAssigneeOpen(false);
                }}
                priority={task.priority}
                onChangePriority={updatePriority}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
