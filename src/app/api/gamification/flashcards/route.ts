import { NextRequest } from "next/server";
import {
  handleGetDailyFlashcards,
  handleReviewFlashcard,
} from "@/modules/controllers/gamification.controller";

export async function GET(request: NextRequest) {
  return handleGetDailyFlashcards(request);
}

export async function POST(request: NextRequest) {
  return handleReviewFlashcard(request);
}
