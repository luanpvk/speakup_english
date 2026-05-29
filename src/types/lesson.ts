/** Tipos de atividades pedagógicas na trilha de lições */

export type LessonActivityType =
  | "intro"
  | "story"
  | "vocab"
  | "listen"
  | "speak-practice"
  | "memory"
  | "match"
  | "drag-fit"
  | "puzzle"
  | "word-order"
  | "quiz"
  | "review";

export interface LessonVocabCard {
  word: string;
  translation: string;
  emoji?: string;
  example?: string;
  examplePt?: string;
}

export interface LessonQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  hint?: string;
}

export interface LessonActivityIntro {
  objective: string;
  whatYouWillLearn: string[];
}

export interface LessonActivityStory {
  paragraphs: { en: string; pt: string }[];
}

export interface LessonActivityVocab {
  cards: LessonVocabCard[];
}

export interface LessonActivityListen {
  prompt: string;
  targetWord: string;
  targetEmoji?: string;
  options: string[];
  correctIndex: number;
}

export interface LessonActivitySpeakPractice {
  phrase: string;
  translation: string;
  emoji?: string;
  tip: string;
}

export interface LessonActivityMemory {
  pairs: { id: string; english: string; portuguese: string; emoji?: string }[];
}

export interface LessonActivityMatch {
  pairs: { id: string; english: string; portuguese: string; emoji?: string }[];
}

export interface LessonActivityDragFit {
  instruction: string;
  slots: { id: string; label: string; emoji?: string }[];
  pieces: { id: string; english: string; portuguese: string; slotId: string; emoji?: string }[];
}

export interface LessonActivityPuzzle {
  instruction: string;
  word: string;
  translation: string;
  emoji?: string;
  hint?: string;
}

export interface LessonActivityWordOrder {
  instruction: string;
  words: string[];
  correctSentence: string;
}

export interface LessonActivityQuiz {
  questions: LessonQuizQuestion[];
}

export interface LessonActivityReview {
  summary: string;
  words: LessonVocabCard[];
}

export type LessonActivityData =
  | LessonActivityIntro
  | LessonActivityStory
  | LessonActivityVocab
  | LessonActivityListen
  | LessonActivitySpeakPractice
  | LessonActivityMemory
  | LessonActivityMatch
  | LessonActivityDragFit
  | LessonActivityPuzzle
  | LessonActivityWordOrder
  | LessonActivityQuiz
  | LessonActivityReview;

export interface LessonActivity {
  id: string;
  type: LessonActivityType;
  title: string;
  instruction?: string;
  data: LessonActivityData;
}

export interface LessonContent {
  slug: string;
  moduleSlug: string;
  chapterTitle: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  xpReward: number;
  coinReward: number;
  starReward: number;
  estimatedMinutes: number;
  activities: LessonActivity[];
}
