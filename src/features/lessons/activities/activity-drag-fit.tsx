"use client";

import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { KidIcon } from "@/lib/icons/kid-icons";
import type { LessonActivityDragFit } from "@/types/lesson";

interface Props {
  data: LessonActivityDragFit;
  onComplete: (correct: boolean) => void;
}

export function ActivityDragFit({ data, onComplete }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [wrongSlot, setWrongSlot] = useState<string | null>(null);

  const remaining = data.pieces.filter((p) => !Object.values(placed).includes(p.id));
  const allPlaced = data.slots.every((s) => placed[s.id]);

  const place = (slotId: string) => {
    if (!selected) return;
    const piece = data.pieces.find((p) => p.id === selected);
    if (!piece) return;

    if (piece.slotId === slotId) {
      setPlaced((prev) => ({ ...prev, [slotId]: piece.id }));
      setSelected(null);
      setWrongSlot(null);
    } else {
      setWrongSlot(slotId);
      setTimeout(() => setWrongSlot(null), 600);
    }
  };

  const reset = () => {
    setPlaced({});
    setSelected(null);
    setWrongSlot(null);
  };

  return (
    <Card className="border-2">
      <CardContent className="space-y-6 py-6">
        <p className="text-center text-muted-foreground">{data.instruction}</p>

        <div className="grid gap-3 sm:grid-cols-2">
          {data.slots.map((slot) => {
            const pieceId = placed[slot.id];
            const piece = pieceId ? data.pieces.find((p) => p.id === pieceId) : null;
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => !piece && place(slot.id)}
                className={`flex min-h-[72px] flex-col items-center justify-center rounded-xl border-2 border-dashed p-3 transition ${
                  piece
                    ? "border-primary bg-speakup-green-soft"
                    : wrongSlot === slot.id
                      ? "border-red-400 bg-red-50"
                      : "border-muted hover:border-primary/50"
                }`}
              >
                {piece ? (
                  <>
                    <KidIcon emoji={piece.emoji} word={piece.english} size="sm" variant="plain" />
                    <span className="mt-1 font-bold text-primary">{piece.english}</span>
                  </>
                ) : (
                  <>
                    <KidIcon emoji={slot.emoji} word={slot.label} size="sm" variant="plain" />
                    <span className="mt-1 text-sm font-medium">{slot.label}</span>
                  </>
                )}
              </button>
            );
          })}
        </div>

        <div>
          <p className="mb-2 text-center text-sm font-medium">Toque na palavra em inglês, depois no lugar certo:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {remaining.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelected(selected === p.id ? null : p.id)}
                className={`rounded-xl border-2 px-4 py-2 font-semibold transition ${
                  selected === p.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                {p.english}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <Button variant="outline" size="sm" onClick={reset}>
            <RotateCcw className="h-4 w-4" />
            Recomeçar
          </Button>
          {allPlaced && (
            <Button size="lg" onClick={() => onComplete(true)}>
              <Check className="h-4 w-4" />
              Tudo encaixado!
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
