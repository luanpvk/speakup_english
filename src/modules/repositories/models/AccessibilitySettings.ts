import mongoose, { Schema, type Model } from "mongoose";
import type { IAccessibilitySettings } from "@/modules/types/models";

const AccessibilitySettingsSchema = new Schema<IAccessibilitySettings>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    childProfileId: {
      type: Schema.Types.ObjectId,
      ref: "ChildProfile",
      sparse: true,
    },
    reduceMotion: { type: Boolean, default: false },
    highContrast: { type: Boolean, default: false },
    accessibleFont: { type: Boolean, default: false },
    lowStimulusMode: { type: Boolean, default: false },
    soundEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

AccessibilitySettingsSchema.index(
  { userId: 1, childProfileId: 1 },
  { unique: true }
);

export const AccessibilitySettings: Model<IAccessibilitySettings> =
  mongoose.models.AccessibilitySettings ??
  mongoose.model<IAccessibilitySettings>(
    "AccessibilitySettings",
    AccessibilitySettingsSchema
  );
