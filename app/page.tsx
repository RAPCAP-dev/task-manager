import { db } from "./lib/db";
import { Header, Form, List } from "./ui";
import {
  createTaskAction,
  toggleTaskStatusAction,
  updateTaskPriorityAction,
} from "./services";

export default async function Home() {
  const projects = await db.project.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      tasks: {
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      },
    },
  });

  const project = projects[0];

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-xl mx-auto space-y-8">
        <Header />
        <Form project={project} createTaskAction={createTaskAction} />
        <List
          tasks={project?.tasks || []}
          toggleTaskStatusAction={toggleTaskStatusAction}
          updateTaskPriorityAction={updateTaskPriorityAction}
        />
      </div>
    </main>
  );
}
