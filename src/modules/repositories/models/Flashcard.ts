import mongoose, { Schema, type Model } from "mongoose";
import type { IFlashcard } from "@/modules/types/models";

const FlashcardSchema = new Schema<IFlashcard>(
  {
    childProfileId: { type: Schema.Types.ObjectId, ref: "ChildProfile", required: true, index: true },
    cardKey: { type: String, required: true },
    word: { type: String, required: true },
    translation: { type: String, required: true },
    emoji: { type: String },
    example: { type: String },
    lessonSlug: { type: String },
    intervalDays: { type: Number, default: 0 },
    easeFactor: { type: Number, default: 2.5 },
    repetitions: { type: Number, default: 0 },
    nextReviewAt: { type: Date, default: () => new Date() },
    lastReviewedAt: { type: Date },
  },
  { timestamps: true }
);

FlashcardSchema.index({ childProfileId: 1, cardKey: 1 }, { unique: true });
FlashcardSchema.index({ childProfileId: 1, nextReviewAt: 1 });

export const Flashcard: Model<IFlashcard> =
  mongoose.models.Flashcard ?? mongoose.model<IFlashcard>("Flashcard", FlashcardSchema);
