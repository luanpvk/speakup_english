import mongoose, { Schema, type Model } from "mongoose";
import type { IRefreshToken } from "@/modules/types/models";

const RefreshTokenSchema = new Schema<IRefreshToken>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tokenId: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
  },
  { timestamps: true }
);

export const RefreshToken: Model<IRefreshToken> =
  mongoose.models.RefreshToken ??
  mongoose.model<IRefreshToken>("RefreshToken", RefreshTokenSchema);
