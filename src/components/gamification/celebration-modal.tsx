"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGamificationStore } from "@/store/gamification-store";

/** Confete leve em CSS: posição, cor e atraso fixos (sem Math.random, evita diferença entre renders) */
const CONFETTI = [
  { left: "8%", color: "bg-primary", delay: "0s", rotate: "12deg" },
  { left: "18%", color: "bg-accent", delay: "0.15s", rotate: "-20deg" },
  { left: "28%", color: "bg-secondary", delay: "0.05s", rotate: "35deg" },
  { left: "38%", color: "bg-sky-400", delay: "0.25s", rotate: "-8deg" },
  { left: "48%", color: "bg-rose-400", delay: "0.1s", rotate: "22deg" },
  { left: "58%", color: "bg-accent", delay: "0.3s", rotate: "-30deg" },
  { left: "68%", color: "bg-primary", delay: "0.2s", rotate: "15deg" },
  { left: "78%", color: "bg-secondary", delay: "0.05s", rotate: "-15deg" },
  { left: "88%", color: "bg-sky-400", delay: "0.18s", rotate: "28deg" },
  { left: "94%", color: "bg-rose-400", delay: "0.35s", rotate: "-25deg" },
];

export function CelebrationModal() {
  const { celebration, hideCelebration } = useGamificationStore();
  const hasRewards = Boolean(celebration.xp || celebration.coins);

  // Esc fecha, como em qualquer diálogo
  useEffect(() => {
    if (!celebration.show) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && hideCelebration();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [celebration.show, hideCelebration]);

  return (
    <AnimatePresence>
      {celebration.show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/85 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="celebration-title"
        >
          <motion.div
            className="relative w-full max-w-sm overflow-hidden rounded-3xl border-2 border-border bg-card px-6 pb-6 pt-8 text-center shadow-[0_8px_0_hsl(var(--border-shadow))]"
            initial={{ scale: 0.85, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-full" aria-hidden>
              {CONFETTI.map((c, i) => (
                <span
                  key={i}
                  className={`confetti-piece absolute top-0 h-3 w-2 rounded-sm ${c.color}`}
                  style={{ left: c.left, animationDelay: c.delay, rotate: c.rotate }}
                />
              ))}
            </div>

            <Image
              src="/mascot.png"
              alt=""
              width={132}
              height={132}
              className="animate-hop relative mx-auto"
              priority
            />

            <h2
              id="celebration-title"
              className="mt-3 font-display text-3xl font-bold text-primary"
            >
              {celebration.title}
            </h2>
            <p className="mt-1 text-muted-foreground">{celebration.message}</p>

            {hasRewards && (
              <div className="mt-5 grid grid-cols-2 gap-3">
                {celebration.xp ? (
                  <RewardBox
                    label="XP"
                    value={`+${celebration.xp}`}
                    icon={<Zap className="h-5 w-5 fill-current" aria-hidden />}
                    tone="bg-amber-400 text-amber-950"
                    border="border-amber-400"
                    valueColor="text-amber-500"
                  />
                ) : null}
                {celebration.coins ? (
                  <RewardBox
                    label="Moedas"
                    value={`+${celebration.coins}`}
                    icon={<Coins className="h-5 w-5" aria-hidden />}
                    tone="bg-primary text-primary-foreground"
                    border="border-primary"
                    valueColor="text-primary"
                  />
                ) : null}
              </div>
            )}

            <Button className="mt-6 w-full" size="lg" onClick={hideCelebration} autoFocus>
              Continuar
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function RewardBox({
  label,
  value,
  icon,
  tone,
  border,
  valueColor,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  tone: string;
  border: string;
  valueColor: string;
}) {
  return (
    <div className={`overflow-hidden rounded-2xl border-2 ${border}`}>
      <p className={`py-1 text-xs font-bold uppercase tracking-wider ${tone}`}>{label}</p>
      <p className={`flex items-center justify-center gap-1.5 py-2.5 font-display text-2xl font-bold ${valueColor}`}>
        {icon}
        {value}
      </p>
    </div>
  );
}
