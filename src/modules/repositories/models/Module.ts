import mongoose, { Schema, type Model } from "mongoose";
import type { IModule } from "@/modules/types/models";

const ModuleSchema = new Schema<IModule>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: "📚" },
    order: { type: Number, required: true, index: true },
    requiredLevel: { type: Number, default: 1 },
    requiredModuleSlug: { type: String },
    xpReward: { type: Number, default: 50 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Module: Model<IModule> =
  mongoose.models.Module ?? mongoose.model<IModule>("Module", ModuleSchema);
