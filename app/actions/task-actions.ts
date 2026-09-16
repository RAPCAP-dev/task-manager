"use server";

import { db } from "../lib/db";
import { revalidatePath } from "next/cache";
import { Priority, TaskStatus } from "../types"; 

export async function createTaskAction(formData: FormData, projectId: string, userId: string) {
  const title = formData.get("taskTitle") as string;
  if (!title || !projectId) return;

  await db.task.create({
    data: {
      title: title,
      projectId: projectId,
      status: "TODO",
      priority: (formData.get("taskPriority") as Priority) || "MEDIUM",
      creatorId: userId,
    },
  });

  revalidatePath("/");
}

export async function toggleTaskStatusAction(taskId: string) {
  const task = await db.task.findUnique({ where: { id: taskId } });
  if (!task) return;

  const newStatus: TaskStatus = task.status === "DONE" ? "TODO" : "DONE";

  await db.task.update({
    where: { id: taskId },
    data: { status: newStatus },
  });

  revalidatePath("/");
}

export async function updateTaskPriorityAction(taskId: string, newPriority: Priority) {
  const task = await db.task.findUnique({ where: { id: taskId } });
  if (!task) return;

  await db.task.update({
    where: { id: taskId },
    data: { priority: newPriority },
  });

  revalidatePath("/");
}

