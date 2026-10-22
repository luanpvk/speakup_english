"use client";

import { use } from "react";
import { LessonPlayer } from "@/features/lessons/lesson-player";

export default function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  // key: outra lição começa com estado novo, sem precisar "resetar"
  return <LessonPlayer key={slug} slug={slug} />;
}
