import { handleLoginParent } from "@/modules/controllers/auth.controller";

export async function POST(request: Request) {
  return handleLoginParent(request as import("next/server").NextRequest);
}
