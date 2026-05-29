import mongoose, { Schema, type Model } from "mongoose";
import type { IStreak } from "@/modules/types/models";

const StreakSchema = new Schema<IStreak>(
  {
    childProfileId: {
      type: Schema.Types.ObjectId,
      ref: "ChildProfile",
      required: true,
      unique: true,
      index: true,
    },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastActivityDate: { type: Date, required: false },
  },
  { timestamps: true }
);

export const Streak: Model<IStreak> =
  mongoose.models.Streak ?? mongoose.model<IStreak>("Streak", StreakSchema);
