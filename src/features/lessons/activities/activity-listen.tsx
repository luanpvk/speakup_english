"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { LessonActivityListen } from "@/types/lesson";
import type { LessonMistake } from "@/types/lesson-mistakes";
import { FEEDBACK_MS } from "./activity-quiz";
import { LessonFooter, ListenButtons, OptionButton, playFeedback, useAutoSpeak, useOptionKeys } from "../lesson-kit";

interface Props {
  data: LessonActivityListen;
  onComplete: (correct: boolean) => void;
  onMistake?: (mistake: LessonMistake) => void;
  onAnswer?: (correct: boolean) => void;
}

export function ActivityListen({ data, onComplete, onMistake, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const answered = selected !== null;
  const ok = selected === data.correctIndex;

  useAutoSpeak(data.targetWord);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const finish = useCallback(() => {
    window.clearTimeout(timer.current);
    onComplete(ok);
  }, [ok, onComplete]);

  const pick = useCallback(
    (index: number) => {
      if (answered) return;
      setSelected(index);
      const right = index === data.correctIndex;
      playFeedback(right ? "correct" : "wrong");
      onAnswer?.(right);
      if (!right) {
        onMistake?.({ id: `listen-${data.targetWord}`, kind: "listen", label: data.prompt, data });
      }
      // Segue sozinho; a revisão dos erros acontece no final
      timer.current = window.setTimeout(() => onComplete(right), right ? FEEDBACK_MS.correct : FEEDBACK_MS.wrong);
    },
    [answered, data, onAnswer, onComplete, onMistake]
  );

  useOptionKeys(data.options.length, pick, !answered);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="font-display text-xl font-bold">O que você ouviu?</p>
        <ListenButtons text={data.targetWord} size="lg" />
      </div>
      <div className="grid gap-3">
        {data.options.map((opt, i) => (
          <OptionButton
            key={i}
            index={i}
            label={opt}
            disabled={answered}
            onClick={() => pick(i)}
            state={
              !answered ? "idle" : i === data.correctIndex ? "correct" : i === selected ? "wrong" : "faded"
            }
          />
        ))}
      </div>
      <LessonFooter
        status={!answered ? "idle" : ok ? "correct" : "wrong"}
        title={ok ? "Muito bem!" : "Quase!"}
        detail={!ok && answered ? `"${data.targetWord}" é "${data.options[data.correctIndex]}"` : undefined}
        actionLabel="Continuar"
        disabled={!answered}
        onAction={finish}
      />
    </div>
  );
}
