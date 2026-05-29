"use client";

import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { LessonActivityWordOrder } from "@/types/lesson";
import type { LessonMistake } from "@/types/lesson-mistakes";

interface Props {
  data: LessonActivityWordOrder;
  onComplete: (correct: boolean) => void;
  onMistake?: (mistake: LessonMistake) => void;
}

export function ActivityWordOrder({ data, onComplete, onMistake }: Props) {
  const [pool, setPool] = useState(() => [...data.words]);
  const [sentence, setSentence] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);

  const addWord = (word: string, fromIndex: number) => {
    if (checked) return;
    setSentence((s) => [...s, word]);
    setPool((p) => p.filter((_, i) => i !== fromIndex));
  };

  const reset = () => {
    setPool([...data.words]);
    setSentence([]);
    setChecked(false);
    setCorrect(false);
  };

  const check = () => {
    const built = sentence.join(" ");
    const ok = built.toLowerCase() === data.correctSentence.toLowerCase();
    setCorrect(ok);
    setChecked(true);
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
    <Card className="border-2">
      <CardContent className="space-y-4 py-6">
        <p className="text-center text-muted-foreground">{data.instruction}</p>
        <div className="min-h-[56px] rounded-xl border-2 border-dashed border-primary/40 bg-muted/30 p-3">
          <p className="text-center font-display text-lg font-semibold">
            {sentence.length > 0 ? sentence.join(" ") : "Monte a frase aqui..."}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {pool.map((word, i) => (
            <Button key={`${word}-${i}`} variant="secondary" onClick={() => addWord(word, i)}>
              {word}
            </Button>
          ))}
        </div>
        {!checked ? (
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={reset}>
              <RotateCcw className="h-4 w-4" />
              Limpar
            </Button>
            <Button className="flex-1" disabled={pool.length > 0} onClick={check}>
              Verificar
            </Button>
          </div>
        ) : (
          <div className="space-y-3 text-center">
            <p className={correct ? "text-primary font-semibold" : "text-destructive font-semibold"}>
              {correct ? (
                <>
                  <Check className="inline h-5 w-5" /> Correto!
                </>
              ) : (
                <>Quase! A frase certa é: &ldquo;{data.correctSentence}&rdquo;</>
              )}
            </p>
            {correct ? (
              <Button className="w-full" onClick={() => onComplete(true)}>
                Continuar
              </Button>
            ) : (
              <Button className="w-full" variant="outline" onClick={reset}>
                Tentar de novo
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
