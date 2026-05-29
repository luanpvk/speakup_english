import { NextRequest } from "next/server";
import { jsonSuccess, jsonError } from "@/modules/utils/api-response";
import { authenticateRequest } from "@/modules/middlewares/auth.middleware";
import { registerChildSchema } from "@/modules/utils/validators";
import * as parentService from "@/modules/services/parent.service";

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
    const message = error instanceof Error ? error.message : "Erro";
    const status = message.includes("Acesso") ? 403 : 400;
    return jsonError(message, status);
  }
}

export async function handleCreateChild(request: NextRequest) {
  try {
    const parentUserId = requireParent(request);
    const body = await request.json();
    const parsed = registerChildSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Dados inválidos", 400);
    }

    const child = await parentService.createChildForParent(parentUserId, {
      displayName: parsed.data.displayName,
      username: parsed.data.username,
      pin: parsed.data.pin,
      avatarEmoji: parsed.data.avatarEmoji,
      birthYear: parsed.data.birthYear,
    });

    return jsonSuccess({ child }, 201, "Perfil infantil criado com sucesso!");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao cadastrar";
    return jsonError(message, 400);
  }
}
