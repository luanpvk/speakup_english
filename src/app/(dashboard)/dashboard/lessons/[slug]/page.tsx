"use client";

import { use } from "react";
import { LessonPlayer } from "@/features/lessons/lesson-player";

export default function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  return <LessonPlayer slug={slug} />;
}
