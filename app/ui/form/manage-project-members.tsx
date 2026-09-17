import { useProjects } from "@/app/context/project";
import { ProjectMemberWithUser, ProjectRole } from "@/app/types";
import { useState, useEffect } from "react";

export const ManageProjectMembersForm = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  const [memberList, setMemberList] = useState<ProjectMemberWithUser[]>([]);
  const [search, setSearch] = useState("");
  const { getProjectMembers, removeProjectMember, updateProjectMemberRole } =
    useProjects();

  useEffect(() => {
    const updateAsync = async () => {
      const resultMembers = await getProjectMembers(search);
      setMemberList(resultMembers);
    };
    updateAsync();
  }, [getProjectMembers, search]);

  const handleRemove = (userId: string) => {
    //TODO: display error ui
    removeProjectMember(userId);
  };

  const handleRoleChange = (role: ProjectRole, userId: string) => {
    //TODO: display error ui
    updateProjectMemberRole(role, userId);
  };

  return (
    <div className="w-full bg-slate-950 border border-slate-700 rounded-lg p-4 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-slate-200 font-medium text-sm">
          Управление участниками проекта
        </h3>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 transition text-sm"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по имени или email..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition"
          />
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="w-full max-h-48 overflow-y-auto border border-slate-800 rounded-lg divide-y divide-slate-800 bg-slate-900/50">
          {memberList.length > 0 ? (
            memberList.map((member) => (
              <div
                key={member.user.id}
                className="flex justify-between items-center px-3 py-2 hover:bg-slate-900 transition"
              >
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm font-medium text-slate-200 truncate">
                    {member.user.name}
                  </span>
                  <span className="text-xs text-slate-400 truncate">
                    {member.user.email}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-2">
                  {member.role === ProjectRole.OWNER ? (
                    <span className="px-2 py-1 text-xs text-violet-400 bg-violet-950/30 border border-violet-900/50 rounded font-medium minimal-w-[85px] text-center">
                      Владелец
                    </span>
                  ) : (
                    <>
                      <select
                        value={member.role}
                        onChange={(e) =>
                          handleRoleChange(
                            e.target.value as ProjectRole,
                            member.user.id,
                          )
                        }
                        className="bg-slate-900 border border-slate-700 text-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500 transition cursor-pointer custom-select"
                      >
                        <option value={ProjectRole.MEMBER}>Участник</option>
                        <option value={ProjectRole.ADMIN}>Админ</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => handleRemove(member.user.id)}
                        className="px-2 py-1 text-xs text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-900/50 rounded transition"
                      >
                        Удалить
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="p-3 text-sm text-slate-500 text-center">
              Пользователи не найдены
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 border border-transparent hover:border-slate-700 rounded-md transition"
          >
            Готово
          </button>
        </div>
      </div>
    </div>
  );
};
