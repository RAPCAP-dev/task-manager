import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { db } from "./lib/db"; // Берем ваш рабочий db.ts
import "dotenv/config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  // 🔑 Переключаем сессии на JWT (работает мгновенно и без багов с адаптерами)
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  
  callbacks: {
    // 🔑 КОЛБЭК ВХОДА: Срабатывает, когда гугл вернул юзера
    async signIn({ user, account }) {
      if (!user.email) return false;

      try {
        // Проверяем, есть ли уже такой пользователь в нашей Docker-базе
        let dbUser = await db.user.findUnique({
          where: { email: user.email }
        });

        // Если пользователя нет — создаем его вручную прямо в PostgreSQL!
        if (!dbUser) {
          dbUser = await db.user.create({
            data: {
              name: user.name || "Пользователь Google",
              email: user.email,
              image: user.image || "",
            }
          });
        }

        // Записываем ID из базы данных в объект, чтобы прокинуть его в сессию
        user.id = dbUser.id;
        return true;
      } catch (error) {
        console.error("❌ Ошибка при сохранении пользователя в БД:", error);
        return false;
      }
    },

    // Переносим ID из токена в сессию фронтенда
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
