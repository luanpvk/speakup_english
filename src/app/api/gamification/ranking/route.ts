import { NextRequest } from "next/server";
import { handleGetRanking } from "@/modules/controllers/gamification.controller";

export async function GET(request: NextRequest) {
  return handleGetRanking(request);
}
