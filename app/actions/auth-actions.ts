"use server";

import { signIn, signOut } from "../services/auth";

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function signInAction() {
  await signIn("google")
}