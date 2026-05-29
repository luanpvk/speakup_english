import { handleRefresh } from "@/modules/controllers/auth.controller";

export async function POST() {
  return handleRefresh();
}
