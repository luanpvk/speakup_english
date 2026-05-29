import mongoose, { Schema, type Model } from "mongoose";
import type { IProgress } from "@/modules/types/models";

const ProgressSchema = new Schema<IProgress>(
  {
    childProfileId: {
      type: Schema.Types.ObjectId,
      ref: "ChildProfile",
      required: true,
      index: true,
    },
    lessonId: { type: String, required: true },
    moduleId: { type: String, required: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    completedAt: { type: Date, default: Date.now },
    timeSpentSeconds: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProgressSchema.index({ childProfileId: 1, lessonId: 1 }, { unique: true });

export const Progress: Model<IProgress> =
  mongoose.models.Progress ??
  mongoose.model<IProgress>("Progress", ProgressSchema);
