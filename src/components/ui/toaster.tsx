"use client";

import * as ToastPrimitive from "@radix-ui/react-toast";
import { AlertTriangle, CheckCircle2, Info, X, XCircle, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToastStore, type ToastType } from "@/store/toast-store";

const STYLE: Record<ToastType, { icon: LucideIcon; color: string }> = {
  success: { icon: CheckCircle2, color: "text-primary" },
  error: { icon: XCircle, color: "text-destructive" },
  warning: { icon: AlertTriangle, color: "text-amber-500" },
  info: { icon: Info, color: "text-secondary" },
};

/** Igual à duração da animação de saída no CSS: só tira da lista depois que ela termina */
const EXIT_MS = 250;

/** Erros ficam mais tempo na tela para dar tempo de ler */
const DURATION: Record<ToastType, number> = {
  success: 4000,
  info: 4500,
  warning: 6000,
  error: 7000,
};

export function Toaster() {
  const { toasts, dismiss } = useToastStore();

  return (
    <ToastPrimitive.Provider swipeDirection="right" label="Notificação">
      {toasts.map((t) => {
        const { icon: Icon, color } = STYLE[t.type];
        return (
          <ToastPrimitive.Root
            key={t.id}
            duration={DURATION[t.type]}
            type={t.type === "error" ? "foreground" : "background"}
            onOpenChange={(open) => {
              if (!open) window.setTimeout(() => dismiss(t.id), EXIT_MS);
            }}
            className="toast-root relative flex w-full touch-pan-y items-start gap-3 overflow-hidden rounded-2xl border-2 border-border bg-card p-4 text-card-foreground shadow-[0_6px_0_hsl(var(--border-shadow))]"
          >
            <Icon className={cn("mt-0.5 h-6 w-6 shrink-0", color)} aria-hidden />
            <div className="min-w-0 flex-1">
              <ToastPrimitive.Title className="font-display text-base font-bold leading-snug">
                {t.title}
              </ToastPrimitive.Title>
              {t.description && (
                <ToastPrimitive.Description className="mt-0.5 text-sm text-muted-foreground">
                  {t.description}
                </ToastPrimitive.Description>
              )}
            </div>
            <ToastPrimitive.Close
              className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Fechar aviso"
            >
              <X className="h-4 w-4" />
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        );
      })}
      <ToastPrimitive.Viewport className="fixed right-0 top-0 z-[300] flex max-h-screen w-full flex-col gap-3 p-4 outline-none sm:max-w-sm" />
    </ToastPrimitive.Provider>
  );
}
