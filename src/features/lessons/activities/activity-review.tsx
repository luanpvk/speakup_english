"use client";

import Image from "next/image";
import { AlertCircle } from "lucide-react";
import { KidIcon } from "@/lib/icons/kid-icons";
import type { LessonActivityReview } from "@/types/lesson";
import { LessonFooter, speak } from "../lesson-kit";

interface Props {
  data: LessonActivityReview;
  onFinish: () => void;
  finishing?: boolean;
  canFinish?: boolean;
  pendingMistakes?: number;
}

export function ActivityReview({ data, onFinish, finishing, canFinish = true, pendingMistakes = 0 }: Props) {
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <Image src="/mascot.png" alt="" width={110} height={110} className="animate-hop" />
      <div>
        <h3 className="font-display text-2xl font-bold">Você chegou ao fim!</h3>
        <p className="text-muted-foreground">Toque nas palavras para ouvir mais uma vez.</p>
      </div>

      {!canFinish && pendingMistakes > 0 && (
        <p className="flex items-center gap-2 rounded-2xl bg-amber-400/15 px-4 py-3 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-500" aria-hidden />
          Ainda {pendingMistakes === 1 ? "falta corrigir 1 erro" : `faltam corrigir ${pendingMistakes} erros`}.
        </p>
      )}

      {data.words.length > 0 && (
        <div className="grid w-full grid-cols-2 gap-3">
          {data.words.map((w) => (
            <button
              key={w.word}
              type="button"
              onClick={() => speak(w.word, { force: true })}
              className="press-3d flex items-center gap-3 rounded-2xl border-2 border-border bg-card p-3 text-left shadow-[0_4px_0_hsl(var(--border-shadow))] hover:bg-muted/50"
            >
              <KidIcon emoji={w.emoji} word={w.word} size="md" variant="plain" />
              <span className="min-w-0">
                <span className="block font-display text-lg font-bold leading-tight text-primary">{w.word}</span>
                <span className="block text-sm text-muted-foreground">{w.translation}</span>
              </span>
            </button>
          ))}
        </div>
      )}

      <LessonFooter
        actionLabel={finishing ? "Salvando..." : "Concluir lição"}
        disabled={finishing || !canFinish}
        onAction={onFinish}
      />
    </div>
  );
}
