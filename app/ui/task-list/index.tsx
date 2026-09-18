import { TaskItem } from "./task-item";
import { useTask } from "@/app/context/task";

export const TaskList = () => {
  const { tasks } = useTask();

  return (
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
          tasks.map((task) => <TaskItem key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
};
