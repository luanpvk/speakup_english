import { connectDB } from "@/lib/mongodb";
import { ensureSeedData } from "@/modules/services/seed.service";
import { Achievement, Lesson, Module } from "@/modules/repositories/models";

/**
 * Cache em memória do catálogo (capítulos, resumo das lições, conquistas).
 * Esses dados só mudam no deploy/seed, mas eram buscados (com todas as atividades) a cada pedido.
 * shortcut: cache por processo com TTL; com várias instâncias cada uma tem o seu, o que é ok
 * para dados que só mudam no deploy. Se o conteúdo passar a ser editado em produção, trocar por invalidação.
 */
const TTL_MS = 10 * 60_000;

const LESSON_SUMMARY_FIELDS =
  "slug moduleSlug title description icon order xpReward coinReward estimatedMinutes";

async function loadCatalog() {
  await ensureSeedData();
  await connectDB();
  const [modules, lessons, achievements] = await Promise.all([
    Module.find({ isActive: true }).sort({ order: 1 }).lean(),
    Lesson.find({ isActive: true }).sort({ order: 1 }).select(LESSON_SUMMARY_FIELDS).lean(),
    Achievement.find({ isActive: true }).lean(),
  ]);

  const lessonsByModule = new Map<string, typeof lessons>();
  for (const lesson of lessons) {
    const list = lessonsByModule.get(lesson.moduleSlug) ?? [];
    list.push(lesson);
    lessonsByModule.set(lesson.moduleSlug, list);
  }

  return { modules, lessons, lessonsByModule, achievements };
}

export type Catalog = Awaited<ReturnType<typeof loadCatalog>>;

let cached: { at: number; data: Promise<Catalog> } | null = null;

export function getCatalog(): Promise<Catalog> {
  if (!cached || Date.now() - cached.at > TTL_MS) {
    const data = loadCatalog();
    cached = { at: Date.now(), data };
    data.catch(() => {
      cached = null; // falhou: tenta de novo no próximo pedido
    });
  }
  return cached.data;
}

/** Capítulos com todas as lições concluídas */
export function completedModuleSlugs(catalog: Catalog, completedLessonIds: Set<string>) {
  const done = new Set<string>();
  for (const mod of catalog.modules) {
    const lessons = catalog.lessonsByModule.get(mod.slug) ?? [];
    if (lessons.length > 0 && lessons.every((l) => completedLessonIds.has(l.slug))) {
      done.add(mod.slug);
    }
  }
  return done;
}
