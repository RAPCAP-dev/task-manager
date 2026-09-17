"use server";

import { db } from "../db";
import { revalidatePath } from "next/cache";
import { Priority, TaskStatus } from "../types"; 

export async function createTaskAction(title: string, priority: Priority, projectId: string, userId: string) {
  if (!title || !projectId) return;

  await db.task.create({
    data: {
      title: title,
      projectId: projectId,
      status: "TODO",
      priority: priority,
      creatorId: userId,
    },
  });

  revalidatePath("/");
}

export async function updateTaskStatusAction(taskId: string, newStatus: TaskStatus) {
  await db.task.update({
    where: { id: taskId },
    data: { status: newStatus },
  });

  revalidatePath("/");
}

export async function updateTaskPriorityAction(taskId: string, newPriority: Priority) {
  await db.task.update({
    where: { id: taskId },
    data: { priority: newPriority },
  });

  revalidatePath("/");
}

