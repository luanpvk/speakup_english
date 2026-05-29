import type { LessonContent } from "@/types/lesson";
import { buildAllLessons } from "./lesson-builder";
import { LESSON_SPECS, CHAPTER_MODULES as CHAPTERS } from "./chapters-data";

/** Conteúdo pedagógico completo — 45 capítulos, 450 lições. */
export const LESSON_CONTENT: LessonContent[] = buildAllLessons(LESSON_SPECS);

/** Módulos = capítulos na trilha */
export const CHAPTER_MODULES = CHAPTERS;
