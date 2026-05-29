import type { ApiResponse, AuthUser } from "@/types";

async function fetchApi<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: "include",
  });
  return res.json() as Promise<ApiResponse<T>>;
}

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    fetchApi<{ user: AuthUser }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  loginParent: (data: { email: string; password: string }) =>
    fetchApi<{ user: AuthUser }>("/api/auth/login/parent", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  loginChild: (data: { username: string; pin: string }) =>
    fetchApi<{ user: AuthUser }>("/api/auth/login/child", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: () =>
    fetchApi<{ ok: boolean }>("/api/auth/logout", { method: "POST" }),

  me: () => fetchApi<{ user: AuthUser }>("/api/auth/me"),

  refresh: () =>
    fetchApi<{ ok: boolean }>("/api/auth/refresh", { method: "POST" }),

  forgotPassword: (email: string) =>
    fetchApi<{ message: string; devResetToken?: string }>(
      "/api/auth/forgot-password",
      { method: "POST", body: JSON.stringify({ email }) }
    ),

  resetPassword: (token: string, password: string) =>
    fetchApi<{ ok: boolean }>("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    }),
};
