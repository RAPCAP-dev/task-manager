import { Task } from "@/prisma/generated";

export const ListItemTitle = ({
  task,
  onClickStatus,
}: {
  task: Task;
  onClickStatus: () => void;
}) => {
  return (
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <div
        className={`w-5 h-5 rounded-md border flex items-center justify-center text-xs cursor-pointer select-none shrink-0 ${
          task.status === "DONE"
            ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
            : "border-slate-600 hover:border-slate-500"
        }`}
        onClick={onClickStatus}
      >
        {task.status === "DONE" && "✓"}
      </div>

      <span
        className={`font-medium truncate ${task.status === "DONE" ? "line-through text-slate-500" : "text-slate-200"}`}
      >
        {task.title}
      </span>
    </div>
  );
};
