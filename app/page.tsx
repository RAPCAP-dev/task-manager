import { db } from "./db";
import { Form, Auth, Header } from "./ui";
import { makeAuth } from "./auth";

import { UserProvider } from "./context/user";
import { ProjectProvider } from "./context/project";

import { signOutAction } from "./actions/auth-actions";
import {
  createProjectAction,
  addUserToProjectAction,
  getProjectMembersAction,
  removeMemberFromProjectAction,
  updateProjectMemberRoleAction,
} from "./actions/project-actions";

import {
  createTaskAction,
  updateTaskStatusAction,
  updateTaskPriorityAction,
} from "@/app/actions/task-actions";
import { TaskProvider } from "./context/task";
import { ErrorList } from "@/app/ui/error-list";
import { ErrorProvider } from "./context/error";

export default async function Home() {
  const user = await makeAuth();

  if (!user) {
    return <Auth />;
  }

  const projects = await db.project.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      tasks: {
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      },
    },
    where: {
      members: {
        some: {
          userId: user.id,
        },
      },
    },
  });

  return (
    <UserProvider user={user} signOut={signOutAction}>
      <ProjectProvider
        projects={projects}
        addUserToProject={addUserToProjectAction}
        createProject={createProjectAction}
        getProjectMembers={getProjectMembersAction}
        removeProjectMember={removeMemberFromProjectAction}
        updateProjectMemberRole={updateProjectMemberRoleAction}
      >
        <TaskProvider
          createTask={createTaskAction}
          updateTaskStatus={updateTaskStatusAction}
          updateTaskPriority={updateTaskPriorityAction}
        >
          <ErrorProvider>
            <ErrorList />
            <Header />
            <Form />
          </ErrorProvider>
        </TaskProvider>
      </ProjectProvider>
    </UserProvider>
  );
}
