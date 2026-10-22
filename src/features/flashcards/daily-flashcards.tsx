"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { RotateCcw, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TutorialButton } from "@/features/onboarding/tutorial-dialog";
import { ProgressBar } from "@/components/ui/progress-bar";
import { LoadingState } from "@/components/ui/loading-state";
import { useQueryClient } from "@tanstack/react-query";
import { gamificationKeys, useDailyFlashcards, useReviewFlashcard } from "@/hooks/use-gamification";
import { ListenButtons, playFeedback, useOptionKeys } from "@/features/lessons/lesson-kit";
import { MAX_DAILY_FLASHCARDS, ROUTES } from "@/utils/constants";
import { toast } from "@/store/toast-store";
import { cn } from "@/lib/utils";
import type { DailyFlashcardSession, FlashcardRating } from "@/types/flashcard";

const RATINGS: { rating: FlashcardRating; label: string; hint: string; className: string }[] = [
  { rating: 1, label: "Errei", hint: "volta hoje", className: "bg-rose-500 text-white shadow-[0_4px_0_#9f1239]" },
  { rating: 2, label: "Difícil", hint: "volta logo", className: "bg-orange-500 text-white shadow-[0_4px_0_#c2410c]" },
  { rating: 3, label: "Bom", hint: "volta depois", className: "bg-sky-500 text-white shadow-[0_4px_0_#0369a1]" },
  { rating: 4, label: "Fácil", hint: "demora a voltar", className: "bg-primary text-primary-foreground shadow-[0_4px_0_hsl(var(--primary-shadow))]" },
];

export function DailyFlashcards() {
  const { data: session, isLoading, isFetching, refetch } = useDailyFlashcards();
  const reviewMutation = useReviewFlashcard();
  const queryClient = useQueryClient();
  const [flipped, setFlipped] = useState(false);
  const queue = session?.queue ?? [];
  const reviewsDone = session?.reviewsDoneToday ?? 0;

  const current = queue[0];
  const dailyLimit = session?.dailyLimit ?? MAX_DAILY_FLASHCARDS;
  const totalCards = session?.totalCards ?? 0;

  const rate = useCallback(
    async (rating: FlashcardRating) => {
      if (!current || reviewMutation.isPending) return;
      playFeedback(rating >= 3 ? "correct" : "wrong");
      const res = await reviewMutation.mutateAsync({ cardId: current.id, rating });
      setFlipped(false);
      if (res.success && res.data?.session) {
        // A resposta já traz a fila nova: atualiza o cache sem esperar outra consulta
        queryClient.setQueryData<DailyFlashcardSession>(gamificationKeys.flashcards, res.data.session);
        if (res.data.session.queue.length === 0) playFeedback("complete");
      } else {
        toast.error("Não deu para salvar", res.error ?? "Tente de novo.");
        await refetch();
      }
    },
    [current, queryClient, refetch, reviewMutation]
  );

  // 1 a 4 respondem (depois de virar); Enter ou Espaço viram o cartão
  useOptionKeys(RATINGS.length, (i) => void rate(RATINGS[i].rating), flipped && !reviewMutation.isPending);
  useEffect(() => {
    if (!current) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "Enter" || e.key === " ") && !flipped) {
        e.preventDefault();
        setFlipped(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, flipped]);

  if (isLoading || (isFetching && totalCards === 0)) {
    return <LoadingState message="Carregando flashcards..." skeleton="flashcards" />;
  }

  const header = (
    <header className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h1 className="font-display text-2xl font-bold">Flashcards</h1>
        <TutorialButton startAt="flashcards" label="Como funciona?" />
      </div>
      <div className="flex items-center gap-3">
        <ProgressBar value={(reviewsDone / dailyLimit) * 100} className="flex-1" />
        <span className="shrink-0 text-sm font-bold tabular-nums text-muted-foreground">
          {Math.min(reviewsDone, dailyLimit)}/{dailyLimit}
        </span>
      </div>
    </header>
  );

  if (!session || queue.length === 0) {
    const dailyDone = reviewsDone >= dailyLimit;
    return (
      <div className="mx-auto max-w-lg space-y-6">
        {header}
        <div className="flex flex-col items-center gap-3 rounded-3xl border-2 border-border bg-card px-6 py-10 text-center">
          <Image src="/mascot.png" alt="" width={120} height={120} className={dailyDone ? "animate-hop" : undefined} />
          <h2 className="font-display text-2xl font-bold">
            {dailyDone ? "Meta de hoje completa!" : "Nada para revisar agora"}
          </h2>
          <p className="max-w-sm text-muted-foreground">
            {dailyDone
              ? "Você revisou todos os cartões de hoje. Amanhã tem mais!"
              : "Os próximos cartões voltam mais tarde. Que tal fazer uma lição enquanto isso?"}
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href={ROUTES.dashboard}>Ir para a trilha</Link>
            </Button>
            {!dailyDone && (
              <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
                <RotateCcw className="h-4 w-4" />
                Atualizar
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      {header}

      <motion.div key={current.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          className="flip-card w-full"
          data-flipped={flipped}
          aria-label={flipped ? `${current.translation}. Toque para ver em inglês` : `${current.word}. Toque para ver a tradução`}
        >
          <span className="flip-inner grid">
            <span className="flip-face col-start-1 row-start-1 flex min-h-72 flex-col items-center justify-center rounded-3xl border-2 border-border bg-card p-8 shadow-[0_6px_0_hsl(var(--border-shadow))]">
              <span className="rounded-full bg-sky-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-sky-500">
                Inglês
              </span>
              <span className="mt-4 font-display text-4xl font-bold text-primary sm:text-5xl">{current.word}</span>
              <span className="mt-6 flex items-center gap-1 text-sm font-semibold text-muted-foreground">
                <RotateCw className="h-4 w-4" aria-hidden />
                Lembra o que é? Toque para virar
              </span>
            </span>
            <span className="flip-face flip-back col-start-1 row-start-1 flex min-h-72 flex-col items-center justify-center rounded-3xl border-2 border-primary/40 bg-speakup-green-soft p-8 shadow-[0_6px_0_hsl(var(--primary-shadow))]">
              <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                Português
              </span>
              <span className="mt-4 font-display text-3xl font-bold sm:text-4xl">{current.translation}</span>
              {current.example && (
                <span className="mt-4 text-sm text-muted-foreground">&ldquo;{current.example}&rdquo;</span>
              )}
            </span>
          </span>
        </button>
      </motion.div>

      <ListenButtons text={current.word} />

      {flipped ? (
        <div className="space-y-2">
          <p className="text-center text-sm font-semibold text-muted-foreground">Como foi lembrar?</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {RATINGS.map(({ rating, label, hint, className }, i) => (
              <button
                key={rating}
                type="button"
                disabled={reviewMutation.isPending}
                onClick={() => rate(rating)}
                className={cn("press-3d flex flex-col items-center rounded-2xl px-2 py-3 disabled:opacity-60", className)}
              >
                <span className="font-display text-lg font-bold">
                  <span className="mr-1 text-xs opacity-70">{i + 1}</span>
                  {label}
                </span>
                <span className="text-xs opacity-90">{hint}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <Button size="lg" className="w-full" onClick={() => setFlipped(true)}>
          Ver resposta
        </Button>
      )}
    </div>
  );
}
