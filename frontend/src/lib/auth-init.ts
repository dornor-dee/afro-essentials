import { api, refreshAccessToken } from "./axios-client";
import {
  setAuthSession,
  type AuthSession,
  type AuthUser,
} from "./auth-session";

export async function initializeSession(): Promise<AuthSession | null> {
  try {
    const accessToken = await refreshAccessToken();

    const { data } = await api.get<{ success: boolean; user: AuthUser }>(
      "/auth/me",
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    if (!data?.user) {
      return null;
    }

    const session: AuthSession = { accessToken, user: data.user };
    setAuthSession(session);

    return session;
  } catch {
    return null;
  }
}
