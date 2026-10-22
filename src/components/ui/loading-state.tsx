"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  FlashcardSkeleton,
  FormSkeleton,
  GridSkeleton,
  LessonSkeleton,
  ListSkeleton,
  PathSkeleton,
  ProfileSkeleton,
  RowsSkeleton,
} from "@/components/ui/skeleton";

const SKELETONS = {
  path: PathSkeleton,
  lesson: LessonSkeleton,
  grid: GridSkeleton,
  list: ListSkeleton,
  profile: ProfileSkeleton,
  form: FormSkeleton,
  rows: RowsSkeleton,
  flashcards: FlashcardSkeleton,
} as const;

interface LoadingStateProps {
  /** Lido por leitores de tela; na tela aparece o esqueleto da página */
  message?: string;
  /** Formato do esqueleto; "mascot" mostra o gatinho (ex.: salvando) */
  skeleton?: keyof typeof SKELETONS | "mascot";
  className?: string;
}

export function LoadingState({
  message = "Carregando...",
  skeleton = "grid",
  className,
}: LoadingStateProps) {
  if (skeleton === "mascot") {
    return (
      <div
        className={cn("flex flex-col items-center justify-center gap-3 text-center", className)}
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <Image src="/mascot.png" alt="" width={88} height={88} className="animate-hop" />
        <p className="font-display text-lg font-semibold">{message}</p>
      </div>
    );
  }

  const Layout = SKELETONS[skeleton];
  return (
    <div className={cn("animate-fade-in", className)} role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">{message}</span>
      <Layout />
    </div>
  );
}
