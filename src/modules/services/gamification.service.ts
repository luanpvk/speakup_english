import { connectDB } from "@/lib/mongodb";
import {
  levelFromXp,
  xpProgressInLevel,
} from "@/lib/data/seed-content";
import { ensureSeedData } from "@/modules/services/seed.service";
import {
  ChildProfile,
  Progress,
  Streak,
  Module,
  Lesson,
  Reward,
  Achievement,
  Avatar,
  AvatarItem,
  Ranking,
  ChildAchievement,
} from "@/modules/repositories/models";
import type { TokenUser } from "@/lib/auth/jwt";
import type { IChildProfile } from "@/modules/types/models";
import type { HydratedDocument } from "mongoose";

async function normalizeChildProfile(profile: HydratedDocument<IChildProfile> | null) {
  if (!profile) return null;

  let changed = false;

  if (!Array.isArray(profile.ownedItemSlugs) || profile.ownedItemSlugs.length === 0) {
    profile.ownedItemSlugs = ["hair-default", "clothes-default"];
    changed = true;
  } else if (
    !profile.ownedItemSlugs.includes("hair-default") ||
    !profile.ownedItemSlugs.includes("clothes-default")
  ) {
    if (!profile.ownedItemSlugs.includes("hair-default")) {
      profile.ownedItemSlugs.push("hair-default");
    }
    if (!profile.ownedItemSlugs.includes("clothes-default")) {
      profile.ownedItemSlugs.push("clothes-default");
    }
    changed = true;
  }

  if (!Array.isArray(profile.purchasedRewardSlugs)) {
    profile.purchasedRewardSlugs = [];
    changed = true;
  }

  if (profile.coins == null || Number.isNaN(profile.coins)) {
    profile.coins = 50;
    changed = true;
  }
  if (profile.stars == null || Number.isNaN(profile.stars)) {
    profile.stars = 0;
    changed = true;
  }
  if (profile.medals == null || Number.isNaN(profile.medals)) {
    profile.medals = 0;
    changed = true;
  }

  if (changed) {
    await profile.save();
  }

  return profile;
}

async function getChildProfileOrThrow(childProfileId: string) {
  await connectDB();
  const profile = await ChildProfile.findById(childProfileId);
  if (!profile || !profile.isActive) {
    throw new Error("Perfil infantil não encontrado");
  }
  const normalized = await normalizeChildProfile(profile);
  if (!normalized) {
    throw new Error("Perfil infantil não encontrado");
  }
  return normalized;
}

async function ensureChildAvatar(childProfileId: string, baseEmoji: string) {
  let avatar = await Avatar.findOne({ childProfileId });
  if (!avatar) {
    avatar = await Avatar.create({
      childProfileId,
      baseEmoji,
      hairSlug: "hair-default",
      clothesSlug: "clothes-default",
    });
    const profile = await getChildProfileOrThrow(childProfileId);
    const owned = profile.ownedItemSlugs ?? [];
    if (!owned.includes("hair-default")) {
      profile.ownedItemSlugs = [...owned, "hair-default", "clothes-default"];
      await profile.save();
    }
  }
  return avatar;
}

async function updateRanking(childProfileId: string, displayName: string, avatarEmoji: string, score: number) {
  for (const period of ["alltime", "weekly"] as const) {
    await Ranking.findOneAndUpdate(
      { childProfileId, period },
      { displayName, avatarEmoji, score },
      { upsert: true, returnDocument: "after" }
    );
  }

  const allEntries = await Ranking.find({ period: "alltime" })
    .sort({ score: -1 })
    .limit(50)
    .lean();

  for (let i = 0; i < allEntries.length; i++) {
    await Ranking.updateOne(
      { _id: allEntries[i]._id },
      { rank: i + 1 }
    );
  }
}

