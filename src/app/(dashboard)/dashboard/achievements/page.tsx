"use client";

import { motion } from "framer-motion";
import { Award, Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useChildStats } from "@/hooks/use-gamification";
import { LoadingState } from "@/components/ui/loading-state";
import { KidIcon } from "@/lib/icons/kid-icons";

export default function AchievementsPage() {
  const { data: stats, isLoading } = useChildStats();

  if (isLoading || !stats) {
    return <LoadingState message="Carregando conquistas..." />;
  }

  const unlocked = stats.achievements.filter((a) => a.unlocked);
  const locked = stats.achievements.filter((a) => !a.unlocked);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold flex items-center gap-2">
          <Award className="h-8 w-8 text-secondary" />
          Conquistas
        </h1>
        <p className="text-muted-foreground">
          {unlocked.length} de {stats.achievements.length} desbloqueadas
        </p>
      </header>

      {unlocked.length > 0 && (
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-primary">
            <Award className="h-6 w-6" />
            Desbloqueadas
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {unlocked.map((a, i) => (
              <motion.div
                key={a.slug}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="border-2 border-primary bg-speakup-green-soft/30">
                  <CardHeader>
                    <KidIcon emoji={a.icon} slug={a.slug} size="lg" className="mx-auto" />
                    <CardTitle>{a.name}</CardTitle>
                    <CardDescription>{a.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-4 font-display text-xl font-bold text-muted-foreground">A desbloquear</h2>
        {locked.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardContent className="py-8 text-center">
              Parabéns! Você desbloqueou todas as conquistas disponíveis!
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {locked.map((a) => (
              <Card key={a.slug} className="border-2 opacity-70">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <KidIcon emoji={a.icon} slug={a.slug} size="lg" className="opacity-50 grayscale" />
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardTitle>{a.name}</CardTitle>
                  <CardDescription>{a.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
