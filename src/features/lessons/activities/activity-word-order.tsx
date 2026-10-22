"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { LessonActivityWordOrder } from "@/types/lesson";
import type { LessonMistake } from "@/types/lesson-mistakes";
import { LessonFooter, playFeedback, speak } from "../lesson-kit";

interface Props {
  data: LessonActivityWordOrder;
  onComplete: (correct: boolean) => void;
  onMistake?: (mistake: LessonMistake) => void;
  onAnswer?: (correct: boolean) => void;
}

/** Cada palavra tem id próprio para palavras repetidas não se confundirem */
type WordTile = { id: number; word: string };

export function ActivityWordOrder({ data, onComplete, onMistake, onAnswer }: Props) {
  const tiles = useMemo<WordTile[]>(() => data.words.map((word, id) => ({ id, word })), [data.words]);
  const [sentence, setSentence] = useState<WordTile[]>([]);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const pool = tiles.filter((t) => !sentence.some((s) => s.id === t.id));

  const add = (tile: WordTile) => {
    if (result) return;
    speak(tile.word);
    setSentence((s) => [...s, tile]);
  };

  const remove = (tile: WordTile) => {
    if (!result) setSentence((s) => s.filter((t) => t.id !== tile.id));
  };

  const check = () => {
    if (result) {
      onComplete(result === "correct");
      return;
    }
    const ok =
      sentence.map((t) => t.word).join(" ").toLowerCase() === data.correctSentence.toLowerCase();
    setResult(ok ? "correct" : "wrong");
    playFeedback(ok ? "correct" : "wrong");
    speak(data.correctSentence);
    onAnswer?.(ok);
    if (!ok) {
      onMistake?.({
        id: `word-order-${data.correctSentence.slice(0, 24)}`,
        kind: "word-order",
        label: data.instruction,
        data,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="font-display text-xl font-bold">Monte a frase</p>
        <p className="mt-1 text-muted-foreground">{data.instruction}</p>
      </div>

      <div className="flex min-h-20 flex-wrap content-start gap-2 border-b-2 border-border pb-3">
        {sentence.map((t) => (
          <motion.button
            layout
            key={t.id}
            type="button"
            onClick={() => remove(t)}
            className="press-3d rounded-2xl border-2 border-border bg-card px-4 py-2.5 text-lg font-semibold shadow-[0_4px_0_hsl(var(--border-shadow))]"
          >
            {t.word}
          </motion.button>
        ))}
      </div>

      <div className="flex min-h-14 flex-wrap justify-center gap-2">
        {pool.map((t) => (
          <motion.button
            layout
            key={t.id}
            type="button"
            onClick={() => add(t)}
            className="press-3d rounded-2xl border-2 border-border bg-card px-4 py-2.5 text-lg font-semibold shadow-[0_4px_0_hsl(var(--border-shadow))] hover:bg-muted/50"
          >
            {t.word}
          </motion.button>
        ))}
      </div>

      <LessonFooter
        status={result ?? "idle"}
        title={result === "correct" ? "Muito bem!" : "Quase!"}
        detail={result === "wrong" ? `A frase certa é "${data.correctSentence}"` : undefined}
        actionLabel={result ? "Continuar" : "Verificar"}
        disabled={!result && pool.length > 0}
        onAction={check}
      />
    </div>
  );
}
