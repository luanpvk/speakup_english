"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import Image from "next/image";
import type { LessonActivityStory } from "@/types/lesson";
import { LessonFooter, speak } from "../lesson-kit";

interface Props {
  data: LessonActivityStory;
  onComplete: () => void;
}

/** História em forma de conversa: cada toque revela a próxima fala e já lê em inglês */
export function ActivityStory({ data, onComplete }: Props) {
  const [shown, setShown] = useState(1);
  const lines = data.paragraphs.slice(0, shown);
  const isLast = shown >= data.paragraphs.length;

  useEffect(() => {
    const line = data.paragraphs[shown - 1];
    if (!line) return;
    const t = window.setTimeout(() => speak(line.en), 250);
    return () => window.clearTimeout(t);
  }, [shown, data.paragraphs]);

  return (
    <div className="space-y-4">
      {lines.map((p, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-end gap-3"
        >
          <Image src="/mascot.png" alt="" width={44} height={44} className="shrink-0" />
          <button
            type="button"
            onClick={() => speak(p.en, { force: true })}
            className="group rounded-2xl rounded-bl-sm border-2 border-border bg-card px-4 py-3 text-left shadow-[0_4px_0_hsl(var(--border-shadow))]"
            aria-label={`Ouvir: ${p.en}`}
          >
            <span className="flex items-center gap-2 font-display text-xl font-bold text-primary">
              {p.en}
              <Volume2 className="h-5 w-5 shrink-0 text-sky-500 opacity-70 group-hover:opacity-100" aria-hidden />
            </span>
            <span className="block text-muted-foreground">{p.pt}</span>
          </button>
        </motion.div>
      ))}

      <LessonFooter
        actionLabel={isLast ? "Continuar" : "Próxima fala"}
        onAction={() => (isLast ? onComplete() : setShown((n) => n + 1))}
      />
    </div>
  );
}