async function checkAchievements(childProfileId: string) {
  const profile = await ChildProfile.findById(childProfileId);
  const streak = await Streak.findOne({ childProfileId });
  const lessonCount = await Progress.countDocuments({ childProfileId });
  if (!profile) return [];

  const achievements = await Achievement.find({ isActive: true }).lean();
  const unlocked = await ChildAchievement.find({ childProfileId }).lean();
  const unlockedSlugs = new Set(unlocked.map((a) => a.achievementSlug));
  const newlyUnlocked: string[] = [];

  for (const ach of achievements) {
    if (unlockedSlugs.has(ach.slug)) continue;

    let met = false;
    switch (ach.criteriaType) {
      case "lessons":
        met = lessonCount >= ach.threshold;
        break;
      case "streak":
        met = (streak?.currentStreak ?? 0) >= ach.threshold;
        break;
      case "xp":
        met = profile.xp >= ach.threshold;
        break;
      case "level":
        met = profile.level >= ach.threshold;
        break;
      case "coins":
        met = profile.coins >= ach.threshold;
        break;
    }

    if (met) {
      await ChildAchievement.create({
        childProfileId,
        achievementSlug: ach.slug,
      });
      profile.xp += ach.xpBonus;
      profile.coins += ach.coinBonus;
      profile.medals += 1;
      newlyUnlocked.push(ach.slug);
    }
  }

  if (newlyUnlocked.length) {
    profile.level = levelFromXp(profile.xp);
    await profile.save();
  }

  return newlyUnlocked;
}

function isModuleUnlocked(
  mod: { requiredLevel: number; requiredModuleSlug?: string; slug: string },
  profile: { level: number },
  completedModuleSlugs: Set<string>
): boolean {
  if (profile.level < mod.requiredLevel) return false;
  if (mod.requiredModuleSlug && !completedModuleSlugs.has(mod.requiredModuleSlug)) {
    return false;
  }
  return true;
}

export async function getChildStats(childProfileId: string) {
  await ensureSeedData();
  await connectDB();

  const profile = await getChildProfileOrThrow(childProfileId);
  const streak = await Streak.findOne({ childProfileId }).lean();
  const progressList = await Progress.find({ childProfileId }).lean();
  const completedLessonIds = new Set(progressList.map((p) => p.lessonId));
  const avatar = await ensureChildAvatar(childProfileId, profile.avatarEmoji);

  const modules = await Module.find({ isActive: true }).sort({ order: 1 }).lean();
  const lessons = await Lesson.find({ isActive: true }).sort({ order: 1 }).lean();

  const lessonsByModule = lessons.reduce<Record<string, typeof lessons>>((acc, l) => {
    if (!acc[l.moduleSlug]) acc[l.moduleSlug] = [];
    acc[l.moduleSlug].push(l);
    return acc;
  }, {});

  const completedModuleSlugs = new Set<string>();
  for (const mod of modules) {
    const modLessons = lessonsByModule[mod.slug] ?? [];
    if (modLessons.length > 0 && modLessons.every((l) => completedLessonIds.has(l.slug))) {
      completedModuleSlugs.add(mod.slug);
    }
  }

  const xpProgress = xpProgressInLevel(profile.xp, profile.level);
  const achievements = await Achievement.find({ isActive: true }).lean();
  const childAchievements = await ChildAchievement.find({ childProfileId }).lean();
  const unlockedAchievementSlugs = new Set(childAchievements.map((a) => a.achievementSlug));

  return {
    profile: {
      id: profile._id.toString(),
      displayName: profile.displayName,
      username: profile.username,
      avatarEmoji: profile.avatarEmoji,
      level: profile.level,
      xp: profile.xp,
      coins: profile.coins ?? 0,
      stars: profile.stars ?? 0,
      medals: profile.medals ?? 0,
      ownedItemSlugs: profile.ownedItemSlugs,
      purchasedRewardSlugs: profile.purchasedRewardSlugs,
    },
    streak: {
      current: streak?.currentStreak ?? 0,
      longest: streak?.longestStreak ?? 0,
      lastActivityDate: streak?.lastActivityDate,
    },
    xpProgress,
    lessonsCompleted: progressList.length,
    totalLessons: lessons.length,
    avatar: {
      hairSlug: avatar.hairSlug,
      clothesSlug: avatar.clothesSlug,
      accessorySlug: avatar.accessorySlug,
      baseEmoji: avatar.baseEmoji,
    },
    modules: modules.map((mod) => {
      const modLessons = lessonsByModule[mod.slug] ?? [];
      const completedCount = modLessons.filter((l) => completedLessonIds.has(l.slug)).length;
      return {
        ...mod,
        id: mod._id.toString(),
        unlocked: isModuleUnlocked(mod, profile, completedModuleSlugs),
        lessonsTotal: modLessons.length,
        lessonsCompleted: completedCount,
        lessons: modLessons.map((l) => ({
          id: l._id.toString(),
          slug: l.slug,
          title: l.title,
          description: l.description,
          icon: l.icon,
          order: l.order,
          xpReward: l.xpReward,
          coinReward: l.coinReward,
          estimatedMinutes: l.estimatedMinutes,
          completed: completedLessonIds.has(l.slug),
          score: progressList.find((p) => p.lessonId === l.slug)?.score,
        })),
      };
    }),
    achievements: achievements.map((a) => ({
      ...a,
      id: a._id.toString(),
      unlocked: unlockedAchievementSlugs.has(a.slug),
      unlockedAt: childAchievements.find((ca) => ca.achievementSlug === a.slug)?.unlockedAt,
    })),
  };
}

