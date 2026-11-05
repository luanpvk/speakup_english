import type { LessonContent } from "@/types/lesson";
import { buildAllLessons } from "./lesson-builder";
import { LESSON_SPECS, CHAPTER_MODULES as CHAPTERS } from "./chapters-data";
import { buildHyperfocusContent } from "./hyperfocus-lessons";

/** Capítulos extras de hiperfoco vêm depois da trilha principal */
const HYPERFOCUS = buildHyperfocusContent(CHAPTERS.length + 1, LESSON_SPECS.length + 1);

/** Conteúdo pedagógico completo: 45 capítulos da trilha + 12 de hiperfoco (510 lições). */
export const LESSON_CONTENT: LessonContent[] = buildAllLessons([...LESSON_SPECS, ...HYPERFOCUS.specs]);

/** Módulos = capítulos na trilha */
export const CHAPTER_MODULES = [...CHAPTERS, ...HYPERFOCUS.modules];
