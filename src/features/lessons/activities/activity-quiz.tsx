"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { LessonActivityQuiz } from "@/types/lesson";
import type { LessonMistake } from "@/types/lesson-mistakes";
import { LessonFooter, OptionButton, playFeedback, useOptionKeys } from "../lesson-kit";

/** Tempo para a criança ver o feedback antes de avançar sozinho */
export const FEEDBACK_MS = { correct: 1100, wrong: 2400 };

interface Props {
  data: LessonActivityQuiz;
  onComplete: (correctCount: number, total: number) => void;
  onMistake?: (mistake: LessonMistake) => void;
  onAnswer?: (correct: boolean) => void;
}

export function ActivityQuiz({ data, onComplete, onMistake, onAnswer }: Props) {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const questions = data.questions;
  const current = questions[qIndex];
  const answered = selected !== null;
  const ok = selected === current.correctIndex;
  const isLast = qIndex >= questions.length - 1;

  const advance = useCallback(
    (total: number) => {
      window.clearTimeout(timer.current);
      if (isLast) {
        onComplete(total, questions.length);
      } else {
        setSelected(null);
        setQIndex((i) => i + 1);
      }
    },
    [isLast, onComplete, questions.length]
  );

  const pick = useCallback(
    (index: number) => {
      if (answered) return;
      setSelected(index);
      const right = index === current.correctIndex;
      const total = correctCount + (right ? 1 : 0);
      setCorrectCount(total);
      playFeedback(right ? "correct" : "wrong");
      onAnswer?.(right);
      if (!right) {
        onMistake?.({
          id: `quiz-${qIndex}-${current.question.slice(0, 30)}`,
          kind: "quiz",
          label: current.question,
          data: current,
        });
      }
      // Errou: mostra a resposta certa e segue sozinho. A correção acontece na revisão final
      timer.current = window.setTimeout(() => advance(total), right ? FEEDBACK_MS.correct : FEEDBACK_MS.wrong);
    },
    [answered, advance, correctCount, current, onAnswer, onMistake, qIndex]
  );

  useOptionKeys(current.options.length, pick, !answered);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm font-bold text-muted-foreground">
          Pergunta {qIndex + 1} de {questions.length}
        </p>
        <h3 className="mt-1 font-display text-2xl font-bold">{current.question}</h3>
        {current.hint && !answered && <p className="mt-1 text-sm text-amber-500">Dica: {current.hint}</p>}
      </div>
      <div className="grid gap-3">
        {current.options.map((opt, i) => (
          <OptionButton
            key={`${qIndex}-${i}`}
            index={i}
            label={opt}
            disabled={answered}
            onClick={() => pick(i)}
            state={
              !answered ? "idle" : i === current.correctIndex ? "correct" : i === selected ? "wrong" : "faded"
            }
          />
        ))}
      </div>
      <LessonFooter
        status={!answered ? "idle" : ok ? "correct" : "wrong"}
        title={ok ? "Muito bem!" : "Quase!"}
        detail={!ok && answered ? `A resposta certa é "${current.options[current.correctIndex]}"` : undefined}
        actionLabel={isLast ? "Continuar" : "Próxima"}
        disabled={!answered}
        onAction={() => advance(correctCount)}
      />
    </div>
  );
}
