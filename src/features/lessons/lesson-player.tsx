"use client";

import { toast } from "@/store/toast-store";

import { useState, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Flame, Layers, X } from "lucide-react";
import Image from "next/image";
import { LessonFooter } from "./lesson-kit";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLesson, useCompleteLesson } from "@/hooks/use-gamification";
import { useGamificationStore } from "@/store/gamification-store";
import { ROUTES } from "@/utils/constants";
import { LessonStepHeader } from "./lesson-step-header";
import { ActivityRenderer } from "./activities/activity-renderer";
import { ActivityFixMistakes, MAX_REVIEW_ERRORS } from "./activities/activity-fix-mistakes";
import { ActivityReview } from "./activities/activity-review";
import { LoadingState } from "@/components/ui/loading-state";
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
  const [startTime] = useState(() => Date.now());
  const [reviewErrors, setReviewErrors] = useState(0);
  const [combo, setCombo] = useState(0);
  const handleAnswer = useCallback((correct: boolean) => setCombo((c) => (correct ? c + 1 : 0)), []);
  const [restarted, setRestarted] = useState(false);

  const scoredRef = useRef({ correct: 0, total: 0 });
  const mistakesMapRef = useRef(new Map<string, LessonMistake>());

  const activities = useMemo(() => data?.lesson.activities ?? [], [data]);
  const learningActivities = useMemo(
    () => activities.filter((a) => a.type !== "review"),
    [activities]
  );
  const reviewActivity = useMemo(
    () => activities.find((a) => a.type === "review"),
    [activities]
  );
  const reviewData = reviewActivity?.data as LessonActivityReview | undefined;

  const resetRun = useCallback(() => {
    setActivityIndex(0);
    setPhase("playing");
    setMistakes([]);
    setReviewErrors(0);
    setCombo(0);
    scoredRef.current = { correct: 0, total: 0 };
    mistakesMapRef.current = new Map();
  }, []);


  const handleReviewWrong = useCallback(() => {
    if (reviewErrors + 1 < MAX_REVIEW_ERRORS) {
      setReviewErrors(reviewErrors + 1);
      return;
    }
    // 3 erros na revisão: refaz a lição inteira
    resetRun();
    setRestarted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [reviewErrors, resetRun]);

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

    if (!res.success) {
      // Não mostra "Lição completa" se o progresso não foi salvo
      toast.error("Não deu para salvar sua lição", res.error ?? "Toque em concluir para tentar de novo.");
      return;
    }

    if (res.data && data) {
      showCelebration({
        title: "Mandou bem!",
        message: `Você terminou a ${data.lesson.title}.`,
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
    return <LoadingState message="Carregando lição..." skeleton="lesson" />;
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
    setRestarted(false);
    afterActivityComplete();
  };

  if (phase === "done") {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 pb-44 pt-10 text-center">
        <Image src="/mascot.png" alt="" width={140} height={140} className="animate-hop" />
        <h2 className="font-display text-3xl font-bold">Lição completa!</h2>
        <p className="text-muted-foreground">Você aprendeu de verdade. A próxima já está esperando na trilha.</p>
        <LessonFooter
          actionLabel="Continuar"
          onAction={() => router.push(ROUTES.dashboard)}
          secondary={
            <Button variant="ghost" asChild>
              <Link href={ROUTES.flashcards}>
                <Layers className="h-4 w-4" />
                Flashcards
              </Link>
            </Button>
          }
        />
      </div>
    );
  }


  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-44">
      <div className="flex items-center gap-3">
        <Link
          href={ROUTES.dashboard}
          aria-label="Sair da lição"
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-7 w-7" strokeWidth={2.5} />
        </Link>
        <ProgressBar
          className="flex-1"
          value={
            phase === "playing"
              ? (activityIndex / Math.max(learningActivities.length + (reviewActivity ? 1 : 0), 1)) * 100
              : phase === "fixing"
                ? 90
                : 100
          }
        />
        {/* Acertos seguidos: aparece a partir de 2 */}
        <AnimatePresence>
          {combo >= 2 && phase === "playing" && (
            <motion.span
              key={combo}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="flex items-center gap-1 font-display text-lg font-bold text-orange-500"
              aria-label={`${combo} acertos seguidos`}
            >
              <Flame className="h-5 w-5 fill-orange-400" aria-hidden />
              {combo}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {restarted && phase === "playing" && (
        <p
          role="alert"
          className="rounded-xl border-2 border-amber-400 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
        >
          Você errou {MAX_REVIEW_ERRORS} vezes na revisão, e tudo bem! Vamos fazer a lição de novo
          desde o começo, com calma.
        </p>
      )}

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
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <ActivityRenderer
            activity={current}
            lessonIcon={lesson.icon}
            lessonTitle={lesson.title}
            lessonSlug={lesson.slug}
            onStepComplete={handleStepComplete}
                onMistake={addMistake}
                onAnswer={handleAnswer}
              />
            </motion.div>
          </AnimatePresence>
        </>
      )}

      {phase === "fixing" && mistakes.length > 0 && (
        <ActivityFixMistakes
          mistakes={mistakes}
          onFixed={handleMistakeFixed}
          onWrong={handleReviewWrong}
          wrongCount={reviewErrors}
        />
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
