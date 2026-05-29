"use client";

import { useState } from "react";
import { ArrowRight, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { KidIcon } from "@/lib/icons/kid-icons";
import type { LessonActivityVocab } from "@/types/lesson";

interface Props {
  data: LessonActivityVocab;
  onComplete: () => void;
}

export function ActivityVocab({ data, onComplete }: Props) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const cards = data.cards;
  const card = cards[index];

  const speak = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(card.word);
      u.lang = "en-US";
      window.speechSynthesis.speak(u);
    }
  };

  const next = () => {
    if (index < cards.length - 1) {
      setIndex((i) => i + 1);
      setFlipped(false);
    } else {
      onComplete();
    }
  };

  return (
    <Card className="border-2">
      <CardContent className="space-y-4 py-8 text-center">
        <p className="text-sm text-muted-foreground">
          Cartão {index + 1} de {cards.length} — toque para virar
        </p>
        <button
          type="button"
          className="mx-auto block w-full max-w-sm rounded-2xl border-2 border-primary/30 bg-card p-8 shadow-md transition hover:border-primary"
          onClick={() => setFlipped((f) => !f)}
        >
          <KidIcon emoji={card.emoji} word={card.word} size="xl" className="mx-auto" />
          {!flipped ? (
            <p className="mt-4 font-display text-4xl font-bold text-primary">{card.word}</p>
          ) : (
            <>
              <p className="mt-4 text-3xl font-semibold">{card.translation}</p>
              {card.example && (
                <p className="mt-3 text-sm text-muted-foreground">
                  &ldquo;{card.example}&rdquo;
                  {card.examplePt && <span className="block">{card.examplePt}</span>}
                </p>
              )}
            </>
          )}
        </button>
        <div className="flex justify-center gap-3">
          <Button variant="outline" size="sm" onClick={speak}>
            <Volume2 className="h-4 w-4" />
            Ouvir
          </Button>
          <Button onClick={next}>
            {index < cards.length - 1 ? "Próximo cartão" : "Praticar mais!"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
