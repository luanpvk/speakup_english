"use client";

import type { LessonActivity } from "@/types/lesson";
import type {
  LessonActivityIntro,
  LessonActivityStory,
  LessonActivityVocab,
  LessonActivityListen,
  LessonActivitySpeakPractice,
  LessonActivityMemory,
  LessonActivityMatch,
  LessonActivityDragFit,
  LessonActivityPuzzle,
  LessonActivityWordOrder,
  LessonActivityQuiz,
} from "@/types/lesson";
import type { LessonMistake } from "@/types/lesson-mistakes";
import { ActivityIntro } from "./activity-intro";
import { ActivityStory } from "./activity-story";
import { ActivityVocab } from "./activity-vocab";
import { ActivityListen } from "./activity-listen";
import { ActivitySpeak } from "./activity-speak";
import { ActivityMemory } from "./activity-memory";
import { ActivityMatch } from "./activity-match";
import { ActivityDragFit } from "./activity-drag-fit";
import { ActivityPuzzle } from "./activity-puzzle";
import { ActivityWordOrder } from "./activity-word-order";
import { ActivityQuiz } from "./activity-quiz";

interface Props {
  activity: LessonActivity;
  lessonIcon: string;
  lessonTitle: string;
  lessonSlug?: string;
  onStepComplete: (opts?: {
    correct?: boolean;
    quizCorrect?: number;
    quizTotal?: number;
  }) => void;
  onMistake?: (mistake: LessonMistake) => void;
  onFinishLesson?: () => void;
}

export function ActivityRenderer({
  activity,
  lessonIcon,
  lessonTitle,
  lessonSlug,
  onStepComplete,
  onMistake,
}: Props) {
  switch (activity.type) {
    case "intro":
      return (
        <ActivityIntro
          data={activity.data as LessonActivityIntro}
          lessonIcon={lessonIcon}
          lessonTitle={lessonTitle}
          lessonSlug={lessonSlug}
          onComplete={() => onStepComplete()}
        />
      );
    case "story":
      return (
        <ActivityStory
          data={activity.data as LessonActivityStory}
          onComplete={() => onStepComplete()}
        />
      );
    case "vocab":
      return (
        <ActivityVocab
          data={activity.data as LessonActivityVocab}
          onComplete={() => onStepComplete()}
        />
      );
    case "listen":
      return (
        <ActivityListen
          data={activity.data as LessonActivityListen}
          onComplete={(correct) => onStepComplete({ correct })}
          onMistake={onMistake}
        />
      );
    case "speak-practice":
      return (
        <ActivitySpeak
          data={activity.data as LessonActivitySpeakPractice}
          onComplete={() => onStepComplete()}
        />
      );
    case "memory":
      return (
        <ActivityMemory
          data={activity.data as LessonActivityMemory}
          onComplete={() => onStepComplete()}
        />
      );
    case "match":
      return (
        <ActivityMatch
          data={activity.data as LessonActivityMatch}
          onComplete={(correct) => onStepComplete({ correct })}
        />
      );
    case "drag-fit":
      return (
        <ActivityDragFit
          data={activity.data as LessonActivityDragFit}
          onComplete={(correct) => onStepComplete({ correct })}
        />
      );
    case "puzzle":
      return (
        <ActivityPuzzle
          data={activity.data as LessonActivityPuzzle}
          onComplete={(correct) => onStepComplete({ correct })}
        />
      );
    case "word-order":
      return (
        <ActivityWordOrder
          data={activity.data as LessonActivityWordOrder}
          onComplete={(correct) => onStepComplete({ correct })}
          onMistake={onMistake}
        />
      );
    case "quiz":
      return (
        <ActivityQuiz
          data={activity.data as LessonActivityQuiz}
          onComplete={(quizCorrect, quizTotal) =>
            onStepComplete({ quizCorrect, quizTotal })
          }
          onMistake={onMistake}
        />
      );
    default:
      return (
        <p className="text-center text-muted-foreground">
          Atividade desconhecida.{" "}
          <button type="button" className="underline" onClick={() => onStepComplete()}>
            Pular
          </button>
        </p>
      );
  }
}
