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
    birthYear: { type: Number },
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

export const ChildProfile: Model<IChildProfile> =
  mongoose.models.ChildProfile ??
  mongoose.model<IChildProfile>("ChildProfile", ChildProfileSchema);
