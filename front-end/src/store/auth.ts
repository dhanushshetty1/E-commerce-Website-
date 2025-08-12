import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: number | null;
  email?: string;
  role?: string;
};

type AuthState = {
  token: string | null;
  user: User | null;
  login: (token: string, user?: Partial<User>) => void;
  logout: () => void;
};

function parseJwt(token: string): unknown {
  try {
    const base64 = token.split(".")[1];
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: (token, user) => {
        const payload = parseJwt(token) as
          | { userId?: number; id?: number; email?: string; role?: string; roles?: string[] }
          | null;

        const derived: User = {
          id: Number(user?.id ?? payload?.userId ?? payload?.id ?? null),
          email: user?.email ?? payload?.email,
          role: user?.role ?? (payload?.role ?? (payload?.roles?.[0] as string | undefined)),
        };
        set({ token, user: derived });
      },
      logout: () => set({ token: null, user: null }),
    }),
    { name: "auth" }
  )
);
