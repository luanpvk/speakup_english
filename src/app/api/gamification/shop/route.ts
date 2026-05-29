import { NextRequest } from "next/server";
import { handleGetShop } from "@/modules/controllers/gamification.controller";

export async function GET(request: NextRequest) {
  return handleGetShop(request);
}
