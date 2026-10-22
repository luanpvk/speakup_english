"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Heart, RotateCw } from "lucide-react";
import { KidIcon } from "@/lib/icons/kid-icons";
import type { LessonMistake } from "@/types/lesson-mistakes";
import { cn } from "@/lib/utils";
import { LessonFooter, ListenButtons, OptionButton, playFeedback, speak, useAutoSpeak, useOptionKeys } from "../lesson-kit";

/** Erros permitidos na revisão antes de refazer a lição inteira */
export const MAX_REVIEW_ERRORS = 3;

interface Props {
  mistakes: LessonMistake[];
  onFixed: (mistakeId: string) => void;
  /** Chamado a cada resposta errada na revisão */
  onWrong: () => void;
  wrongCount: number;
}

export function ActivityFixMistakes({ mistakes, onFixed, onWrong, wrongCount }: Props) {
  const current = mistakes[0];
  if (!current) return null;
  const livesLeft = MAX_REVIEW_ERRORS - wrongCount;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 rounded-2xl bg-amber-400/15 px-4 py-3">
        <div>
          <p className="font-display text-lg font-bold">Vamos revisar o que errou</p>
          <p className="text-sm text-muted-foreground">
            {mistakes.length === 1 ? "Falta 1" : `Faltam ${mistakes.length}`}. Com {MAX_REVIEW_ERRORS} erros, a lição
            começa de novo.
          </p>
        </div>
        <div className="flex shrink-0 gap-1" aria-label={`${livesLeft} tentativas restantes`}>
          {Array.from({ length: MAX_REVIEW_ERRORS }, (_, i) => (
            <Heart
              key={i}
              className={cn("h-6 w-6", i < livesLeft ? "fill-rose-500 text-rose-500" : "text-muted-foreground/40")}
              aria-hidden
            />
          ))}
        </div>
      </div>

      {/* key: cada erro começa com o estado limpo */}
      <FixItem key={current.id} mistake={current} onFixed={() => onFixed(current.id)} onWrong={onWrong} />
    </div>
  );
}

function FixItem({ mistake, onFixed, onWrong }: { mistake: LessonMistake; onFixed: () => void; onWrong: () => void }) {
  switch (mistake.kind) {
    case "quiz":
      return (
        <ChoiceFix
          title={mistake.data.question}
          options={mistake.data.options}
          correctIndex={mistake.data.correctIndex}
          onFixed={onFixed}
          onWrong={onWrong}
        />
      );
    case "listen":
      return (
        <ChoiceFix
          title="O que você ouviu?"
          listen={mistake.data.targetWord}
          options={mistake.data.options}
          correctIndex={mistake.data.correctIndex}
          onFixed={onFixed}
          onWrong={onWrong}
        />
      );
    case "word-order":
      return (
        <WordOrderFix
          instruction={mistake.data.instruction}
          words={mistake.data.words}
          correct={mistake.data.correctSentence}
          onFixed={onFixed}
          onWrong={onWrong}
        />
      );
    case "vocab":
      return <VocabFix word={mistake.data.word} translation={mistake.data.translation} emoji={mistake.data.emoji} onFixed={onFixed} />;
  }
}