export async function getLessonDetail(childProfileId: string, lessonSlug: string) {
  await ensureSeedData();
  await connectDB();

  const lesson = await Lesson.findOne({ slug: lessonSlug, isActive: true }).lean();
  if (!lesson) throw new Error("Lição não encontrada");

  const progress = await Progress.findOne({ childProfileId, lessonId: lessonSlug }).lean();
  const profile = await getChildProfileOrThrow(childProfileId);
  const mod = await Module.findOne({ slug: lesson.moduleSlug }).lean();

  if (mod) {
    const modules = await Module.find({ isActive: true }).lean();
    const allLessons = await Lesson.find({ isActive: true }).lean();
    const progressList = await Progress.find({ childProfileId }).lean();
    const completedLessonIds = new Set(progressList.map((p) => p.lessonId));
    const completedModuleSlugs = new Set<string>();
    for (const m of modules) {
      const modLessons = allLessons.filter((l) => l.moduleSlug === m.slug);
      if (modLessons.length > 0 && modLessons.every((l) => completedLessonIds.has(l.slug))) {
        completedModuleSlugs.add(m.slug);
      }
    }
    if (!isModuleUnlocked(mod, profile, completedModuleSlugs)) {
      throw new Error("Módulo bloqueado. Complete as lições anteriores!");
    }
  }

  const activities =
    lesson.activities?.length > 0
      ? lesson.activities
      : buildLegacyActivities(lesson);

  return {
    lesson: {
      id: lesson._id.toString(),
      slug: lesson.slug,
      moduleSlug: lesson.moduleSlug,
      chapterTitle: lesson.chapterTitle,
      title: lesson.title,
      description: lesson.description,
      icon: lesson.icon,
      activities,
      vocabulary: lesson.vocabulary,
      quiz: lesson.quiz,
      xpReward: lesson.xpReward,
      coinReward: lesson.coinReward,
      starReward: lesson.starReward,
      estimatedMinutes: lesson.estimatedMinutes,
      totalSteps: activities.length,
    },
    progress: progress
      ? { score: progress.score, completedAt: progress.completedAt }
      : null,
  };
}

function buildLegacyActivities(lesson: {
  title: string;
  description: string;
  icon: string;
  vocabulary: { word: string; translation: string; emoji?: string }[];
  quiz: { question: string; options: string[]; correctIndex: number }[];
}) {
  const acts: { id: string; type: string; title: string; instruction?: string; data: Record<string, unknown> }[] = [
    {
      id: "intro",
      type: "intro",
      title: "Introdução",
      data: { objective: lesson.description, whatYouWillLearn: ["Vocabulário", "Prática", "Quiz"] },
    },
  ];
  if (lesson.vocabulary?.length) {
    acts.push({
      id: "vocab",
      type: "vocab",
      title: "Palavras",
      data: { cards: lesson.vocabulary },
    });
  }
  if (lesson.quiz?.length) {
    acts.push({
      id: "quiz",
      type: "quiz",
      title: "Quiz",
      data: { questions: lesson.quiz },
    });
  }
  acts.push({
    id: "review",
    type: "review",
    title: "Revisão",
    data: { summary: "Bom trabalho!", words: lesson.vocabulary ?? [] },
  });
  return acts;
}

