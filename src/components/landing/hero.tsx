"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Star,
  Shield,
  Heart,
  Rabbit,
  Flame,
  Sparkles,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useThemeStore } from "@/store/theme-store";

export function Hero() {
  const reduceMotion = useThemeStore((s) => s.reduceMotion);
  const MotionDiv = reduceMotion ? "div" : motion.div;

  return (
    <section
      className="relative overflow-hidden gradient-speakup px-4 py-16 md:py-24"
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-secondary/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <MotionDiv
          {...(!reduceMotion && {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.45 },
          })}
        >
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-primary/30 bg-speakup-green-soft px-4 py-1.5 text-sm font-semibold text-primary">
            <Star className="h-4 w-4 fill-primary/20" aria-hidden />
            Aprendizado inclusivo
          </span>

          <h1
            id="hero-heading"
            className="mt-6 font-display text-4xl font-bold leading-tight text-balance md:text-5xl lg:text-6xl"
          >
            Inglês que faz as crianças{" "}
            <span className="text-primary">falarem</span> com confiança
          </h1>

          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            SpeakUp English combina lições curtas, jogos suaves e progresso visível — com design
            acolhedor para neurodivergentes e famílias que valorizam calma e clareza.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button size="lg" asChild>
              <Link href="/register">
                Começar grátis
                <ArrowRight className="h-5 w-5" aria-hidden />
              </Link>
            </Button>
            <Button size="lg" variant="child" asChild className="gap-2">
              <Link href="/login/child">
                <Rabbit className="h-5 w-5" aria-hidden />
                Entrar como criança
              </Link>
            </Button>
          </div>

          <ul className="mt-8 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <li className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/60 px-3 py-2">
              <Shield className="h-4 w-4 text-primary" aria-hidden />
              Ambiente seguro
            </li>
            <li className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/60 px-3 py-2">
              <Heart className="h-4 w-4 text-secondary" aria-hidden />
              Baixo estímulo
            </li>
          </ul>
        </MotionDiv>

        <MotionDiv
          className="relative flex justify-center"
          {...(!reduceMotion && {
            initial: { opacity: 0, scale: 0.97 },
            animate: { opacity: 1, scale: 1 },
            transition: { duration: 0.5, delay: 0.1 },
          })}
        >
          <div className="relative w-full max-w-md rounded-3xl border-2 border-primary/20 bg-card p-8 shadow-xl">
            <div className="flex flex-col items-center text-center">
              <span className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-primary/25 bg-gradient-to-br from-speakup-green-soft to-speakup-yellow-soft">
                <Rabbit className="h-12 w-12 text-primary" strokeWidth={2} aria-hidden />
              </span>
              <p className="mt-4 font-display text-2xl font-bold">Olá, explorer!</p>
              <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
                Nível 3
                <span className="text-border">·</span>
                <Flame className="h-4 w-4 text-orange-500" aria-hidden />
                5 dias seguidos
              </p>
            </div>

            <div className="mt-6 space-y-2">
              <ProgressBar value={75} label="75% da lição de hoje" color="primary" />
            </div>

            <div className="mt-5 flex justify-center gap-3">
              <span className="inline-flex items-center gap-1 rounded-xl bg-speakup-yellow-soft px-3 py-1.5 text-xs font-semibold text-foreground">
                <Star className="h-3.5 w-3.5 text-amber-500" aria-hidden />
                +12 XP
              </span>
              <span className="inline-flex items-center gap-1 rounded-xl bg-speakup-green-soft px-3 py-1.5 text-xs font-semibold text-primary">
                <Trophy className="h-3.5 w-3.5" aria-hidden />
                Lição 2/7
              </span>
            </div>

            {!reduceMotion && (
              <>
                <Sparkles
                  className="absolute -right-1 top-4 h-7 w-7 text-amber-400"
                  aria-hidden
                />
                <Star
                  className="absolute -bottom-1 -left-1 h-6 w-6 text-primary/70"
                  aria-hidden
                />
              </>
            )}
          </div>
        </MotionDiv>
      </div>
    </section>
  );
}
