"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Lock, Play } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useChildStats } from "@/hooks/use-gamification";
import { ROUTES } from "@/utils/constants";
import { LoadingState } from "@/components/ui/loading-state";
import { KidIcon } from "@/lib/icons/kid-icons";

export default function LessonsPage() {
  const { data: stats, isLoading } = useChildStats();

  if (isLoading || !stats) {
    return <LoadingState message="Carregando trilha..." variant="lesson" />;
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold">Trilha de lições</h1>
        <p className="text-muted-foreground">
          {stats.lessonsCompleted} de {stats.totalLessons} lições completas
        </p>
        <ProgressBar
          className="mt-4 max-w-md"
          value={(stats.lessonsCompleted / Math.max(stats.totalLessons, 1)) * 100}
          label="Progresso geral"
        />
      </header>

      {stats.modules.map((mod, mi) => (
        <section key={mod.slug} className="space-y-4">
          <div className="flex items-center gap-3 rounded-2xl border-2 border-primary/20 bg-gradient-to-r from-speakup-green-soft/50 to-transparent p-4">
            {mod.unlocked ? (
              <KidIcon emoji={mod.icon} slug={mod.slug} size="lg" />
            ) : (
              <Lock className="h-10 w-10 text-muted-foreground" />
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Capítulo {mod.order}
              </p>
              <h2 className="font-display text-xl font-bold">{mod.title}</h2>
              <p className="text-sm text-muted-foreground">{mod.description}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {mod.lessons.map((lesson, li) => (
              <motion.div
                key={lesson.slug}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (mi + li) * 0.05 }}
              >
                <Card
                  className={`border-2 ${lesson.completed ? "border-primary/40 bg-speakup-green-soft/30" : ""} ${!mod.unlocked ? "opacity-50" : ""}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <KidIcon emoji={lesson.icon} slug={lesson.slug} size="md" />
                      {lesson.completed ? (
                        <CheckCircle2 className="h-6 w-6 text-primary" aria-label="Completa" />
                      ) : !mod.unlocked ? (
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      ) : null}
                    </div>
                    <CardTitle className="text-lg">{lesson.title}</CardTitle>
                    <CardDescription>{lesson.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      +{lesson.xpReward} XP · {lesson.estimatedMinutes} min
                      {lesson.score != null && ` · ${lesson.score}%`}
                    </span>
                    {mod.unlocked && (
                      <Button size="sm" asChild variant={lesson.completed ? "outline" : "default"}>
                        <Link href={ROUTES.lesson(lesson.slug)}>
                          <Play className="h-4 w-4" />
                          {lesson.completed ? "Revisar" : "Jogar"}
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
