"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useAuth } from "@/hooks/use-auth";
import { useChildStats } from "@/hooks/use-gamification";
import { ParentDashboard } from "@/features/parent/parent-dashboard";
import { ROUTES } from "@/utils/constants";
import { LoadingState } from "@/components/ui/loading-state";
import { KidIcon } from "@/lib/icons/kid-icons";
import { getHyperfocusTheme } from "@/lib/data/hyperfocus";
import { TutorialButton } from "@/features/onboarding/tutorial-dialog";
import { LessonPath, UnitBanner } from "@/features/lessons/lesson-path";

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const isChild = user?.role === "child";
  const { data: stats, isLoading, error } = useChildStats(Boolean(isChild));

  if (authLoading || !user) {
    return <LoadingState message="Carregando..." skeleton="path" />;
  }

  if (!isChild) {
    return <ParentDashboard />;
  }

  if (isLoading) {
    return <LoadingState message="Preparando sua aventura..." skeleton="path" />;
  }

  if (error || !stats) {
    return (
      <Card className="border-2 border-destructive/30">
        <CardContent className="py-8 text-center">
          <p>Não foi possível carregar seu progresso.</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  const nextLesson = stats.modules
    .flatMap((m) => m.lessons.map((l) => ({ ...l, moduleSlug: m.slug, unlocked: m.unlocked })))
    .find((l) => !l.completed && l.unlocked);
  const unlockedModules = stats.modules.filter((m) => m.unlocked);
  const currentModule =
    stats.modules.find((m) => m.slug === nextLesson?.moduleSlug) ?? unlockedModules.at(-1);
  const upcomingModule = currentModule
    ? stats.modules.find((m) => m.order > currentModule.order && !m.unlocked)
    : undefined;

  // Lições enviadas automaticamente a partir do hiperfoco da criança
  const theme = getHyperfocusTheme(stats.profile.hyperfocus);
  const focusLessons = theme
    ? theme.modules
        .flatMap((slug) => stats.modules.find((m) => m.slug === slug)?.lessons ?? [])
        .filter((l) => !l.completed)
        .slice(0, 4)
    : [];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold">Sua trilha</h1>
        <TutorialButton autoOpen />
      </div>

      {/* XP compacto quando o painel lateral não aparece */}
      <div className="rounded-3xl border-2 border-border bg-card p-4 xl:hidden">
        <ProgressBar
          value={stats.xpProgress.percent}
          color="primary"
          label={`Nível ${stats.profile.level} · ${stats.xpProgress.current} / ${stats.xpProgress.needed} XP`}
        />
      </div>

      {currentModule ? (
        <section className="space-y-2">
          <UnitBanner mod={currentModule} />
          <LessonPath
            lessons={currentModule.lessons}
            unlocked={currentModule.unlocked}
            currentSlug={nextLesson?.slug}
            showMascot
          />
        </section>
      ) : (
        <div className="rounded-3xl border-2 border-dashed p-8 text-center">
          <p className="flex items-center justify-center gap-2 text-lg font-semibold">
            <KidIcon emoji="🏆" size="md" variant="plain" />
            Você completou todas as lições!
          </p>
        </div>
      )}

      {theme && focusLessons.length > 0 && (
        <section className="space-y-2">
          <UnitBanner
            tone="secondary"
            eyebrow="Seu tema favorito"
            mod={{
              title: theme.label,
              description: "Lições escolhidas porque você adora esse assunto!",
              icon: theme.icon,
              slug: theme.id,
              order: 0,
              unlocked: true,
              lessonsCompleted: 0,
              lessonsTotal: focusLessons.length,
            }}
          />
          <LessonPath
            lessons={focusLessons}
            unlocked
            currentSlug={focusLessons[0]?.slug}
            tone="secondary"
          />
        </section>
      )}

      {!theme && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-dashed border-secondary/50 bg-speakup-purple-soft/40 p-5">
          <p className="flex items-center gap-2 font-semibold">
            <Heart className="h-6 w-6 text-secondary" aria-hidden />
            Escolha seu tema favorito e receba lições sobre ele!
          </p>
          <Button variant="secondary" asChild>
            <Link href={ROUTES.profile}>Escolher tema</Link>
          </Button>
        </div>
      )}

      {upcomingModule && <UnitBanner mod={upcomingModule} eyebrow="Próximo capítulo" />}

      <div className="text-center">
        <Button variant="outline" asChild>
          <Link href={ROUTES.lessons}>Ver todos os capítulos</Link>
        </Button>
      </div>
    </div>
  );
}
