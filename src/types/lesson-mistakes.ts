import type {
  LessonActivityListen,
  LessonQuizQuestion,
  LessonActivityWordOrder,
  LessonVocabCard,
} from "@/types/lesson";

export type LessonMistakeKind = "quiz" | "listen" | "word-order" | "vocab";

export type LessonMistake =
  | {
      id: string;
      kind: "quiz";
      label: string;
      data: LessonQuizQuestion;
    }
  | {
      id: string;
      kind: "listen";
      label: string;
      data: LessonActivityListen;
    }
  | {
      id: string;
      kind: "word-order";
      label: string;
      data: LessonActivityWordOrder;
    }
  | {
      id: string;
      kind: "vocab";
      label: string;
      data: LessonVocabCard;
    };

export function mistakeKey(m: LessonMistake): string {
  return m.id;
}
