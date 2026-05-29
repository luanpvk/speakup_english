import { NextRequest } from "next/server";
import {
  handlePurchaseReward,
  handlePurchaseAvatarItem,
} from "@/modules/controllers/gamification.controller";

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (body.itemSlug) {
    return handlePurchaseAvatarItem(request, body);
  }
  if (body.rewardSlug) {
    return handlePurchaseReward(request, body);
  }
  return handlePurchaseReward(request, body);
}
