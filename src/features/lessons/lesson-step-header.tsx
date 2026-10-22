"use client";

interface LessonStepHeaderProps {
  chapterTitle?: string;
  activityTitle: string;
  instruction?: string;
  stepIndex: number;
  totalSteps: number;
}

export function LessonStepHeader({ chapterTitle, activityTitle, stepIndex, totalSteps }: LessonStepHeaderProps) {
  return (
    <p className="text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
      <span className="sr-only">{activityTitle}. </span>
      {chapterTitle ? `${chapterTitle} · ` : ""}Passo {stepIndex + 1} de {totalSteps}
    </p>
  );
}
