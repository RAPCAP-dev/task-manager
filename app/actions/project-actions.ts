"use server";

import { db } from "../db";
import { revalidatePath } from "next/cache";

export async function createProjectAction(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("projectDescription") as string || "";
  const userId = formData.get("userId") as string;
  
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