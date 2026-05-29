"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Check, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KidIcon } from "@/lib/icons/kid-icons";
import type { LessonMistake } from "@/types/lesson-mistakes";

interface Props {
  mistakes: LessonMistake[];
  onFixed: (mistakeId: string) => void;
}

export function ActivityFixMistakes({ mistakes, onFixed }: Props) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [wordOrder, setWordOrder] = useState<string[]>([]);
  const [pool, setPool] = useState<string[]>([]);
  const [flipped, setFlipped] = useState(false);

  const current = mistakes[Math.min(index, mistakes.length - 1)];

  useEffect(() => {
    setIndex(0);
    setSelected(null);
    setFlipped(false);
    if (current?.kind === "word-order") {
      setPool([...current.data.words]);
      setWordOrder([]);
    } else {
      setPool([]);
      setWordOrder([]);
    }
  }, [mistakes.length, current?.id]);

  if (!current) return null;

  const speak = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      window.speechSynthesis.speak(u);
    }
  };

  const advance = () => {
    onFixed(current.id);
    setSelected(null);
    setFlipped(false);
  };

  return (
    <Card className="border-2 border-amber-400">
      <div className="flex items-center gap-2 border-b border-amber-200 bg-amber-50 px-4 py-3 dark:bg-amber-950/30">
        <AlertCircle className="h-5 w-5 text-amber-600" />
        <div>
          <p className="font-semibold">Revisão dos erros</p>
          <p className="text-xs text-muted-foreground">
            {mistakes.length} {mistakes.length === 1 ? "item" : "itens"} — acerte tudo para
            ganhar a medalha!
          </p>
        </div>
      </div>

      {current.kind === "quiz" && (
        <>
          <CardHeader>
            <CardTitle className="text-lg">{current.data.question}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 pb-6">
            {current.data.options.map((opt, i) => {
              const show = selected !== null;
              const isCorrect = i === current.data.correctIndex;
              const isSelected = selected === i;
              return (
                <Button
                  key={opt}
                  variant="outline"
                  className={`h-auto justify-start py-3 ${
                    show && isCorrect
                      ? "border-primary bg-speakup-green-soft"
                      : show && isSelected && !isCorrect
                        ? "border-destructive bg-destructive/10"
                        : ""
                  }`}
                  onClick={() => {
                    setSelected(i);
                    if (i === current.data.correctIndex) setTimeout(advance, 500);
                  }}
                >
                  {show && isCorrect && <Check className="h-4 w-4 text-primary" />}
                  {opt}
                </Button>
              );
            })}
          </CardContent>
        </>
      )}

      {current.kind === "listen" && (
        <CardContent className="space-y-4 py-6">
          <p className="text-center">{current.data.prompt}</p>
          <Button variant="outline" className="mx-auto flex" onClick={() => speak(current.data.targetWord)}>
            <Volume2 className="h-4 w-4" />
            Ouvir
          </Button>
          <div className="grid gap-2">
            {current.data.options.map((opt, i) => (
              <Button
                key={opt}
                variant="outline"
                onClick={() => {
                  setSelected(i);
                  if (i === current.data.correctIndex) setTimeout(advance, 500);
                }}
              >
                {opt}
              </Button>
            ))}
          </div>
        </CardContent>
      )}

      {current.kind === "word-order" && (
        <CardContent className="space-y-4 py-6">
          <p className="text-center text-muted-foreground">{current.data.instruction}</p>
          <p className="min-h-[48px] rounded-lg border-2 border-dashed p-3 text-center font-semibold">
            {wordOrder.join(" ") || "..."}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {pool.map((w, i) => (
              <Button
                key={`${w}-${i}`}
                size="sm"
                variant="secondary"
                onClick={() => {
                  setWordOrder((s) => [...s, w]);
                  setPool((p) => p.filter((_, j) => j !== i));
                }}
              >
                {w}
              </Button>
            ))}
          </div>
          {pool.length === 0 && (
            <Button
              className="w-full"
              onClick={() => {
                if (
                  wordOrder.join(" ").toLowerCase() ===
                  current.data.correctSentence.toLowerCase()
                ) {
                  advance();
                } else {
                  setPool([...current.data.words]);
                  setWordOrder([]);
                }
              }}
            >
              Verificar
            </Button>
          )}
        </CardContent>
      )}

      {current.kind === "vocab" && (
        <CardContent className="space-y-4 py-8 text-center">
          <button
            type="button"
            className="mx-auto block w-full max-w-sm rounded-2xl border-2 p-8"
            onClick={() => setFlipped((f) => !f)}
          >
            <KidIcon emoji={current.data.emoji} word={current.data.word} size="lg" className="mx-auto" />
            <p className="mt-4 text-2xl font-bold text-primary">
              {flipped ? current.data.translation : current.data.word}
            </p>
          </button>
          <Button onClick={() => speak(current.data.word)} variant="outline">
            <Volume2 className="h-4 w-4" />
            Ouvir
          </Button>
          {flipped && (
            <Button className="w-full" onClick={advance}>
              Lembrei! Próximo
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  );
}
