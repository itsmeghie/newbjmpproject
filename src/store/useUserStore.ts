import { UserAccounts } from "@/lib/definitions";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserState = {
  user: UserAccounts | null;
  setUser: (user: UserAccounts) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-store", // localStorage key
    }
  )
);
