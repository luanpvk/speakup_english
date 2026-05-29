"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KidIcon } from "@/lib/icons/kid-icons";
import type { LessonActivityIntro } from "@/types/lesson";

interface Props {
  data: LessonActivityIntro;
  lessonIcon: string;
  lessonTitle: string;
  lessonSlug?: string;
  onComplete: () => void;
}

export function ActivityIntro({ data, lessonIcon, lessonTitle, lessonSlug, onComplete }: Props) {
  return (
    <Card className="border-2 border-primary">
      <CardHeader className="flex flex-col items-center text-center">
        <KidIcon emoji={lessonIcon} slug={lessonSlug} size="xl" />
        <CardTitle className="mt-4 text-2xl">{lessonTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{data.objective}</p>
        <div className="rounded-xl bg-muted/50 p-4">
          <p className="mb-2 text-sm font-semibold">Nesta lição você vai:</p>
          <ul className="list-inside list-disc space-y-1 text-sm">
            {data.whatYouWillLearn.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <Button size="lg" className="w-full" onClick={onComplete}>
          Começar a aprender
          <ArrowRight className="h-5 w-5" />
        </Button>
      </CardContent>
    </Card>
  );
}