function extractLessonVocabulary(lesson: {
  vocabulary?: { word: string; translation: string; emoji?: string; audioHint?: string }[];
  activities?: { type: string; data: Record<string, unknown> }[];
}) {
  const words: { word: string; translation: string; emoji?: string; example?: string }[] = [];
  const seen = new Set<string>();

  const add = (w: { word: string; translation: string; emoji?: string; example?: string }) => {
    const key = w.word.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      words.push(w);
    }
  };

  for (const v of lesson.vocabulary ?? []) {
    add({
      word: v.word,
      translation: v.translation,
      emoji: v.emoji,
      example: v.audioHint,
    });
  }

  for (const act of lesson.activities ?? []) {
    if (act.type === "vocab") {
      const cards = (act.data as { cards?: { word: string; translation: string; emoji?: string; example?: string }[] })
        .cards;
      for (const c of cards ?? []) {
        add(c);
      }
    }
  }

  return words;
}

export async function completeLesson(
  childProfileId: string,
  lessonSlug: string,
  score: number,
  timeSpentSeconds: number
) {
  await ensureSeedData();
  await connectDB();

  const lesson = await Lesson.findOne({ slug: lessonSlug, isActive: true });
  if (!lesson) throw new Error("Lição não encontrada");

  const { upsertFlashcardsFromLesson } = await import("@/modules/services/flashcard.service");
  const vocabWords = extractLessonVocabulary(lesson);
  await upsertFlashcardsFromLesson(childProfileId, lessonSlug, vocabWords);

  const profile = await getChildProfileOrThrow(childProfileId);
  const existing = await Progress.findOne({ childProfileId, lessonId: lessonSlug });
  const isFirstComplete = !existing;

  const normalizedScore = Math.min(100, Math.max(0, score));
  const xpGain = isFirstComplete
    ? lesson.xpReward + Math.floor(normalizedScore / 10)
    : Math.floor(lesson.xpReward * 0.25);
  const coinGain = isFirstComplete ? lesson.coinReward : Math.floor(lesson.coinReward * 0.1);
  const starGain = isFirstComplete ? lesson.starReward : 0;

  await Progress.findOneAndUpdate(
    { childProfileId, lessonId: lessonSlug },
    {
      childProfileId,
      lessonId: lessonSlug,
      moduleId: lesson.moduleSlug,
      score: Math.max(existing?.score ?? 0, normalizedScore),
      completedAt: new Date(),
      timeSpentSeconds: (existing?.timeSpentSeconds ?? 0) + timeSpentSeconds,
    },
    { upsert: true, returnDocument: "after" }
  );

  profile.xp += xpGain;
  profile.coins += coinGain;
  profile.stars += starGain;
  profile.level = levelFromXp(profile.xp);
  await profile.save();

  const { recordDailyActivity } = await import("@/modules/services/streak.service");
  await recordDailyActivity(childProfileId);

  await updateRanking(
    childProfileId,
    profile.displayName,
    profile.avatarEmoji,
    profile.xp
  );

  const newAchievements = await checkAchievements(childProfileId);
  const updatedProfile = await ChildProfile.findById(childProfileId).lean();

  return {
    xpGained: xpGain,
    coinsGained: coinGain,
    starsGained: starGain,
    isFirstComplete,
    level: updatedProfile?.level ?? profile.level,
    xp: updatedProfile?.xp ?? profile.xp,
    coins: updatedProfile?.coins ?? profile.coins,
    stars: updatedProfile?.stars ?? profile.stars,
    newAchievements,
  };
}

