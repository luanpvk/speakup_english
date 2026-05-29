"use client";

import { useState } from "react";
import { Check, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { KidIcon } from "@/lib/icons/kid-icons";
import type { LessonActivityListen } from "@/types/lesson";
import type { LessonMistake } from "@/types/lesson-mistakes";

interface Props {
  data: LessonActivityListen;
  onComplete: (correct: boolean) => void;
  onMistake?: (mistake: LessonMistake) => void;
}

export function ActivityListen({ data, onComplete, onMistake }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [wrongAttempt, setWrongAttempt] = useState(false);

  const play = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(data.targetWord);
      u.lang = "en-US";
      window.speechSynthesis.speak(u);
    }
  };

  const pick = (index: number) => {
    setSelected(index);
    if (index === data.correctIndex) {
      setWrongAttempt(false);
    } else {
      setWrongAttempt(true);
      onMistake?.({
        id: `listen-${data.targetWord}`,
        kind: "listen",
        label: data.prompt,
        data,
      });
    }
  };

  const submit = () => {
    if (selected === null || selected !== data.correctIndex) return;
    onComplete(true);
  };

  return (
    <Card className="border-2">
      <CardContent className="space-y-4 py-6">
        <div className="flex flex-col items-center gap-3 rounded-xl bg-muted/40 p-6">
          <KidIcon emoji={data.targetEmoji} word={data.targetWord} size="lg" />
          <p className="text-center text-lg">{data.prompt}</p>
          <Button variant="outline" onClick={play}>
            <Volume2 className="h-5 w-5" />
            Ouvir palavra
          </Button>
        </div>
        {wrongAttempt && (
          <p className="text-center text-sm font-medium text-destructive">
            Não foi dessa vez — escolha a tradução correta
          </p>
        )}
        <div className="grid gap-2">
          {data.options.map((opt, i) => {
            const show = selected !== null;
            const isCorrect = i === data.correctIndex;
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
                onClick={() => pick(i)}
              >
                {show && isCorrect && <Check className="h-4 w-4 text-primary" />}
                {opt}
              </Button>
            );
          })}
        </div>
        {selected === data.correctIndex && (
          <Button className="w-full" size="lg" onClick={submit}>
            Continuar
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
