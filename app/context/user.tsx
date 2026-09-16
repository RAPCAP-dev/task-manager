"use client";

import { User } from "@/prisma/generated";
import React from "react";

export type UserContextType = {
  user: User;
  signOut: () => void;
};

export const UserContext = React.createContext<UserContextType | null>(null);

export const UserProvider = ({
  children,
  user,
  signOut,
}: {
  children: React.ReactNode;
  user: User;
  signOut: () => void;
}) => {
  return (
    <UserContext.Provider value={{ user, signOut }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error("useUser должен использоваться строго внутри UserProvider");
  }
  return context;
};
