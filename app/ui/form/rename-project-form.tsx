import { SUCCESS_MESSAGE } from "@/app/consts";
import { useNotification } from "@/app/context/notification";
import { useProjects } from "@/app/context/project";
import { useMemo } from "react";

export const RenameProjectForm = ({ onClose }: { onClose: () => void }) => {
  const { updateProjectName, projects, selectedProjectId } = useProjects();
  const { ifErrorCode, addNotification } = useNotification();

  const handleSubmit = async (formData: FormData) => {
    const title = formData.get("title") as string;

    const result = await updateProjectName(title);

    if (result === true) {
      addNotification(SUCCESS_MESSAGE.UPDATE_PROJECT);
    } else {
      ifErrorCode(result);
    }

    onClose();
  };

  const currentProjectName = useMemo(
    () => projects.find(({ id }) => id === selectedProjectId)?.title || "",
    [projects, selectedProjectId],
  );

  return (
    <div className="w-full bg-slate-950 border border-slate-700 rounded-lg p-4 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-slate-200 font-medium text-sm">
          Изменить название проекта: {currentProjectName}
        </h3>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 transition text-sm"
        >
          ✕
        </button>
      </div>

      <form action={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400">Новое название</label>
          <input
            type="text"
            name="title"
            placeholder="Введите название проекта"
            required
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div className="flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 border border-transparent hover:border-slate-700 rounded-md transition"
          >
            Отмена
          </button>
          <button
            type="submit"
            className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-md transition"
          >
            Сохранить
          </button>
        </div>
      </form>
    </div>
  );
};
