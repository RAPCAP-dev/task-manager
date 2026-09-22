import { getProjectMembersAction } from "../actions/project-actions";
import { db } from "../db";

export type {
  PrismaClient,
  Task,
  Session,
  ProjectMember,
  User,
} from "@/prisma/generated";

// enums
export { ProjectRole, TaskStatus, Priority } from "@/prisma/generated";


export type ProjectMemberWithUser = Awaited<
  ReturnType<typeof getProjectMembersAction>
>[number];

export type Project = Awaited<ReturnType<typeof db.project.findFirst>> & {
  tasks: Awaited<ReturnType<typeof db.task.findMany>>;
};

export type SortOption = "newest" | "oldest" | "priority-desc" | "priority-asc" | "none";
export type FilterOption = "all" | "my";

export interface GetProjectsParams {
  sort?: SortOption;
  filter?: FilterOption;
}
