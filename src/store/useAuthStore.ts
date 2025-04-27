import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: true,
      setIsAuthenticated: (auth) => set(() => ({ isAuthenticated: auth })),
    }),
    { name: "auth-storage" }
  )
);
