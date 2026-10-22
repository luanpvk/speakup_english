import mongoose, { Schema, type Model } from "mongoose";
import type { IAvatarItem } from "@/modules/types/models";

const AvatarItemSchema = new Schema<IAvatarItem>(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["hair", "clothes", "accessory", "background"],
      required: true,
    },
    icon: { type: String, required: true },
    price: { type: Number, default: 0 },
    unlockLevel: { type: Number, default: 1 },
    isDefault: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const AvatarItem: Model<IAvatarItem> =
  mongoose.models.AvatarItem ??
  mongoose.model<IAvatarItem>("AvatarItem", AvatarItemSchema);
