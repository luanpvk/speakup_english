import { handleRegister } from "@/modules/controllers/auth.controller";

export async function POST(request: Request) {
  return handleRegister(request as import("next/server").NextRequest);
}
