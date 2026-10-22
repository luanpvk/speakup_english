import { NextRequest } from "next/server";
import { handleUpdateChildProfile } from "@/modules/controllers/gamification.controller";

export async function PATCH(request: NextRequest) {
  return handleUpdateChildProfile(request);
}
