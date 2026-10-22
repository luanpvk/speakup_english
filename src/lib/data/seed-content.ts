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
  { slug: "hair-bob", name: "Chanel", type: "hair" as const, icon: "💇", price: 25, unlockLevel: 1, isDefault: false },
  { slug: "hair-side", name: "Topete de lado", type: "hair" as const, icon: "💇", price: 25, unlockLevel: 1, isDefault: false },
  { slug: "hair-curly", name: "Cabelo cacheado", type: "hair" as const, icon: "🌀", price: 30, unlockLevel: 1, isDefault: false },
  { slug: "hair-ponytail", name: "Rabo de cavalo", type: "hair" as const, icon: "🎀", price: 35, unlockLevel: 1, isDefault: false },
  { slug: "hair-bun", name: "Coque", type: "hair" as const, icon: "🍩", price: 35, unlockLevel: 1, isDefault: false },
  { slug: "hair-pigtails", name: "Maria-chiquinha", type: "hair" as const, icon: "🎀", price: 40, unlockLevel: 1, isDefault: false },
  { slug: "hair-spiky", name: "Cabelo espetado", type: "hair" as const, icon: "⚡", price: 50, unlockLevel: 2, isDefault: false },
  { slug: "hair-long", name: "Cabelo longo", type: "hair" as const, icon: "💇", price: 50, unlockLevel: 2, isDefault: false },
  { slug: "hair-afro", name: "Black power", type: "hair" as const, icon: "☁️", price: 60, unlockLevel: 2, isDefault: false },
  { slug: "hair-braids", name: "Tranças", type: "hair" as const, icon: "🪢", price: 70, unlockLevel: 3, isDefault: false },
  { slug: "hair-mohawk", name: "Moicano", type: "hair" as const, icon: "🦔", price: 80, unlockLevel: 3, isDefault: false },
  { slug: "hair-rainbow", name: "Cabelo arco-íris", type: "hair" as const, icon: "🌈", price: 150, unlockLevel: 5, isDefault: false },
  { slug: "clothes-default", name: "Camiseta verde", type: "clothes" as const, icon: "👕", price: 0, unlockLevel: 1, isDefault: true },
  { slug: "clothes-stripes", name: "Camiseta listrada", type: "clothes" as const, icon: "👕", price: 25, unlockLevel: 1, isDefault: false },
  { slug: "clothes-hoodie", name: "Moletom", type: "clothes" as const, icon: "🧥", price: 35, unlockLevel: 1, isDefault: false },
  { slug: "clothes-scarf", name: "Cachecol", type: "clothes" as const, icon: "🧣", price: 35, unlockLevel: 1, isDefault: false },
  { slug: "clothes-overalls", name: "Jardineira", type: "clothes" as const, icon: "👖", price: 40, unlockLevel: 1, isDefault: false },
  { slug: "clothes-dress", name: "Vestido", type: "clothes" as const, icon: "👗", price: 40, unlockLevel: 1, isDefault: false },
  { slug: "clothes-sport", name: "Camisa de time", type: "clothes" as const, icon: "⚽", price: 50, unlockLevel: 2, isDefault: false },
  { slug: "clothes-rainbow", name: "Camiseta arco-íris", type: "clothes" as const, icon: "🌈", price: 60, unlockLevel: 2, isDefault: false },
  { slug: "clothes-doctor", name: "Jaleco de médico", type: "clothes" as const, icon: "🩺", price: 60, unlockLevel: 2, isDefault: false },
  { slug: "clothes-cape", name: "Capa de herói", type: "clothes" as const, icon: "🦸", price: 80, unlockLevel: 3, isDefault: false },
  { slug: "clothes-tuxedo", name: "Smoking", type: "clothes" as const, icon: "🤵", price: 80, unlockLevel: 3, isDefault: false },
  { slug: "clothes-pirate", name: "Roupa de pirata", type: "clothes" as const, icon: "🏴‍☠️", price: 90, unlockLevel: 3, isDefault: false },
  { slug: "clothes-princess", name: "Vestido de princesa", type: "clothes" as const, icon: "👸", price: 100, unlockLevel: 3, isDefault: false },
  { slug: "clothes-dino", name: "Fantasia de dino", type: "clothes" as const, icon: "🦖", price: 110, unlockLevel: 4, isDefault: false },
  { slug: "clothes-astronaut", name: "Traje de astronauta", type: "clothes" as const, icon: "🚀", price: 130, unlockLevel: 4, isDefault: false },
  { slug: "acc-freckles", name: "Sardinhas", type: "accessory" as const, icon: "✨", price: 20, unlockLevel: 1, isDefault: false },
  { slug: "acc-mustache", name: "Bigodinho", type: "accessory" as const, icon: "🥸", price: 25, unlockLevel: 1, isDefault: false },
  { slug: "acc-bow", name: "Laço", type: "accessory" as const, icon: "🎀", price: 30, unlockLevel: 1, isDefault: false },
  { slug: "acc-flower", name: "Flor no cabelo", type: "accessory" as const, icon: "🌸", price: 30, unlockLevel: 1, isDefault: false },
  { slug: "acc-bandana", name: "Bandana", type: "accessory" as const, icon: "🧢", price: 35, unlockLevel: 1, isDefault: false },
  { slug: "acc-glasses", name: "Óculos legal", type: "accessory" as const, icon: "👓", price: 40, unlockLevel: 1, isDefault: false },
  { slug: "acc-cap", name: "Boné", type: "accessory" as const, icon: "🧢", price: 40, unlockLevel: 1, isDefault: false },
  { slug: "acc-beanie", name: "Gorro", type: "accessory" as const, icon: "🧶", price: 40, unlockLevel: 1, isDefault: false },
  { slug: "acc-party", name: "Chapéu de festa", type: "accessory" as const, icon: "🥳", price: 45, unlockLevel: 1, isDefault: false },
  { slug: "acc-sunglasses", name: "Óculos escuros", type: "accessory" as const, icon: "🕶️", price: 50, unlockLevel: 2, isDefault: false },
  { slug: "acc-pirate", name: "Tapa-olho", type: "accessory" as const, icon: "🏴‍☠️", price: 55, unlockLevel: 2, isDefault: false },
  { slug: "acc-headphones", name: "Fones de ouvido", type: "accessory" as const, icon: "🎧", price: 60, unlockLevel: 2, isDefault: false },
  { slug: "acc-hat", name: "Chapéu mágico", type: "accessory" as const, icon: "🎩", price: 70, unlockLevel: 2, isDefault: false },
  { slug: "acc-mask", name: "Máscara de herói", type: "accessory" as const, icon: "🦸", price: 70, unlockLevel: 3, isDefault: false },
  { slug: "acc-halo", name: "Auréola", type: "accessory" as const, icon: "😇", price: 90, unlockLevel: 3, isDefault: false },
  { slug: "acc-star", name: "Estrela brilhante", type: "accessory" as const, icon: "⭐", price: 100, unlockLevel: 4, isDefault: false },
  { slug: "acc-wizard", name: "Chapéu de mago", type: "accessory" as const, icon: "🧙", price: 110, unlockLevel: 4, isDefault: false },
  { slug: "acc-crown", name: "Coroa", type: "accessory" as const, icon: "👑", price: 150, unlockLevel: 5, isDefault: false },
  { slug: "bg-default", name: "Cor do personagem", type: "background" as const, icon: "🎨", price: 0, unlockLevel: 1, isDefault: true },
  { slug: "bg-sky", name: "Céu azul", type: "background" as const, icon: "☁️", price: 30, unlockLevel: 1, isDefault: false },
  { slug: "bg-candy", name: "Algodão-doce", type: "background" as const, icon: "🍭", price: 35, unlockLevel: 1, isDefault: false },
  { slug: "bg-forest", name: "Floresta", type: "background" as const, icon: "🌲", price: 50, unlockLevel: 1, isDefault: false },
  { slug: "bg-beach", name: "Praia", type: "background" as const, icon: "🏖️", price: 50, unlockLevel: 2, isDefault: false },
  { slug: "bg-sunset", name: "Pôr do sol", type: "background" as const, icon: "🌅", price: 60, unlockLevel: 2, isDefault: false },
  { slug: "bg-night", name: "Noite estrelada", type: "background" as const, icon: "🌙", price: 70, unlockLevel: 2, isDefault: false },
  { slug: "bg-space", name: "Espaço", type: "background" as const, icon: "🪐", price: 90, unlockLevel: 3, isDefault: false },
  { slug: "bg-rainbow", name: "Arco-íris", type: "background" as const, icon: "🌈", price: 120, unlockLevel: 4, isDefault: false },
] as const;

