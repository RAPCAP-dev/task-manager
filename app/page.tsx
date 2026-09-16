import { db } from "./db";
import { Form, Auth, Header } from "./ui";
import { makeAuth } from "./auth";

import { UserProvider } from "./context/user";
import { ProjectProvider } from "./context/project";

import { signOutAction } from "./actions/auth-actions";
import { createProjectAction } from "./actions/project-actions";

import {
  createTaskAction,
  toggleTaskStatusAction,
  updateTaskPriorityAction,
} from "@/app/actions/task-actions";
import { TaskProvider } from "./context/task";

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
      <ProjectProvider projects={projects} createProject={createProjectAction}>
        <TaskProvider
          createTask={createTaskAction}
          toggleTask={toggleTaskStatusAction}
          updateTaskPriority={updateTaskPriorityAction}
        >
          <Header />
          <Form />
        </TaskProvider>
      </ProjectProvider>
    </UserProvider>
  );
}
