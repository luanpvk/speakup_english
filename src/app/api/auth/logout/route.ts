import { handleLogout } from "@/modules/controllers/auth.controller";

export async function POST() {
  return handleLogout();
}
