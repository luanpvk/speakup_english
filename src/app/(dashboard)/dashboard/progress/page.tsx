"use client";

import Link from "next/link";
import {
  Award,
  BookOpen,
  Check,
  ChevronDown,
  Circle,
  Flame,
  Lock,
  Star,
  TrendingUp,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useChildStats } from "@/hooks/use-gamification";
import { LoadingState } from "@/components/ui/loading-state";
import { KidIcon } from "@/lib/icons/kid-icons";
import { chapterName } from "@/features/lessons/lesson-path";
import { ROUTES } from "@/utils/constants";
import { cn } from "@/lib/utils";

export default function ProgressPage() {
  const { data: stats, isLoading } = useChildStats();

  if (isLoading || !stats) {
    return <LoadingState message="Carregando progresso..." skeleton="profile" />;
  }

  const overallPercent = (stats.lessonsCompleted / Math.max(stats.totalLessons, 1)) * 100;
  const achievementsWon = stats.achievements.filter((a) => a.unlocked).length;
  const openChapters = stats.modules.filter((m) => m.unlocked);
  const lockedChapters = stats.modules.filter((m) => !m.unlocked);

  const tiles: { label: string; value: string | number; icon: LucideIcon; color: string }[] = [
    { label: "Nível", value: stats.profile.level, icon: TrendingUp, color: "bg-sky-500/15 text-sky-500" },
    { label: "XP total", value: stats.profile.xp, icon: Zap, color: "bg-amber-400/15 text-amber-500" },
    { label: "Lições feitas", value: stats.lessonsCompleted, icon: BookOpen, color: "bg-primary/15 text-primary" },
    { label: "Maior sequência", value: `${stats.streak.longest} ${stats.streak.longest === 1 ? "dia" : "dias"}`, icon: Flame, color: "bg-orange-500/15 text-orange-500" },
    { label: "Estrelas", value: stats.profile.stars, icon: Star, color: "bg-secondary/15 text-secondary" },
    { label: "Conquistas", value: achievementsWon, icon: Award, color: "bg-rose-400/15 text-rose-500" },
  ];

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border-2 border-border bg-card p-5">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Meu progresso</h1>
        <p className="mb-3 text-muted-foreground">
          {stats.lessonsCompleted} de {stats.totalLessons} lições feitas. Olha quanta coisa você já aprendeu!
        </p>
        <ProgressBar value={overallPercent} />
      </header>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {tiles.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="flex items-center gap-3 rounded-3xl border-2 border-border bg-card p-4">
            <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl", color)}>
              <Icon className="h-6 w-6" strokeWidth={2.4} aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block font-display text-2xl font-bold leading-none">{value}</span>
              <span className="text-xs font-semibold text-muted-foreground">{label}</span>
            </span>
          </div>
        ))}
      </section>

      <section>
        <h2 className="mb-3 font-display text-xl font-bold">Capítulos</h2>
        <div className="space-y-3">
          {openChapters.map((mod) => {
            const percent = mod.lessonsTotal ? (mod.lessonsCompleted / mod.lessonsTotal) * 100 : 0;
            const done = mod.lessonsTotal > 0 && mod.lessonsCompleted === mod.lessonsTotal;
            return (
              <details key={mod.slug} className="group rounded-3xl border-2 border-border bg-card">
                <summary className="flex cursor-pointer list-none items-center gap-3 p-4 [&::-webkit-details-marker]:hidden">
                  <span
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
                      done ? "bg-accent text-accent-foreground" : "bg-speakup-green-soft"
                    )}
                  >
                    {done ? (
                      <Check className="h-6 w-6" strokeWidth={3} aria-hidden />
                    ) : (
                      <KidIcon slug={mod.slug} size="md" variant="plain" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="truncate font-display text-lg font-bold">{chapterName(mod.title)}</span>
                      <span className="shrink-0 text-sm font-bold tabular-nums text-muted-foreground">
                        {mod.lessonsCompleted}/{mod.lessonsTotal}
                      </span>
                    </span>
                    <ProgressBar value={percent} className="mt-1.5" />
                  </span>
                  <ChevronDown
                    className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                    aria-hidden
                  />
                </summary>
                <ul className="space-y-1 border-t-2 border-border px-4 py-3">
                  {mod.lessons.map((l) => (
                    <li key={l.slug}>
                      <Link
                        href={ROUTES.lesson(l.slug)}
                        className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm hover:bg-muted"
                      >
                        {l.completed ? (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <Check className="h-4 w-4" strokeWidth={3} aria-label="Feita" />
                          </span>
                        ) : (
                          <Circle className="h-6 w-6 text-muted-foreground/50" aria-label="Ainda não feita" />
                        )}
                        <span className="flex-1 font-medium">{l.title}</span>
                        {l.score != null && (
                          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-bold">{l.score}%</span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            );
          })}
        </div>

        {lockedChapters.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-muted-foreground">
              <Lock className="h-4 w-4" aria-hidden />
              Ainda bloqueados ({lockedChapters.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {lockedChapters.map((mod) => (
                <span
                  key={mod.slug}
                  className="flex items-center gap-1.5 rounded-full border-2 border-dashed border-border px-3 py-1 text-xs font-semibold text-muted-foreground"
                >
                  <KidIcon slug={mod.slug} size="xs" variant="plain" iconClassName="text-muted-foreground" />
                  {chapterName(mod.title)}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