/** Ranking ao vivo pelos perfis — sem duplicatas */
export async function getRanking(period: "weekly" | "alltime" = "alltime", limit = 50) {
  await ensureSeedData();
  await connectDB();

  void period; // semanal usa o mesmo XP por enquanto; período reservado para evolução futura

  const profiles = await ChildProfile.find({ isActive: true })
    .sort({ xp: -1, updatedAt: -1 })
    .lean();

  const seen = new Set<string>();
  const unique: typeof profiles = [];

  for (const profile of profiles) {
    const id = profile._id.toString();
    if (seen.has(id)) continue;
    seen.add(id);
    unique.push(profile);
    if (unique.length >= limit) break;
  }

  return unique.map((p, i) => ({
    rank: i + 1,
    displayName: p.displayName,
    avatarEmoji: p.avatarEmoji,
    score: p.xp,
    childProfileId: p._id.toString(),
    isCurrentUser: false,
  }));
}

export async function getRankingForChild(childProfileId: string, period: "weekly" | "alltime" = "alltime") {
  const entries = await getRanking(period, 50);
  return entries.map((e) => ({
    ...e,
    isCurrentUser: e.childProfileId === childProfileId,
  }));
}

export async function getShopItems(childProfileId: string) {
  await ensureSeedData();
  await connectDB();

  const profile = await getChildProfileOrThrow(childProfileId);
  const rewards = await Reward.find({ isActive: true }).lean();
  const avatarItems = await AvatarItem.find({ isActive: true }).lean();

  const ownedSlugs = profile.ownedItemSlugs ?? [];
  const purchasedSlugs = profile.purchasedRewardSlugs ?? [];
  const coins = profile.coins ?? 0;

  return {
    coins,
    level: profile.level ?? 1,
    rewards: rewards.map((r) => ({
      slug: r.slug,
      name: r.name,
      description: r.description,
      icon: r.icon,
      cost: r.cost,
      type: r.type,
      requiredLevel: r.requiredLevel,
      avatarItemSlug: r.avatarItemSlug,
      owned: purchasedSlugs.includes(r.slug),
    })),
    avatarItems: avatarItems.map((item) => ({
      slug: item.slug,
      name: item.name,
      icon: item.icon,
      type: item.type,
      price: item.price,
      unlockLevel: item.unlockLevel,
      owned: ownedSlugs.includes(item.slug),
      canAfford: coins >= item.price,
      levelOk: (profile.level ?? 1) >= item.unlockLevel,
    })),
  };
}

export async function purchaseReward(childProfileId: string, rewardSlug: string) {
  await ensureSeedData();
  await connectDB();

  const profile = await getChildProfileOrThrow(childProfileId);
  const reward = await Reward.findOne({ slug: rewardSlug, isActive: true });
  if (!reward) throw new Error("Recompensa não encontrada");
  const purchasedSlugs = profile.purchasedRewardSlugs ?? [];
  const ownedSlugs = profile.ownedItemSlugs ?? [];

  if (purchasedSlugs.includes(rewardSlug)) {
    throw new Error("Você já possui esta recompensa");
  }
  if (profile.coins < reward.cost) throw new Error("Moedas insuficientes");
  if (profile.level < reward.requiredLevel) throw new Error("Nível insuficiente");

  profile.coins = (profile.coins ?? 0) - reward.cost;
  profile.purchasedRewardSlugs = [...purchasedSlugs, rewardSlug];

  if (reward.type === "badge") {
    profile.stars += 3;
  }
  if (reward.type === "boost") {
    profile.xp += 20;
    profile.level = levelFromXp(profile.xp);
  }
  if (reward.avatarItemSlug && !ownedSlugs.includes(reward.avatarItemSlug)) {
    profile.ownedItemSlugs = [...ownedSlugs, reward.avatarItemSlug];
  }

  await profile.save();
  return { coins: profile.coins, stars: profile.stars, xp: profile.xp, level: profile.level };
}

