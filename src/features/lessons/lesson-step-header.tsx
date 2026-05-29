"use client";

import { ProgressBar } from "@/components/ui/progress-bar";

interface LessonStepHeaderProps {
  chapterTitle?: string;
  activityTitle: string;
  instruction?: string;
  stepIndex: number;
  totalSteps: number;
}

export function LessonStepHeader({
  chapterTitle,
  activityTitle,
  instruction,
  stepIndex,
  totalSteps,
}: LessonStepHeaderProps) {
  const progress = ((stepIndex + 1) / Math.max(totalSteps, 1)) * 100;

  return (
    <div className="space-y-2">
      {chapterTitle && (
        <p className="text-xs font-medium uppercase tracking-wide text-primary">{chapterTitle}</p>
      )}
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-xl font-bold">{activityTitle}</h2>
        <span className="shrink-0 text-sm text-muted-foreground">
          {stepIndex + 1} / {totalSteps}
        </span>
      </div>
      {instruction && <p className="text-sm text-muted-foreground">{instruction}</p>}
      <ProgressBar value={progress} label={`Etapa ${stepIndex + 1}`} />
    </div>
  );
}
