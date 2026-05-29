"use client";

import { motion } from "framer-motion";
import { Delete } from "lucide-react";
import { cn } from "@/lib/utils";

interface PinPadProps {
  value: string;
  onChange: (pin: string) => void;
  maxLength?: number;
  disabled?: boolean;
}

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];

export function PinPad({ value, onChange, maxLength = 4, disabled }: PinPadProps) {
  const handleKey = (key: string) => {
    if (disabled) return;
    if (key === "del") {
      onChange(value.slice(0, -1));
      return;
    }
    if (!key || value.length >= maxLength) return;
    onChange(value + key);
  };

  return (
    <div className="space-y-4">
      <div
        className="flex justify-center gap-3"
        aria-label={`PIN: ${value.length} de ${maxLength} dígitos`}
      >
        {Array.from({ length: maxLength }).map((_, i) => (
          <motion.div
            key={i}
            className={cn(
              "h-4 w-4 rounded-full border-2 border-primary transition-colors",
              i < value.length ? "bg-primary" : "bg-transparent"
            )}
            animate={i < value.length ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.2 }}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {keys.map((key, idx) => {
          if (key === "") {
            return <div key={`empty-${idx}`} />;
          }
          return (
            <motion.button
              key={key}
              type="button"
              disabled={disabled}
              className={cn(
                "flex h-14 items-center justify-center rounded-2xl border-2 border-border bg-card text-xl font-bold shadow-sm transition-colors",
                "hover:border-primary hover:bg-speakup-green-soft/50",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "disabled:opacity-50",
                key === "del" && "text-destructive"
              )}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleKey(key)}
              aria-label={key === "del" ? "Apagar" : `Número ${key}`}
            >
              {key === "del" ? <Delete className="h-6 w-6" /> : key}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
