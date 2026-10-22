import type { LessonContent, LessonVocabCard } from "@/types/lesson";
import type { ILessonVocab, ILessonQuiz } from "@/modules/types/models";

export const LESSON_CONTENT_VERSION = 47;

export function lessonContentToDbFields(content: LessonContent) {
  const vocabulary: ILessonVocab[] = [];
  const quiz: ILessonQuiz[] = [];

  for (const activity of content.activities) {
    if (activity.type === "vocab") {
      const data = activity.data as { cards: LessonVocabCard[] };
      for (const card of data.cards ?? []) {
        vocabulary.push({
          word: card.word,
          translation: card.translation,
          emoji: card.emoji,
          audioHint: card.example,
        });
      }
    }
    if (activity.type === "quiz") {
      const data = activity.data as { questions: ILessonQuiz[] };
      quiz.push(...(data.questions ?? []));
    }
  }

  return {
    slug: content.slug,
    moduleSlug: content.moduleSlug,
    chapterTitle: content.chapterTitle,
    title: content.title,
    description: content.description,
    icon: content.icon,
    order: content.order,
    xpReward: content.xpReward,
    coinReward: content.coinReward,
    starReward: content.starReward,
    estimatedMinutes: content.estimatedMinutes,
    contentVersion: LESSON_CONTENT_VERSION,
    activities: content.activities,
    vocabulary,
    quiz,
    isActive: true,
  };
}
