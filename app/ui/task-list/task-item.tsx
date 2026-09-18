"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Priority, ProjectMemberWithUser, Task, TaskStatus } from "@/app/types";
import { PrioritySelector } from "../priority-selector";
import { useProjects } from "@/app/context/project";
import { useTask } from "@/app/context/task";
import { TaskItemTitle } from "./task-item-title";
import { useNotification } from "@/app/context/notification";
import { SUCCESS_MESSAGE } from "@/app/consts";

interface ListItemProps {
  task: Task;
}

export const TaskItem = ({ task }: ListItemProps) => {
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isAssigneeOpen, setIsAssigneeOpen] = useState(false);

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
  const { updateAssignedTask, updateTaskStatus, updateTaskPriority } =
    useTask();

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
    const assignedMember = members.find(
      ({ user }) => user.id === task.assigneeId,
    );
    if (assignedMember) {
      return assignedMember.user;
    }
  }, [members, task.assigneeId]);

  const updateStatus = async () => {
    const newStatus: TaskStatus = task.status === "DONE" ? "TODO" : "DONE";
    const result = await updateTaskStatus(task.id, newStatus);

    if (result === true) {
      addNotification(SUCCESS_MESSAGE.UPDATE_TASK);
    } else {
      ifErrorCode(result);
    }
  };

  const updatePriority = async (newPriority: Priority) => {
    setIsPriorityOpen(false);
    const result = await updateTaskPriority(task.id, newPriority);

    if (result === true) {
      addNotification(SUCCESS_MESSAGE.UPDATE_TASK);
    } else {
      ifErrorCode(result);
    }
  };

  const updateAssigned = async (taskId: string, userId: string | null) => {
    setIsAssigneeOpen(false);
    const result = await updateAssignedTask(taskId, userId);

    if (result === true) {
      addNotification(SUCCESS_MESSAGE.UPDATE_TASK);
    } else {
      ifErrorCode(result);
    }
  };

  return (
    <div
      className={`flex items-center justify-between p-4 bg-slate-800/50 border border-slate-800 rounded-xl hover:border-slate-700 transition relative ${
        isAnyMenuOpen ? "z-40 shadow-xl border-slate-700" : "z-10"
      }`}
    >
      <TaskItemTitle task={task} onClickStatus={updateStatus} />

      <div className="flex items-center gap-3 shrink-0 ml-4 relative">
        <div className="relative" ref={assigneeRef}>
          <div
            onClick={() => {
              setIsAssigneeOpen(!isAssigneeOpen);
              setIsPriorityOpen(false);
            }}
            className="text-xs px-2 py-1 rounded font-medium border border-slate-700/60 bg-slate-800/40 text-slate-400 hover:text-slate-300 hover:border-slate-600 cursor-pointer transition select-none min-w-[90px] text-center"
          >
            {assigned ? (
              <>
                <div className="text-right w-full">{assigned.name}</div>
                <div className="text-right w-full opacity-60">
                  {assigned.email}
                </div>
              </>
            ) : (
              <div className="text-center w-full italic opacity-60">
                Не назначено
              </div>
            )}
          </div>

          {isAssigneeOpen && (
            <div className="absolute right-0 top-full mt-2 min-w-[150px] z-[999] bg-[#0f172a] border border-slate-700 p-1.5 rounded-lg shadow-2xl space-y-1 backdrop-blur-md">
              {members.map(({ user }) => (
                <button
                  key={user.id}
                  onClick={() => {
                    updateAssigned(task.id, user.id);
                  }}
                  className="w-full text-right text-[11px] px-2 py-1.5 rounded text-slate-300 hover:bg-slate-800 transition"
                >
                  <div>{user.name}</div>
                  <div>{user.email}</div>
                </button>
              ))}

              <button
                onClick={() => {
                  updateAssigned(task.id, null);
                }}
                className="w-full text-right text-[11px] px-2 py-1.5 rounded text-rose-400 hover:bg-rose-500/10 transition border-t border-slate-800 mt-1 pt-1"
              >
                Сбросить
              </button>
            </div>
          )}
        </div>

        <div className="relative" ref={priorityRef}>
          <span
            onClick={() => {
              setIsPriorityOpen(!isPriorityOpen);
              setIsAssigneeOpen(false);
            }}
            className={`text-xs px-2 py-0.5 rounded font-semibold uppercase tracking-wider cursor-pointer block text-center min-w-[75px] transition select-none ${
              task.priority === "HIGH"
                ? "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20"
                : task.priority === "MEDIUM"
                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20"
                  : "bg-slate-700/50 text-slate-400 border border-slate-700 hover:bg-slate-700/80"
            }`}
          >
            {task.priority}
          </span>

          {isPriorityOpen && (
            <div className="absolute right-0 top-full mt-2 min-w-[110px] z-[999] bg-[#0f172a] border border-slate-700 p-1.5 rounded-lg shadow-2xl space-y-1 backdrop-blur-md">
              <PrioritySelector
                value={task.priority}
                onChange={updatePriority}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
