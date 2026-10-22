"use client";

import { useState } from "react";
import { RotateCw } from "lucide-react";
import { KidIcon } from "@/lib/icons/kid-icons";
import type { LessonActivityVocab } from "@/types/lesson";
import { LessonFooter, ListenButtons, useAutoSpeak } from "../lesson-kit";

interface Props {
  data: LessonActivityVocab;
  onComplete: () => void;
}

export function ActivityVocab({ data, onComplete }: Props) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const cards = data.cards;
  const card = cards[index];
  const isLast = index >= cards.length - 1;

  useAutoSpeak(card.word);

  const next = () => {
    if (isLast) {
      onComplete();
      return;
    }
    setFlipped(false);
    setIndex((i) => i + 1);
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex gap-1.5" aria-label={`Cartão ${index + 1} de ${cards.length}`}>
        {cards.map((c, i) => (
          <span
            key={c.word}
            className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-primary" : i < index ? "w-2 bg-primary/60" : "w-2 bg-muted"}`}
          />
        ))}
      </div>

      <button
        key={card.word}
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="flip-card w-full max-w-sm"
        data-flipped={flipped}
        aria-label={flipped ? `${card.translation}. Toque para ver em inglês` : `${card.word}. Toque para ver a tradução`}
      >
        <span className="flip-inner grid">
          <span className="flip-face col-start-1 row-start-1 flex min-h-64 flex-col items-center justify-center rounded-3xl border-2 border-border bg-card p-6 shadow-[0_6px_0_hsl(var(--border-shadow))]">
            <KidIcon emoji={card.emoji} word={card.word} size="xl" />
            <span className="mt-4 font-display text-4xl font-bold text-primary">{card.word}</span>
            <span className="mt-3 flex items-center gap-1 text-xs font-semibold text-muted-foreground">
              <RotateCw className="h-3.5 w-3.5" aria-hidden />
              Toque para ver a tradução
            </span>
          </span>
          <span className="flip-face flip-back col-start-1 row-start-1 flex min-h-64 flex-col items-center justify-center rounded-3xl border-2 border-primary/40 bg-speakup-green-soft p-6 shadow-[0_6px_0_hsl(var(--primary-shadow))]">
            <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Em português</span>
            <span className="mt-2 font-display text-3xl font-bold">{card.translation}</span>
            {card.example && (
              <span className="mt-4 text-sm text-muted-foreground">
                &ldquo;{card.example}&rdquo;
                {card.examplePt && <span className="block">{card.examplePt}</span>}
              </span>
            )}
          </span>
        </span>
      </button>

      <ListenButtons text={card.word} />

      <LessonFooter actionLabel={isLast ? "Vamos praticar" : "Próxima palavra"} onAction={next} />
    </div>
  );
}
