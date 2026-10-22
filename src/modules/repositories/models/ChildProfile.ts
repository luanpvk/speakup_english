import mongoose, { Schema, type Model } from "mongoose";
import type { IChildProfile } from "@/modules/types/models";

const ChildProfileSchema = new Schema<IChildProfile>(
  {
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Parent",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    displayName: { type: String, required: true, trim: true },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    avatarEmoji: { type: String, default: "🦊" },
    pinHash: { type: String, required: true, select: false },
    /** Proteção contra tentativa de adivinhar o PIN (só 10.000 combinações) */
    failedPinAttempts: { type: Number, default: 0, select: false },
    pinLockedUntil: { type: Date, select: false },
    birthYear: { type: Number },
    /** Tema de hiperfoco (HYPERFOCUS_THEMES): libera e recomenda lições relacionadas */
    hyperfocus: { type: String },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    coins: { type: Number, default: 50 },
    stars: { type: Number, default: 0 },
    medals: { type: Number, default: 0 },
    ownedItemSlugs: { type: [String], default: [] },
    purchasedRewardSlugs: { type: [String], default: [] },
    flashcardReviewsToday: { type: Number, default: 0 },
    flashcardReviewDate: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Ranking: maiores XP entre perfis ativos
ChildProfileSchema.index({ isActive: 1, xp: -1 });

export const ChildProfile: Model<IChildProfile> =
  mongoose.models.ChildProfile ??
  mongoose.model<IChildProfile>("ChildProfile", ChildProfileSchema);
