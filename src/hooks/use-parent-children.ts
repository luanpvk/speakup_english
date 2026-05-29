"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { parentApi } from "@/services/parent.service";

export const parentChildrenKeys = {
  all: ["parent", "children"] as const,
};

export function useParentChildren(enabled = true) {
  return useQuery({
    queryKey: parentChildrenKeys.all,
    queryFn: async () => {
      const res = await parentApi.listChildren();
      if (!res.success || !res.data) {
        throw new Error(res.error ?? "Erro ao carregar filhos");
      }
      return res.data.children;
    },
    enabled,
  });
}

export function useCreateChild() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: parentApi.createChild,
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: parentChildrenKeys.all });
      }
    },
  });
}
