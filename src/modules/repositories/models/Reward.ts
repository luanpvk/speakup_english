import mongoose, { Schema, type Model } from "mongoose";
import type { IReward } from "@/modules/types/models";

const RewardSchema = new Schema<IReward>(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: "🎁" },
    cost: { type: Number, required: true },
    type: {
      type: String,
      enum: ["cosmetic", "boost", "badge"],
      default: "cosmetic",
    },
    avatarItemSlug: { type: String },
    requiredLevel: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Reward: Model<IReward> =
  mongoose.models.Reward ?? mongoose.model<IReward>("Reward", RewardSchema);
