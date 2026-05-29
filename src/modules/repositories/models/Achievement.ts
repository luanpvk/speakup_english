import mongoose, { Schema, type Model } from "mongoose";
import type { IAchievement } from "@/modules/types/models";

const AchievementSchema = new Schema<IAchievement>(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: "🏅" },
    criteriaType: {
      type: String,
      enum: ["lessons", "streak", "xp", "level", "coins"],
      required: true,
    },
    threshold: { type: Number, required: true },
    xpBonus: { type: Number, default: 0 },
    coinBonus: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Achievement: Model<IAchievement> =
  mongoose.models.Achievement ??
  mongoose.model<IAchievement>("Achievement", AchievementSchema);
