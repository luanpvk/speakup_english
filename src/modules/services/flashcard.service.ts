import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { FLASHCARD_BANK, FLASHCARD_BANK_SIZE } from "@/lib/data/flashcard-bank";
import { Flashcard, ChildProfile } from "@/modules/repositories/models";
import type { IFlashcard } from "@/modules/types/models";

export const MAX_DAILY_FLASHCARD_REVIEWS = 10;

export type FlashcardRating = 1 | 2 | 3 | 4;

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

async function resetDailyCounterIfNeeded(profile: {
  flashcardReviewsToday?: number;
  flashcardReviewDate?: string;
  save: () => Promise<unknown>;
}) {
  const key = todayKey();
  if (profile.flashcardReviewDate !== key) {
    profile.flashcardReviewsToday = 0;
    profile.flashcardReviewDate = key;
    await profile.save();
  }
}

function childOid(childProfileId: string) {
  return new mongoose.Types.ObjectId(childProfileId);
}

/** Garante baralho de 1000+ cartões do banco global para a criança */
export async function ensureFlashcardBankForChild(childProfileId: string): Promise<number> {
  await connectDB();
  const oid = childOid(childProfileId);
  const now = new Date();

  // Corrige textos antigos "I like car" mantendo o progresso de revisão do card
  if (await Flashcard.exists({ childProfileId: oid, cardKey: /^bank:like-/, word: /^I like (?!the )/ })) {
    await Flashcard.bulkWrite(
      FLASHCARD_BANK.filter((e) => e.id.startsWith("like-")).map((entry) => ({
        updateOne: {
          filter: { childProfileId: oid, cardKey: `bank:${entry.id}` },
          update: {
            $set: { word: entry.word, translation: entry.translation, example: entry.example },
          },
        },
      })),
      { ordered: false }
    );
  }

  const total = await Flashcard.countDocuments({ childProfileId: oid });
  if (total >= FLASHCARD_BANK_SIZE) {
    await Flashcard.updateMany(
      {
        childProfileId: oid,
        $or: [{ nextReviewAt: mongoose.trusted({ $exists: false }) }, { nextReviewAt: null }],
      },
      { $set: { nextReviewAt: now } }
    );
    return total;
  }

  const existing = await Flashcard.find({ childProfileId: oid }).select("cardKey").lean();
  const existingKeys = new Set(existing.map((e) => e.cardKey));

  const missing = FLASHCARD_BANK.filter((e) => !existingKeys.has(`bank:${e.id}`));
  const BATCH = 200;

  for (let i = 0; i < missing.length; i += BATCH) {
    const slice = missing.slice(i, i + BATCH);
    await Flashcard.bulkWrite(
      slice.map((entry) => ({
        updateOne: {
          filter: { childProfileId: oid, cardKey: `bank:${entry.id}` },
          update: {
            $set: {
              word: entry.word,
              translation: entry.translation,
              emoji: entry.emoji,
              example: entry.example,
              lessonSlug: `bank-${entry.category}`,
            },
            $setOnInsert: {
              childProfileId: oid,
              cardKey: `bank:${entry.id}`,
              intervalDays: 0,
              easeFactor: 2.5,
              repetitions: 0,
              nextReviewAt: now,
            },
          },
          upsert: true,
        },
      })),
      { ordered: false }
    );
  }

  return Flashcard.countDocuments({ childProfileId: oid });
}

export async function upsertFlashcardsFromLesson(
  childProfileId: string,
  lessonSlug: string,
  words: { word: string; translation: string; emoji?: string; example?: string }[]
) {
  if (!words.length) return;
  await connectDB();
  const oid = childOid(childProfileId);
  const now = new Date();

  for (const w of words) {
    const cardKey = `${lessonSlug}:${w.word.toLowerCase()}`;
    await Flashcard.findOneAndUpdate(
      { childProfileId: oid, cardKey },
      {
        $set: {
          word: w.word,
          translation: w.translation,
          emoji: w.emoji,
          example: w.example,
          lessonSlug,
        },
        $setOnInsert: {
          childProfileId: oid,
          cardKey,
          intervalDays: 0,
          easeFactor: 2.5,
          repetitions: 0,
          nextReviewAt: now,
        },
      },
      { upsert: true }
    );
  }
}

