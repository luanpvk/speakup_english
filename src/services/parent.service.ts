import { apiFetch } from "@/services/api-client";

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


export const parentApi = {
  listChildren: () =>
    apiFetch<{ children: ChildListItem[] }>("/api/parent/children"),

  createChild: (data: {
    displayName: string;
    username: string;
    pin: string;
    avatarEmoji?: string;
    hyperfocus?: string;
    birthYear?: number;
  }) =>
    apiFetch<{ child: ChildListItem }>("/api/parent/children", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
