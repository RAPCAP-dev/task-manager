"use server";

import { db } from "../db";
import { revalidatePath } from "next/cache";
import { Priority, TaskStatus } from "../types";
import { ErrorCode } from "../consts";

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
    return true;
  } catch (error) {
    console.error("❌ Ошибка при создании задачи:", error);
    return ErrorCode.CREATE_TASK_ERROR;
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
    return true;
  } catch (error) {
    console.error("❌ Ошибка при обновлении задачи:", error);
    return ErrorCode.CREATE_TASK_ERROR;
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
    return true;
  } catch (error) {
    console.error("❌ Ошибка при обновлении задачи:", error);
    return ErrorCode.CREATE_TASK_ERROR;
  }
}

export async function updateAssignedTaskAction(
  taskId: string,
  targetUserId: string | null,
) {
  try {
    const currentTask = await db.task.findUnique({
      where: { id: taskId },
      select: { assigneeId: true },
    });

    if (!currentTask) {
      return ErrorCode.TASK_NOT_FOUND_ERROR;
    }

    if (currentTask.assigneeId === targetUserId) {
      return ErrorCode.TASK_ALREADY_ASSIGNED;
    }

    await db.task.update({
      where: { id: taskId },
      data: {
        assigneeId: targetUserId,
      },
    });

    revalidatePath("/");
    return true;
  } catch (error) {
    console.error("❌ Ошибка при обновлении задачи:", error);
    return ErrorCode.CREATE_TASK_ERROR;
  }
}


export async function updateDescriptionTaskAction(
  taskId: string,
  description: string | null,
) {
  try {
    await db.task.update({
      where: { id: taskId },
      data: {
        description: description,
      },
    });

    revalidatePath("/");
    return true;
  } catch (error) {
    console.error("❌ Ошибка при обновлении задачи:", error);
    return ErrorCode.CREATE_TASK_ERROR;
  }
}

export async function updateTitleTaskAction(taskId: string, title: string) {
  try {
    await db.task.update({
      where: { id: taskId },
      data: {
        title: title,
      },
    });

    revalidatePath("/");
    return true;
  } catch (error) {
    console.error("❌ Ошибка при обновлении задачи:", error);
    return ErrorCode.CREATE_TASK_ERROR;
  }
}