export async function getDailyFlashcardSession(childProfileId: string) {
  await connectDB();
  const oid = childOid(childProfileId);
  const [profile, totalCardsInBank] = await Promise.all([
    ChildProfile.findById(childProfileId).select("flashcardReviewsToday flashcardReviewDate"),
    ensureFlashcardBankForChild(childProfileId),
  ]);
  if (!profile) throw new Error("Perfil não encontrado");

  await resetDailyCounterIfNeeded(profile);
  const reviewsDoneToday = profile.flashcardReviewsToday ?? 0;
  const remainingToday = Math.max(0, MAX_DAILY_FLASHCARD_REVIEWS - reviewsDoneToday);

  const dueFilter = { childProfileId: oid, nextReviewAt: mongoose.trusted({ $lte: new Date() }) };
  // Só os cartões de hoje (antes vinham todos os vencidos, ~1000, para usar 10)
  const [dueCards, totalDue, totalCards] = await Promise.all([
    remainingToday > 0
      ? Flashcard.find(dueFilter).sort({ nextReviewAt: 1, repetitions: 1 }).limit(remainingToday).lean()
      : [],
    Flashcard.countDocuments(dueFilter),
    Flashcard.countDocuments({ childProfileId: oid }),
  ]);

  const queue = dueCards.map((c) => serializeCard(c));

  return {
    queue,
    reviewsDoneToday,
    dailyLimit: MAX_DAILY_FLASHCARD_REVIEWS,
    remainingToday,
    totalDue,
    totalCards,
    bankSize: FLASHCARD_BANK_SIZE,
    isDailyComplete: remainingToday === 0,
    needsSync: totalCards === 0 && totalCardsInBank === 0,
  };
}

function serializeCard(c: IFlashcard) {
  return {
    id: c._id.toString(),
    word: c.word,
    translation: c.translation,
    emoji: c.emoji,
    example: c.example,
    lessonSlug: c.lessonSlug,
    intervalDays: c.intervalDays,
    repetitions: c.repetitions,
    nextReviewAt: c.nextReviewAt,
  };
}

export async function reviewFlashcard(
  childProfileId: string,
  cardId: string,
  rating: FlashcardRating
) {
  await connectDB();
  const profile = await ChildProfile.findById(childProfileId);
  if (!profile) throw new Error("Perfil não encontrado");

  await resetDailyCounterIfNeeded(profile);
  const reviewsDoneToday = profile.flashcardReviewsToday ?? 0;
  if (reviewsDoneToday >= MAX_DAILY_FLASHCARD_REVIEWS) {
    throw new Error("Você já completou os 10 flashcards de hoje! Volte amanhã.");
  }

  const card = await Flashcard.findOne({ _id: cardId, childProfileId: childOid(childProfileId) });
  if (!card) throw new Error("Cartão não encontrado");

  const now = new Date();
  let { intervalDays, easeFactor, repetitions } = card;

  if (rating === 1) {
    repetitions = 0;
    intervalDays = 0;
    card.nextReviewAt = addDays(now, 0);
  } else {
    repetitions += 1;
    if (repetitions === 1) {
      intervalDays = rating === 4 ? 4 : rating === 3 ? 1 : 1;
    } else if (repetitions === 2) {
      intervalDays = rating === 4 ? 7 : rating === 3 ? 3 : 2;
    } else {
      const mult = rating === 4 ? 1.5 : rating === 3 ? 1 : 0.8;
      intervalDays = Math.max(1, Math.round(intervalDays * easeFactor * mult));
    }
    if (rating === 2) easeFactor = Math.max(1.3, easeFactor - 0.15);
    if (rating === 3) easeFactor = Math.min(2.8, easeFactor + 0.05);
    if (rating === 4) easeFactor = Math.min(3, easeFactor + 0.1);
    card.nextReviewAt = addDays(now, intervalDays);
  }

  card.intervalDays = intervalDays;
  card.easeFactor = easeFactor;
  card.repetitions = repetitions;
  card.lastReviewedAt = now;
  await card.save();

  profile.flashcardReviewsToday = reviewsDoneToday + 1;
  profile.flashcardReviewDate = todayKey();
  await profile.save();

  const { recordDailyActivity } = await import("@/modules/services/streak.service");
  await recordDailyActivity(childProfileId);

  const session = await getDailyFlashcardSession(childProfileId);

  return {
    card: serializeCard(card),
    reviewsDoneToday: profile.flashcardReviewsToday ?? 0,
    session,
  };
}
