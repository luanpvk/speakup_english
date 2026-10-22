/**
 * Temas de hiperfoco (comum em crianças autistas). Cada tema libera e recomenda
 * automaticamente as lições dos capítulos relacionados (slugs de CHAPTER_MODULES).
 * Arquivo pequeno de propósito: é usado no cliente sem carregar o currículo inteiro.
 */
export const HYPERFOCUS_THEMES = [
  { id: "animals", label: "Animais", icon: "🐾", modules: ["animals", "insects", "birds", "ocean"] },
  { id: "space", label: "Espaço e planetas", icon: "🚀", modules: ["space", "weather", "shapes"] },
  { id: "vehicles", label: "Carros, trens e aviões", icon: "🚆", modules: ["transport", "travel", "places"] },
  { id: "ocean", label: "Mar e vida marinha", icon: "🌊", modules: ["ocean", "nature", "environment"] },
  { id: "calendar", label: "Relógios e calendários", icon: "📅", modules: ["time", "months", "routine", "holidays"] },
  { id: "numbers", label: "Números e formas", icon: "🔢", modules: ["numbers", "shapes", "sizes", "money"] },
  { id: "games", label: "Games e tecnologia", icon: "🎮", modules: ["technology", "hobbies", "toys"] },
  { id: "music", label: "Música", icon: "🎵", modules: ["music", "hobbies", "party"] },
  { id: "sports", label: "Esportes", icon: "⚽", modules: ["sports", "body", "actions"] },
  { id: "nature", label: "Natureza e plantas", icon: "🌳", modules: ["nature", "garden", "environment", "weather"] },
  { id: "food", label: "Comida e cozinha", icon: "🍳", modules: ["food", "kitchen", "shopping"] },
  { id: "art", label: "Cores e desenho", icon: "🎨", modules: ["colors", "shapes", "hobbies"] },
] as const;

export type HyperfocusId = (typeof HYPERFOCUS_THEMES)[number]["id"];

export const HYPERFOCUS_IDS = HYPERFOCUS_THEMES.map((t) => t.id) as [HyperfocusId, ...HyperfocusId[]];

export function getHyperfocusTheme(id?: string | null) {
  return HYPERFOCUS_THEMES.find((t) => t.id === id);
}

/** Capítulos liberados/recomendados pelo hiperfoco da criança */
export function hyperfocusModules(id?: string | null): readonly string[] {
  return getHyperfocusTheme(id)?.modules ?? [];
}
