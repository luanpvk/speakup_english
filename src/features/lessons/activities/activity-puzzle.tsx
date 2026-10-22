"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Delete } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KidIcon } from "@/lib/icons/kid-icons";
import type { LessonActivityPuzzle } from "@/types/lesson";
import { cn } from "@/lib/utils";
import { LessonFooter, playFeedback, speak } from "../lesson-kit";

interface Props {
  data: LessonActivityPuzzle;
  onComplete: (correct: boolean) => void;
}

function shuffleLetters(word: string): string[] {
  const letters = word.toUpperCase().split("");
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  if (letters.join("") === word.toUpperCase() && letters.length > 1) return shuffleLetters(word);
  return letters;
}


/** Cada letra tem id próprio para letras repetidas não se confundirem */
type Tile = { id: number; letter: string };

export function ActivityPuzzle({ data, onComplete }: Props) {
  const pool = useMemo<Tile[]>(() => shuffleLetters(data.word).map((letter, id) => ({ id, letter })), [data.word]);
  const [answer, setAnswer] = useState<Tile[]>([]);
  const [shake, setShake] = useState(false);
  const [solved, setSolved] = useState(false);
  const [errors, setErrors] = useState(0);
  const timer = useRef<number | undefined>(undefined);

  const target = data.word.toUpperCase();
  const available = pool.filter((t) => !answer.some((a) => a.id === t.id));

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const pick = (tile: Tile) => {
    if (solved) return;
    const next = [...answer, tile];
    setAnswer(next);
    if (next.length < target.length) return;

    // Palavra completa: confere sozinho
    if (next.map((t) => t.letter).join("") === target) {
      setSolved(true);
      playFeedback("complete");
      speak(data.word);
    } else {
      playFeedback("wrong");
      setErrors((n) => n + 1);
      setShake(true);
      timer.current = window.setTimeout(() => {
        setShake(false);
        setAnswer([]);
      }, 700);
    }
  };

  // Toque numa letra já colocada devolve ela (e as seguintes) para baixo
  const removeFrom = (index: number) => {
    if (!solved) setAnswer((a) => a.slice(0, index));
  };

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div>
        <p className="font-display text-xl font-bold">Monte a palavra</p>
        <p className="mt-1 flex items-center justify-center gap-2 text-muted-foreground">
          <KidIcon emoji={data.emoji} word={data.word} size="sm" variant="plain" />
          {data.translation}
        </p>
      </div>

      <div className={cn("flex min-h-16 flex-wrap justify-center gap-2", shake && "animate-shake")}>
        {Array.from({ length: target.length }, (_, i) => {
          const tile = answer[i];
          return tile ? (
            <button
              key={i}
              type="button"
              onClick={() => removeFrom(i)}
              className={cn(
                "flex h-14 w-12 items-center justify-center rounded-xl font-display text-2xl font-bold",
                solved ? "bg-primary text-primary-foreground" : shake ? "bg-destructive text-white" : "bg-sky-500 text-white"
              )}
              aria-label={`Tirar a letra ${tile.letter}`}
            >
              {tile.letter}
            </button>
          ) : (
            <span key={i} className="h-14 w-12 rounded-xl border-2 border-dashed border-border" aria-hidden />
          );
        })}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {available.map((tile) => (
          <button
            key={tile.id}
            type="button"
            onClick={() => pick(tile)}
            className="press-3d flex h-14 w-12 items-center justify-center rounded-xl border-2 border-border bg-card font-display text-2xl font-bold shadow-[0_4px_0_hsl(var(--border-shadow))] hover:bg-muted/50"
          >
            {tile.letter}
          </button>
        ))}
      </div>

      {data.hint && !solved && <p className="text-sm text-amber-500">{data.hint}</p>}

      <LessonFooter
        status={solved ? "correct" : "idle"}
        title="Palavra certa!"
        actionLabel="Continuar"
        disabled={!solved}
        onAction={() => {
          window.clearTimeout(timer.current);
          onComplete(errors === 0);
        }}
        secondary={
          <Button variant="ghost" onClick={() => removeFrom(Math.max(0, answer.length - 1))} disabled={answer.length === 0 || solved}>
            <Delete className="h-4 w-4" />
            Apagar
          </Button>
        }
      />
    </div>
  );
}
