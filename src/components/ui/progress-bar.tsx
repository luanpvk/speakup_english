"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  className?: string;
  label?: string;
  color?: "primary" | "accent" | "secondary";
}

export function ProgressBar({
  value,
  className,
  label,
  color = "primary",
}: ProgressBarProps) {
  const colors = {
    primary: "bg-primary",
    accent: "bg-accent",
    secondary: "bg-secondary",
  };

  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <div className="flex justify-between text-sm font-medium">
          <span>{label}</span>
          <span>{Math.round(value)}%</span>
        </div>
      )}
      <div
        className="h-4 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className={cn("relative h-full rounded-full", colors[color])}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* brilho no topo da barra */}
          <span className="absolute inset-x-2 top-1 h-1 rounded-full bg-white/35" aria-hidden />
        </motion.div>
      </div>
    </div>
  );
}
