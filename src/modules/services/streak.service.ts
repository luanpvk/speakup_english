import { connectDB } from "@/lib/mongodb";
import { Streak } from "@/modules/repositories/models";

function startOfLocalDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Registra estudo no dia (lição, flashcard, etc.) e atualiza o streak. */
export async function recordDailyActivity(childProfileId: string): Promise<void> {
  await connectDB();

  const today = startOfLocalDay(new Date());
  const streak = await Streak.findOne({ childProfileId });

  if (!streak) {
    await Streak.create({
      childProfileId,
      currentStreak: 1,
      longestStreak: 1,
      lastActivityDate: new Date(),
    });
    return;
  }

  const last = streak.lastActivityDate
    ? startOfLocalDay(new Date(streak.lastActivityDate))
    : null;

  if (!last) {
    streak.currentStreak = Math.max(1, streak.currentStreak);
    streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
    streak.lastActivityDate = new Date();
    await streak.save();
    return;
  }

  const diffDays = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    if (streak.currentStreak < 1) {
      streak.currentStreak = 1;
      streak.longestStreak = Math.max(streak.longestStreak, 1);
      await streak.save();
    }
    return;
  }

  if (diffDays === 1) {
    streak.currentStreak += 1;
  } else {
    streak.currentStreak = 1;
  }

  streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
  streak.lastActivityDate = new Date();
  await streak.save();
}
