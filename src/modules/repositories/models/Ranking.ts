import mongoose, { Schema, type Model } from "mongoose";
import type { IRanking } from "@/modules/types/models";

const RankingSchema = new Schema<IRanking>(
  {
    childProfileId: {
      type: Schema.Types.ObjectId,
      ref: "ChildProfile",
      required: true,
      index: true,
    },
    displayName: { type: String, required: true },
    avatarEmoji: { type: String, default: "🦊" },
    score: { type: Number, default: 0, index: true },
    period: {
      type: String,
      enum: ["weekly", "alltime"],
      default: "alltime",
      index: true,
    },
    rank: { type: Number },
  },
  { timestamps: true }
);

RankingSchema.index({ period: 1, score: -1 });
RankingSchema.index({ childProfileId: 1, period: 1 }, { unique: true });

export const Ranking: Model<IRanking> =
  mongoose.models.Ranking ?? mongoose.model<IRanking>("Ranking", RankingSchema);
