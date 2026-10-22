"use client";

import { Lightbulb } from "lucide-react";
import { KidIcon } from "@/lib/icons/kid-icons";
import type { LessonActivitySpeakPractice } from "@/types/lesson";
import { LessonFooter, ListenButtons, useAutoSpeak } from "../lesson-kit";

interface Props {
  data: LessonActivitySpeakPractice;
  onComplete: () => void;
}

export function ActivitySpeak({ data, onComplete }: Props) {
  useAutoSpeak(data.phrase);

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-speakup-green-soft">
        <KidIcon emoji={data.emoji} word={data.phrase} size="xl" variant="plain" />
      </span>
      <div>
        <p className="font-display text-3xl font-bold text-primary">{data.phrase}</p>
        <p className="mt-1 text-lg text-muted-foreground">{data.translation}</p>
      </div>
      <ListenButtons text={data.phrase} size="lg" />
      <p className="flex max-w-md items-start gap-2 rounded-2xl bg-amber-400/15 px-4 py-3 text-left text-sm">
        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden />
        <span>{data.tip}</span>
      </p>
      <LessonFooter actionLabel="Já falei!" onAction={onComplete} />
    </div>
  );
}
