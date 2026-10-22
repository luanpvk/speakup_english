"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen, Check, Lock, Star } from "lucide-react";
import { KidIcon } from "@/lib/icons/kid-icons";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/utils/constants";
import { usePrefetchLesson } from "@/hooks/use-gamification";
import type { LessonSummary, ModuleWithLessons } from "@/types/gamification";

type Tone = "primary" | "secondary";

/** Deslocamento horizontal das bolinhas: desenha o caminho em zigue-zague */
const ZIGZAG = [0, 44, 72, 44, 0, -44, -72, -44];

const TONE = {
  primary: {
    banner: "bg-[hsl(var(--primary-shadow))] shadow-[0_6px_0_hsl(142_55%_22%)]",
    node: "bg-primary text-primary-foreground shadow-[0_6px_0_hsl(var(--primary-shadow))]",
    ring: "ring-primary/30",
    text: "text-primary",
  },
  secondary: {
    banner: "bg-[hsl(var(--secondary-shadow))] shadow-[0_6px_0_hsl(270_40%_30%)]",
    node: "bg-secondary text-white shadow-[0_6px_0_hsl(var(--secondary-shadow))]",
    ring: "ring-secondary/30",
    text: "text-secondary",
  },
} as const;

export function chapterName(title: string) {
  return title.replace(/^Capítulo \d+\s*[:—]\s*/, "");
}

export function UnitBanner({
  mod,
  tone = "primary",
  eyebrow,
}: {
  mod: Pick<ModuleWithLessons, "title" | "description" | "icon" | "slug" | "order" | "unlocked" | "lessonsCompleted" | "lessonsTotal">;
  tone?: Tone;
  eyebrow?: string;
}) {
  if (!mod.unlocked) {
    return (
      <div className="flex items-center justify-between gap-4 rounded-3xl border-2 border-dashed border-border bg-muted/50 p-5 text-muted-foreground">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider">{eyebrow ?? `Capítulo ${mod.order}`}</p>
          <h2 className="font-display text-xl font-bold">{chapterName(mod.title)}</h2>
          <p className="text-sm">Termine o capítulo anterior para liberar</p>
        </div>
        <Lock className="h-10 w-10 shrink-0" aria-hidden />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-between gap-4 rounded-3xl p-5 text-white", TONE[tone].banner)}>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wider text-white/85">
          {eyebrow ?? `Capítulo ${mod.order}`} · {mod.lessonsCompleted}/{mod.lessonsTotal}
        </p>
        <h2 className="font-display text-2xl font-bold leading-tight">{chapterName(mod.title)}</h2>
        <p className="text-sm font-semibold text-white/90">{mod.description}</p>
      </div>
      <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-2 ring-white/25">
        <KidIcon emoji={mod.icon} slug={mod.slug} size="lg" variant="plain" iconClassName="text-white" />
      </span>
    </div>
  );
}

export function LessonPath({
  lessons,
  unlocked,
  currentSlug,
  tone = "primary",
  showMascot = false,
}: {
  lessons: LessonSummary[];
  unlocked: boolean;
  currentSlug?: string;
  tone?: Tone;
  showMascot?: boolean;
}) {
  usePrefetchLesson(unlocked ? currentSlug : undefined);
  return (
    <ol className="relative flex flex-col items-center gap-12 py-10" aria-label="Lições do capítulo">
      {showMascot && (
        <Image
          src="/mascot.png"
          alt=""
          width={130}
          height={130}
          loading="eager"
          className="pointer-events-none absolute left-0 top-24 hidden animate-float-gentle sm:block"
        />
      )}
      {lessons.map((lesson, i) => (
        <li key={lesson.slug} style={{ transform: `translateX(${ZIGZAG[i % ZIGZAG.length]}px)` }}>
          <PathNode
            lesson={lesson}
            unlocked={unlocked}
            current={lesson.slug === currentSlug}
            tone={tone}
          />
        </li>
      ))}
    </ol>
  );
}

function PathNode({
  lesson,
  unlocked,
  current,
  tone,
}: {
  lesson: LessonSummary;
  unlocked: boolean;
  current: boolean;
  tone: Tone;
}) {
  const label = `${lesson.title}${lesson.completed ? " (completa)" : !unlocked ? " (bloqueada)" : ""}`;
  const base = "press-3d flex h-[72px] w-[72px] items-center justify-center rounded-full [&_svg]:h-8 [&_svg]:w-8";

  if (!unlocked) {
    return (
      <span
        className={cn(base, "bg-muted text-muted-foreground shadow-[0_6px_0_hsl(var(--border-shadow))]")}
        role="img"
        aria-label={label}
      >
        <Lock aria-hidden />
      </span>
    );
  }

  return (
    <div className="relative flex flex-col items-center">
      {current && (
        <span
          className={cn(
            "absolute -top-12 z-10 animate-float-gentle whitespace-nowrap rounded-xl border-2 border-border bg-card px-3 py-1.5 font-display text-sm font-bold uppercase tracking-wide shadow-sm",
            TONE[tone].text
          )}
        >
          Começar
          <span className="absolute -bottom-[7px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-border bg-card" />
        </span>
      )}
      <Link
        href={ROUTES.lesson(lesson.slug)}
        aria-label={label}
        title={lesson.title}
        className={cn(
          base,
          lesson.completed
            ? "bg-accent text-accent-foreground shadow-[0_6px_0_hsl(var(--accent-shadow))]"
            : current
              ? cn(TONE[tone].node, "ring-8", TONE[tone].ring)
              : "border-2 border-border bg-card shadow-[0_6px_0_hsl(var(--border-shadow))]",
          !lesson.completed && !current && TONE[tone].text
        )}
      >
        {lesson.completed ? <Check strokeWidth={3} aria-hidden /> : current ? <Star className="fill-current" aria-hidden /> : <BookOpen aria-hidden />}
      </Link>
    </div>
  );
}
