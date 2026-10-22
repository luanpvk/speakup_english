"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BookOpen, Coins, Flame, Lock, TrendingUp, Zap, type LucideIcon } from "lucide-react";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useChildStats } from "@/hooks/use-gamification";
import { LoadingState } from "@/components/ui/loading-state";
import { cn } from "@/lib/utils";
import type { AchievementWithStatus, ChildStats } from "@/types/gamification";

/** Cada tipo de conquista tem sua cor e ícone, e sabe medir o progresso atual */
const KIND: Record<
  string,
  { icon: LucideIcon; badge: string; ring: string; value: (s: ChildStats) => number }
> = {
  lessons: {
    icon: BookOpen,
    badge: "bg-primary text-primary-foreground",
    ring: "shadow-[0_5px_0_hsl(var(--primary-shadow))]",
    value: (s) => s.lessonsCompleted,
  },
  streak: {
    icon: Flame,
    badge: "bg-orange-500 text-white",
    ring: "shadow-[0_5px_0_#c2410c]",
    value: (s) => s.streak.current,
  },
  xp: {
    icon: Zap,
    badge: "bg-amber-400 text-amber-950",
    ring: "shadow-[0_5px_0_#b45309]",
    value: (s) => s.profile.xp,
  },
  level: {
    icon: TrendingUp,
    badge: "bg-sky-500 text-white",
    ring: "shadow-[0_5px_0_#0369a1]",
    value: (s) => s.profile.level,
  },
  coins: {
    icon: Coins,
    badge: "bg-yellow-400 text-yellow-950",
    ring: "shadow-[0_5px_0_#a16207]",
    value: (s) => s.profile.coins,
  },
};

export default function AchievementsPage() {
  const { data: stats, isLoading } = useChildStats();

  if (isLoading || !stats) {
    return <LoadingState message="Carregando conquistas..." skeleton="list" />;
  }

  const unlocked = stats.achievements.filter((a) => a.unlocked);
  // Bloqueadas: as mais perto de completar aparecem primeiro
  const locked = stats.achievements
    .filter((a) => !a.unlocked)
    .sort((a, b) => progressOf(b, stats) - progressOf(a, stats));

  return (
    <div className="space-y-8">
      <header className="flex items-center gap-4 rounded-3xl border-2 border-border bg-card p-5">
        <Image src="/mascot.png" alt="" width={80} height={80} className="shrink-0" />
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Conquistas</h1>
          <p className="mb-2 text-muted-foreground">
            Você já ganhou {unlocked.length} de {stats.achievements.length}. Continue assim!
          </p>
          <ProgressBar value={(unlocked.length / Math.max(stats.achievements.length, 1)) * 100} />
        </div>
      </header>

      <section>
        <h2 className="mb-3 font-display text-xl font-bold">Quase lá</h2>
        {locked.length === 0 ? (
          <p className="rounded-3xl border-2 border-dashed border-border p-6 text-center text-muted-foreground">
            Você ganhou todas as conquistas. Que demais!
          </p>
        ) : (
          <ul className="divide-y-2 divide-border overflow-hidden rounded-3xl border-2 border-border bg-card">
            {locked.map((a) => (
              <AchievementRow key={a.slug} achievement={a} stats={stats} />
            ))}
          </ul>
        )}
      </section>

      {unlocked.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-xl font-bold">Já ganhou</h2>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {unlocked.map((a, i) => {
              const kind = KIND[a.criteriaType] ?? KIND.lessons;
              const Icon = kind.icon;
              return (
                <motion.li
                  key={a.slug}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex flex-col items-center rounded-3xl border-2 border-border bg-card p-4 text-center"
                >
                  <span className={cn("flex h-16 w-16 items-center justify-center rounded-2xl", kind.badge, kind.ring)}>
                    <Icon className="h-8 w-8" strokeWidth={2.4} aria-hidden />
                  </span>
                  <p className="mt-3 font-display font-bold leading-tight">{a.name}</p>
                  {a.unlockedAt && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {new Date(a.unlockedAt).toLocaleDateString("pt-BR", { day: "numeric", month: "short" })}
                    </p>
                  )}
                </motion.li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}

function progressOf(a: AchievementWithStatus, stats: ChildStats) {
  const kind = KIND[a.criteriaType];
  if (!kind || a.threshold <= 0) return 0;
  return Math.min(1, kind.value(stats) / a.threshold);
}

function AchievementRow({ achievement: a, stats }: { achievement: AchievementWithStatus; stats: ChildStats }) {
  const kind = KIND[a.criteriaType] ?? KIND.lessons;
  const Icon = kind.icon;
  const current = Math.min(kind.value(stats), a.threshold);

  return (
    <li className="flex items-center gap-4 p-4">
      <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <Icon className="h-7 w-7" strokeWidth={2.4} aria-hidden />
        <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-muted">
          <Lock className="h-3 w-3" aria-hidden />
        </span>
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
          <p className="font-display text-lg font-bold leading-tight">{a.name}</p>
          <Rewards xp={a.xpBonus} coins={a.coinBonus} />
        </div>
        <p className="mb-2 text-sm text-muted-foreground">{a.description}</p>
        <div className="flex items-center gap-3">
          <ProgressBar className="flex-1" value={(current / Math.max(a.threshold, 1)) * 100} color="accent" />
          <span className="shrink-0 text-sm font-bold tabular-nums text-muted-foreground">
            {current}/{a.threshold}
          </span>
        </div>
      </div>
    </li>
  );
}

function Rewards({ xp, coins }: { xp?: number; coins?: number }) {
  if (!xp && !coins) return null;
  return (
    <span className="flex items-center gap-2 text-xs font-bold">
      {xp ? (
        <span className="flex items-center gap-0.5 text-amber-500">
          <Zap className="h-3.5 w-3.5 fill-current" aria-hidden />+{xp}
        </span>
      ) : null}
      {coins ? (
        <span className="flex items-center gap-0.5 text-primary">
          <Coins className="h-3.5 w-3.5" aria-hidden />+{coins}
        </span>
      ) : null}
    </span>
  );
}
