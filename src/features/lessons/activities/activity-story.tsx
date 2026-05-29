"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { LessonActivityStory } from "@/types/lesson";

interface Props {
  data: LessonActivityStory;
  onComplete: () => void;
}

export function ActivityStory({ data, onComplete }: Props) {
  const [index, setIndex] = useState(0);
  const [showEnglish, setShowEnglish] = useState(false);
  const paragraph = data.paragraphs[index];
  const isLast = index >= data.paragraphs.length - 1;

  const next = () => {
    if (!showEnglish) {
      setShowEnglish(true);
      return;
    }
    if (isLast) {
      onComplete();
    } else {
      setIndex((i) => i + 1);
      setShowEnglish(false);
    }
  };

  return (
    <Card className="border-2">
      <CardContent className="space-y-6 py-8">
        <p className="text-center text-sm text-muted-foreground">
          Trecho {index + 1} de {data.paragraphs.length}
        </p>
        <div className="rounded-2xl bg-speakup-green-soft/40 p-6 text-center">
          {!showEnglish ? (
            <>
              <p className="text-xs uppercase text-muted-foreground">Português</p>
              <p className="mt-2 text-xl font-medium">{paragraph.pt}</p>
            </>
          ) : (
            <>
              <p className="text-xs uppercase text-primary">English</p>
              <p className="mt-2 font-display text-2xl font-bold text-primary">{paragraph.en}</p>
            </>
          )}
        </div>
        <Button size="lg" className="w-full" onClick={next}>
          {!showEnglish ? "Ver em inglês" : isLast ? "Continuar" : "Próximo trecho"}
          <ArrowRight className="h-5 w-5" />
        </Button>
      </CardContent>
    </Card>
  );
}
