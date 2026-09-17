import { Dispatch } from "react";

export const FormHeader = ({
  isCreatingProject,
  setIsCreatingProject,
}: {
  isCreatingProject: boolean;
  setIsCreatingProject: Dispatch<boolean>;
}) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
        {isCreatingProject ? "Новый проект" : "Выбор проекта"}
      </h2>
      <button
        type="button"
        onClick={() => setIsCreatingProject(!isCreatingProject)}
        className="text-xs text-blue-400 hover:text-blue-300 underline cursor-pointer"
      >
        {isCreatingProject ? "К выбору проектов" : "+ Создать проект"}
      </button>
    </div>
  );
};
