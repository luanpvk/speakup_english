import { handleLoginChild } from "@/modules/controllers/auth.controller";

export async function POST(request: Request) {
  return handleLoginChild(request as import("next/server").NextRequest);
}
