import mongoose, { Schema, type Model } from "mongoose";
import type { IAvatar } from "@/modules/types/models";

const AvatarSchema = new Schema<IAvatar>(
  {
    childProfileId: {
      type: Schema.Types.ObjectId,
      ref: "ChildProfile",
      required: true,
      unique: true,
      index: true,
    },
    hairSlug: { type: String, default: "hair-default" },
    clothesSlug: { type: String, default: "clothes-default" },
    accessorySlug: { type: String },
    baseEmoji: { type: String, default: "🦊" },
  },
  { timestamps: true }
);

export const Avatar: Model<IAvatar> =
  mongoose.models.Avatar ?? mongoose.model<IAvatar>("Avatar", AvatarSchema);
