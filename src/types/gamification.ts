export interface ChildStats {
  profile: {
    id: string;
    displayName: string;
    username: string;
    avatarEmoji: string;
    level: number;
    xp: number;
    coins: number;
    stars: number;
    medals: number;
    ownedItemSlugs: string[];
    purchasedRewardSlugs: string[];
  };
  streak: {
    current: number;
    longest: number;
    lastActivityDate?: string;
  };
  xpProgress: {
    current: number;
    needed: number;
    percent: number;
  };
  lessonsCompleted: number;
  totalLessons: number;
  avatar: {
    hairSlug: string;
    clothesSlug: string;
    accessorySlug?: string;
    baseEmoji: string;
  };
  modules: ModuleWithLessons[];
  achievements: AchievementWithStatus[];
}

export interface LessonSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  xpReward: number;
  coinReward: number;
  estimatedMinutes: number;
  completed: boolean;
  score?: number;
}

export interface ModuleWithLessons {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  requiredLevel: number;
  unlocked: boolean;
  lessonsTotal: number;
  lessonsCompleted: number;
  lessons: LessonSummary[];
}

export interface AchievementWithStatus {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  criteriaType: string;
  threshold: number;
  unlocked: boolean;
  unlockedAt?: string;
}

import type { LessonActivity } from "@/types/lesson";

export interface LessonDetail {
  lesson: {
    id: string;
    slug: string;
    moduleSlug: string;
    chapterTitle?: string;
    title: string;
    description: string;
    icon: string;
    activities: LessonActivity[];
    vocabulary: { word: string; translation: string; emoji?: string }[];
    quiz: { question: string; options: string[]; correctIndex: number }[];
    xpReward: number;
    coinReward: number;
    starReward: number;
    estimatedMinutes: number;
    totalSteps: number;
  };
  progress: { score: number; completedAt: string } | null;
}

export interface RankingEntry {
  rank: number;
  displayName: string;
  avatarEmoji: string;
  score: number;
  childProfileId: string;
  isCurrentUser: boolean;
}
