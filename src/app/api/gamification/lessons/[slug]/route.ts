import { NextRequest } from "next/server";
import { handleGetLesson } from "@/modules/controllers/gamification.controller";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  return handleGetLesson(request, slug);
}
