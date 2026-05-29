"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useChildStats } from "@/hooks/use-gamification";
import { LoadingState } from "@/components/ui/loading-state";

export default function ProgressPage() {
  const { data: stats, isLoading } = useChildStats();

  if (isLoading || !stats) {
    return <LoadingState message="Carregando progresso..." />;
  }

  const overallPercent = (stats.lessonsCompleted / Math.max(stats.totalLessons, 1)) * 100;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold">Meu progresso</h1>
        <p className="text-muted-foreground">Acompanhe sua jornada de aprendizado</p>
      </header>

      <Card className="border-2 border-primary/30">
        <CardHeader>
          <CardTitle>Visão geral</CardTitle>
          <CardDescription>
            {stats.lessonsCompleted} lições de {stats.totalLessons} completas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProgressBar value={overallPercent} label="Progresso total" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-center">
            <div className="rounded-xl bg-muted p-4">
              <p className="text-2xl font-bold text-primary">{stats.profile.level}</p>
              <p className="text-sm text-muted-foreground">Nível</p>
            </div>
            <div className="rounded-xl bg-muted p-4">
              <p className="text-2xl font-bold">{stats.profile.xp}</p>
              <p className="text-sm text-muted-foreground">XP total</p>
            </div>
            <div className="rounded-xl bg-muted p-4">
              <p className="text-2xl font-bold">{stats.streak.longest}</p>
              <p className="text-sm text-muted-foreground">Melhor streak</p>
            </div>
            <div className="rounded-xl bg-muted p-4">
              <p className="text-2xl font-bold">{stats.profile.stars}</p>
              <p className="text-sm text-muted-foreground">Estrelas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {stats.modules.map((mod) => {
        const percent = mod.lessonsTotal
          ? (mod.lessonsCompleted / mod.lessonsTotal) * 100
          : 0;
        return (
          <Card key={mod.slug} className={`border-2 ${!mod.unlocked ? "opacity-60" : ""}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>{mod.icon}</span>
                {mod.title}
              </CardTitle>
              <CardDescription>
                {mod.unlocked
                  ? `${mod.lessonsCompleted}/${mod.lessonsTotal} lições`
                  : "Módulo bloqueado"}
              </CardDescription>
            </CardHeader>
            {mod.unlocked && (
              <CardContent>
                <ProgressBar value={percent} color="secondary" />
                <ul className="mt-4 space-y-2">
                  {mod.lessons.map((l) => (
                    <li
                      key={l.slug}
                      className="flex items-center justify-between text-sm"
                    >
                      <span>
                        {l.completed ? "✅" : "⭕"} {l.title}
                      </span>
                      {l.score != null && (
                        <span className="text-muted-foreground">{l.score}%</span>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
