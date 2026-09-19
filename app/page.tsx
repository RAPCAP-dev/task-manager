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
  getProjects,
  updateProjectNameAction,
} from "./actions/project-actions";

import {
  createTaskAction,
  updateTaskStatusAction,
  updateTaskPriorityAction,
  updateAssignedTaskAction,
  updateDescriptionTaskAction,
  updateTitleTaskAction,
} from "@/app/actions/task-actions";
import { TaskProvider } from "./context/task";
import { NotificationList } from "@/app/ui/notification";
import { NotificationProvider } from "./context/notification";

export default async function Home() {
  const user = await makeAuth();

  if (!user) {
    return <Auth />;
  }

  const projects = await getProjects(user);

  return (
    <UserProvider user={user} signOut={signOutAction}>
      <ProjectProvider
        projects={projects}
        addUserToProject={addUserToProjectAction}
        createProject={createProjectAction}
        getProjectMembers={getProjectMembersAction}
        removeProjectMember={removeMemberFromProjectAction}
        updateProjectMemberRole={updateProjectMemberRoleAction}
        updateProjectName={updateProjectNameAction}
      >
        <TaskProvider
          createTask={createTaskAction}
          updateTaskStatus={updateTaskStatusAction}
          updateTaskPriority={updateTaskPriorityAction}
          updateAssignedTask={updateAssignedTaskAction}
          updateDescriptionTask={updateDescriptionTaskAction}
          updateTitleTask={updateTitleTaskAction}
        >
          <NotificationProvider>
            <NotificationList />
            <Header />
            <Form />
          </NotificationProvider>
        </TaskProvider>
      </ProjectProvider>
    </UserProvider>
  );
}
