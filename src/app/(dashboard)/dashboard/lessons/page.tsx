"use client";

import { ProgressBar } from "@/components/ui/progress-bar";
import { useChildStats } from "@/hooks/use-gamification";
import { LoadingState } from "@/components/ui/loading-state";
import { LessonPath, UnitBanner } from "@/features/lessons/lesson-path";

export default function LessonsPage() {
  const { data: stats, isLoading } = useChildStats();

  if (isLoading || !stats) {
    return <LoadingState message="Carregando trilha..." skeleton="path" />;
  }

  const nextSlug = stats.modules
    .flatMap((m) => (m.unlocked ? m.lessons : []))
    .find((l) => !l.completed)?.slug;

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border-2 border-border bg-card p-5 text-center">
        <h1 className="font-display text-3xl font-bold">Todos os capítulos</h1>
        <p className="mb-4 text-muted-foreground">
          {stats.lessonsCompleted} de {stats.totalLessons} lições completas
        </p>
        <ProgressBar
          value={(stats.lessonsCompleted / Math.max(stats.totalLessons, 1)) * 100}
          label="Progresso geral"
        />
      </header>

      {stats.modules.map((mod) => (
        <section key={mod.slug} className="space-y-2">
          <UnitBanner mod={mod} />
          {mod.unlocked && (
            <LessonPath lessons={mod.lessons} unlocked currentSlug={nextSlug} />
          )}
        </section>
      ))}
    </div>
  );
}
