"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Snail, Volume2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/store/theme-store";

/* ------------------------------------------------------------------ */
/* Áudio: voz em inglês e sons de acerto/erro (respeitam "Sons ativados") */
/* ------------------------------------------------------------------ */

function soundOn() {
  return useThemeStore.getState().soundEnabled;
}

/** Fala em inglês; `slow` é para a criança ouvir com calma */
export function speak(text: string, { slow = false, force = false } = {}) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  // Botão "Ouvir" sempre funciona; o áudio automático só com som ligado
  if (!force && !soundOn()) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = slow ? 0.55 : 0.9;
  window.speechSynthesis.speak(u);
}

let audioCtx: AudioContext | null = null;

/** Sons curtos gerados no navegador (sem arquivos de áudio) */
export function playFeedback(kind: "correct" | "wrong" | "complete") {
  if (typeof window === "undefined" || !soundOn()) return;
  try {
    audioCtx ??= new AudioContext();
    const notes =
      kind === "correct" ? [660, 880] : kind === "complete" ? [523, 659, 784, 1047] : [220, 180];
    notes.forEach((freq, i) => {
      const osc = audioCtx!.createOscillator();
      const gain = audioCtx!.createGain();
      const start = audioCtx!.currentTime + i * 0.09;
      osc.type = kind === "wrong" ? "triangle" : "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.12, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18);
      osc.connect(gain).connect(audioCtx!.destination);
      osc.start(start);
      osc.stop(start + 0.2);
    });
  } catch {
    // navegador sem Web Audio: segue sem som
  }
}

/** Fala o texto uma vez quando ele aparece na tela */
export function useAutoSpeak(text: string | undefined, enabled = true) {
  useEffect(() => {
    if (!text || !enabled) return;
    const t = window.setTimeout(() => speak(text), 250);
    return () => window.clearTimeout(t);
  }, [text, enabled]);
}

/** Botões de ouvir: normal e devagar */
export function ListenButtons({ text, size = "md" }: { text: string; size?: "md" | "lg" }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <button
        type="button"
        onClick={() => speak(text, { force: true })}
        className={cn(
          "press-3d flex items-center justify-center rounded-2xl bg-sky-500 text-white shadow-[0_4px_0_#0369a1]",
          size === "lg" ? "h-20 w-20" : "h-12 w-12"
        )}
        aria-label={`Ouvir "${text}"`}
      >
        <Volume2 className={size === "lg" ? "h-10 w-10" : "h-6 w-6"} strokeWidth={2.4} />
      </button>
      <button
        type="button"
        onClick={() => speak(text, { slow: true, force: true })}
        className={cn(
          "press-3d flex items-center justify-center rounded-2xl bg-sky-500/15 text-sky-500 shadow-[0_4px_0_hsl(var(--border-shadow))]",
          size === "lg" ? "h-14 w-14" : "h-12 w-12"
        )}
        aria-label={`Ouvir "${text}" devagar`}
      >
        <Snail className="h-6 w-6" strokeWidth={2.4} />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Teclado: 1..n escolhe opção, Enter aciona o botão principal          */
/* ------------------------------------------------------------------ */

export function useOptionKeys(count: number, onPick: (index: number) => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const n = Number(e.key);
      if (n >= 1 && n <= count) {
        e.preventDefault();
        onPick(n - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count, enabled, onPick]);
}

/* ------------------------------------------------------------------ */
/* Barra fixa embaixo: mesmo lugar em todas as atividades               */
/* ------------------------------------------------------------------ */

export type FooterStatus = "idle" | "correct" | "wrong";

const noSubscribe = () => () => {};

interface LessonFooterProps {
  status?: FooterStatus;
  /** Título do painel de acerto/erro (ex.: "Muito bem!") */
  title?: string;
  /** Detalhe (ex.: a resposta certa) */
  detail?: ReactNode;
  actionLabel: string;
  onAction: () => void;
  disabled?: boolean;
  /** Botão secundário à esquerda (ex.: Limpar) */
  secondary?: ReactNode;
}

export function LessonFooter({
  status = "idle",
  title,
  detail,
  actionLabel,
  onAction,
  disabled = false,
  secondary,
}: LessonFooterProps) {
  // Enter aciona o botão principal
  useEffect(() => {
    if (disabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter" || e.repeat) return;
      // Enter é sempre o botão principal (como no Duolingo); Espaço aperta o botão em foco
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      e.preventDefault();
      onAction();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [disabled, onAction]);

  const feedback = status !== "idle";
  const mounted = useSyncExternalStore(noSubscribe, () => true, () => false);
  if (!mounted) return null;

  // Portal no <body>: a barra não pisca nem sai do lugar durante a animação de troca de passo
  return createPortal(
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t-2 transition-colors duration-200",
        status === "correct"
          ? "border-primary/40 bg-speakup-green-soft"
          : status === "wrong"
            ? "border-destructive/40 bg-destructive/10"
            : "border-border bg-background/95 backdrop-blur"
      )}
    >
      <div className="mx-auto flex max-w-2xl flex-col gap-3 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 sm:flex-row sm:items-center">
        <AnimatePresence mode="wait">
          {feedback ? (
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex min-w-0 flex-1 items-center gap-3"
              role="status"
            >
              {status === "correct" ? (
                <CheckCircle2 className="h-10 w-10 shrink-0 text-primary" aria-hidden />
              ) : (
                <XCircle className="h-10 w-10 shrink-0 text-destructive" aria-hidden />
              )}
              <div className="min-w-0">
                <p
                  className={cn(
                    "font-display text-xl font-bold",
                    status === "correct" ? "text-primary" : "text-destructive"
                  )}
                >
                  {title}
                </p>
                {detail && <p className="text-sm font-semibold">{detail}</p>}
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-1 gap-2">{secondary}</div>
          )}
        </AnimatePresence>
        <Button
          size="lg"
          variant={status === "wrong" ? "outline" : "default"}
          className={cn("w-full sm:w-48", status === "wrong" && "border-destructive/50 text-destructive")}
          disabled={disabled}
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      </div>
    </div>
  ,
    document.body
  );
}

/** Opção de resposta grande, com número do atalho de teclado */
export function OptionButton({
  index,
  label,
  state,
  onClick,
  disabled,
}: {
  index: number;
  label: ReactNode;
  state: "idle" | "selected" | "correct" | "wrong" | "faded";
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={state === "selected"}
      className={cn(
        "press-3d flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left text-lg font-semibold",
        state === "correct" && "border-primary bg-speakup-green-soft text-primary shadow-[0_4px_0_hsl(var(--primary-shadow))]",
        state === "wrong" && "animate-shake border-destructive bg-destructive/10 text-destructive shadow-[0_4px_0_hsl(var(--destructive)/0.5)]",
        state === "selected" && "border-sky-500 bg-sky-500/10 shadow-[0_4px_0_#0369a1]",
        state === "faded" && "border-border opacity-50 shadow-[0_4px_0_hsl(var(--border-shadow))]",
        state === "idle" && "border-border bg-card shadow-[0_4px_0_hsl(var(--border-shadow))] hover:bg-muted/50"
      )}
    >
      <span
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 text-sm",
          state === "idle" ? "border-border text-muted-foreground" : "border-current"
        )}
        aria-hidden
      >
        {index + 1}
      </span>
      <span className="min-w-0 flex-1">{label}</span>
    </button>
  );
}
