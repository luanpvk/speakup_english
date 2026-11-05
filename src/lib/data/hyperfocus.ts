/**
 * Temas de hiperfoco (comum em crianças autistas). Cada tema libera e recomenda
 * automaticamente as lições dos capítulos relacionados (slugs de CHAPTER_MODULES).
 * Arquivo pequeno de propósito: é usado no cliente sem carregar o currículo inteiro.
 */
export const HYPERFOCUS_THEMES = [
  { id: "animals", label: "Animais", icon: "🐾", modules: ["focus-animals", "animals", "insects", "birds", "ocean"] },
  { id: "space", label: "Espaço e planetas", icon: "🚀", modules: ["focus-space", "space", "weather", "shapes"] },
  { id: "vehicles", label: "Carros, trens e aviões", icon: "🚆", modules: ["focus-vehicles", "transport", "travel", "places"] },
  { id: "ocean", label: "Mar e vida marinha", icon: "🌊", modules: ["focus-ocean", "ocean", "nature", "environment"] },
  { id: "calendar", label: "Relógios e calendários", icon: "📅", modules: ["focus-calendar", "time", "months", "routine", "holidays"] },
  { id: "numbers", label: "Números e formas", icon: "🔢", modules: ["focus-numbers", "numbers", "shapes", "sizes", "money"] },
  { id: "games", label: "Games e tecnologia", icon: "🎮", modules: ["focus-games", "technology", "hobbies", "toys"] },
  { id: "music", label: "Música", icon: "🎵", modules: ["focus-music", "music", "hobbies", "party"] },
  { id: "sports", label: "Esportes", icon: "⚽", modules: ["focus-sports", "sports", "body", "actions"] },
  { id: "nature", label: "Natureza e plantas", icon: "🌳", modules: ["focus-nature", "nature", "garden", "environment", "weather"] },
  { id: "food", label: "Comida e cozinha", icon: "🍳", modules: ["focus-food", "food", "kitchen", "shopping"] },
  { id: "art", label: "Cores e desenho", icon: "🎨", modules: ["focus-art", "colors", "shapes", "hobbies"] },
] as const;

export type HyperfocusId = (typeof HYPERFOCUS_THEMES)[number]["id"];

export const HYPERFOCUS_IDS = HYPERFOCUS_THEMES.map((t) => t.id) as [HyperfocusId, ...HyperfocusId[]];

/** Capítulo extra exclusivo de cada tema (hyperfocus-lessons.ts); é o primeiro da lista `modules` */
export function focusModuleSlug(id: HyperfocusId) {
  return `focus-${id}`;
}

export function getHyperfocusTheme(id?: string | null) {
  return HYPERFOCUS_THEMES.find((t) => t.id === id);
}

/** Capítulos liberados/recomendados pelo hiperfoco da criança */
export function hyperfocusModules(id?: string | null): readonly string[] {
  return getHyperfocusTheme(id)?.modules ?? [];
}
