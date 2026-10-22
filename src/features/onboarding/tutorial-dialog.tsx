"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, HelpCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KidIcon } from "@/lib/icons/kid-icons";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    id: "welcome",
    icon: "👋",
    title: "Bem-vindo ao SpeakUp!",
    text: "Aqui você aprende inglês brincando. Vem que eu te mostro como funciona, é rapidinho!",
  },
  {
    id: "lessons",
    icon: "📚",
    title: "Lições",
    text: "Cada lição tem passinhos curtos: uma história, palavras novas, um jogo e um desafio no fim. A barrinha lá em cima mostra quanto falta.",
  },
  {
    id: "mistakes",
    icon: "💡",
    title: "Errou? Tudo bem!",
    text: "Errar faz parte! A gente mostra a resposta certa e segue. No fim você revisa o que errou. Se errar 3 vezes na revisão, a lição começa de novo, sem pressa.",
  },
  {
    id: "flashcards",
    icon: "🃏",
    title: "Flashcards diários",
    text: "Toque no cartão para virar e ver a tradução. Depois conte como foi: Errei, Difícil, Bom ou Fácil. Quanto mais fácil, mais tempo ele demora para voltar.",
  },
  {
    id: "hyperfocus",
    icon: "⭐",
    title: "Seu tema favorito",
    text: "No Perfil, escolha o que você mais gosta: animais, espaço, trens, música... As lições desse assunto aparecem primeiro para você.",
  },
  {
    id: "rewards",
    icon: "🪙",
    title: "Moedas, loja e perfil",
    text: "Cada lição terminada vale XP, moedas e estrelas. Gaste as moedas na Loja para deixar seu avatar do seu jeito.",
  },
] as const;

export type TutorialStepId = (typeof STEPS)[number]["id"];

const SEEN_KEY = "speakup-tutorial-seen";

function alreadySeen() {
  try {
    return localStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

interface TutorialButtonProps {
  /** Abre sozinho na primeira visita (lembrado no navegador) */
  autoOpen?: boolean;
  /** Passo inicial ao abrir pelo botão */
  startAt?: TutorialStepId;
  label?: string;
  className?: string;
}

export function TutorialButton({
  autoOpen = false,
  startAt = "welcome",
  label = "Como funciona?",
  className,
}: TutorialButtonProps) {
  // Montado só no cliente (após login), então ler o storage aqui é seguro
  const [open, setOpen] = useState(() => autoOpen && typeof window !== "undefined" && !alreadySeen());
  const [step, setStep] = useState(0);

  const changeOpen = (value: boolean) => {
    setOpen(value);
    if (!value) {
      try {
        localStorage.setItem(SEEN_KEY, "1");
      } catch {
        // sem storage: o tutorial só reabre na próxima visita
      }
    }
  };

  const openAt = () => {
    setStep(Math.max(0, STEPS.findIndex((s) => s.id === startAt)));
    setOpen(true);
  };

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <Dialog.Root open={open} onOpenChange={changeOpen}>
      <Button type="button" variant="outline" size="sm" className={cn("gap-1", className)} onClick={openAt}>
        <HelpCircle className="h-4 w-4" aria-hidden />
        {label}
      </Button>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[101] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border-4 border-primary bg-card p-6 text-center shadow-2xl focus:outline-none">
          <Dialog.Close
            className="absolute right-3 top-3 rounded-full p-2 text-muted-foreground hover:bg-muted"
            aria-label="Fechar tutorial"
          >
            <X className="h-5 w-5" />
          </Dialog.Close>
          <KidIcon emoji={current.icon} size="xl" className="mx-auto" />
          <Dialog.Title className="mt-4 font-display text-2xl font-bold">{current.title}</Dialog.Title>
          <Dialog.Description className="mt-3 text-base leading-relaxed text-muted-foreground">
            {current.text}
          </Dialog.Description>

          <div className="mt-5 flex justify-center gap-2" aria-label={`Passo ${step + 1} de ${STEPS.length}`}>
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStep(i)}
                className={cn(
                  "h-2.5 rounded-full transition-all",
                  i === step ? "w-6 bg-primary" : "w-2.5 bg-muted-foreground/30"
                )}
                aria-label={`Ir para o passo ${i + 1}: ${s.title}`}
                aria-current={i === step ? "step" : undefined}
              />
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              disabled={step === 0}
              onClick={() => setStep((s) => s - 1)}
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <Button
              type="button"
              className="flex-1"
              onClick={() => (isLast ? changeOpen(false) : setStep((s) => s + 1))}
            >
              {isLast ? "Começar!" : "Próximo"}
              {!isLast && <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
