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
          <TaskItemTitle task={task} onClickStatus={updateStatus} />

          <div className="flex items-center gap-3 shrink-0 ml-4 relative">
            <div className="relative group">
              <button
                onClick={() => setIsEditingDescription(true)}
                title={
                  task.description
                    ? "Редактировать описание"
                    : "Добавить описание"
                }
                className={`flex items-center justify-center w-7 h-7 rounded border transition ${
                  task.description
                    ? "border-blue-500/30 bg-blue-500/10 text-blue-400 hover:text-blue-300 hover:border-blue-500/50"
                    : "border-slate-700/60 bg-slate-800/40 text-slate-400 hover:text-slate-300 hover:border-slate-600"
                }`}
              >
                ℹ️
              </button>

              <div className="absolute bottom-full right-0 mb-2 w-64 p-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 text-xs text-slate-300">
                {task.description ? (
                  <div className="whitespace-pre-wrap break-words">
                    {task.description}
                  </div>
                ) : (
                  <span className="italic opacity-50">Нет описания</span>
                )}
              </div>
            </div>

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
