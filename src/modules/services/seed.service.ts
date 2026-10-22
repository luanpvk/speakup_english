import mongoose from "mongoose";
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

/** Promise compartilhada: requisições simultâneas esperam o mesmo seed em vez de repetir */
let seeding: Promise<void> | null = null;

export function ensureSeedData(): Promise<void> {
  seeding ??= runSeed().catch((error) => {
    seeding = null; // permite tentar de novo na próxima requisição
    throw error;
  });
  return seeding;
}

async function runSeed(): Promise<void> {
  await connectDB();

  // Poucas idas ao banco: importante com MongoDB remoto (antes eram ~900 consultas sequenciais)
  await Module.bulkWrite(
    CHAPTER_MODULES.map((mod) => ({
      updateOne: { filter: { slug: mod.slug }, update: { $set: { ...mod, isActive: true } }, upsert: true },
    })),
    { ordered: false }
  );

  const upToDate = new Set(
    (
      await Lesson.find({ contentVersion: mongoose.trusted({ $gte: LESSON_CONTENT_VERSION }) })
        .select("slug")
        .lean()
    ).map((l) => l.slug)
  );
  const outdated = LESSON_CONTENT.filter((c) => !upToDate.has(c.slug));
  if (outdated.length > 0) {
    await Lesson.bulkWrite(
      outdated.map((content) => ({
        updateOne: {
          filter: { slug: content.slug },
          update: { $set: lessonContentToDbFields(content) },
          upsert: true,
        },
      })),
      { ordered: false }
    );
  }

  const activeSlugs = LESSON_CONTENT.map((c) => c.slug);
  await Lesson.updateMany({ slug: mongoose.trusted({ $nin: activeSlugs }) }, { isActive: false });

  await AvatarItem.bulkWrite(
    SEED_AVATAR_ITEMS.map((item) => ({
      updateOne: { filter: { slug: item.slug }, update: { $set: { ...item, isActive: true } }, upsert: true },
    })),
    { ordered: false }
  );

  const rewardCount = await Reward.countDocuments();
  if (rewardCount === 0) {
    await Reward.insertMany(SEED_REWARDS);
  }

  await Achievement.bulkWrite(
    SEED_ACHIEVEMENTS.map((a) => ({
      updateOne: { filter: { slug: a.slug }, update: { $set: { ...a, isActive: true } }, upsert: true },
    })),
    { ordered: false }
  );
}

/** Força atualização do conteúdo das lições (dev/admin) */
export async function forceReseedLessons(): Promise<void> {
  await connectDB();
  for (const content of LESSON_CONTENT) {
    const fields = lessonContentToDbFields(content);
    await Lesson.findOneAndUpdate({ slug: content.slug }, fields, { upsert: true, returnDocument: "after" });
  }
}
