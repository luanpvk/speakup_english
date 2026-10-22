import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import {
  levelFromXp,
  xpProgressInLevel,
} from "@/lib/data/seed-content";
import { ensureSeedData } from "@/modules/services/seed.service";
import { hyperfocusModules } from "@/lib/data/hyperfocus";
import { completedModuleSlugs, getCatalog, type Catalog } from "@/modules/services/catalog.service";
import {
  ChildProfile,
  Progress,
  Streak,
  Lesson,
  Reward,
  Avatar,
  AvatarItem,
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

async function checkAchievements(childProfileId: string) {
  const [profile, streak, lessonCount, unlocked, catalog] = await Promise.all([
    ChildProfile.findById(childProfileId),
    Streak.findOne({ childProfileId }).lean(),
    Progress.countDocuments({ childProfileId }),
    ChildAchievement.find({ childProfileId }).select("achievementSlug").lean(),
    getCatalog(),
  ]);
  if (!profile) return [];

  const unlockedSlugs = new Set(unlocked.map((a) => a.achievementSlug));
  const newlyUnlocked: string[] = [];

  for (const ach of catalog.achievements) {
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
      profile.xp += ach.xpBonus;
      profile.coins += ach.coinBonus;
      profile.medals += 1;
      newlyUnlocked.push(ach.slug);
    }
  }

  if (newlyUnlocked.length) {
    profile.level = levelFromXp(profile.xp);
    await Promise.all([
      ChildAchievement.insertMany(
        newlyUnlocked.map((achievementSlug) => ({ childProfileId, achievementSlug }))
      ),
      profile.save(),
    ]);
  }

  return newlyUnlocked;
}

function isModuleUnlocked(
  mod: { requiredLevel: number; requiredModuleSlug?: string; slug: string },
  profile: { level: number; hyperfocus?: string },
  completedModuleSlugs: Set<string>
): boolean {
  // Capítulos do hiperfoco ficam sempre liberados
  if (hyperfocusModules(profile.hyperfocus).includes(mod.slug)) return true;
  if (profile.level < mod.requiredLevel) return false;
  if (mod.requiredModuleSlug && !completedModuleSlugs.has(mod.requiredModuleSlug)) {
    return false;
  }
  return true;
}

/** Lança erro se o capítulo da lição ainda está bloqueado para a criança */
function assertModuleUnlocked(
  catalog: Catalog,
  moduleSlug: string,
  profile: { level: number; hyperfocus?: string },
  completedLessonIds: Set<string>
) {
  const mod = catalog.modules.find((m) => m.slug === moduleSlug);
  if (mod && !isModuleUnlocked(mod, profile, completedModuleSlugs(catalog, completedLessonIds))) {
    throw new Error("Módulo bloqueado. Complete as lições anteriores!");
  }
}

export async function getChildStats(childProfileId: string) {
  const catalog = await getCatalog();
  const [profile, streak, progressList, existingAvatar, childAchievements] = await Promise.all([
    getChildProfileOrThrow(childProfileId),
    Streak.findOne({ childProfileId }).lean(),
    Progress.find({ childProfileId }).select("lessonId score").lean(),
    Avatar.findOne({ childProfileId }).lean(),
    ChildAchievement.find({ childProfileId }).select("achievementSlug unlockedAt").lean(),
  ]);
  const avatar = existingAvatar ?? (await ensureChildAvatar(childProfileId, profile.avatarEmoji));

  const scoreByLesson = new Map(progressList.map((p) => [p.lessonId, p.score]));
  const completedModules = completedModuleSlugs(catalog, new Set(scoreByLesson.keys()));
  const unlockedAtBySlug = new Map(childAchievements.map((a) => [a.achievementSlug, a.unlockedAt]));
  const xpProgress = xpProgressInLevel(profile.xp, profile.level);

  return {
    profile: {
      id: profile._id.toString(),
      displayName: profile.displayName,
      username: profile.username,
      avatarEmoji: profile.avatarEmoji,
      hyperfocus: profile.hyperfocus ?? null,
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
    totalLessons: catalog.lessons.length,
    avatar: {
      hairSlug: avatar.hairSlug,
      clothesSlug: avatar.clothesSlug,
      accessorySlug: avatar.accessorySlug,
      backgroundSlug: avatar.backgroundSlug ?? "bg-default",
      baseEmoji: avatar.baseEmoji,
    },
    modules: catalog.modules.map((mod) => {
      const modLessons = catalog.lessonsByModule.get(mod.slug) ?? [];
      return {
        ...mod,
        id: mod._id.toString(),
        unlocked: isModuleUnlocked(mod, profile, completedModules),
        lessonsTotal: modLessons.length,
        lessonsCompleted: modLessons.filter((l) => scoreByLesson.has(l.slug)).length,
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
          completed: scoreByLesson.has(l.slug),
          score: scoreByLesson.get(l.slug),
        })),
      };
    }),
    achievements: catalog.achievements.map((a) => ({
      ...a,
      id: a._id.toString(),
      unlocked: unlockedAtBySlug.has(a.slug),
      unlockedAt: unlockedAtBySlug.get(a.slug),
    })),
  };
}

