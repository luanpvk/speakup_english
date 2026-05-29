import { connectDB } from "@/lib/mongodb";
import { LESSON_CONTENT, CHAPTER_MODULES } from "@/lib/data/lesson-content";
import { lessonContentToDbFields, LESSON_CONTENT_VERSION } from "@/lib/lessons/lesson-db";
import {
  SEED_AVATAR_ITEMS,
  SEED_REWARDS,
  SEED_ACHIEVEMENTS,
} from "@/lib/data/seed-content";
import {
  Module,
  Lesson,
  AvatarItem,
  Reward,
  Achievement,
} from "@/modules/repositories/models";

let seeded = false;

export async function ensureSeedData(): Promise<void> {
  if (seeded) return;
  await connectDB();

  for (const mod of CHAPTER_MODULES) {
    await Module.findOneAndUpdate({ slug: mod.slug }, { ...mod, isActive: true }, { upsert: true });
  }

  for (const content of LESSON_CONTENT) {
    const fields = lessonContentToDbFields(content);
    const existing = await Lesson.findOne({ slug: content.slug }).select("contentVersion").lean();
    if (!existing || (existing.contentVersion ?? 1) < LESSON_CONTENT_VERSION) {
      await Lesson.findOneAndUpdate({ slug: content.slug }, fields, { upsert: true, returnDocument: "after" });
    }
  }

  const activeSlugs = LESSON_CONTENT.map((c) => c.slug);
  await Lesson.updateMany({ slug: { $nin: activeSlugs } }, { isActive: false });

  const itemCount = await AvatarItem.countDocuments();
  if (itemCount === 0) {
    await AvatarItem.insertMany(SEED_AVATAR_ITEMS);
  }

  const rewardCount = await Reward.countDocuments();
  if (rewardCount === 0) {
    await Reward.insertMany(SEED_REWARDS);
  }

  const achievementCount = await Achievement.countDocuments();
  if (achievementCount === 0) {
    await Achievement.insertMany(SEED_ACHIEVEMENTS);
  }

  seeded = true;
}

/** Força atualização do conteúdo das lições (dev/admin) */
export async function forceReseedLessons(): Promise<void> {
  await connectDB();
  for (const content of LESSON_CONTENT) {
    const fields = lessonContentToDbFields(content);
    await Lesson.findOneAndUpdate({ slug: content.slug }, fields, { upsert: true, returnDocument: "after" });
  }
}
