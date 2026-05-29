"use client";

import { Loader2, BookOpen, Save, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type LoadingVariant = "default" | "lesson" | "save" | "flashcards";

const VARIANT_ICON: Record<LoadingVariant, LucideIcon> = {
  default: Loader2,
  lesson: BookOpen,
  save: Save,
  flashcards: Sparkles,
};

interface LoadingStateProps {
  message?: string;
  variant?: LoadingVariant;
  className?: string;
  fullScreen?: boolean;
}

export function LoadingState({
  message = "Carregando...",
  variant = "default",
  className,
  fullScreen = false,
}: LoadingStateProps) {
  const Icon = VARIANT_ICON[variant];
  const spin = variant === "default";

  const content = (
    <div
      className={cn("flex flex-col items-center justify-center gap-4 text-center", className)}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary/40 bg-speakup-green-soft">
        <Icon
          className={cn("h-8 w-8 text-primary", spin && "animate-spin")}
          strokeWidth={2}
          aria-hidden
        />
      </div>
      <p className="font-display text-lg font-semibold text-foreground">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center py-16">{content}</div>
    );
  }

  return <div className="py-12">{content}</div>;
}
