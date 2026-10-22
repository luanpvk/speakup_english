"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import type { LessonActivityMemory } from "@/types/lesson";
import { cn } from "@/lib/utils";
import { LessonFooter, playFeedback, speak } from "../lesson-kit";

interface MemoryCard {
  uid: string;
  pairId: string;
  text: string;
  lang: "en" | "pt";
}

interface Props {
  data: LessonActivityMemory;
  onComplete: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const DONE_MS = 1300;

export function ActivityMemory({ data, onComplete }: Props) {
  const cards = useMemo(
    () =>
      shuffle(
        data.pairs.flatMap((pair) => [
          { uid: `${pair.id}-en`, pairId: pair.id, text: pair.english, lang: "en" as const },
          { uid: `${pair.id}-pt`, pairId: pair.id, text: pair.portuguese, lang: "pt" as const },
        ])
      ),
    [data.pairs]
  );

  const [open, setOpen] = useState<string[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [lock, setLock] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const allMatched = matched.size === data.pairs.length;

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const flip = (card: MemoryCard) => {
    if (lock || matched.has(card.pairId) || open.includes(card.uid)) return;
    if (card.lang === "en") speak(card.text);

    const next = [...open, card.uid];
    setOpen(next);
    if (next.length < 2) return;

    const [a, b] = next.map((uid) => cards.find((c) => c.uid === uid)!);
    if (a.pairId === b.pairId) {
      const done = new Set(matched).add(a.pairId);
      setMatched(done);
      setOpen([]);
      if (done.size === data.pairs.length) {
        playFeedback("complete");
        timer.current = window.setTimeout(onComplete, DONE_MS);
      } else {
        playFeedback("correct");
      }
    } else {
      setLock(true);
      playFeedback("wrong");
      timer.current = window.setTimeout(() => {
        setOpen([]);
        setLock(false);
      }, 900);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-center font-display text-xl font-bold">Ache os pares</p>
      <p className="text-center text-sm font-semibold text-muted-foreground">
        {matched.size} de {data.pairs.length} pares
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.map((card) => {
          const isMatched = matched.has(card.pairId);
          const isOpen = open.includes(card.uid) || isMatched;
          return (
            <button
              key={card.uid}
              type="button"
              disabled={isMatched}
              onClick={() => flip(card)}
              className="flip-card"
              data-flipped={isOpen}
              aria-label={isOpen ? card.text : "Carta virada para baixo"}
            >
              <span className="flip-inner grid">
                <span className="flip-face col-start-1 row-start-1 flex min-h-24 items-center justify-center rounded-2xl border-2 border-border bg-secondary/15 text-secondary shadow-[0_4px_0_hsl(var(--border-shadow))]">
                  <Sparkles className="h-7 w-7" aria-hidden />
                </span>
                <span
                  className={cn(
                    "flip-face flip-back col-start-1 row-start-1 flex min-h-24 items-center justify-center rounded-2xl border-2 p-2 text-center font-semibold leading-tight",
                    isMatched
                      ? "border-primary bg-speakup-green-soft text-primary"
                      : "border-sky-500 bg-card shadow-[0_4px_0_#0369a1]",
                    card.lang === "en" && "font-display text-lg"
                  )}
                >
                  {card.text}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <LessonFooter
        status={allMatched ? "correct" : "idle"}
        title="Achou todos!"
        actionLabel="Continuar"
        disabled={!allMatched}
        onAction={() => {
          window.clearTimeout(timer.current);
          onComplete();
        }}
      />
    </div>
  );
}
