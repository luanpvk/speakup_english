import { NextRequest } from "next/server";
import {
  handleGetAvatar,
  handleUpdateAvatar,
} from "@/modules/controllers/gamification.controller";

export async function GET(request: NextRequest) {
  return handleGetAvatar(request);
}

export async function PATCH(request: NextRequest) {
  return handleUpdateAvatar(request);
}
