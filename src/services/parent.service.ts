import type { ApiResponse } from "@/types";

export interface ChildListItem {
  id: string;
  childProfileId: string;
  displayName: string;
  username: string;
  avatarEmoji: string;
  level: number;
  xp: number;
  isActive: boolean;
}

async function fetchApi<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  return res.json() as Promise<ApiResponse<T>>;
}

export const parentApi = {
  listChildren: () =>
    fetchApi<{ children: ChildListItem[] }>("/api/parent/children"),

  createChild: (data: {
    displayName: string;
    username: string;
    pin: string;
    avatarEmoji?: string;
    birthYear?: number;
  }) =>
    fetchApi<{ child: ChildListItem }>("/api/parent/children", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
