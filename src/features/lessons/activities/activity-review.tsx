"use client";

import { AlertCircle, Trophy } from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { KidIcon } from "@/lib/icons/kid-icons";
import type { LessonActivityReview } from "@/types/lesson";

interface Props {
  data: LessonActivityReview;
  onFinish: () => void;
  finishing?: boolean;
  canFinish?: boolean;
  pendingMistakes?: number;
}

export function ActivityReview({
  data,
  onFinish,
  finishing,
  canFinish = true,
  pendingMistakes = 0,
}: Props) {
  return (
    <Card className="relative border-2 border-primary text-center">
      {finishing && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-card/90 backdrop-blur-sm">
          <LoadingState message="Salvando progresso..." variant="save" />
        </div>
      )}
      <CardContent className="space-y-6 py-10">
        <Trophy className="mx-auto h-16 w-16 text-amber-500" strokeWidth={2} />
        <h3 className="font-display text-2xl font-bold">Hora da revisão!</h3>
        <p className="text-muted-foreground">{data.summary}</p>

        {!canFinish && pendingMistakes > 0 && (
          <div className="flex items-center justify-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:bg-amber-950/40">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>
              Ainda há {pendingMistakes} {pendingMistakes === 1 ? "erro" : "erros"} para corrigir
              antes do parabéns.
            </span>
          </div>
        )}

        {data.words.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3">
            {data.words.map((w) => (
              <div
                key={w.word}
                className="flex items-center gap-2 rounded-xl border bg-muted/40 px-4 py-2 text-sm"
              >
                <KidIcon emoji={w.emoji} word={w.word} size="sm" variant="plain" />
                <span>
                  <strong>{w.word}</strong> — {w.translation}
                </span>
              </div>
            ))}
          </div>
        )}

        <Button
          size="lg"
          className="w-full gap-2"
          onClick={onFinish}
          disabled={finishing || !canFinish}
        >
          {finishing ? (
            "Salvando..."
          ) : canFinish ? (
            "Concluir lição e ganhar recompensas!"
          ) : (
            "Corrija os erros primeiro"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
