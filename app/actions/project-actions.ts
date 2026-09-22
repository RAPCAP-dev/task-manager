"use server";

import { ErrorCode } from "../consts";
import { db } from "../db";
import { revalidatePath } from "next/cache";
import { GetProjectsParams, ProjectRole, User } from "../types";
import { auth } from "../auth";


export async function getProjectsAction(user: User, params?: GetProjectsParams) {
  const sort = params?.sort || "newest";
  const filter = params?.filter || "all";

  // TODO: fix types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const taskWhereClause: any = {};
  
  if (filter === "my") {
    taskWhereClause.assigneeId = user.id;
  }
  
  // TODO: fix types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let taskOrderBy: any = [{ createdAt: "desc" }, { id: "desc" }];

  if (sort === "oldest") {
    taskOrderBy = [{ createdAt: "asc" }, { id: "asc" }];
  } else if (sort === "priority-desc") {
    taskOrderBy = [{ priority: "desc" }, { createdAt: "desc" }];
  } else if (sort === "priority-asc") {
    taskOrderBy = [{ priority: "asc" }, { createdAt: "desc" }];
  } else if (sort === "none") {
    taskOrderBy = [{ id: "desc" }];
  }

  try {
    return await db.project.findMany({
      orderBy: { createdAt: "desc" },
      where: {
        members: {
          some: {
            userId: user.id,
          },
        },
      },
      include: {
        tasks: {
          where: taskWhereClause,
          orderBy: taskOrderBy,
        },
      },
    });
  } catch (error) {
    console.error("❌ Ошибка при загрузке проектов:", error);
    return [];
  }
}

type AuthCheckResult =
  | { success: true; currentUserId: string }
  | { success: false; error: "UNAUTHORIZED" | "FORBIDDEN" };

export async function verifyProjectAdmin(
  projectId: string,
): Promise<AuthCheckResult> {
  const session = await auth();

  if (!session?.user?.id) {
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
    return { success: false, error: "FORBIDDEN" };
  }

  return { success: true, currentUserId };
}

export async function createProjectAction(formData: FormData, userId: string) {
  const title = formData.get("title") as string;
  const description = (formData.get("projectDescription") as string) || "";

  if (!title || !userId) {
    return ErrorCode.CREATE_PROJECT_ERROR;
  }

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
    return true;
  } catch (error) {
    console.error("❌ Ошибка при создании проекта:", error);
    return ErrorCode.CREATE_PROJECT_ERROR;
  }
}

export async function addUserToProjectAction(
  email: string,
  projectId: string,
): Promise<void | string | true> {
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
      return ErrorCode.USER_ALREADY_IN_PROJECT;
    }

    await db.projectMember.create({
      data: {
        userId: user.id,
        projectId: projectId,
        role: "MEMBER",
      },
    });

    revalidatePath("/");
    return true;
  } catch (error) {
    console.error("❌ Критическая ошибка добавлении пользователя:", error);
    return ErrorCode.DATABASE_ERROR;
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
): Promise<void | string | true> {
  if (!userId || !projectId) {
    return ErrorCode.UPDATE_PROJECT_ERROR;
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
      return ErrorCode.UPDATE_PROJECT_ERROR;
    }

    if (targetMember.role === "OWNER") {
      return ErrorCode.CANNOT_REMOVE_OWNER;
    }

    await db.projectMember.delete({
      where: {
        userId_projectId: { userId, projectId },
      },
    });

    revalidatePath("/");
    return true;
  } catch (dbError) {
    console.error("❌ Критическая ошибка БД при удалении участника:", dbError);
    return ErrorCode.DATABASE_ERROR;
  }
}

export async function updateProjectMemberRoleAction(
  role: ProjectRole,
  userId: string,
  projectId: string,
): Promise<void | string | true> {
  if (!userId || !projectId || !role) {
    return ErrorCode.UPDATE_PROJECT_ERROR;
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
      return ErrorCode.UPDATE_PROJECT_ERROR;
    }

    if (targetMember.role === "OWNER") {
      return ErrorCode.UPDATE_PROJECT_ERROR;
    }

    if (role === "OWNER") {
      return ErrorCode.UPDATE_PROJECT_ERROR;
    }

    await db.projectMember.update({
      where: {
        userId_projectId: { userId, projectId },
      },
      data: { role },
    });

    revalidatePath("/");
    return true;
  } catch (dbError) {
    console.error("❌ Критическая ошибка БД при обновлении роли:", dbError);
    return ErrorCode.DATABASE_ERROR;
  }
}

export async function updateProjectNameAction(
  title: string,
  projectId: string,
  userId: string,
) {
  if (!title || !projectId || !userId) {
    return ErrorCode.UPDATE_PROJECT_ERROR;
  }

  try {
    const member = await db.projectMember.findFirst({
      where: {
        projectId: projectId,
        userId: userId,
        role: {
          in: ["OWNER", "ADMIN"],
        },
      },
    });

    if (!member) {
      return ErrorCode.UPDATE_PROJECT_ERROR;
    }

    await db.project.update({
      where: {
        id: projectId,
      },
      data: {
        title: title,
      },
    });

    revalidatePath("/");
    return true;
  } catch (error) {
    console.error("❌ Ошибка при изменении названия проекта:", error);
    return ErrorCode.UPDATE_PROJECT_ERROR;
  }
}
