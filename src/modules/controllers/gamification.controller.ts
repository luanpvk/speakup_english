import { NextRequest } from "next/server";
import { jsonSuccess, jsonError, errorResponse } from "@/modules/utils/api-response";
import { authenticateRequest } from "@/modules/middlewares/auth.middleware";
import * as gamificationService from "@/modules/services/gamification.service";
import {
  completeLessonSchema,
  flashcardReviewSchema,
  purchaseSchema,
  updateAvatarSchema,
  updateChildProfileSchema,
} from "@/modules/utils/validators";

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
    return errorResponse(error, "Erro");
  }
}

export async function handleGetLesson(request: NextRequest, lessonSlug: string) {
  try {
    const childProfileId = await getChildId(request);
    const data = await gamificationService.getLessonDetail(childProfileId, lessonSlug);
    return jsonSuccess(data);
  } catch (error) {
    return errorResponse(error, "Erro", 404);
  }
}

export async function handleCompleteLesson(request: NextRequest, lessonSlug: string) {
  try {
    const childProfileId = await getChildId(request);
    const { score, timeSpentSeconds } = completeLessonSchema.parse(await request.json());
    const result = await gamificationService.completeLesson(
      childProfileId,
      lessonSlug,
      score,
      timeSpentSeconds
    );
    return jsonSuccess(result, 200, "Lição concluída! Parabéns! 🎉");
  } catch (error) {
    return errorResponse(error, "Erro", 400);
  }
}

export async function handleGetRanking(request: NextRequest) {
  try {
    const childProfileId = await getChildId(request);
    const period = (request.nextUrl.searchParams.get("period") ?? "alltime") as "weekly" | "alltime";
    const ranking = await gamificationService.getRankingForChild(childProfileId, period);
    return jsonSuccess({ ranking, period });
  } catch (error) {
    return errorResponse(error, "Erro", 403);
  }
}

export async function handleGetShop(request: NextRequest) {
  try {
    const childProfileId = await getChildId(request);
    const shop = await gamificationService.getShopItems(childProfileId);
    return jsonSuccess(shop);
  } catch (error) {
    return errorResponse(error, "Erro", 403);
  }
}

export async function handlePurchaseReward(
  request: NextRequest,
  body?: { rewardSlug?: string }
) {
  try {
    const childProfileId = await getChildId(request);
    const payload = purchaseSchema.safeParse(body ?? (await request.json()));
    if (!payload.success || !payload.data.rewardSlug) {
      return jsonError("Recompensa inválida", 400);
    }
    const result = await gamificationService.purchaseReward(
      childProfileId,
      payload.data.rewardSlug
    );
    return jsonSuccess(result, 200, "Compra realizada!");
  } catch (error) {
    return errorResponse(error, "Erro", 400);
  }
}

export async function handlePurchaseAvatarItem(
  request: NextRequest,
  body?: { itemSlug?: string }
) {
  try {
    const childProfileId = await getChildId(request);
    const payload = purchaseSchema.safeParse(body ?? (await request.json()));
    if (!payload.success || !payload.data.itemSlug) {
      return jsonError("Item inválido", 400);
    }
    const result = await gamificationService.purchaseAvatarItem(
      childProfileId,
      payload.data.itemSlug
    );
    return jsonSuccess(result, 200, "Item desbloqueado!");
  } catch (error) {
    return errorResponse(error, "Erro", 400);
  }
}

export async function handleGetAvatar(request: NextRequest) {
  try {
    const childProfileId = await getChildId(request);
    const data = await gamificationService.getAvatarCustomization(childProfileId);
    return jsonSuccess(data);
  } catch (error) {
    return errorResponse(error, "Erro", 403);
  }
}

export async function handleUpdateAvatar(request: NextRequest) {
  try {
    const childProfileId = await getChildId(request);
    const parsed = updateAvatarSchema.safeParse(await request.json());
    if (!parsed.success) return jsonError("Dados do avatar inválidos", 400);
    const data = await gamificationService.updateAvatar(childProfileId, parsed.data);
    return jsonSuccess(data, 200, "Avatar atualizado!");
  } catch (error) {
    return errorResponse(error, "Erro", 400);
  }
}

export async function handleUpdateChildProfile(request: NextRequest) {
  try {
    const childProfileId = await getChildId(request);
    const parsed = updateChildProfileSchema.safeParse(await request.json());
    if (!parsed.success) {
      return jsonError(parsed.error.issues.map((i) => i.message).join(" · "), 400);
    }
    const data = await gamificationService.updateChildProfile(childProfileId, parsed.data);
    return jsonSuccess(data, 200, "Perfil atualizado!");
  } catch (error) {
    return errorResponse(error, "Erro", 400);
  }
}

export async function handleGetDailyFlashcards(request: NextRequest) {
  try {
    const childProfileId = await getChildId(request);
    const { getDailyFlashcardSession } = await import("@/modules/services/flashcard.service");
    const session = await getDailyFlashcardSession(childProfileId);
    return jsonSuccess(session);
  } catch (error) {
    return errorResponse(error, "Erro", 400);
  }
}

export async function handleReviewFlashcard(request: NextRequest) {
  try {
    const childProfileId = await getChildId(request);
    const parsed = flashcardReviewSchema.safeParse(await request.json());
    if (!parsed.success) return jsonError("Dados inválidos", 400);
    const { cardId, rating } = parsed.data;
    const { reviewFlashcard } = await import("@/modules/services/flashcard.service");
    const result = await reviewFlashcard(childProfileId, cardId, rating);
    return jsonSuccess(result);
  } catch (error) {
    return errorResponse(error, "Erro", 400);
  }
}
