"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AccessibilityPreferences } from "@/types";

interface ThemeState extends AccessibilityPreferences {
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
  setAccessibility: (prefs: Partial<AccessibilityPreferences>) => void;
  applyToDocument: () => void;
}

const defaultPrefs: AccessibilityPreferences = {
  reduceMotion: false,
  highContrast: false,
  accessibleFont: false,
  lowStimulusMode: false,
  soundEnabled: true,
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "light",
      ...defaultPrefs,
      setTheme: (theme) => {
        set({ theme });
        get().applyToDocument();
      },
      setAccessibility: (prefs) => {
        set(prefs);
        get().applyToDocument();
      },
      applyToDocument: () => {
        if (typeof document === "undefined") return;
        const state = get();
        const root = document.documentElement;

        root.classList.toggle("reduce-motion", state.reduceMotion);
        root.classList.toggle("high-contrast", state.highContrast);
        root.classList.toggle("accessible-font", state.accessibleFont);
        root.classList.toggle("low-stimulus", state.lowStimulusMode);

        if (state.theme === "dark") {
          root.classList.add("dark");
        } else if (state.theme === "light") {
          root.classList.remove("dark");
        } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      },
    }),
    { name: "speakup-theme" }
  )
);
