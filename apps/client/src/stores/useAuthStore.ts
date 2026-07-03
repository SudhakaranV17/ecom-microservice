import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  // add other actions here if needed, like:
  // setToken: (token: string | null) => void;
}

// Notice the extra () after <AuthState>
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
    }),
    {
      name: "auth-storage", // The key used in localStorage
    },
  ),
);
