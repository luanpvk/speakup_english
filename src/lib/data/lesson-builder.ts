import type {
  LessonActivity,
  LessonContent,
  LessonVocabCard,
} from "@/types/lesson";

/** Tupla: inglês, português, emoji?, exemplo EN?, exemplo PT? */
export type WordEntry = [string, string, string?, string?, string?];

export type QuizEntry = [string, string[], number, string?];

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
  speak?: { phrase: string; tip: string };
  wordOrder?: { ptLabel: string; words: string[]; correct: string };
  quiz: QuizEntry[];
};

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

function buildPuzzle(words: WordEntry[]) {
  const candidate =
    words
      .filter(([en]) => !en.includes(" ") && en.length >= 3 && en.length <= 8)
      .sort((a, b) => a[0].length - b[0].length)[0] ?? words[0];
  const [word, translation, emoji] = candidate;
  return {
    instruction: "Monte a palavra em inglês letra por letra.",
    word: word.replace(/[^a-zA-Z]/g, "") || word,
    translation,
    emoji,
    hint: `A palavra tem ${word.replace(/[^a-zA-Z]/g, "").length || word.length} letras.`,
  };
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

export function buildLessonFromSpec(spec: LessonSpec): LessonContent {
  const cards = toCards(spec.words);
  const storyLines = spec.story ?? defaultStory(spec.words);
  const game = spec.globalOrder % 4;
  const baseXp = 38 + Math.floor(spec.globalOrder / 3) * 2;
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

  if (game === 0) {
    activities.push({
      id: "memory",
      type: "memory",
      title: "Jogo da memória",
      instruction: "Encontre os pares: inglês ↔ português.",
      data: buildMemory(spec.words),
    });
  } else if (game === 1) {
    activities.push({
      id: "match",
      type: "match",
      title: "Ligue os pares",
      instruction: "Toque inglês e português que combinam.",
      data: buildMatch(spec.words),
    });
  } else if (game === 2) {
    activities.push({
      id: "drag-fit",
      type: "drag-fit",
      title: "Encaixe as palavras",
      instruction: "Mini jogo: encaixe inglês no significado certo.",
      data: buildDragFit(spec.words),
    });
  } else {
    activities.push({
      id: "puzzle",
      type: "puzzle",
      title: "Quebra-cabeça de letras",
      instruction: "Monte a palavra em inglês.",
      data: buildPuzzle(spec.words),
    });
  }

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
