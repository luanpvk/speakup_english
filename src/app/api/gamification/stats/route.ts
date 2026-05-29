import { NextRequest } from "next/server";
import { handleGetStats } from "@/modules/controllers/gamification.controller";

export async function GET(request: NextRequest) {
  return handleGetStats(request);
}
