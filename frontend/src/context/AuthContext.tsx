"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { initializeSession } from "@/lib/auth-init";
import {
  clearAuthSession,
  setAuthSession,
  type AuthSession,
  type AuthUser,
} from "@/lib/auth-session";

type AuthContextValue = {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setSession: (session: AuthSession) => void;
  logout: () => void;
};

const defaultAuthValue: AuthContextValue = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,
  setSession: () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextValue>(defaultAuthValue);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    initializeSession().then((restoredSession) => {
      if (!cancelled) {
        setSessionState(restoredSession);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const setSession = (nextSession: AuthSession) => {
    setAuthSession(nextSession);
    setSessionState(nextSession);
  };

  const logout = () => {
    clearAuthSession();
    setSessionState(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      accessToken: session?.accessToken ?? null,
      isAuthenticated: Boolean(session),
      isLoading,
      setSession,
      logout,
    }),
    [session, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
