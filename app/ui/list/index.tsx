import { Priority, Task } from "@/app/types";
import { ListItem } from "./list-item";

export const List = ({
  tasks,
  toggleTaskStatusAction,
  updateTaskPriorityAction,
}: {
  tasks: Task[];
  toggleTaskStatusAction: (taskId: string) => Promise<void>;
  updateTaskPriorityAction: (
    taskId: string,
    newPriority: Priority,
  ) => Promise<void>;
}) => (
  <div className="space-y-4">
    <h2 className="text-xl font-bold text-slate-200 flex items-center justify-between">
      <span>Список задач</span>
      <span className="text-xs bg-slate-800 px-2 py-1 rounded-full text-slate-400 font-mono">
        всего: {tasks.length || 0}
      </span>
    </h2>

    <div className="space-y-2">
      {tasks.length === 0 ? (
        <p className="text-slate-500 text-sm italic">
          Задач пока нет. Создайте первую выше!
        </p>
      ) : (
        tasks.map((task) => (
          <ListItem
            key={task.id}
            task={task}
            toggleTaskStatusAction={toggleTaskStatusAction}
            updateTaskPriorityAction={updateTaskPriorityAction}
          />
        ))
      )}
    </div>
  </div>
);
