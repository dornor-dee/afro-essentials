"use client";

import { createContext, useContext, type ReactNode } from "react";

type AuthUser = {
  name: string;
  email: string;
} | null;

type AuthContextValue = {
  user: AuthUser;
  logout: () => void;
};

const defaultAuthValue: AuthContextValue = {
  user: null,
  logout: () => {},
};

const AuthContext = createContext<AuthContextValue>(defaultAuthValue);

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider value={defaultAuthValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
