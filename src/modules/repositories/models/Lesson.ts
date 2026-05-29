import mongoose, { Schema, type Model } from "mongoose";
import type { ILesson } from "@/modules/types/models";

const VocabSchema = new Schema(
  {
    word: { type: String, required: true },
    translation: { type: String, required: true },
    emoji: { type: String },
    audioHint: { type: String },
  },
  { _id: false }
);

const QuizSchema = new Schema(
  {
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctIndex: { type: Number, required: true },
    hint: { type: String },
  },
  { _id: false }
);

const ActivitySchema = new Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    instruction: { type: String },
    data: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false }
);

const LessonSchema = new Schema<ILesson>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    moduleSlug: { type: String, required: true, index: true },
    chapterTitle: { type: String },
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: "✨" },
    order: { type: Number, required: true },
    xpReward: { type: Number, default: 25 },
    coinReward: { type: Number, default: 10 },
    starReward: { type: Number, default: 1 },
    estimatedMinutes: { type: Number, default: 5 },
    contentVersion: { type: Number, default: 1 },
    activities: [ActivitySchema],
    vocabulary: [VocabSchema],
    quiz: [QuizSchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Lesson: Model<ILesson> =
  mongoose.models.Lesson ?? mongoose.model<ILesson>("Lesson", LessonSchema);
