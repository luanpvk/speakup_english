import { apiFetch } from "@/services/api-client";
import type { AuthUser } from "@/types";


export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    apiFetch<{ user: AuthUser }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  loginParent: (data: { email: string; password: string }) =>
    apiFetch<{ user: AuthUser }>("/api/auth/login/parent", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  loginChild: (data: { parentEmail: string; username: string; pin: string }) =>
    apiFetch<{ user: AuthUser }>("/api/auth/login/child", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: () =>
    apiFetch<{ ok: boolean }>("/api/auth/logout", { method: "POST" }),

  me: () => apiFetch<{ user: AuthUser }>("/api/auth/me"),

  refresh: () =>
    apiFetch<{ ok: boolean }>("/api/auth/refresh", { method: "POST" }),

  forgotPassword: (email: string) =>
    apiFetch<{ message: string; devResetToken?: string }>(
      "/api/auth/forgot-password",
      { method: "POST", body: JSON.stringify({ email }) }
    ),

  resetPassword: (token: string, password: string) =>
    apiFetch<{ ok: boolean }>("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    }),
};
