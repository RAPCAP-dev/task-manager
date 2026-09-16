import { db } from "../db";

export type {
  PrismaClient,
  Task,
  TaskStatus,
  Priority,
  Session,
} from "@/prisma/generated";

export type Project = Awaited<ReturnType<typeof db.project.findFirst>> & {
  tasks: Awaited<ReturnType<typeof db.task.findMany>>;
};