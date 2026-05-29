"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Coins, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGamificationStore } from "@/store/gamification-store";

export function CelebrationModal() {
  const { celebration, hideCelebration } = useGamificationStore();

  return (
    <AnimatePresence>
      {celebration.show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="celebration-title"
        >
          <motion.div
            className="w-full max-w-sm rounded-3xl border-4 border-primary bg-card p-8 text-center shadow-2xl"
            initial={{ scale: 0.8, rotate: -3 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: 2, duration: 0.5 }}
            >
              <Sparkles className="mx-auto h-16 w-16 text-accent" aria-hidden />
            </motion.div>
            <h2 id="celebration-title" className="mt-4 font-display text-2xl font-bold">
              {celebration.title}
            </h2>
            <p className="mt-2 text-muted-foreground">{celebration.message}</p>
            {(celebration.xp || celebration.coins) && (
              <div className="mt-4 flex justify-center gap-4 text-lg font-semibold">
                {celebration.xp ? <span className="text-primary">+{celebration.xp} XP</span> : null}
                {celebration.coins ? (
                  <span className="inline-flex items-center gap-1 text-accent-foreground">
                    <Coins className="h-5 w-5" aria-hidden />
                    +{celebration.coins}
                  </span>
                ) : null}
              </div>
            )}
            <Button className="mt-6 w-full" size="lg" onClick={hideCelebration}>
              Continuar!
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
