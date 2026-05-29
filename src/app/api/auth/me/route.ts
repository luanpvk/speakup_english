import { handleMe } from "@/modules/controllers/auth.controller";

export async function GET(request: Request) {
  return handleMe(request as import("next/server").NextRequest);
}