export async function purchaseAvatarItem(childProfileId: string, itemSlug: string) {
  await ensureSeedData();
  await connectDB();

  const profile = await getChildProfileOrThrow(childProfileId);
  const item = await AvatarItem.findOne({ slug: itemSlug, isActive: true });
  if (!item) throw new Error("Item não encontrado");
  const ownedSlugs = profile.ownedItemSlugs ?? [];

  if (ownedSlugs.includes(itemSlug)) {
    throw new Error("Você já possui este item");
  }
  if (profile.level < item.unlockLevel) throw new Error("Nível insuficiente");
  if ((profile.coins ?? 0) < item.price) throw new Error("Moedas insuficientes");

  profile.coins = (profile.coins ?? 0) - item.price;
  profile.ownedItemSlugs = [...ownedSlugs, itemSlug];
  await profile.save();

  return { coins: profile.coins, ownedItemSlugs: profile.ownedItemSlugs };
}

export async function updateAvatar(
  childProfileId: string,
  data: { hairSlug?: string; clothesSlug?: string; accessorySlug?: string | null; baseEmoji?: string }
) {
  await connectDB();
  const profile = await getChildProfileOrThrow(childProfileId);
  const avatar = await ensureChildAvatar(childProfileId, profile.avatarEmoji);

  const ownedSlugs = profile.ownedItemSlugs ?? [];
  const slugsToCheck = [data.hairSlug, data.clothesSlug, data.accessorySlug].filter(Boolean) as string[];
  for (const slug of slugsToCheck) {
    if (!ownedSlugs.includes(slug)) {
      const item = await AvatarItem.findOne({ slug, isDefault: true });
      if (!item) throw new Error(`Item ${slug} não desbloqueado`);
    }
  }

  if (data.hairSlug) avatar.hairSlug = data.hairSlug;
  if (data.clothesSlug) avatar.clothesSlug = data.clothesSlug;
  if (data.accessorySlug !== undefined) {
    avatar.accessorySlug = data.accessorySlug || undefined;
  }
  if (data.baseEmoji) {
    avatar.baseEmoji = data.baseEmoji;
    profile.avatarEmoji = data.baseEmoji;
    await profile.save();
  }
  await avatar.save();

  const slugs = [avatar.hairSlug, avatar.clothesSlug, avatar.accessorySlug].filter(
    (s): s is string => Boolean(s)
  );
  const items = await AvatarItem.find({ slug: { $in: slugs } }).lean();

  return {
    hairSlug: avatar.hairSlug,
    clothesSlug: avatar.clothesSlug,
    accessorySlug: avatar.accessorySlug,
    baseEmoji: avatar.baseEmoji,
    items,
  };
}

export async function getAvatarCustomization(childProfileId: string) {
  await ensureSeedData();
  await connectDB();

  const profile = await getChildProfileOrThrow(childProfileId);
  const avatar = await ensureChildAvatar(childProfileId, profile.avatarEmoji);
  const items = await AvatarItem.find({ isActive: true }).lean();

  return {
    avatar: {
      hairSlug: avatar.hairSlug,
      clothesSlug: avatar.clothesSlug,
      accessorySlug: avatar.accessorySlug,
      baseEmoji: avatar.baseEmoji,
    },
    ownedItemSlugs: profile.ownedItemSlugs ?? [],
    coins: profile.coins ?? 0,
    items: items.map((i) => ({
      slug: i.slug,
      name: i.name,
      icon: i.icon,
      type: i.type,
      price: i.price,
      unlockLevel: i.unlockLevel,
      owned: (profile.ownedItemSlugs ?? []).includes(i.slug),
    })),
  };
}

export async function resolveChildProfileId(tokenUser: TokenUser): Promise<string> {
  if (tokenUser.role !== "child") {
    throw new Error("Acesso apenas para perfil infantil");
  }

  if (tokenUser.childProfileId) {
    return tokenUser.childProfileId;
  }

  await connectDB();
  const profile = await ChildProfile.findOne({
    userId: tokenUser.userId,
    isActive: true,
  });

  if (!profile) {
    throw new Error("Perfil infantil não encontrado. Entre novamente na área da criança.");
  }

  return profile._id.toString();
}

/** @deprecated use resolveChildProfileId */
export function requireChildProfile(tokenUser: TokenUser): string {
  if (tokenUser.role !== "child" || !tokenUser.childProfileId) {
    throw new Error("Acesso apenas para perfil infantil");
  }
  return tokenUser.childProfileId;
}
