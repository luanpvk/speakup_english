"use client";

import Image from "next/image";
import { KidIcon } from "@/lib/icons/kid-icons";
import type { LessonActivityIntro } from "@/types/lesson";
import { LessonFooter, speak } from "../lesson-kit";

interface Props {
  data: LessonActivityIntro;
  lessonIcon: string;
  lessonTitle: string;
  lessonSlug?: string;
  onComplete: () => void;
}

export function ActivityIntro({ data, lessonIcon, lessonTitle, lessonSlug, onComplete }: Props) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex items-end gap-3">
        <Image src="/mascot.png" alt="" width={96} height={96} loading="eager" className="animate-hop" />
        <div className="relative mb-6 rounded-2xl border-2 border-border bg-card px-4 py-2.5 text-left shadow-[0_4px_0_hsl(var(--border-shadow))]">
          <p className="font-display font-bold">Bora aprender?</p>
          <span className="absolute -left-[9px] bottom-4 h-4 w-4 rotate-45 border-b-2 border-l-2 border-border bg-card" />
        </div>
      </div>

      <span className="mt-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-speakup-green-soft">
        <KidIcon emoji={lessonIcon} slug={lessonSlug} size="xl" variant="plain" />
      </span>
      <h2 className="mt-3 font-display text-2xl font-bold">{lessonTitle}</h2>
      <p className="mt-1 max-w-md text-muted-foreground">{data.objective}</p>

      <p className="mt-6 text-sm font-bold uppercase tracking-wide text-muted-foreground">Palavras de hoje</p>
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        {data.whatYouWillLearn.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => speak(item, { force: true })}
            className="press-3d rounded-2xl border-2 border-border bg-card px-4 py-2 font-semibold shadow-[0_4px_0_hsl(var(--border-shadow))] hover:bg-muted/50"
            aria-label={`Ouvir ${item}`}
          >
            {item}
          </button>
        ))}
      </div>

      <LessonFooter actionLabel="Começar" onAction={onComplete} />
    </div>
  );
}
