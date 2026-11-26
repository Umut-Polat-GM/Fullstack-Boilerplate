import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

/**
 * Auth state (persisted to localStorage).
 * Usage: const user = useAuthStore((s) => s.user);
 * Outside React: useAuthStore.getState().logout();
 */
export const useAuthStore = create()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        login: ({ user, token }) => set({ user, token }, false, "auth/login"),
        logout: () => set({ user: null, token: null }, false, "auth/logout"),
      }),
      { name: "auth", storage: createJSONStorage(() => localStorage) },
    ),
    { name: "AuthStore", enabled: import.meta.env.DEV },
  ),
);

export const useIsAuthenticated = () => useAuthStore((s) => Boolean(s.token));
