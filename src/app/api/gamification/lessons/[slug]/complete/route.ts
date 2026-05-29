import { NextRequest } from "next/server";
import { handleCompleteLesson } from "@/modules/controllers/gamification.controller";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  return handleCompleteLesson(request, slug);
}
