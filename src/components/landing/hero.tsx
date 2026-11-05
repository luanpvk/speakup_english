"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Star, Shield, Heart, Rabbit, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
      {/* Esfumaça a base para emendar com a próxima seção, sem corte seco */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background dark:hidden"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <MotionDiv
          className="text-center lg:text-left"
          {...(!reduceMotion && {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.45 },
          })}
        >
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-primary/30 bg-speakup-green-soft px-4 py-1.5 text-sm font-semibold text-primary">
            <Star className="h-4 w-4 fill-primary/20" aria-hidden />
            Feito para todas as crianças
          </span>

          <h1
            id="hero-heading"
            className="mt-6 font-display text-4xl font-bold leading-tight text-balance md:text-5xl lg:text-6xl"
          >
            Seu filho falando inglês{" "}
            <span className="text-primary">sem medo</span> de errar
          </h1>

          <p className="mx-auto mt-6 max-w-lg text-lg text-muted-foreground lg:mx-0">
            Lições de 10 minutos, joguinhos e um gatinho que comemora cada acerto. Criamos o
            SpeakUp pensando em crianças autistas, com TDAH e em toda família que prefere
            aprender com calma.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row sm:items-center lg:justify-start">
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

          <ul className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground lg:justify-start">
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
          className="relative order-first flex justify-center lg:order-none"
          {...(!reduceMotion && {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            transition: { duration: 0.5, delay: 0.1 },
          })}
        >
          <div className="relative">
            {/* balão de fala do mascote */}
            <div className="absolute -top-2 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-2xl border-2 border-border bg-card px-5 py-2.5 font-display text-xl font-bold shadow-[0_4px_0_hsl(var(--border-shadow))] md:-left-8 md:translate-x-0">
              Hello! Vamos aprender?
              <span className="absolute -bottom-[9px] left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-border bg-card md:left-16" />
            </div>
            <Image
              src="/mascot-hero.png"
              alt="Mascote do SpeakUp: um gatinho amarelo com fones de ouvido"
              width={836}
              height={988}
              sizes="(min-width: 768px) 320px, 240px"
              priority
              className={cn("mt-12 h-64 w-auto md:h-[23rem]", !reduceMotion && "animate-float-gentle")}
            />
            <span className="absolute bottom-10 -left-4 inline-flex items-center gap-1.5 rounded-2xl border-2 border-border bg-card px-3 py-2 font-display font-bold text-orange-500 shadow-[0_4px_0_hsl(var(--border-shadow))] md:-left-10">
              <Flame className="h-5 w-5 fill-orange-400" aria-hidden />5 dias
            </span>
            <span className="absolute bottom-24 -right-4 inline-flex items-center gap-1.5 rounded-2xl border-2 border-border bg-card px-3 py-2 font-display font-bold text-amber-500 shadow-[0_4px_0_hsl(var(--border-shadow))] md:-right-8">
              <Star className="h-5 w-5 fill-current" aria-hidden />
              +12 XP
            </span>
          </div>
        </MotionDiv>
      </div>
    </section>
  );
}
