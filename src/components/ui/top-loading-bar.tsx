"use client";

import { useEffect, useRef, useState } from "react";
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
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }

    if (active) {
      setVisible(true);
      setProgress(22);
      const t1 = setTimeout(() => setProgress(58), 120);
      const t2 = setTimeout(() => setProgress(86), 380);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }

    setProgress(100);
    hideTimer.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 320);

    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [active]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "pointer-events-none left-0 right-0 top-0 z-50 h-2 overflow-hidden",
        placement === "embedded" ? "absolute rounded-t-3xl" : "fixed z-[200]",
        className
      )}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      aria-label="Carregando"
    >
      <div className="h-full w-full bg-primary/15" />
      <div
        className="absolute inset-y-0 left-0 bg-primary transition-[width] duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
