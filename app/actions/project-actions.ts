"use server";

import { ErrorCode } from "../consts";
import { db } from "../db";
import { revalidatePath } from "next/cache";
import { ProjectRole } from "../types";
import { auth } from "../auth";

type AuthCheckResult =
  | { success: true; currentUserId: string }
  | { success: false; error: "UNAUTHORIZED" | "FORBIDDEN" };

export async function verifyProjectAdmin(
  projectId: string,
): Promise<AuthCheckResult> {
  const session = await auth();

  if (!session?.user?.id) {
    // TODO: error display
    return { success: false, error: "UNAUTHORIZED" };
  }

  const currentUserId = session.user.id;

  const memberRecord = await db.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId: currentUserId,
        projectId: projectId,
      },
    },
  });

  const ALLOWED_ROLES = ["OWNER", "ADMIN"];

  if (!memberRecord || !ALLOWED_ROLES.includes(memberRecord.role)) {
    // TODO: error display
    return { success: false, error: "FORBIDDEN" };
  }

  return { success: true, currentUserId };
}

export async function createProjectAction(formData: FormData, userId: string) {
  const title = formData.get("title") as string;
  const description = (formData.get("projectDescription") as string) || "";

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

export async function addUserToProjectAction(
  email: string,
  projectId: string,
): Promise<void | string> {
  if (!email) {
    return ErrorCode.INVALID_EMAIL;
  }

  const authResult = await verifyProjectAdmin(projectId);

  if (!authResult.success) {
    return authResult.error;
  }

  try {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      console.error("❌ Пользователь с таким email не найден");
      return ErrorCode.USER_NOT_FOUND;
    }

    const existingMember = await db.projectMember.findUnique({
      where: { userId_projectId: { userId: user.id, projectId } },
    });
    if (existingMember) {
      // TODO: error display
      return "USER_ALREADY_IN_PROJECT";
    }

    await db.projectMember.create({
      data: {
        userId: user.id,
        projectId: projectId,
        role: "MEMBER",
      },
    });

    revalidatePath("/");
  } catch (dbError) {
    // TODO: error display
    console.error(
      "❌ Критическая ошибка БД при добавлении пользователя:",
      dbError,
    );
    return "DATABASE_ERROR";
  }
}

export async function getProjectMembersAction(
  projectId: string,
  search?: string | undefined,
) {
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
        user: true,
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

export async function removeMemberFromProjectAction(
  userId: string,
  projectId: string,
): Promise<void | string> {
  if (!userId || !projectId) {
    return "INVALID_PARAMS";
  }

  const authResult = await verifyProjectAdmin(projectId);

  if (!authResult.success) {
    return authResult.error;
  }

  try {
    const targetMember = await db.projectMember.findUnique({
      where: {
        userId_projectId: { userId, projectId },
      },
    });

    if (!targetMember) {
      // TODO: error display
      return "MEMBER_NOT_FOUND";
    }

    if (targetMember.role === "OWNER") {
      // TODO: error display
      return "CANNOT_REMOVE_OWNER";
    }

    if (authResult.currentUserId === userId) {
      // TODO: error display
      return "CANNOT_REMOVE_YOURSELF";
    }

    await db.projectMember.delete({
      where: {
        userId_projectId: { userId, projectId },
      },
    });

    revalidatePath("/");
  } catch (dbError) {
    // TODO: error display
    console.error("❌ Критическая ошибка БД при удалении участника:", dbError);
    return "DATABASE_ERROR";
  }
}

export async function updateProjectMemberRoleAction(
  role: ProjectRole,
  userId: string,
  projectId: string,
): Promise<void | string> {
  if (!userId || !projectId || !role) {
    // TODO: error display
    return "INVALID_PARAMS";
  }

  const authResult = await verifyProjectAdmin(projectId);
  if (!authResult.success) {
    return authResult.error;
  }

  try {
    const targetMember = await db.projectMember.findUnique({
      where: {
        userId_projectId: { userId, projectId },
      },
    });

    if (!targetMember) {
      // TODO: error display
      return "MEMBER_NOT_FOUND";
    }

    if (targetMember.role === "OWNER") {
      // TODO: error display
      return "CANNOT_MODIFY_OWNER_ROLE";
    }

    if (role === "OWNER") {
      // TODO: error display
      return "CANNOT_ASSIGN_OWNER_ROLE";
    }

    await db.projectMember.update({
      where: {
        userId_projectId: { userId, projectId },
      },
      data: { role },
    });

    revalidatePath("/");
  } catch (dbError) {
    // TODO: error display
    console.error("❌ Критическая ошибка БД при обновлении роли:", dbError);
    return "DATABASE_ERROR";
  }
}