/** Escolha: na revisão a resposta não é revelada; errou, tenta de novo */
function ChoiceFix({
  title,
  listen,
  options,
  correctIndex,
  onFixed,
  onWrong,
}: {
  title: string;
  listen?: string;
  options: string[];
  correctIndex: number;
  onFixed: () => void;
  onWrong: () => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useAutoSpeak(listen);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const pick = useCallback(
    (i: number) => {
      if (picked !== null || solved) return;
      setPicked(i);
      if (i === correctIndex) {
        setSolved(true);
        playFeedback("correct");
      } else {
        playFeedback("wrong");
        onWrong();
        timer.current = window.setTimeout(() => setPicked(null), 800);
      }
    },
    [correctIndex, onWrong, picked, solved]
  );

  useOptionKeys(options.length, pick, picked === null && !solved);

  return (
    <div className="space-y-5">
      <div className="flex flex-col items-center gap-3 text-center">
        <h3 className="font-display text-2xl font-bold">{title}</h3>
        {listen && <ListenButtons text={listen} size="lg" />}
      </div>
      <div className="grid gap-3">
        {options.map((opt, i) => (
          <OptionButton
            key={i}
            index={i}
            label={opt}
            onClick={() => pick(i)}
            disabled={solved}
            state={picked === i ? (i === correctIndex ? "correct" : "wrong") : solved ? "faded" : "idle"}
          />
        ))}
      </div>
      <LessonFooter
        status={solved ? "correct" : "idle"}
        title="Agora sim!"
        actionLabel="Continuar"
        disabled={!solved}
        onAction={() => {
          window.clearTimeout(timer.current);
          onFixed();
        }}
      />
    </div>
  );
}

function WordOrderFix({
  instruction,
  words,
  correct,
  onFixed,
  onWrong,
}: {
  instruction: string;
  words: string[];
  correct: string;
  onFixed: () => void;
  onWrong: () => void;
}) {
  const tiles = useMemo(() => words.map((word, id) => ({ id, word })), [words]);
  const [sentence, setSentence] = useState<typeof tiles>([]);
  const [shake, setShake] = useState(false);
  const [solved, setSolved] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const pool = tiles.filter((t) => !sentence.some((s) => s.id === t.id));

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const check = () => {
    if (solved) {
      window.clearTimeout(timer.current);
      onFixed();
      return;
    }
    if (sentence.map((t) => t.word).join(" ").toLowerCase() === correct.toLowerCase()) {
      setSolved(true);
      playFeedback("correct");
      speak(correct);
    } else {
      playFeedback("wrong");
      onWrong();
      setShake(true);
      timer.current = window.setTimeout(() => {
        setShake(false);
        setSentence([]);
      }, 700);
    }
  };

  const tileClass =
    "press-3d rounded-2xl border-2 border-border bg-card px-4 py-2.5 text-lg font-semibold shadow-[0_4px_0_hsl(var(--border-shadow))]";

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="font-display text-2xl font-bold">Monte a frase</h3>
        <p className="mt-1 text-muted-foreground">{instruction}</p>
      </div>
      <div className={cn("flex min-h-20 flex-wrap content-start gap-2 border-b-2 border-border pb-3", shake && "animate-shake")}>
        {sentence.map((t) => (
          <button key={t.id} type="button" className={tileClass} onClick={() => !solved && setSentence((s) => s.filter((x) => x.id !== t.id))}>
            {t.word}
          </button>
        ))}
      </div>
      <div className="flex min-h-14 flex-wrap justify-center gap-2">
        {pool.map((t) => (
          <button key={t.id} type="button" className={cn(tileClass, "hover:bg-muted/50")} onClick={() => setSentence((s) => [...s, t])}>
            {t.word}
          </button>
        ))}
      </div>
      <LessonFooter
        status={solved ? "correct" : "idle"}
        title="Agora sim!"
        actionLabel={solved ? "Continuar" : "Verificar"}
        disabled={!solved && pool.length > 0}
        onAction={check}
      />
    </div>
  );
}

function VocabFix({ word, translation, emoji, onFixed }: { word: string; translation: string; emoji?: string; onFixed: () => void }) {
  const [flipped, setFlipped] = useState(false);
  useAutoSpeak(word);

  return (
    <div className="flex flex-col items-center gap-5">
      <button type="button" onClick={() => setFlipped((f) => !f)} className="flip-card w-full max-w-sm" data-flipped={flipped}>
        <span className="flip-inner grid">
          <span className="flip-face col-start-1 row-start-1 flex min-h-56 flex-col items-center justify-center rounded-3xl border-2 border-border bg-card p-6 shadow-[0_6px_0_hsl(var(--border-shadow))]">
            <KidIcon emoji={emoji} word={word} size="xl" />
            <span className="mt-4 font-display text-4xl font-bold text-primary">{word}</span>
            <span className="mt-3 flex items-center gap-1 text-xs font-semibold text-muted-foreground">
              <RotateCw className="h-3.5 w-3.5" aria-hidden />
              Lembra o que é? Toque para ver
            </span>
          </span>
          <span className="flip-face flip-back col-start-1 row-start-1 flex min-h-56 items-center justify-center rounded-3xl border-2 border-primary/40 bg-speakup-green-soft p-6 font-display text-3xl font-bold">
            {translation}
          </span>
        </span>
      </button>
      <ListenButtons text={word} />
      <LessonFooter actionLabel="Lembrei!" disabled={!flipped} onAction={onFixed} />
    </div>
  );
}
