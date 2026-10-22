"use client";

import { Moon, Sun, Accessibility } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useThemeStore } from "@/store/theme-store";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  compact?: boolean;
  /** Texto ao lado do ícone (versão compacta) */
  label?: string;
  className?: string;
}

export function ThemeToggle({ compact = false, label, className }: ThemeToggleProps) {
  const {
    theme,
    reduceMotion,
    highContrast,
    accessibleFont,
    lowStimulusMode,
    setTheme,
    setAccessibility,
    applyToDocument,
  } = useThemeStore();

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(next);
    applyToDocument();
  };

  if (compact) {
    return (
      <Button
        variant="ghost"
        size={label ? "sm" : "icon"}
        onClick={toggleTheme}
        aria-label="Alternar tema claro/escuro"
        className={className}
      >
        {/* relative: sol e lua ficam no mesmo lugar (um some, o outro aparece) */}
        <span className="relative flex h-5 w-5 items-center justify-center">
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </span>
        {label}
      </Button>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border-2 border-border bg-card p-4 space-y-4",
        compact && "hidden"
      )}
      role="region"
      aria-label="Preferências de acessibilidade"
    >
      <div className="flex items-center gap-2 font-semibold">
        <Accessibility className="h-5 w-5 text-secondary" aria-hidden />
        Acessibilidade
      </div>

      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="reduce-motion">Reduzir animações</Label>
        <Switch
          id="reduce-motion"
          checked={reduceMotion}
          onCheckedChange={(v) => {
            setAccessibility({ reduceMotion: v });
            applyToDocument();
          }}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="high-contrast">Alto contraste</Label>
        <Switch
          id="high-contrast"
          checked={highContrast}
          onCheckedChange={(v) => {
            setAccessibility({ highContrast: v });
            applyToDocument();
          }}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="accessible-font">Fonte acessível</Label>
        <Switch
          id="accessible-font"
          checked={accessibleFont}
          onCheckedChange={(v) => {
            setAccessibility({ accessibleFont: v });
            applyToDocument();
          }}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="low-stimulus">Modo baixo estímulo</Label>
        <Switch
          id="low-stimulus"
          checked={lowStimulusMode}
          onCheckedChange={(v) => {
            setAccessibility({ lowStimulusMode: v });
            applyToDocument();
          }}
        />
      </div>
    </div>
  );
}
