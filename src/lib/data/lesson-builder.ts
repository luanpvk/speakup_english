import type {
  LessonActivity,
  LessonContent,
  LessonVocabCard,
} from "@/types/lesson";

/** Tupla: inglês, português, emoji?, exemplo EN?, exemplo PT? */
export type WordEntry = [string, string, string?, string?, string?];

export type QuizEntry = [string, string[], number, string?];

export type LessonGame = "memory" | "match" | "drag-fit" | "puzzle";

export type LessonSpec = {
  slug: string;
  moduleSlug: string;
  chapterTitle: string;
  lessonNum: number;
  globalOrder: number;
  title: string;
  description: string;
  icon: string;
  objective: string;
  learn: string[];
  words: WordEntry[];
  story?: [string, string][];
  /** translation: tradução da frase inteira (sem ela, usa a da palavra contida na frase) */
  speak?: { phrase: string; tip: string; translation?: string };
  wordOrder?: { ptLabel: string; words: string[]; correct: string };
  quiz: QuizEntry[];
  /** Minijogos da lição; sem isso, um único jogo alternado pela ordem global */
  games?: LessonGame[];
  /** XP fixo; sem isso, cresce com a ordem global */
  xpReward?: number;
};

const GAME_ORDER: LessonGame[] = ["memory", "match", "drag-fit", "puzzle"];

export function w(
  en: string,
  pt: string,
  emoji = "📚",
  example?: string,
  examplePt?: string
): WordEntry {
  return [en, pt, emoji, example, examplePt];
}

function toCards(words: WordEntry[]): LessonVocabCard[] {
  return words.map(([word, translation, emoji, example, examplePt]) => ({
    word,
    translation,
    emoji,
    example,
    examplePt,
  }));
}

function buildListen(words: WordEntry[], globalOrder: number) {
  const index = globalOrder % words.length;
  const [target, pt, emoji] = words[index];
  // Sem traduções repetidas (ex.: Goodbye/Bye = "Tchau") nem a resposta certa como opção errada
  const wrong = [...new Set(words.map((x) => x[1]).filter((t) => t !== pt))].slice(0, 3);
  const correctIndex = globalOrder % (wrong.length + 1);
  const options = [...wrong];
  options.splice(correctIndex, 0, pt);
  return {
    prompt: `Alguém disse: "${target}"`,
    targetWord: target,
    targetEmoji: emoji,
    options,
    correctIndex,
  };
}

/** Remove opções duplicadas mantendo a resposta correta */
function uniqueOptions(options: string[], correctIndex: number) {
  const unique = [...new Set(options)];
  return { options: unique, correctIndex: unique.indexOf(options[correctIndex]) };
}

/** Jogos de pares comparam por id: duas palavras com a mesma tradução (ex.: dois "Tchau") deixariam um par impossível */
function uniqueByTranslation(words: WordEntry[]) {
  return words.filter((w, i) => words.findIndex((x) => x[1] === w[1]) === i);
}

function buildMemory(words: WordEntry[]) {
  return {
    pairs: uniqueByTranslation(words).slice(0, 4).map(([english, portuguese, emoji], i) => ({
      id: String(i + 1),
      english,
      portuguese,
      emoji,
    })),
  };
}

function buildMatch(words: WordEntry[]) {
  return {
    pairs: uniqueByTranslation(words).map(([english, portuguese, emoji], i) => ({
      id: String(i + 1),
      english,
      portuguese,
      emoji,
    })),
  };
}

function buildDragFit(words: WordEntry[]) {
  const slice = uniqueByTranslation(words).slice(0, 4);
  return {
    instruction: "Toque na palavra em inglês e depois no significado em português correto.",
    slots: slice.map(([, pt, emoji], i) => ({
      id: `slot-${i}`,
      label: pt,
      emoji,
    })),
    pieces: slice.map(([english, portuguese, emoji], i) => ({
      id: `piece-${i}`,
      english,
      portuguese,
      slotId: `slot-${i}`,
      emoji,
    })),
  };
}

/** Quebra-cabeça só com palavra única de 3 a 8 letras (frase viraria "GOODBYEFRIEND") */
function puzzleCandidate(words: WordEntry[]) {
  return words
    .filter(([en]) => /^[A-Za-z]{3,8}$/.test(en))
    .sort((a, b) => a[0].length - b[0].length)[0];
}

function buildPuzzle(words: WordEntry[]) {
  const [word, translation, emoji] = puzzleCandidate(words) ?? words[0];
  return {
    instruction: "Monte a palavra em inglês letra por letra.",
    word,
    translation,
    emoji,
    hint: `A palavra tem ${word.length} letras.`,
  };
}

/** Sem palavra boa para o quebra-cabeça, usa outro jogo que a lição ainda não tem */
function playableGames(games: LessonGame[], words: WordEntry[]): LessonGame[] {
  if (!games.includes("puzzle") || puzzleCandidate(words)) return games;
  const swap = GAME_ORDER.find((g) => g !== "puzzle" && !games.includes(g))!;
  return games.map((g) => (g === "puzzle" ? swap : g));
}

