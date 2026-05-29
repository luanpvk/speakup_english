export interface FlashcardItem {
  id: string;
  word: string;
  translation: string;
  emoji?: string;
  example?: string;
  lessonSlug?: string;
  intervalDays: number;
  repetitions: number;
}

export interface DailyFlashcardSession {
  queue: FlashcardItem[];
  reviewsDoneToday: number;
  dailyLimit: number;
  remainingToday: number;
  totalDue: number;
  totalCards: number;
  bankSize: number;
  isDailyComplete: boolean;
  needsSync?: boolean;
}

export type FlashcardRating = 1 | 2 | 3 | 4;
