import "dotenv/config";

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { db } from "@/app/lib/db";
import { Role } from "@/prisma/generated";

export const makeAuth = async () => {
  const googleSession = await auth();
  
if (!googleSession) {
    return null;
  }
  const googleEmail = googleSession.user?.email;
  
  let user = await db.user.findUnique({
    where: { email: googleEmail ?? undefined },
  });
  
  if (!user) {
    user = await db.user.create({
      data: {
        name: googleSession.user.name || "Пользователь Google",
        email: googleEmail,
        image: googleSession.user.image || "",
        role: "USER",
      },
    });
  }
  return user;
}


declare module "next-auth" {
  interface User {
    role?: Role;
  }
  interface Session {
    user: {
      id: string;
      role: Role;
    } & import("next-auth").DefaultSession["user"];
  }
}
declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    role?: Role;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
        },
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      try {
        let dbUser = await db.user.findUnique({ where: { email: user.email } });
        if (!dbUser) {
          dbUser = await db.user.create({
            data: {
              name: user.name || "Пользователь Google",
              email: user.email,
              image: user.image || "",
              role: "USER"
            }
          });
        }
        user.id = dbUser.id;
        user.role = dbUser.role;
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token.id && token.role) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
});
