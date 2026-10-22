import type { Types } from "mongoose";
import type { UserRole } from "@/types";

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  parentId?: Types.ObjectId;
  isEmailVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IParent {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  phone?: string;
  children: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IChildProfile {
  _id: Types.ObjectId;
  parentId: Types.ObjectId;
  userId: Types.ObjectId;
  displayName: string;
  username: string;
  avatarEmoji: string;
  pinHash: string;
  failedPinAttempts?: number;
  pinLockedUntil?: Date;
  birthYear?: number;
  hyperfocus?: string;
  level: number;
  xp: number;
  coins: number;
  stars: number;
  medals: number;
  ownedItemSlugs: string[];
  purchasedRewardSlugs: string[];
  flashcardReviewsToday?: number;
  flashcardReviewDate?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFlashcard {
  _id: Types.ObjectId;
  childProfileId: Types.ObjectId;
  cardKey: string;
  word: string;
  translation: string;
  emoji?: string;
  example?: string;
  lessonSlug?: string;
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
  nextReviewAt: Date;
  lastReviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IModule {
  _id: Types.ObjectId;
  slug: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  requiredLevel: number;
  requiredModuleSlug?: string;
  xpReward: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILessonVocab {
  word: string;
  translation: string;
  emoji?: string;
  audioHint?: string;
}

export interface ILessonQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  hint?: string;
}

export interface ILessonActivity {
  id: string;
  type: string;
  title: string;
  instruction?: string;
  data: Record<string, unknown>;
}

export interface ILesson {
  _id: Types.ObjectId;
  slug: string;
  moduleSlug: string;
  chapterTitle?: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  xpReward: number;
  coinReward: number;
  starReward: number;
  estimatedMinutes: number;
  contentVersion?: number;
  activities: ILessonActivity[];
  vocabulary: ILessonVocab[];
  quiz: ILessonQuiz[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReward {
  _id: Types.ObjectId;
  slug: string;
  name: string;
  description: string;
  icon: string;
  cost: number;
  type: "cosmetic" | "boost" | "badge";
  avatarItemSlug?: string;
  requiredLevel: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAchievement {
  _id: Types.ObjectId;
  slug: string;
  name: string;
  description: string;
  icon: string;
  criteriaType: "lessons" | "streak" | "xp" | "level" | "coins";
  threshold: number;
  xpBonus: number;
  coinBonus: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAvatarItem {
  _id: Types.ObjectId;
  slug: string;
  name: string;
  type: "hair" | "clothes" | "accessory" | "background";
  icon: string;
  price: number;
  unlockLevel: number;
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAvatar {
  _id: Types.ObjectId;
  childProfileId: Types.ObjectId;
  hairSlug: string;
  clothesSlug: string;
  accessorySlug?: string;
  backgroundSlug?: string;
  baseEmoji: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRanking {
  _id: Types.ObjectId;
  childProfileId: Types.ObjectId;
  displayName: string;
  avatarEmoji: string;
  score: number;
  period: "weekly" | "alltime";
  rank?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChildAchievement {
  _id: Types.ObjectId;
  childProfileId: Types.ObjectId;
  achievementSlug: string;
  unlockedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAccessibilitySettings {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  childProfileId?: Types.ObjectId;
  reduceMotion: boolean;
  highContrast: boolean;
  accessibleFont: boolean;
  lowStimulusMode: boolean;
  soundEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProgress {
  _id: Types.ObjectId;
  childProfileId: Types.ObjectId;
  lessonId: string;
  moduleId: string;
  score: number;
  completedAt: Date;
  timeSpentSeconds: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStreak {
  _id: Types.ObjectId;
  childProfileId: Types.ObjectId;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRefreshToken {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  tokenId: string;
  expiresAt: Date;
  createdAt: Date;
}
