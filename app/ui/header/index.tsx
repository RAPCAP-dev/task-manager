"use client";

import { useUser } from "@/app/context/user";

export const Header = () => {
  const { user, signOut } = useUser();

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          Fullstack Task Manager
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Компоненты сервера Node.js + PostgreSQL в Docker
        </p>
      </div>

      <div className="max-w-xl mx-auto flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3.5">
          <div className="relative group mr-1">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300"></div>

            <img
              src={user?.image || "https://liara.run"}
              alt="User Avatar"
              className="relative w-8 h-8 rounded-full border-2 border-slate-800 object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm text-slate-100 tracking-tight">
                {user?.name}
              </h2>

              {user?.role === "ADMIN" && (
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-widest animate-pulse">
                  Admin
                </span>
              )}

              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p className="text-xs text-slate-400 font-medium">{user?.email}</p>
          </div>
        </div>

        <form action={signOut}>
          <button
            type="submit"
            className="text-xs font-semibold text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 hover:border-rose-500/20 px-3.5 py-2 rounded-xl transition duration-200 active:scale-95 cursor-pointer"
          >
            Выйти
          </button>
        </form>
      </div>
    </div>
  );
};
