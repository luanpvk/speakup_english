"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Crown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRanking } from "@/hooks/use-gamification";
import { LoadingState } from "@/components/ui/loading-state";
import { cn } from "@/lib/utils";

export default function RankingPage() {
  const [period, setPeriod] = useState<"alltime" | "weekly">("alltime");
  const { data: ranking, isLoading } = useRanking(period);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold flex items-center gap-2">
          <Trophy className="h-8 w-8 text-accent" />
          Ranking dos exploradores
        </h1>
        <p className="text-muted-foreground">Competição saudável — todo mundo aprende junto!</p>
        <div className="mt-4 flex gap-2">
          <Button
            variant={period === "alltime" ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod("alltime")}
          >
            Geral
          </Button>
          <Button
            variant={period === "weekly" ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod("weekly")}
          >
            Semanal
          </Button>
        </div>
      </header>

      {isLoading ? (
        <LoadingState message="Carregando ranking..." />
      ) : !ranking?.length ? (
        <Card className="border-2 border-dashed">
          <CardContent className="py-12 text-center text-muted-foreground">
            <Trophy className="mx-auto h-12 w-12 opacity-40" />
            <p className="mt-4">Ainda não há exploradores no ranking. Seja o primeiro!</p>
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-2">
          {ranking.map((entry, i) => (
            <motion.li
              key={entry.childProfileId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                className={cn(
                  "border-2",
                  entry.isCurrentUser && "border-primary bg-speakup-green-soft/40",
                  entry.rank <= 3 && "shadow-md"
                )}
              >
                <CardContent className="flex items-center gap-4 py-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted font-bold">
                    {entry.rank <= 3 ? (
                      <Crown className={cn("h-5 w-5", entry.rank === 1 ? "text-yellow-500" : entry.rank === 2 ? "text-gray-400" : "text-amber-700")} />
                    ) : (
                      entry.rank
                    )}
                  </span>
                  <span className="text-2xl">{entry.avatarEmoji}</span>
                  <div className="flex-1">
                    <p className="font-semibold">
                      {entry.displayName}
                      {entry.isCurrentUser && (
                        <span className="ml-2 text-sm text-primary">(você)</span>
                      )}
                    </p>
                  </div>
                  <span className="font-display text-lg font-bold text-primary">
                    {entry.score} XP
                  </span>
                </CardContent>
              </Card>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}
