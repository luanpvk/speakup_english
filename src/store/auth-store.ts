"use client";

import { create } from "zustand";
import type { AuthUser } from "@/types";

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

const LAST_ROLE_KEY = "speakup-last-role";

/** Tipo da última conta usada neste aparelho: escolhe o skeleton certo antes da sessão carregar */
export function readLastRole(): AuthUser["role"] | null {
  try {
    const role = localStorage.getItem(LAST_ROLE_KEY);
    return role === "parent" || role === "child" ? role : null;
  } catch {
    return null;
  }
}

function rememberRole(role?: AuthUser["role"]) {
  try {
    if (role) localStorage.setItem(LAST_ROLE_KEY, role);
  } catch {
    // sem storage: usa o skeleton neutro
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => {
    rememberRole(user?.role);
    set({ user, isLoading: false });
  },
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null, isLoading: false }),
}));
