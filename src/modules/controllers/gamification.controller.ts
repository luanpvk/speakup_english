import { NextRequest } from "next/server";
import { jsonSuccess, jsonError } from "@/modules/utils/api-response";
import { authenticateRequest } from "@/modules/middlewares/auth.middleware";
import * as gamificationService from "@/modules/services/gamification.service";

async function getChildId(request: NextRequest) {
  const tokenUser = authenticateRequest(request);
  return gamificationService.resolveChildProfileId(tokenUser);
}

export async function handleGetStats(request: NextRequest) {
  try {
    const childProfileId = await getChildId(request);
    const stats = await gamificationService.getChildStats(childProfileId);
    return jsonSuccess(stats);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro";
    const status = message.includes("Acesso") ? 403 : 400;
    return jsonError(message, status);
  }
}

export async function handleGetLesson(request: NextRequest, lessonSlug: string) {
  try {
    const childProfileId = await getChildId(request);
    const data = await gamificationService.getLessonDetail(childProfileId, lessonSlug);
    return jsonSuccess(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro";
    return jsonError(message, 404);
  }
}

export async function handleCompleteLesson(request: NextRequest, lessonSlug: string) {
  try {
    const childProfileId = await getChildId(request);
    const body = await request.json();
    const score = Number(body.score) || 0;
    const timeSpentSeconds = Number(body.timeSpentSeconds) || 0;
    const result = await gamificationService.completeLesson(
      childProfileId,
      lessonSlug,
      score,
      timeSpentSeconds
    );
    return jsonSuccess(result, 200, "Lição concluída! Parabéns! 🎉");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro";
    return jsonError(message, 400);
  }
}

export async function handleGetRanking(request: NextRequest) {
  try {
    const childProfileId = await getChildId(request);
    const period = (request.nextUrl.searchParams.get("period") ?? "alltime") as "weekly" | "alltime";
    const ranking = await gamificationService.getRankingForChild(childProfileId, period);
    return jsonSuccess({ ranking, period });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro";
    return jsonError(message, 403);
  }
}

export async function handleGetShop(request: NextRequest) {
  try {
    const childProfileId = await getChildId(request);
    const shop = await gamificationService.getShopItems(childProfileId);
    return jsonSuccess(shop);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro";
    return jsonError(message, 403);
  }
}

export async function handlePurchaseReward(
  request: NextRequest,
  body?: { rewardSlug?: string }
) {
  try {
    const childProfileId = await getChildId(request);
    const payload = body ?? (await request.json());
    if (!payload.rewardSlug) {
      return jsonError("Recompensa inválida", 400);
    }
    const result = await gamificationService.purchaseReward(
      childProfileId,
      payload.rewardSlug
    );
    return jsonSuccess(result, 200, "Compra realizada!");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro";
    return jsonError(message, 400);
  }
}

export async function handlePurchaseAvatarItem(
  request: NextRequest,
  body?: { itemSlug?: string }
) {
  try {
    const childProfileId = await getChildId(request);
    const payload = body ?? (await request.json());
    if (!payload.itemSlug) {
      return jsonError("Item inválido", 400);
    }
    const result = await gamificationService.purchaseAvatarItem(
      childProfileId,
      payload.itemSlug
    );
    return jsonSuccess(result, 200, "Item desbloqueado!");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro";
    return jsonError(message, 400);
  }
}

export async function handleGetAvatar(request: NextRequest) {
  try {
    const childProfileId = await getChildId(request);
    const data = await gamificationService.getAvatarCustomization(childProfileId);
    return jsonSuccess(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro";
    return jsonError(message, 403);
  }
}

export async function handleUpdateAvatar(request: NextRequest) {
  try {
    const childProfileId = await getChildId(request);
    const body = await request.json();
    const data = await gamificationService.updateAvatar(childProfileId, body);
    return jsonSuccess(data, 200, "Avatar atualizado!");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro";
    return jsonError(message, 400);
  }
}

export async function handleGetDailyFlashcards(request: NextRequest) {
  try {
    const childProfileId = await getChildId(request);
    const { getDailyFlashcardSession } = await import("@/modules/services/flashcard.service");
    const session = await getDailyFlashcardSession(childProfileId);
    return jsonSuccess(session);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro";
    return jsonError(message, 400);
  }
}

export async function handleReviewFlashcard(request: NextRequest) {
  try {
    const childProfileId = await getChildId(request);
    const body = await request.json();
    const cardId = String(body.cardId ?? "");
    const rating = Number(body.rating) as 1 | 2 | 3 | 4;
    if (!cardId || rating < 1 || rating > 4) {
      return jsonError("Dados inválidos", 400);
    }
    const { reviewFlashcard } = await import("@/modules/services/flashcard.service");
    const result = await reviewFlashcard(childProfileId, cardId, rating);
    return jsonSuccess(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro";
    return jsonError(message, 400);
  }
}
