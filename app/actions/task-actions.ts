"use server";

import { db } from "../db";
import { revalidatePath } from "next/cache";
import { Priority, TaskStatus } from "../types";

export async function createTaskAction(
  title: string,
  priority: Priority,
  projectId: string,
  userId: string,
) {
  if (!title || !projectId) return;

  try {
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
  } catch (error) {
    console.error("❌ Ошибка при создании задачи:", error);
  }
}

export async function updateTaskStatusAction(
  taskId: string,
  newStatus: TaskStatus,
) {
  try {
    await db.task.update({
      where: { id: taskId },
      data: { status: newStatus },
    });

    revalidatePath("/");
  } catch (error) {
    console.error("❌ Ошибка при обновлении задачи:", error);
  }
}

export async function updateTaskPriorityAction(
  taskId: string,
  newPriority: Priority,
) {
  try {
    await db.task.update({
      where: { id: taskId },
      data: { priority: newPriority },
    });

    revalidatePath("/");
  } catch (error) {
    console.error("❌ Ошибка при обновлении задачи:", error);
  }
}

export async function updateAssignedTaskAction(
  taskId: string,
  targetUserId: string | null,
) {
  try {
    await db.task.update({
      where: { id: taskId },
      data: { 
        assigneeId: targetUserId
      },
    });

    revalidatePath("/");
  } catch (error) {
    console.error("❌ Ошибка при обновлении задачи:", error);
  }
}
