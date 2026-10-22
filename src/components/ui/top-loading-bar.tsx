"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TopLoadingBarProps {
  active: boolean;
  className?: string;
  /** fixed = topo da janela; embedded = topo do pai `relative` (ex.: header) */
  placement?: "fixed" | "embedded";
}

export function TopLoadingBar({
  active,
  className,
  placement = "fixed",
}: TopLoadingBarProps) {
  const [progress, setProgress] = useState(active ? 22 : 0);
  const [visible, setVisible] = useState(active);
  const [prevActive, setPrevActive] = useState(active);

  // Começou ou terminou de carregar: ajusta no render (sem setState dentro de efeito)
  if (active !== prevActive) {
    setPrevActive(active);
    if (active) {
      setVisible(true);
      setProgress(22);
    } else {
      setProgress(100);
    }
  }

  useEffect(() => {
    if (active) {
      const t1 = setTimeout(() => setProgress(58), 120);
      const t2 = setTimeout(() => setProgress(86), 380);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
    if (!visible) return;
    const t = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 320);
    return () => clearTimeout(t);
  }, [active, visible]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "pointer-events-none left-0 right-0 top-0 z-50 h-[3px] overflow-hidden",
        placement === "embedded" ? "absolute rounded-t-3xl" : "fixed z-[200]",
        className
      )}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      aria-label="Carregando"
    >
      <div
        className="absolute inset-y-0 left-0 rounded-r-full bg-primary shadow-[0_0_8px_hsl(var(--primary))] transition-[width] duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
