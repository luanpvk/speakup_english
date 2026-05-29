"use client";

import { useMemo, useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { KidIcon } from "@/lib/icons/kid-icons";
import type { LessonActivityPuzzle } from "@/types/lesson";

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
  if (letters.join("") === word.toUpperCase() && letters.length > 1) {
    return shuffleLetters(word);
  }
  return letters;
}

export function ActivityPuzzle({ data, onComplete }: Props) {
  const pool = useMemo(() => shuffleLetters(data.word), [data.word]);
  const [available, setAvailable] = useState<string[]>(() => [...pool]);
  const [answer, setAnswer] = useState<string[]>([]);

  const target = data.word.toUpperCase();
  const current = answer.join("");
  const solved = current === target;

  const pick = (index: number) => {
    const letter = available[index];
    if (!letter) return;
    setAvailable((prev) => prev.filter((_, i) => i !== index));
    setAnswer((prev) => [...prev, letter]);
  };

  const undo = () => {
    if (answer.length === 0) return;
    const last = answer[answer.length - 1];
    setAnswer((prev) => prev.slice(0, -1));
    setAvailable((prev) => [...prev, last]);
  };

  const reset = () => {
    setAvailable([...pool]);
    setAnswer([]);
  };

  return (
    <Card className="border-2">
      <CardContent className="space-y-6 py-8 text-center">
        <KidIcon emoji={data.emoji} word={data.word} size="lg" className="mx-auto" />
        <p className="text-muted-foreground">{data.instruction}</p>
        <p className="text-sm text-muted-foreground">
          Dica: <strong className="text-foreground">{data.translation}</strong>
        </p>
        {data.hint && <p className="text-xs text-amber-700">{data.hint}</p>}

        <div className="flex min-h-[56px] flex-wrap items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/40 bg-muted/30 px-4 py-3">
          {answer.length === 0 ? (
            <span className="text-sm text-muted-foreground">Monte a palavra aqui...</span>
          ) : (
            answer.map((l, i) => (
              <span
                key={`${l}-${i}`}
                className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary font-display text-xl font-bold text-primary-foreground"
              >
                {l}
              </span>
            ))
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {available.map((letter, i) => (
            <button
              key={`${letter}-${i}`}
              type="button"
              onClick={() => pick(i)}
              className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-border bg-card text-lg font-bold transition hover:border-primary hover:bg-speakup-green-soft"
            >
              {letter}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <Button variant="outline" size="sm" onClick={undo} disabled={answer.length === 0}>
            Desfazer
          </Button>
          <Button variant="outline" size="sm" onClick={reset}>
            <RotateCcw className="h-4 w-4" />
            Embaralhar
          </Button>
          {solved && (
            <Button size="lg" onClick={() => onComplete(true)}>
              <Check className="h-4 w-4" />
              Palavra certa!
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
