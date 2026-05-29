import { handleResetPassword } from "@/modules/controllers/auth.controller";

export async function POST(request: Request) {
  return handleResetPassword(request as import("next/server").NextRequest);
}
