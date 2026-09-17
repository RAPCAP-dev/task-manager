export const CreatingForm = ({
  handleCreateProject,
}: {
  handleCreateProject: (formData: FormData) => Promise<void>;
}) => {
  return (
    <form action={handleCreateProject} className="flex gap-2 items-center">
      <input
        type="text"
        name="title"
        placeholder="Название проекта"
        required
        className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
      />
      <button
        type="submit"
        className="bg-green-600 hover:bg-green-500 text-white font-medium px-5 py-2 h-[40px] rounded-lg transition active:scale-95 flex items-center justify-center text-sm"
      >
        Создать
      </button>
    </form>
  );
};
