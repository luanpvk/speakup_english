import mongoose, { Schema, type Model } from "mongoose";
import type { IChildAchievement } from "@/modules/types/models";

const ChildAchievementSchema = new Schema<IChildAchievement>(
  {
    childProfileId: {
      type: Schema.Types.ObjectId,
      ref: "ChildProfile",
      required: true,
      index: true,
    },
    achievementSlug: { type: String, required: true },
    unlockedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ChildAchievementSchema.index(
  { childProfileId: 1, achievementSlug: 1 },
  { unique: true }
);

export const ChildAchievement: Model<IChildAchievement> =
  mongoose.models.ChildAchievement ??
  mongoose.model<IChildAchievement>("ChildAchievement", ChildAchievementSchema);
