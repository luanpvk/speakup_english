"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLesson, useCompleteLesson } from "@/hooks/use-gamification";
import { useGamificationStore } from "@/store/gamification-store";
import { ROUTES } from "@/utils/constants";
import { LessonStepHeader } from "./lesson-step-header";
import { ActivityRenderer } from "./activities/activity-renderer";
import { ActivityFixMistakes } from "./activities/activity-fix-mistakes";
import { ActivityReview } from "./activities/activity-review";
import { LoadingState } from "@/components/ui/loading-state";
import { KidIcon } from "@/lib/icons/kid-icons";
import type { LessonMistake } from "@/types/lesson-mistakes";
import { mistakeKey } from "@/types/lesson-mistakes";
import type { LessonActivityReview } from "@/types/lesson";

type Phase = "playing" | "fixing" | "review" | "done";

interface LessonPlayerProps {
  slug: string;
}

export function LessonPlayer({ slug }: LessonPlayerProps) {
  const router = useRouter();
  const { data, isLoading, error } = useLesson(slug);
  const completeLesson = useCompleteLesson();
  const showCelebration = useGamificationStore((s) => s.showCelebration);

  const [activityIndex, setActivityIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("playing");
  const [mistakes, setMistakes] = useState<LessonMistake[]>([]);
  const [startTime] = useState(Date.now());

  const scoredRef = useRef({ correct: 0, total: 0 });
  const mistakesMapRef = useRef(new Map<string, LessonMistake>());

  const activities = data?.lesson.activities ?? [];
  const learningActivities = useMemo(
    () => activities.filter((a) => a.type !== "review"),
    [activities]
  );
  const reviewActivity = useMemo(
    () => activities.find((a) => a.type === "review"),
    [activities]
  );
  const reviewData = reviewActivity?.data as LessonActivityReview | undefined;

  useEffect(() => {
    setActivityIndex(0);
    setPhase("playing");
    setMistakes([]);
    scoredRef.current = { correct: 0, total: 0 };
    mistakesMapRef.current = new Map();
  }, [slug]);

  const addMistake = useCallback((mistake: LessonMistake) => {
    const key = mistakeKey(mistake);
    if (!mistakesMapRef.current.has(key)) {
      mistakesMapRef.current.set(key, mistake);
      setMistakes(Array.from(mistakesMapRef.current.values()));
    }
  }, []);

  const handleMistakeFixed = useCallback((id: string) => {
    mistakesMapRef.current.delete(id);
    const next = Array.from(mistakesMapRef.current.values());
    setMistakes(next);
    if (next.length === 0) {
      setPhase("review");
    }
  }, []);

  const finishLesson = useCallback(async () => {
    if (mistakesMapRef.current.size > 0) {
      setPhase("fixing");
      return;
    }

    const { correct, total } = scoredRef.current;
    const score = total > 0 ? Math.round((correct / total) * 100) : 100;
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    const res = await completeLesson.mutateAsync({
      slug,
      score,
      timeSpentSeconds: timeSpent,
    });

    if (res.success && res.data && data) {
      showCelebration({
        title: "Parabéns!",
        message: `Você aprendeu tudo em "${data.lesson.title}"!`,
        xp: res.data.xpGained,
        coins: res.data.coinsGained,
      });
    }
    setPhase("done");
  }, [slug, startTime, completeLesson, showCelebration, data]);

  const afterActivityComplete = useCallback(() => {
    if (activityIndex < learningActivities.length - 1) {
      setActivityIndex((i) => i + 1);
    } else if (mistakesMapRef.current.size > 0) {
      setPhase("fixing");
    } else {
      setPhase("review");
    }
  }, [activityIndex, learningActivities.length]);

  if (isLoading) {
    return <LoadingState message="Carregando lição..." variant="lesson" fullScreen />;
  }

  if (error || !data) {
    return (
      <Card className="border-2">
        <CardContent className="py-8 text-center">
          <p>{error instanceof Error ? error.message : "Lição não encontrada"}</p>
          <Button className="mt-4" variant="outline" onClick={() => router.push(ROUTES.lessons)}>
            Voltar
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { lesson } = data;
  const current = phase === "playing" ? learningActivities[activityIndex] : undefined;

  const handleStepComplete = (opts?: {
    correct?: boolean;
    quizCorrect?: number;
    quizTotal?: number;
  }) => {
    if (opts?.quizTotal != null && opts.quizCorrect != null) {
      scoredRef.current.correct += opts.quizCorrect;
      scoredRef.current.total += opts.quizTotal;
    } else if (opts?.correct !== undefined) {
      scoredRef.current.total += 1;
      if (opts.correct) scoredRef.current.correct += 1;
    }
    afterActivityComplete();
  };

  if (phase === "done") {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Card className="border-2 border-primary text-center">
          <CardContent className="py-12">
            <KidIcon emoji="🏆" size="xl" className="mx-auto" />
            <h2 className="mt-4 font-display text-2xl font-bold">Lição completa!</h2>
            <p className="mt-2 text-muted-foreground">
              Você corrigiu todos os erros e aprendeu de verdade.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Button asChild>
                <a href={ROUTES.dashboard}>Painel</a>
              </Button>
              <Button variant="outline" asChild>
                <a href={ROUTES.flashcards}>Flashcards diários</a>
              </Button>
              <Button variant="outline" asChild>
                <a href={ROUTES.lessons}>Mais lições</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button variant="ghost" onClick={() => router.push(ROUTES.lessons)}>
        <ArrowLeft className="h-4 w-4" />
        Voltar às lições
      </Button>

      {phase === "playing" && current && (
        <>
          <LessonStepHeader
            chapterTitle={lesson.chapterTitle}
            activityTitle={current.title}
            instruction={current.instruction}
            stepIndex={activityIndex}
            totalSteps={learningActivities.length + (reviewActivity ? 1 : 0)}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={`${slug}-${current.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
            >
              <ActivityRenderer
            activity={current}
            lessonIcon={lesson.icon}
            lessonTitle={lesson.title}
            lessonSlug={lesson.slug}
            onStepComplete={handleStepComplete}
                onMistake={addMistake}
              />
            </motion.div>
          </AnimatePresence>
        </>
      )}

      {phase === "fixing" && mistakes.length > 0 && (
        <ActivityFixMistakes mistakes={mistakes} onFixed={handleMistakeFixed} />
      )}

      {phase === "review" && reviewData && (
        <ActivityReview
          data={reviewData}
          onFinish={finishLesson}
          finishing={completeLesson.isPending}
          canFinish={mistakes.length === 0}
          pendingMistakes={mistakes.length}
        />
      )}

      {phase === "review" && !reviewData && (
        <Card>
          <CardContent className="py-8 text-center">
            <Button onClick={finishLesson} disabled={mistakes.length > 0 || completeLesson.isPending}>
              Concluir lição
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
