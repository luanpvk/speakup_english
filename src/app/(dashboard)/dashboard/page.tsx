"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Flame, Star, Coins, Medal, ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StatCard } from "@/components/gamification/stat-card";
import { useAuth } from "@/hooks/use-auth";
import { useChildStats } from "@/hooks/use-gamification";
import { ParentDashboard } from "@/features/parent/parent-dashboard";
import { ROUTES } from "@/utils/constants";
import { LoadingState } from "@/components/ui/loading-state";
import { KidIcon } from "@/lib/icons/kid-icons";

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const isChild = user?.role === "child";
  const { data: stats, isLoading, error } = useChildStats(Boolean(isChild));

  if (authLoading || !user) {
    return <LoadingState message="Carregando..." />;
  }

  if (!isChild) {
    return <ParentDashboard />;
  }

  if (isLoading) {
    return <LoadingState message="Preparando sua aventura..." />;
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
    .flatMap((m) => m.lessons.map((l) => ({ ...l, moduleTitle: m.title, unlocked: m.unlocked })))
    .find((l) => !l.completed && l.unlocked);

  return (
    <div className="space-y-8">
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-3xl font-bold">Olá, {stats.profile.displayName}!</h1>
        <p className="mt-1 text-muted-foreground">Pronto para mais uma aventura em inglês?</p>
      </motion.header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Star} label="Nível" value={stats.profile.level} delay={0} className="border-primary/20 bg-speakup-green-soft/50" />
        <StatCard icon={Flame} label="Streak" value={`${stats.streak.current} dias`} delay={1} className="border-accent/30 bg-speakup-yellow-soft/50" />
        <StatCard icon={Coins} label="Moedas" value={stats.profile.coins} delay={2} className="border-secondary/20 bg-speakup-purple-soft/50" />
        <StatCard icon={Medal} label="Medalhas" value={stats.profile.medals} delay={3} />
      </div>

      <Card className="border-2 border-primary/30">
        <CardHeader>
          <CardTitle>Seu XP</CardTitle>
          <CardDescription>
            {stats.xpProgress.current} / {stats.xpProgress.needed} XP para o próximo nível
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProgressBar value={stats.xpProgress.percent} color="primary" />
        </CardContent>
      </Card>

      {nextLesson ? (
        <Card className="border-2 border-primary bg-gradient-to-r from-speakup-green-soft/40 to-speakup-yellow-soft/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              Próxima lição
            </CardTitle>
            <CardDescription>{nextLesson.moduleTitle}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="flex items-center gap-3 text-2xl font-bold">
                <KidIcon emoji={nextLesson.icon} slug={nextLesson.slug} size="md" />
                {nextLesson.title}
              </p>
              <p className="text-sm text-muted-foreground">
                +{nextLesson.xpReward} XP · ~{nextLesson.estimatedMinutes} min
              </p>
            </div>
            <Button size="lg" asChild>
              <Link href={ROUTES.lesson(nextLesson.slug)}>
                Começar!
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-dashed text-center">
          <CardContent className="py-8">
            <p className="flex items-center justify-center gap-2 text-lg font-semibold">
              <KidIcon emoji="🏆" size="md" variant="plain" />
              Você completou todas as lições!
            </p>
            <Button className="mt-4" variant="outline" asChild>
              <Link href={ROUTES.lessons}>Revisar lições</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <section>
        <h2 className="mb-4 font-display text-xl font-bold">Trilha de aprendizado</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {stats.modules.map((mod, i) => (
            <motion.div
              key={mod.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card
                className={`border-2 h-full ${!mod.unlocked ? "opacity-60" : "hover:shadow-lg transition-shadow"}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    {mod.unlocked ? (
                      <KidIcon emoji={mod.icon} slug={mod.slug} size="lg" />
                    ) : (
                      <Lock className="h-10 w-10 text-muted-foreground" />
                    )}
                    <span className="text-sm font-medium text-muted-foreground">
                      {mod.lessonsCompleted}/{mod.lessonsTotal}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{mod.title}</CardTitle>
                  <CardDescription>{mod.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {mod.unlocked ? (
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={ROUTES.lessons}>Ver lições</Link>
                    </Button>
                  ) : (
                    <p className="text-sm text-muted-foreground">Complete o módulo anterior para desbloquear</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