/** História padrão neutra: funciona com palavras, frases ou perguntas ("What's your name?") */
function defaultStory(words: WordEntry[]): [string, string][] {
  return [
    ["Today I learn new words!", "Hoje eu aprendo palavras novas!"],
    ...words.slice(0, 2).map(([en, pt]): [string, string] => [
      `"${en}" means "${pt}".`,
      `"${en}" significa "${pt}".`,
    ]),
  ];
}

function buildGame(game: LessonGame, words: WordEntry[]): LessonActivity {
  switch (game) {
    case "memory":
      return {
        id: "memory",
        type: "memory",
        title: "Jogo da memória",
        instruction: "Encontre os pares: inglês ↔ português.",
        data: buildMemory(words),
      };
    case "match":
      return {
        id: "match",
        type: "match",
        title: "Ligue os pares",
        instruction: "Toque inglês e português que combinam.",
        data: buildMatch(words),
      };
    case "drag-fit":
      return {
        id: "drag-fit",
        type: "drag-fit",
        title: "Encaixe as palavras",
        instruction: "Mini jogo: encaixe inglês no significado certo.",
        data: buildDragFit(words),
      };
    case "puzzle":
      return {
        id: "puzzle",
        type: "puzzle",
        title: "Quebra-cabeça de letras",
        instruction: "Monte a palavra em inglês.",
        data: buildPuzzle(words),
      };
  }
}

export function buildLessonFromSpec(spec: LessonSpec): LessonContent {
  const cards = toCards(spec.words);
  const storyLines = spec.story ?? defaultStory(spec.words);
  const games = playableGames(spec.games ?? [GAME_ORDER[spec.globalOrder % 4]], spec.words);
  const baseXp = spec.xpReward ?? 38 + Math.floor(spec.globalOrder / 3) * 2;
  const activities: LessonActivity[] = [
    {
      id: "intro",
      type: "intro",
      title: "Objetivo da lição",
      data: {
        objective: spec.objective,
        whatYouWillLearn: spec.learn,
      },
    },
    {
      id: "story",
      type: "story",
      title: "História curta",
      instruction: "Leia em português e depois em inglês. Sem pressa!",
      data: {
        paragraphs: storyLines.map(([en, pt]) => ({ en, pt })),
      },
    },
    {
      id: "vocab",
      type: "vocab",
      title: "Palavras novas",
      instruction: "Toque em cada cartão, ouça mentalmente e repita em voz alta.",
      data: { cards },
    },
  ];

  if (spec.speak) {
    activities.push({
      id: "speak",
      type: "speak-practice",
      title: "Hora de falar",
      instruction: "Repita a frase três vezes. Pode ser devagar!",
      data: {
        phrase: spec.speak.phrase,
        translation:
          spec.speak.translation ??
          spec.words.find(([en]) => spec.speak!.phrase.includes(en))?.[1] ??
          spec.speak.phrase,
        emoji: spec.icon,
        tip: spec.speak.tip,
      },
    });
  }

  activities.push({
    id: "listen",
    type: "listen",
    title: "O que você ouviu?",
    instruction: "Imagine a palavra sendo falada e escolha a tradução.",
    data: buildListen(spec.words, spec.globalOrder),
  });

  for (const game of games) activities.push(buildGame(game, spec.words));

  if (spec.wordOrder) {
    activities.push({
      id: "word-order",
      type: "word-order",
      title: "Monte a frase",
      instruction: "Coloque as palavras na ordem correta.",
      data: {
        instruction: spec.wordOrder.ptLabel,
        words: spec.wordOrder.words,
        correctSentence: spec.wordOrder.correct,
      },
    });
  }

  activities.push({
    id: "quiz",
    type: "quiz",
    title: "Desafio final",
    instruction: "Responda para fixar o que aprendeu.",
    data: {
      questions: spec.quiz.map(([question, options, correctIndex, hint]) => ({
        question,
        ...uniqueOptions(options, correctIndex),
        hint,
      })),
    },
  });

  activities.push({
    id: "review",
    type: "review",
    title: "Revisão e recompensas",
    instruction: "Revise e conclua para ganhar XP e moedas!",
    data: {
      summary: spec.objective,
      words: cards.slice(0, 4),
    },
  });

  return {
    slug: spec.slug,
    moduleSlug: spec.moduleSlug,
    chapterTitle: spec.chapterTitle,
    title: spec.title,
    description: spec.description,
    icon: spec.icon,
    order: spec.lessonNum,
    xpReward: baseXp,
    coinReward: Math.floor(baseXp / 2),
    starReward: spec.lessonNum === 1 ? 2 : 1,
    estimatedMinutes: 10 + (spec.words.length > 4 ? 2 : 0),
    activities,
  };
}

export function buildAllLessons(specs: LessonSpec[]): LessonContent[] {
  return specs.map(buildLessonFromSpec);
}
