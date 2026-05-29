"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { LessonActivityMemory } from "@/types/lesson";

interface MemoryCard {
  uid: string;
  pairId: string;
  text: string;
  lang: "en" | "pt";
  emoji?: string;
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

export function ActivityMemory({ data, onComplete }: Props) {
  const cards = useMemo(() => {
    const built: MemoryCard[] = [];
    for (const pair of data.pairs) {
      built.push({
        uid: `${pair.id}-en`,
        pairId: pair.id,
        text: pair.english,
        lang: "en",
        emoji: pair.emoji,
      });
      built.push({
        uid: `${pair.id}-pt`,
        pairId: pair.id,
        text: pair.portuguese,
        lang: "pt",
      });
    }
    return shuffle(built);
  }, [data.pairs]);

  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [lock, setLock] = useState(false);

  const allMatched = matched.size === data.pairs.length;

  const handleFlip = (card: MemoryCard) => {
    if (lock || matched.has(card.pairId) || flipped.includes(card.uid)) return;

    const next = [...flipped, card.uid];
    setFlipped(next);

    if (next.length === 2) {
      const [a, b] = next.map((uid) => cards.find((c) => c.uid === uid)!);
      if (a.pairId === b.pairId && a.lang !== b.lang) {
        setMatched((m) => new Set(m).add(a.pairId));
        setFlipped([]);
      } else {
        setLock(true);
        setTimeout(() => {
          setFlipped([]);
          setLock(false);
        }, 900);
      }
    }
  };

  return (
    <Card className="border-2">
      <CardContent className="space-y-4 py-6">
        <p className="text-center text-sm text-muted-foreground">
          Pares encontrados: {matched.size} / {data.pairs.length}
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {cards.map((card) => {
            const isOpen = flipped.includes(card.uid) || matched.has(card.pairId);
            return (
              <button
                key={card.uid}
                type="button"
                disabled={matched.has(card.pairId)}
                onClick={() => handleFlip(card)}
                className={`flex min-h-[88px] flex-col items-center justify-center rounded-xl border-2 p-2 text-sm font-semibold transition ${
                  isOpen
                    ? "border-primary bg-speakup-green-soft"
                    : "border-muted bg-muted/30 hover:border-primary/50"
                } ${matched.has(card.pairId) ? "opacity-60" : ""}`}
              >
                {isOpen ? (
                  <span className="mt-1 text-center text-sm font-semibold leading-tight">{card.text}</span>
                ) : (
                  <span className="text-lg font-bold text-muted-foreground">?</span>
                )}
              </button>
            );
          })}
        </div>
        {allMatched && (
          <Button className="w-full" size="lg" onClick={onComplete}>
            Memória completa — continuar!
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
