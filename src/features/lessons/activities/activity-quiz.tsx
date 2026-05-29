"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LessonActivityQuiz } from "@/types/lesson";
import type { LessonMistake } from "@/types/lesson-mistakes";

interface Props {
  data: LessonActivityQuiz;
  onComplete: (correctCount: number, total: number) => void;
  onMistake?: (mistake: LessonMistake) => void;
}

export function ActivityQuiz({ data, onComplete, onMistake }: Props) {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongAttempt, setWrongAttempt] = useState(false);

  const questions = data.questions;
  const current = questions[qIndex];

  const pick = (index: number) => {
    setSelected(index);
    if (index === current.correctIndex) {
      setWrongAttempt(false);
    } else {
      setWrongAttempt(true);
      onMistake?.({
        id: `quiz-${qIndex}-${current.question.slice(0, 30)}`,
        kind: "quiz",
        label: current.question,
        data: current,
      });
    }
  };

  const handleNext = () => {
    if (selected === null || selected !== current.correctIndex) return;

    const newCorrect = correctCount + 1;

    if (qIndex < questions.length - 1) {
      setCorrectCount(newCorrect);
      setSelected(null);
      setWrongAttempt(false);
      setQIndex((i) => i + 1);
    } else {
      onComplete(newCorrect, questions.length);
    }
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="text-xl">{current.question}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Pergunta {qIndex + 1} de {questions.length}
          {wrongAttempt && (
            <span className="mt-1 block font-medium text-destructive">
              Errado — selecione a resposta correta (verde) para continuar
            </span>
          )}
          {current.hint && !wrongAttempt && selected === null && (
            <span className="mt-1 block text-amber-700">Dica: {current.hint}</span>
          )}
        </p>
      </CardHeader>
      <CardContent className="grid gap-3">
        {current.options.map((opt, i) => {
          const show = selected !== null;
          const isCorrect = i === current.correctIndex;
          const isSelected = selected === i;
          return (
            <Button
              key={opt}
              variant="outline"
              className={`h-auto justify-start py-4 text-left ${
                show && isCorrect
                  ? "border-primary bg-speakup-green-soft"
                  : show && isSelected && !isCorrect
                    ? "border-destructive bg-destructive/10"
                    : ""
              }`}
              onClick={() => pick(i)}
            >
              {show && isCorrect && <Check className="h-5 w-5 text-primary" />}
              {opt}
            </Button>
          );
        })}
        {selected === current.correctIndex && (
          <Button className="mt-2 w-full" size="lg" onClick={handleNext}>
            {qIndex < questions.length - 1 ? "Próxima pergunta" : "Concluir quiz"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