export async function getLessonDetail(childProfileId: string, lessonSlug: string) {
  const catalog = await getCatalog();
  const [lesson, profile, progressList] = await Promise.all([
    Lesson.findOne({ slug: lessonSlug, isActive: true }).lean(),
    getChildProfileOrThrow(childProfileId),
    Progress.find({ childProfileId }).select("lessonId score completedAt").lean(),
  ]);
  if (!lesson) throw new Error("Lição não encontrada");

  assertModuleUnlocked(
    catalog,
    lesson.moduleSlug,
    profile,
    new Set(progressList.map((p) => p.lessonId))
  );
  const progress = progressList.find((p) => p.lessonId === lessonSlug);

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
  const catalog = await getCatalog();
  const [lesson, profile, progressList] = await Promise.all([
    Lesson.findOne({ slug: lessonSlug, isActive: true }).lean(),
    getChildProfileOrThrow(childProfileId),
    Progress.find({ childProfileId }).select("lessonId score completedAt timeSpentSeconds").lean(),
  ]);
  if (!lesson) throw new Error("Lição não encontrada");
  // Impede ganhar XP/moedas de capítulos bloqueados chamando a API direto
  assertModuleUnlocked(
    catalog,
    lesson.moduleSlug,
    profile,
    new Set(progressList.map((p) => p.lessonId))
  );

  const existing = progressList.find((p) => p.lessonId === lessonSlug);
  const isFirstComplete = !existing;

  const normalizedScore = Math.min(100, Math.max(0, score));
  // Repetir a mesma lição em menos de 2 min não rende nada (evita farmar XP pela API)
  const tooSoon =
    !isFirstComplete && Date.now() - new Date(existing.completedAt).getTime() < 2 * 60_000;
  const xpGain = isFirstComplete
    ? lesson.xpReward + Math.floor(normalizedScore / 10)
    : tooSoon
      ? 0
      : Math.floor(lesson.xpReward * 0.25);
  const coinGain = isFirstComplete
    ? lesson.coinReward
    : tooSoon
      ? 0
      : Math.floor(lesson.coinReward * 0.1);
  const starGain = isFirstComplete ? lesson.starReward : 0;

  profile.xp += xpGain;
  profile.coins += coinGain;
  profile.stars += starGain;
  profile.level = levelFromXp(profile.xp);

  const [{ upsertFlashcardsFromLesson }, { recordDailyActivity }] = await Promise.all([
    import("@/modules/services/flashcard.service"),
    import("@/modules/services/streak.service"),
  ]);

  // Escritas independentes em paralelo (cada ida ao banco remoto custa ~150 ms)
  await Promise.all([
    upsertFlashcardsFromLesson(childProfileId, lessonSlug, extractLessonVocabulary(lesson)),
    Progress.updateOne(
      { childProfileId, lessonId: lessonSlug },
      {
        childProfileId,
        lessonId: lessonSlug,
        moduleId: lesson.moduleSlug,
        score: Math.max(existing?.score ?? 0, normalizedScore),
        completedAt: new Date(),
        timeSpentSeconds: (existing?.timeSpentSeconds ?? 0) + timeSpentSeconds,
      },
      { upsert: true }
    ),
    profile.save(),
    recordDailyActivity(childProfileId),
  ]);

  const newAchievements = await checkAchievements(childProfileId);
  const updatedProfile = newAchievements.length
    ? await ChildProfile.findById(childProfileId).select("level xp coins stars").lean()
    : null;

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

/** Ranking ao vivo pelos perfis: sem duplicatas */
export async function getRanking(period: "weekly" | "alltime" = "alltime", limit = 50) {
  await ensureSeedData();
  await connectDB();

  void period; // semanal usa o mesmo XP por enquanto; período reservado para evolução futura

  // Só os campos e a quantidade necessários
  const profiles = await ChildProfile.find({ isActive: true })
    .sort({ xp: -1, updatedAt: -1 })
    .limit(limit)
    .select("displayName avatarEmoji xp")
    .lean();

  return profiles.map((p, i) => ({
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

  const [profile, rewards, avatarItems] = await Promise.all([
    getChildProfileOrThrow(childProfileId),
    Reward.find({ isActive: true }).lean(),
    AvatarItem.find({ isActive: true }).lean(),
  ]);

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

  // Atômico: dois cliques simultâneos não gastam a mesma moeda nem compram duas vezes
  const updated = await ChildProfile.findOneAndUpdate(
    {
      _id: profile._id,
      coins: mongoose.trusted({ $gte: reward.cost }),
      purchasedRewardSlugs: mongoose.trusted({ $ne: rewardSlug }),
    },
    {
      $inc: {
        coins: -reward.cost,
        stars: reward.type === "badge" ? 3 : 0,
        xp: reward.type === "boost" ? 20 : 0,
      },
      $addToSet: {
        purchasedRewardSlugs: rewardSlug,
        ...(reward.avatarItemSlug && !ownedSlugs.includes(reward.avatarItemSlug)
          ? { ownedItemSlugs: reward.avatarItemSlug }
          : {}),
      },
    },
    { returnDocument: "after" }
  );
  if (!updated) throw new Error("Moedas insuficientes ou recompensa já comprada");

  if (reward.type === "boost") {
    updated.level = levelFromXp(updated.xp);
    await updated.save();
  }
  return { coins: updated.coins, stars: updated.stars, xp: updated.xp, level: updated.level };
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

  // Atômico: evita gastar a mesma moeda em pedidos simultâneos
  const updated = await ChildProfile.findOneAndUpdate(
    {
      _id: profile._id,
      coins: mongoose.trusted({ $gte: item.price }),
      ownedItemSlugs: mongoose.trusted({ $ne: itemSlug }),
    },
    { $inc: { coins: -item.price }, $addToSet: { ownedItemSlugs: itemSlug } },
    { returnDocument: "after" }
  );
  if (!updated) throw new Error("Moedas insuficientes ou item já comprado");

  return { coins: updated.coins, ownedItemSlugs: updated.ownedItemSlugs };
}

export async function updateAvatar(
  childProfileId: string,
  data: {
    hairSlug?: string;
    clothesSlug?: string;
    accessorySlug?: string | null;
    backgroundSlug?: string;
    baseEmoji?: string;
  }
) {
  await connectDB();
  const profile = await getChildProfileOrThrow(childProfileId);
  const avatar = await ensureChildAvatar(childProfileId, profile.avatarEmoji);

  const ownedSlugs = profile.ownedItemSlugs ?? [];
  const slugsToCheck = [data.hairSlug, data.clothesSlug, data.accessorySlug, data.backgroundSlug].filter(Boolean) as string[];
  for (const slug of slugsToCheck) {
    if (!ownedSlugs.includes(slug)) {
      const item = await AvatarItem.findOne({ slug, isDefault: true });
      if (!item) throw new Error(`Item ${slug} não desbloqueado`);
    }
  }

  if (data.hairSlug) avatar.hairSlug = data.hairSlug;
  if (data.backgroundSlug) avatar.backgroundSlug = data.backgroundSlug;
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
  const items = await AvatarItem.find({ slug: mongoose.trusted({ $in: slugs }) }).lean();

  return {
    hairSlug: avatar.hairSlug,
    clothesSlug: avatar.clothesSlug,
    accessorySlug: avatar.accessorySlug,
    backgroundSlug: avatar.backgroundSlug ?? "bg-default",
    baseEmoji: avatar.baseEmoji,
    items,
  };
}

export async function updateChildProfile(
  childProfileId: string,
  data: { hyperfocus?: string | null }
) {
  const profile = await getChildProfileOrThrow(childProfileId);
  if (data.hyperfocus !== undefined) profile.hyperfocus = data.hyperfocus ?? undefined;
  await profile.save();
  return { hyperfocus: profile.hyperfocus ?? null };
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
      backgroundSlug: avatar.backgroundSlug ?? "bg-default",
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
