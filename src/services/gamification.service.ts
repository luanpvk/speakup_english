import { apiFetch } from "@/services/api-client";
import type { ChildStats, LessonDetail, RankingEntry } from "@/types/gamification";
import type { DailyFlashcardSession, FlashcardRating } from "@/types/flashcard";


export const gamificationApi = {
  getStats: () => apiFetch<ChildStats>("/api/gamification/stats"),

  getLesson: (slug: string) =>
    apiFetch<LessonDetail>(`/api/gamification/lessons/${slug}`),

  completeLesson: (slug: string, score: number, timeSpentSeconds: number) =>
    apiFetch<{
      xpGained: number;
      coinsGained: number;
      starsGained: number;
      isFirstComplete: boolean;
      level: number;
      newAchievements: string[];
    }>(`/api/gamification/lessons/${slug}/complete`, {
      method: "POST",
      body: JSON.stringify({ score, timeSpentSeconds }),
    }),

  getRanking: (period: "weekly" | "alltime" = "alltime") =>
    apiFetch<{ ranking: RankingEntry[]; period: string }>(
      `/api/gamification/ranking?period=${period}`
    ),

  getShop: () =>
    apiFetch<{
      coins: number;
      level: number;
      rewards: Array<Record<string, unknown>>;
      avatarItems: Array<Record<string, unknown>>;
    }>("/api/gamification/shop"),

  purchaseReward: (rewardSlug: string) =>
    apiFetch<{ coins: number; stars: number }>("/api/gamification/shop/purchase", {
      method: "POST",
      body: JSON.stringify({ rewardSlug }),
    }),

  purchaseAvatarItem: (itemSlug: string) =>
    apiFetch<{ coins: number }>("/api/gamification/shop/purchase", {
      method: "POST",
      body: JSON.stringify({ itemSlug }),
    }),

  getAvatar: () =>
    apiFetch<{
      avatar: {
        hairSlug: string;
        clothesSlug: string;
        accessorySlug?: string;
        backgroundSlug?: string;
        baseEmoji: string;
      };
      ownedItemSlugs: string[];
      coins: number;
      items: Array<Record<string, unknown>>;
    }>("/api/gamification/avatar"),

  updateAvatar: (data: Record<string, string | null | undefined>) =>
    apiFetch<Record<string, unknown>>("/api/gamification/avatar", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  updateProfile: (data: { hyperfocus?: string | null }) =>
    apiFetch<{ hyperfocus: string | null }>("/api/gamification/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  getDailyFlashcards: () =>
    apiFetch<DailyFlashcardSession>("/api/gamification/flashcards"),

  reviewFlashcard: (cardId: string, rating: FlashcardRating) =>
    apiFetch<{ session: DailyFlashcardSession; reviewsDoneToday: number }>(
      "/api/gamification/flashcards",
      {
      method: "POST",
      body: JSON.stringify({ cardId, rating }),
    }),
};
