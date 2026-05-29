"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, BookOpen, Layers, RotateCcw, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useDailyFlashcards, useReviewFlashcard } from "@/hooks/use-gamification";
import { MAX_DAILY_FLASHCARDS } from "@/utils/constants";
import type { FlashcardItem, FlashcardRating } from "@/types/flashcard";
import Link from "next/link";
import { ROUTES } from "@/utils/constants";
import { LoadingState } from "@/components/ui/loading-state";
import { KidIcon } from "@/lib/icons/kid-icons";
import { Sparkles } from "lucide-react";

const RATING_BUTTONS: { rating: FlashcardRating; label: string; sub: string; className: string }[] = [
  { rating: 1, label: "Errei", sub: "Ver de novo hoje", className: "bg-red-100 hover:bg-red-200 text-red-900" },
  { rating: 2, label: "Difícil", sub: "Quase lá", className: "bg-orange-100 hover:bg-orange-200 text-orange-900" },
  { rating: 3, label: "Bom", sub: "Lembrei bem", className: "bg-sky-100 hover:bg-sky-200 text-sky-900" },
  { rating: 4, label: "Fácil", sub: "Muito fácil!", className: "bg-emerald-100 hover:bg-emerald-200 text-emerald-900" },
];

export function DailyFlashcards() {
  const { data: session, isLoading, isFetching, refetch } = useDailyFlashcards();
  const reviewMutation = useReviewFlashcard();
  const [flipped, setFlipped] = useState(false);
  const [queue, setQueue] = useState<FlashcardItem[]>([]);
  const [reviewsDone, setReviewsDone] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      setQueue(session.queue);
      setReviewsDone(session.reviewsDoneToday);
    }
  }, [session]);

  const current = queue[0];
  const dailyLimit = session?.dailyLimit ?? MAX_DAILY_FLASHCARDS;
  const remaining = Math.max(0, dailyLimit - reviewsDone);
  const totalCards = session?.totalCards ?? 0;
  const bankSize = session?.bankSize ?? 1000;
  const totalDue = session?.totalDue ?? 0;

  const speak = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      window.speechSynthesis.speak(u);
    }
  };

  const rate = async (rating: FlashcardRating) => {
    if (!current || reviewMutation.isPending) return;
    setErrorMsg(null);

    try {
      const res = await reviewMutation.mutateAsync({ cardId: current.id, rating });
      setFlipped(false);

      if (res.success && res.data?.session) {
        setQueue(res.data.session.queue);
        setReviewsDone(res.data.session.reviewsDoneToday);
      } else {
        setErrorMsg(res.error ?? "Não foi possível salvar a revisão");
        setQueue((q) => q.slice(1));
        await refetch();
      }
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Erro ao revisar cartão");
    }
  };

  const handleRefresh = () => {
    setErrorMsg(null);
    refetch();
  };

  if (isLoading || (isFetching && totalCards === 0)) {
    return (
      <LoadingState
        message={
          isFetching && totalCards === 0
            ? "Preparando seu baralho com mais de 1000 palavras..."
            : "Carregando flashcards..."
        }
        variant="flashcards"
        fullScreen
      />
    );
  }

  if (!session || (totalCards === 0 && !isFetching)) {
    return (
      <Card className="border-2 text-center">
        <CardContent className="space-y-4 py-12">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="font-display text-xl font-bold">Preparando baralho...</h2>
          <p className="text-muted-foreground">
            Estamos criando mais de {bankSize} cartões para você. Clique em atualizar.
          </p>
          <Button onClick={handleRefresh} disabled={isFetching}>
            <RotateCcw className="h-4 w-4" />
            Criar meu baralho
          </Button>
        </CardContent>
      </Card>
    );
  }

  const dailyDone = reviewsDone >= dailyLimit;
  const noQueueNow = queue.length === 0;

  if (noQueueNow) {
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <header className="space-y-2">
          <h1 className="font-display text-2xl font-bold">Flashcards diários</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Baralho: {totalCards.toLocaleString("pt-BR")} / {bankSize.toLocaleString("pt-BR")} cartões
          </p>
        </header>

        <Card className="border-2 border-primary text-center">
          <CardContent className="space-y-4 py-12">
            {dailyDone ? (
              <Sparkles className="mx-auto h-16 w-16 text-primary" />
            ) : (
              <BookOpen className="mx-auto h-16 w-16 text-muted-foreground" />
            )}
            <h2 className="font-display text-2xl font-bold">
              {dailyDone ? "Meta de hoje completa!" : "Nenhum cartão na fila agora"}
            </h2>
            <p className="text-muted-foreground">
              {dailyDone
                ? `Você revisou ${reviewsDone}/${dailyLimit} cartões hoje. Volte amanhã para mais 10!`
                : `${totalDue.toLocaleString("pt-BR")} cartões vencem depois (repetição espaçada). Você já fez ${reviewsDone} de ${dailyLimit} hoje.`}
            </p>
            <ProgressBar value={(reviewsDone / dailyLimit) * 100} label="Meta diária" />
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="outline" onClick={handleRefresh} disabled={isFetching}>
                <RotateCcw className="h-4 w-4" />
                Atualizar
              </Button>
              <Button variant="outline" asChild>
                <Link href={ROUTES.lessons}>Fazer lições</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <header className="space-y-2">
        <h1 className="font-display text-2xl font-bold">Flashcards diários</h1>
        <p className="text-sm text-muted-foreground">
          Estilo Anki — {remaining} de {dailyLimit} restantes hoje ·{" "}
          {totalCards.toLocaleString("pt-BR")} cartões no baralho
        </p>
        <ProgressBar
          value={(reviewsDone / dailyLimit) * 100}
          label={`Hoje: ${reviewsDone} / ${dailyLimit}`}
        />
      </header>

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      <motion.div
        key={current.id}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <button
          type="button"
          className="w-full rounded-2xl border-2 border-primary/40 bg-card p-10 shadow-lg transition hover:border-primary"
          onClick={() => setFlipped((f) => !f)}
        >
          <KidIcon emoji={current.emoji} word={current.word} size="xl" className="mx-auto" />
          {!flipped ? (
            <>
              <p className="mt-4 text-xs uppercase tracking-wide text-muted-foreground">Inglês</p>
              <p className="font-display text-3xl font-bold text-primary sm:text-4xl">{current.word}</p>
              <p className="mt-4 text-sm text-muted-foreground">Toque para ver a resposta</p>
            </>
          ) : (
            <>
              <p className="mt-4 text-xs uppercase tracking-wide text-muted-foreground">Português</p>
              <p className="text-2xl font-semibold sm:text-3xl">{current.translation}</p>
              {current.example && (
                <p className="mt-3 text-sm italic text-muted-foreground">&ldquo;{current.example}&rdquo;</p>
              )}
            </>
          )}
        </button>
      </motion.div>

      <div className="flex justify-center">
        <Button variant="outline" size="sm" onClick={() => speak(current.word)}>
          <Volume2 className="h-4 w-4" />
          Ouvir
        </Button>
      </div>

      {flipped && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {RATING_BUTTONS.map(({ rating, label, sub, className }) => (
            <Button
              key={rating}
              type="button"
              variant="ghost"
              disabled={reviewMutation.isPending}
              className={`h-auto flex-col py-3 ${className}`}
              onClick={() => rate(rating)}
            >
              <span className="font-bold">{label}</span>
              <span className="text-[10px] opacity-80">{sub}</span>
            </Button>
          ))}
        </div>
      )}

      {!flipped && (
        <p className="text-center text-sm text-muted-foreground">
          Pense na resposta, vire o cartão e escolha o quão bem você lembrou.
        </p>
      )}
    </div>
  );
}
