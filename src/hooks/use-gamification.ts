"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { gamificationApi } from "@/services/gamification.service";

export const gamificationKeys = {
  stats: ["gamification", "stats"] as const,
  lesson: (slug: string) => ["gamification", "lesson", slug] as const,
  ranking: (period: string) => ["gamification", "ranking", period] as const,
  shop: ["gamification", "shop"] as const,
  avatar: ["gamification", "avatar"] as const,
  flashcards: ["gamification", "flashcards", "daily"] as const,
};

export function useChildStats(enabled = true) {
  return useQuery({
    queryKey: gamificationKeys.stats,
    queryFn: async () => {
      const res = await gamificationApi.getStats();
      if (!res.success || !res.data) throw new Error(res.error ?? "Erro ao carregar");
      return res.data;
    },
    enabled,
    staleTime: 30_000,
  });
}

export function useLesson(slug: string, enabled = true) {
  return useQuery({
    queryKey: gamificationKeys.lesson(slug),
    queryFn: async () => {
      const res = await gamificationApi.getLesson(slug);
      if (!res.success || !res.data) throw new Error(res.error ?? "Lição não encontrada");
      return res.data;
    },
    enabled: enabled && Boolean(slug),
  });
}

export function useCompleteLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      slug,
      score,
      timeSpentSeconds,
    }: {
      slug: string;
      score: number;
      timeSpentSeconds: number;
    }) => gamificationApi.completeLesson(slug, score, timeSpentSeconds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gamification"] });
    },
  });
}

export function useRanking(period: "weekly" | "alltime" = "alltime") {
  return useQuery({
    queryKey: gamificationKeys.ranking(period),
    queryFn: async () => {
      const res = await gamificationApi.getRanking(period);
      if (!res.success || !res.data) throw new Error(res.error ?? "Erro");
      return res.data.ranking;
    },
  });
}

export function useShop(enabled = true) {
  return useQuery({
    queryKey: gamificationKeys.shop,
    queryFn: async () => {
      const res = await gamificationApi.getShop();
      if (!res.success || !res.data) {
        throw new Error(res.error ?? "Não foi possível carregar a loja");
      }
      return res.data;
    },
    enabled,
    retry: 2,
  });
}

export function useAvatar(enabled = true) {
  return useQuery({
    queryKey: gamificationKeys.avatar,
    queryFn: async () => {
      const res = await gamificationApi.getAvatar();
      if (!res.success || !res.data) {
        throw new Error(res.error ?? "Não foi possível carregar o avatar");
      }
      return res.data;
    },
    enabled,
    retry: 2,
  });
}

export function useDailyFlashcards(enabled = true) {
  return useQuery({
    queryKey: gamificationKeys.flashcards,
    queryFn: async () => {
      const res = await gamificationApi.getDailyFlashcards();
      if (!res.success || !res.data) throw new Error(res.error ?? "Erro ao carregar flashcards");
      return res.data;
    },
    enabled,
    staleTime: 10_000,
  });
}

export function useReviewFlashcard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cardId, rating }: { cardId: string; rating: 1 | 2 | 3 | 4 }) =>
      gamificationApi.reviewFlashcard(cardId, rating),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gamificationKeys.flashcards });
      queryClient.invalidateQueries({ queryKey: gamificationKeys.stats });
    },
  });
}
