import { db } from "./db";
import { Form, Auth, Header } from "./ui";
import { makeAuth } from "./auth";

import { UserProvider } from "./context/user";
import { ProjectProvider } from "./context/project";

import { signOutAction } from "./actions/auth-actions";
import {
  createProjectAction,
  addUserToProjectAction,
} from "./actions/project-actions";

import {
  createTaskAction,
  toggleTaskStatusAction,
  updateTaskPriorityAction,
} from "@/app/actions/task-actions";
import { TaskProvider } from "./context/task";
import { ErrorList } from "./ui/error";
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
      >
        <TaskProvider
          createTask={createTaskAction}
          toggleTask={toggleTaskStatusAction}
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
