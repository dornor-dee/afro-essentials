export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
};

export type AuthSession = {
  accessToken: string;
  user: AuthUser;
};

let inMemorySession: AuthSession | null = null;

export function getAuthSession(): AuthSession | null {
  return inMemorySession;
}

export function getAccessToken(): string | null {
  return inMemorySession?.accessToken ?? null;
}

export function setAuthSession(session: AuthSession) {
  inMemorySession = session;
}

export function clearAuthSession() {
  inMemorySession = null;
}
