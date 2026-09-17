import { Dispatch, SetStateAction, useState } from "react";
import { Project } from "@/app/types";
import { AddUserForm } from "./add-user-form";
import { ManageProjectMembersForm } from "./manage-project-members";

export const ProjectList = ({
  projects,
  setSelectedProjectId,
  selectedProjectId,
}: {
  projects: Project[];
  setSelectedProjectId: Dispatch<SetStateAction<string>>;
  selectedProjectId: string;
}) => {
  const [isOpenSettings, setIsOpenSettings] = useState(false);
  const [isOpenAddUserForm, setIsOpenAddUserForm] = useState(false);
  const [isOpenRemoveUserForm, setIsOpenRemoveUserForm] = useState(false);

  const handleAddUser = () => {
    setIsOpenSettings(false);
    setIsOpenAddUserForm(true);
  };

  const handleRemoveUser = () => {
    setIsOpenSettings(false);
    setIsOpenRemoveUserForm(true);
  };

  return (
    <>
      <div className="w-full">
        {projects.length > 0 ? (
          <div className="flex gap-2 items-center w-full">
            <div className="relative flex-1 group">
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full appearance-none bg-slate-950 border border-slate-700 rounded-lg px-4 pr-10 py-2 text-slate-200 focus:outline-none focus:border-blue-500 transition cursor-pointer"
              >
                {projects.map((proj) => (
                  <option
                    key={proj.id}
                    value={proj.id}
                    className="bg-slate-950 text-slate-200"
                  >
                    {proj.title}
                  </option>
                ))}
              </select>

              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setIsOpenSettings(!isOpenSettings)}
                className="p-2 bg-slate-950 border border-slate-700 hover:border-slate-500 rounded-lg text-slate-400 hover:text-slate-200 transition"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>

              {isOpenSettings && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-950 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
                  <button
                    onClick={handleAddUser}
                    className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
                  >
                    Добавить участника
                  </button>
                  <button
                    onClick={handleRemoveUser}
                    className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
                  >
                    Управление
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-amber-400 bg-amber-950/30 border border-amber-900 p-3 rounded-lg text-sm">
            ⚠ Нет доступных проектов. Создайте первый проект.
          </p>
        )}
      </div>

      {isOpenAddUserForm && (
        <AddUserForm onClose={() => setIsOpenAddUserForm(false)} />
      )}

      {isOpenRemoveUserForm && (
        <ManageProjectMembersForm
          onClose={() => setIsOpenRemoveUserForm(false)}
        />
      )}
    </>
  );
};
