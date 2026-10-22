"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { LessonActivityMatch } from "@/types/lesson";
import { cn } from "@/lib/utils";
import { LessonFooter, playFeedback, speak } from "../lesson-kit";

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
  const portuguese = useMemo(() => shuffle(data.pairs), [data.pairs]);

  const [selectedEn, setSelectedEn] = useState<string | null>(null);
  const [selectedPt, setSelectedPt] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState<[string, string] | null>(null);
  const [errors, setErrors] = useState(0);
  const timer = useRef<number | undefined>(undefined);
  const done = matched.size === data.pairs.length;

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const tryMatch = (en: string, pt: string) => {
    if (en === pt) {
      const next = new Set(matched).add(en);
      setMatched(next);
      setSelectedEn(null);
      setSelectedPt(null);
      if (next.size === data.pairs.length) {
        playFeedback("complete");
      } else {
        playFeedback("correct");
      }
    } else {
      playFeedback("wrong");
      setErrors((n) => n + 1);
      setWrong([en, pt]);
      timer.current = window.setTimeout(() => {
        setWrong(null);
        setSelectedEn(null);
        setSelectedPt(null);
      }, 650);
    }
  };

  const pickEn = (id: string, text: string) => {
    if (matched.has(id) || wrong) return;
    speak(text);
    setSelectedEn(id);
    if (selectedPt) tryMatch(id, selectedPt);
  };

  const pickPt = (id: string) => {
    if (matched.has(id) || wrong) return;
    setSelectedPt(id);
    if (selectedEn) tryMatch(selectedEn, id);
  };

  const tileClass = (id: string, selected: boolean, side: 0 | 1) =>
    cn(
      "press-3d w-full rounded-2xl border-2 px-3 py-4 text-center font-semibold",
      matched.has(id)
        ? "border-primary/40 bg-speakup-green-soft text-primary opacity-60"
        : wrong && wrong[side] === id
          ? "animate-shake border-destructive bg-destructive/10 text-destructive"
          : selected
            ? "border-sky-500 bg-sky-500/10 shadow-[0_4px_0_#0369a1]"
            : "border-border bg-card shadow-[0_4px_0_hsl(var(--border-shadow))] hover:bg-muted/50"
    );

  return (
    <div className="space-y-4">
      <p className="text-center font-display text-xl font-bold">Ligue os pares</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-3">
          {english.map((p) => (
            <button
              key={`en-${p.id}`}
              type="button"
              disabled={matched.has(p.id)}
              className={cn(tileClass(p.id, selectedEn === p.id, 0), "font-display text-lg")}
              onClick={() => pickEn(p.id, p.english)}
            >
              {p.english}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {portuguese.map((p) => (
            <button
              key={`pt-${p.id}`}
              type="button"
              disabled={matched.has(p.id)}
              className={tileClass(p.id, selectedPt === p.id, 1)}
              onClick={() => pickPt(p.id)}
            >
              {p.portuguese}
            </button>
          ))}
        </div>
      </div>
      <LessonFooter
        status={done ? "correct" : "idle"}
        title="Tudo ligado!"
        actionLabel="Continuar"
        disabled={!done}
        onAction={() => {
          window.clearTimeout(timer.current);
          onComplete(errors === 0);
        }}
      />
    </div>
  );
}
