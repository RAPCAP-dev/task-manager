import { signIn } from "@/app/services";

export const Auth = () => {
  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl text-center space-y-6">
        <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          Task Manager FS
        </h1>
        <p className="text-slate-400 text-sm">
          Для работы с персональным списком задач необходимо авторизоваться
          через ваш аккаунт Google.
        </p>

        {/* Форма вызывает Server Action для мгновенного редиректа в Google */}
        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <button
            type="submit"
            className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-3 px-4 rounded-xl transition active:scale-95 shadow-lg flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.29 1.51-1.14 2.78-2.4 3.63v3.02h3.87c2.26-2.08 3.56-5.14 3.56-8.5z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.87-3.02c-1.08.72-2.45 1.16-4.09 1.16-3.15 0-5.81-2.13-6.76-5.01H1.33v3.12c2.01 4 6.13 6.66 10.67 6.66z"
              />
              <path
                fill="#FBBC05"
                d="M5.24 14.22c-.25-.72-.39-1.5-.39-2.3 0-.8.14-1.58.39-2.3V6.5H1.33C.48 8.16 0 10.02 0 12s.48 3.84 1.33 5.5l3.91-3.28z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.96 1.19 15.24 0 12 0 7.46 0 3.34 2.66 1.33 6.5l3.91 3.12c.95-2.88 3.61-5.01 6.76-5.01z"
              />
            </svg>
            Войти через Google
          </button>
        </form>
      </div>
    </main>
  );
};
