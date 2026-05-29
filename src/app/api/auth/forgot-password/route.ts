import { handleForgotPassword } from "@/modules/controllers/auth.controller";

export async function POST(request: Request) {
  return handleForgotPassword(request as import("next/server").NextRequest);
}