export const SEED_REWARDS = [
  { slug: "reward-xp-boost", name: "Boost de XP", description: "+20 XP bônus na próxima lição", icon: "⚡", cost: 50, type: "boost" as const, requiredLevel: 1 },
  { slug: "reward-star-pack", name: "Pacote de estrelas", description: "+3 estrelas para sua coleção", icon: "✨", cost: 80, type: "badge" as const, requiredLevel: 2 },
  { slug: "reward-cape", name: "Capa de herói", description: "Desbloqueia a capa no avatar", icon: "🦸", cost: 80, type: "cosmetic" as const, avatarItemSlug: "clothes-cape", requiredLevel: 3 },
] as const;

export const SEED_ACHIEVEMENTS = [
  { slug: "first-lesson", name: "Primeira aventura", description: "Termine sua primeira lição", icon: "🎯", criteriaType: "lessons" as const, threshold: 1, xpBonus: 10, coinBonus: 20 },
  { slug: "five-lessons", name: "Explorador", description: "Termine 5 lições", icon: "🗺️", criteriaType: "lessons" as const, threshold: 5, xpBonus: 25, coinBonus: 50 },
  { slug: "ten-lessons", name: "Viajante", description: "Termine 10 lições", icon: "🧭", criteriaType: "lessons" as const, threshold: 10, xpBonus: 40, coinBonus: 80 },
  { slug: "twenty-five-lessons", name: "Aventureiro", description: "Termine 25 lições", icon: "🏕️", criteriaType: "lessons" as const, threshold: 25, xpBonus: 80, coinBonus: 150 },
  { slug: "fifty-lessons", name: "Mestre das lições", description: "Termine 50 lições", icon: "🏆", criteriaType: "lessons" as const, threshold: 50, xpBonus: 150, coinBonus: 300 },
  { slug: "streak-3", name: "Em chamas", description: "Estude 3 dias seguidos", icon: "🔥", criteriaType: "streak" as const, threshold: 3, xpBonus: 15, coinBonus: 30 },
  { slug: "streak-7", name: "Semana completa", description: "Estude 7 dias seguidos", icon: "💪", criteriaType: "streak" as const, threshold: 7, xpBonus: 50, coinBonus: 100 },
  { slug: "streak-14", name: "Duas semanas", description: "Estude 14 dias seguidos", icon: "📅", criteriaType: "streak" as const, threshold: 14, xpBonus: 100, coinBonus: 200 },
  { slug: "streak-30", name: "Imparável", description: "Estude 30 dias seguidos", icon: "🚀", criteriaType: "streak" as const, threshold: 30, xpBonus: 250, coinBonus: 500 },
  { slug: "xp-500", name: "Cabeça cheia", description: "Junte 500 XP", icon: "⚡", criteriaType: "xp" as const, threshold: 500, xpBonus: 30, coinBonus: 60 },
  { slug: "xp-2000", name: "Supercérebro", description: "Junte 2.000 XP", icon: "🧠", criteriaType: "xp" as const, threshold: 2000, xpBonus: 100, coinBonus: 200 },
  { slug: "level-5", name: "Subindo de nível", description: "Chegue ao nível 5", icon: "⬆️", criteriaType: "level" as const, threshold: 5, xpBonus: 30, coinBonus: 60 },
  { slug: "level-10", name: "Nível 10", description: "Chegue ao nível 10", icon: "🌟", criteriaType: "level" as const, threshold: 10, xpBonus: 80, coinBonus: 160 },
  { slug: "rich-coins", name: "Colecionador", description: "Tenha 200 moedas guardadas", icon: "🪙", criteriaType: "coins" as const, threshold: 200, xpBonus: 20, coinBonus: 0 },
  { slug: "rich-coins-500", name: "Cofrinho cheio", description: "Tenha 500 moedas guardadas", icon: "💰", criteriaType: "coins" as const, threshold: 500, xpBonus: 50, coinBonus: 0 },
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
