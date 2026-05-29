"use client";

import { Mic, Volume2, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { KidIcon } from "@/lib/icons/kid-icons";
import type { LessonActivitySpeakPractice } from "@/types/lesson";

interface Props {
  data: LessonActivitySpeakPractice;
  onComplete: () => void;
}

export function ActivitySpeak({ data, onComplete }: Props) {
  const speak = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(data.phrase);
      u.lang = "en-US";
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <Card className="border-2">
      <CardContent className="space-y-6 py-8 text-center">
        <KidIcon emoji={data.emoji} word={data.phrase} size="xl" className="mx-auto" />
        <p className="font-display text-3xl font-bold text-primary">{data.phrase}</p>
        <p className="text-xl text-muted-foreground">{data.translation}</p>
        <p className="flex items-start justify-center gap-2 rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden />
          <span>{data.tip}</span>
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="outline" onClick={speak}>
            <Volume2 className="h-4 w-4" />
            Ouvir modelo
          </Button>
          <Button onClick={onComplete}>
            <Mic className="h-4 w-4" />
            Eu repeti — continuar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
