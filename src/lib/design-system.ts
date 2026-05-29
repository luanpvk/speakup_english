/**
 * Design tokens — SpeakUp English
 * Cores principais: amarelo (accent), verde (primary), roxo (secondary)
 */
export const designTokens = {
  colors: {
    yellow: "hsl(var(--speakup-yellow))",
    green: "hsl(var(--speakup-green))",
    purple: "hsl(var(--speakup-purple))",
  },
  radius: {
    sm: "calc(var(--radius) - 4px)",
    md: "calc(var(--radius) - 2px)",
    lg: "var(--radius)",
    xl: "calc(var(--radius) + 4px)",
    "2xl": "calc(var(--radius) + 8px)",
  },
  typography: {
    body: "font-sans text-[1.0625rem] leading-relaxed",
    heading: "font-display font-bold tracking-tight",
    accessible: "font-accessible",
  },
  motion: {
    gentle: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
    reduced: { duration: 0.01 },
  },
} as const;
