"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { KidIcon } from "@/lib/icons/kid-icons";
import type { LessonActivityMatch } from "@/types/lesson";

interface Props {
  data: LessonActivityMatch;
  onComplete: (correct: boolean) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function ActivityMatch({ data, onComplete }: Props) {
  const english = useMemo(() => shuffle(data.pairs), [data.pairs]);
  const portuguese = useMemo(
    () => shuffle(data.pairs.map((p) => ({ id: p.id, text: p.portuguese }))),
    [data.pairs]
  );

  const [selectedEn, setSelectedEn] = useState<string | null>(null);
  const [selectedPt, setSelectedPt] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongFlash, setWrongFlash] = useState(false);

  const tryMatch = (enId: string, ptId: string) => {
    if (enId === ptId) {
      const next = new Set(matched).add(enId);
      setMatched(next);
      setSelectedEn(null);
      setSelectedPt(null);
      if (next.size === data.pairs.length) {
        onComplete(true);
      }
    } else {
      setWrongFlash(true);
      setTimeout(() => {
        setWrongFlash(false);
        setSelectedEn(null);
        setSelectedPt(null);
      }, 600);
    }
  };

  const onEn = (id: string) => {
    if (matched.has(id)) return;
    setSelectedEn(id);
    if (selectedPt) tryMatch(id, selectedPt);
  };

  const onPt = (id: string) => {
    if (matched.has(id)) return;
    setSelectedPt(id);
    if (selectedEn) tryMatch(selectedEn, id);
  };

  return (
    <Card className={`border-2 ${wrongFlash ? "border-destructive" : ""}`}>
      <CardContent className="space-y-4 py-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <p className="text-center text-xs font-semibold uppercase text-primary">English</p>
            {english.map((p) => (
              <Button
                key={`en-${p.id}`}
                variant="outline"
                disabled={matched.has(p.id)}
                className={`h-auto w-full py-3 ${
                  selectedEn === p.id ? "border-primary bg-speakup-green-soft" : ""
                } ${matched.has(p.id) ? "opacity-40" : ""}`}
                onClick={() => onEn(p.id)}
              >
                <KidIcon emoji={p.emoji} word={p.english} size="xs" variant="plain" className="mr-2" />
                {p.english}
              </Button>
            ))}
          </div>
          <div className="space-y-2">
            <p className="text-center text-xs font-semibold uppercase text-muted-foreground">
              Português
            </p>
            {portuguese.map((p) => (
              <Button
                key={`pt-${p.id}`}
                variant="outline"
                disabled={matched.has(p.id)}
                className={`h-auto w-full py-3 ${
                  selectedPt === p.id ? "border-primary bg-speakup-green-soft" : ""
                } ${matched.has(p.id) ? "opacity-40" : ""}`}
                onClick={() => onPt(p.id)}
              >
                {p.text}
              </Button>
            ))}
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          {matched.size} / {data.pairs.length} pares ligados
        </p>
      </CardContent>
    </Card>
  );
}
