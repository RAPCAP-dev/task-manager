"use server";

import { ErrorCode } from "../consts";
import { db } from "../db";
import { revalidatePath } from "next/cache";
import { ProjectRole } from "../types";

export async function createProjectAction(formData: FormData, userId: string) {
  const title = formData.get("title") as string;
  const description = formData.get("projectDescription") as string || "";
  
  if (!title || !userId) return;

  try {
    const newProject = await db.project.create({
      data: {
        title,
        description,
      },
    });

    await db.projectMember.create({
      data: {
        userId: userId,
        projectId: newProject.id,
        role: "OWNER", 
      },
    });

    revalidatePath("/");
  } catch (error) {
    console.error("❌ Ошибка при создании проекта:", error);
  }
}

export async function addUserToProjectAction(email: string, projectId: string): Promise<void | string> {  
  if (!email) {
    return ErrorCode.INVALID_EMAIL
  }
  
 try {
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error("❌ Пользователь с таким email не найден");
      return ErrorCode.USER_NOT_FOUND
    }

   await db.projectMember.create({
      data: {
        userId: user.id,
        projectId: projectId,
        role: 'MEMBER',
      },
    });

    revalidatePath("/");
  } catch (error) {
    console.error("❌ Ошибка при добавлении пользователя в проект:", error);
  }
}

export async function getProjectMembersAction(projectId: string, search?: string | undefined) {
  try {
    const members = await db.projectMember.findMany({
      where: {
        projectId: projectId,
        ...(search && {
          user: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          },
        }),
      },
      include: {
        user: true
      },
      orderBy: {
        createdAt: "asc",
      },
      take: 20,
    });

    return members;
  } catch (error) {
    console.error("❌ Ошибка при получении участников проекта:", error);
    return [];
  }
}

export async function removeMemberFromProjectAction(userId: string, projectId: string) {  
  if (!userId || !projectId) return;

  try {
    await db.projectMember.delete({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectId,
        },
      },
    });

    revalidatePath("/");
  } catch (error) {
    console.error("❌ Ошибка при удалении пользователя из проекта:", error);
  }
}

export async function updateProjectMemberRoleAction(
  role: ProjectRole,
  userId: string,
  projectId: string
) {
  if (!userId || !projectId || !role) return;

  try {
    await db.projectMember.update({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectId,
        },
      },
      data: {
        role: role,
      },
    });

    revalidatePath("/");
  } catch (error) {
    console.error("❌ Ошибка при обновлении роли участника:", error);
  }
}
