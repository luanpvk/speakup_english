/** Conteúdo inicial de módulos, lições, recompensas e conquistas */

export const SEED_MODULES = [
  {
    slug: "greetings",
    title: "Cumprimentos",
    description: "Aprenda a dizer olá, tchau e se apresentar!",
    icon: "👋",
    order: 1,
    requiredLevel: 1,
    xpReward: 50,
  },
  {
    slug: "colors",
    title: "Cores",
    description: "Descubra as cores em inglês de forma divertida!",
    icon: "🎨",
    order: 2,
    requiredLevel: 2,
    requiredModuleSlug: "greetings",
    xpReward: 75,
  },
  {
    slug: "animals",
    title: "Animais",
    description: "Conheça animais fofos e seus nomes em inglês!",
    icon: "🐾",
    order: 3,
    requiredLevel: 3,
    requiredModuleSlug: "colors",
    xpReward: 100,
  },
] as const;

export const SEED_LESSONS = [
  {
    slug: "hello-goodbye",
    moduleSlug: "greetings",
    title: "Hello & Goodbye",
    description: "Cumprimentos do dia a dia",
    icon: "🌟",
    order: 1,
    xpReward: 30,
    coinReward: 15,
    starReward: 1,
    estimatedMinutes: 5,
    vocabulary: [
      { word: "Hello", translation: "Olá", emoji: "👋" },
      { word: "Goodbye", translation: "Tchau", emoji: "🖐️" },
      { word: "Hi", translation: "Oi", emoji: "😊" },
      { word: "Bye", translation: "Tchau", emoji: "✌️" },
    ],
    quiz: [
      {
        question: "Como dizemos 'Olá' em inglês?",
        options: ["Goodbye", "Hello", "Thanks", "Please"],
        correctIndex: 1,
      },
      {
        question: "Qual palavra significa 'Tchau'?",
        options: ["Hi", "Hello", "Bye", "Yes"],
        correctIndex: 2,
      },
    ],
  },
  {
    slug: "my-name",
    moduleSlug: "greetings",
    title: "My Name Is...",
    description: "Aprenda a se apresentar",
    icon: "🦊",
    order: 2,
    xpReward: 35,
    coinReward: 20,
    starReward: 1,
    estimatedMinutes: 6,
    vocabulary: [
      { word: "My name is", translation: "Meu nome é", emoji: "📛" },
      { word: "Nice to meet you", translation: "Prazer em conhecer", emoji: "🤝" },
      { word: "What is your name?", translation: "Qual é o seu nome?", emoji: "❓" },
    ],
    quiz: [
      {
        question: "Como você diz 'Meu nome é Ana'?",
        options: [
          "My name is Ana",
          "Goodbye Ana",
          "Hello Ana",
          "Bye Ana",
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    slug: "basic-colors",
    moduleSlug: "colors",
    title: "Basic Colors",
    description: "Red, blue, green e mais!",
    icon: "🔴",
    order: 1,
    xpReward: 40,
    coinReward: 20,
    starReward: 2,
    estimatedMinutes: 7,
    vocabulary: [
      { word: "Red", translation: "Vermelho", emoji: "🔴" },
      { word: "Blue", translation: "Azul", emoji: "🔵" },
      { word: "Green", translation: "Verde", emoji: "🟢" },
      { word: "Yellow", translation: "Amarelo", emoji: "🟡" },
    ],
    quiz: [
      {
        question: "Qual cor é 'Red'?",
        options: ["Azul", "Verde", "Vermelho", "Amarelo"],
        correctIndex: 2,
      },
    ],
  },
  {
    slug: "farm-animals",
    moduleSlug: "animals",
    title: "Farm Animals",
    description: "Animais da fazenda",
    icon: "🐄",
    order: 1,
    xpReward: 45,
    coinReward: 25,
    starReward: 2,
    estimatedMinutes: 8,
    vocabulary: [
      { word: "Cat", translation: "Gato", emoji: "🐱" },
      { word: "Dog", translation: "Cachorro", emoji: "🐶" },
      { word: "Cow", translation: "Vaca", emoji: "🐄" },
      { word: "Bird", translation: "Pássaro", emoji: "🐦" },
    ],
    quiz: [
      {
        question: "Como se diz 'Gato' em inglês?",
        options: ["Dog", "Cow", "Cat", "Bird"],
        correctIndex: 2,
      },
    ],
  },
] as const;

export const SEED_AVATAR_ITEMS = [
  { slug: "hair-default", name: "Cabelo clássico", type: "hair" as const, icon: "💇", price: 0, unlockLevel: 1, isDefault: true },
  { slug: "hair-curly", name: "Cabelo cacheado", type: "hair" as const, icon: "🌀", price: 30, unlockLevel: 1, isDefault: false },
  { slug: "hair-spiky", name: "Cabelo espetado", type: "hair" as const, icon: "⚡", price: 50, unlockLevel: 2, isDefault: false },
  { slug: "clothes-default", name: "Roupa básica", type: "clothes" as const, icon: "👕", price: 0, unlockLevel: 1, isDefault: true },
  { slug: "clothes-cape", name: "Capa de herói", type: "clothes" as const, icon: "🦸", price: 80, unlockLevel: 3, isDefault: false },
  { slug: "clothes-rainbow", name: "Camiseta arco-íris", type: "clothes" as const, icon: "🌈", price: 60, unlockLevel: 2, isDefault: false },
  { slug: "acc-glasses", name: "Óculos legal", type: "accessory" as const, icon: "👓", price: 40, unlockLevel: 1, isDefault: false },
  { slug: "acc-hat", name: "Chapéu mágico", type: "accessory" as const, icon: "🎩", price: 70, unlockLevel: 2, isDefault: false },
  { slug: "acc-star", name: "Estrela brilhante", type: "accessory" as const, icon: "⭐", price: 100, unlockLevel: 4, isDefault: false },
] as const;

export const SEED_REWARDS = [
  { slug: "reward-xp-boost", name: "Boost de XP", description: "+20 XP bônus na próxima lição", icon: "⚡", cost: 50, type: "boost" as const, requiredLevel: 1 },
  { slug: "reward-star-pack", name: "Pacote de estrelas", description: "+3 estrelas para sua coleção", icon: "✨", cost: 80, type: "badge" as const, requiredLevel: 2 },
  { slug: "reward-cape", name: "Capa de herói", description: "Desbloqueia a capa no avatar", icon: "🦸", cost: 80, type: "cosmetic" as const, avatarItemSlug: "clothes-cape", requiredLevel: 3 },
] as const;

export const SEED_ACHIEVEMENTS = [
  { slug: "first-lesson", name: "Primeira aventura", description: "Complete sua primeira lição", icon: "🎯", criteriaType: "lessons" as const, threshold: 1, xpBonus: 10, coinBonus: 20 },
  { slug: "five-lessons", name: "Explorador", description: "Complete 5 lições", icon: "🗺️", criteriaType: "lessons" as const, threshold: 5, xpBonus: 25, coinBonus: 50 },
  { slug: "streak-3", name: "Em chamas", description: "Mantenha 3 dias de streak", icon: "🔥", criteriaType: "streak" as const, threshold: 3, xpBonus: 15, coinBonus: 30 },
  { slug: "streak-7", name: "Super streak", description: "7 dias seguidos estudando", icon: "💪", criteriaType: "streak" as const, threshold: 7, xpBonus: 50, coinBonus: 100 },
  { slug: "level-5", name: "Subindo de nível", description: "Alcance o nível 5", icon: "⬆️", criteriaType: "level" as const, threshold: 5, xpBonus: 30, coinBonus: 60 },
  { slug: "rich-coins", name: "Colecionador", description: "Acumule 200 moedas", icon: "🪙", criteriaType: "coins" as const, threshold: 200, xpBonus: 20, coinBonus: 0 },
] as const;

/** XP necessário para cada nível (acumulativo simplificado) */
export function xpForLevel(level: number): number {
  return level * 100;
}

export function levelFromXp(xp: number): number {
  let level = 1;
  while (xp >= xpForLevel(level) && level < 50) {
    level++;
  }
  return level;
}

export function xpProgressInLevel(xp: number, level: number): { current: number; needed: number; percent: number } {
  const prevThreshold = level > 1 ? xpForLevel(level - 1) : 0;
  const nextThreshold = xpForLevel(level);
  const current = xp - prevThreshold;
  const needed = nextThreshold - prevThreshold;
  const percent = needed > 0 ? Math.min(100, Math.round((current / needed) * 100)) : 100;
  return { current, needed, percent };
}
