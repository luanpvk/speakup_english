"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { OptionButton, ListenButtons, playFeedback, speak } from "@/features/lessons/lesson-kit";
import { SectionHeading } from "./section-heading";

const QUESTION = { word: "Cat", options: ["Cachorro", "Gato", "Passarinho"], correct: 1 };

/** Uma pergunta de verdade, jogável na própria página */
export function LessonDemo() {
  const [picked, setPicked] = useState<number | null>(null);
  const ok = picked === QUESTION.correct;

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    playFeedback(i === QUESTION.correct ? "correct" : "wrong");
  };

  return (
    <section className="px-4 py-16 md:py-24" aria-labelledby="demo-heading">
      <SectionHeading
        id="demo-heading"
        eyebrow="Experimente agora"
        title="É assim uma lição"
        text="Toque no alto-falante, ouça a palavra e escolha a resposta. Sem cadastro."
      />

      <div className="mx-auto mt-10 max-w-lg rounded-3xl border-2 border-border bg-card p-6 shadow-[0_8px_0_hsl(var(--border-shadow))]">
        <div className="flex items-center gap-3">
          <Image src="/mascot.png" alt="" width={56} height={56} />
          <p className="font-display text-xl font-bold">O que quer dizer &ldquo;{QUESTION.word}&rdquo;?</p>
        </div>
        <div className="mt-4">
          <ListenButtons text={QUESTION.word} />
        </div>
        <div className="mt-5 grid gap-3">
          {QUESTION.options.map((opt, i) => (
            <OptionButton
              key={opt}
              index={i}
              label={opt}
              disabled={picked !== null}
              onClick={() => pick(i)}
              state={
                picked === null ? "idle" : i === QUESTION.correct ? "correct" : i === picked ? "wrong" : "faded"
              }
            />
          ))}
        </div>

        <div className="mt-5 min-h-12" aria-live="polite">
          {picked !== null && (
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-muted/60 px-4 py-3">
              <p className="flex items-center gap-2 font-display font-bold">
                {ok ? (
                  <>
                    <CheckCircle2 className="h-6 w-6 text-primary" aria-hidden /> Muito bem! Cat é gato.
                  </>
                ) : (
                  <>
                    <XCircle className="h-6 w-6 text-destructive" aria-hidden /> Quase! Cat é gato.
                  </>
                )}
              </p>
              <button
                type="button"
                onClick={() => {
                  setPicked(null);
                  speak(QUESTION.word, { force: true });
                }}
                className="flex shrink-0 items-center gap-1 text-sm font-bold text-primary hover:underline"
              >
                <RotateCcw className="h-4 w-4" aria-hidden />
                De novo
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
