import { NextRequest } from "next/server";
import { jsonSuccess, jsonError, errorResponse } from "@/modules/utils/api-response";
import { authenticateRequest } from "@/modules/middlewares/auth.middleware";
import { registerChildSchema } from "@/modules/utils/validators";
import * as parentService from "@/modules/services/parent.service";
import { rateLimit, HOUR } from "@/modules/middlewares/rate-limit";

function requireParent(request: NextRequest) {
  const tokenUser = authenticateRequest(request);
  if (tokenUser.role !== "parent") {
    throw new Error("Acesso apenas para responsáveis");
  }
  return tokenUser.userId;
}

export async function handleListChildren(request: NextRequest) {
  try {
    const parentUserId = requireParent(request);
    const children = await parentService.getChildrenForParent(parentUserId);
    return jsonSuccess({ children });
  } catch (error) {
    return errorResponse(error, "Erro");
  }
}

export async function handleCreateChild(request: NextRequest) {
  try {
    const parentUserId = requireParent(request);
    const limited = await rateLimit([
      { key: `create-child:${parentUserId}`, limit: 20, windowSeconds: HOUR },
    ]);
    if (limited) return limited;
    const body = await request.json();
    const parsed = registerChildSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues.map((i) => i.message).join(" · ") || "Dados inválidos", 400);
    }

    const child = await parentService.createChildForParent(parentUserId, {
      displayName: parsed.data.displayName,
      username: parsed.data.username,
      pin: parsed.data.pin,
      avatarEmoji: parsed.data.avatarEmoji,
      hyperfocus: parsed.data.hyperfocus,
      birthYear: parsed.data.birthYear,
    });

    return jsonSuccess({ child }, 201, "Perfil infantil criado com sucesso!");
  } catch (error) {
    return errorResponse(error, "Erro ao cadastrar", 400);
  }
}
