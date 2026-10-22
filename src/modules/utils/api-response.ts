import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types";

export function jsonSuccess<T>(
  data: T,
  status = 200,
  message?: string
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data, message }, { status });
}

export function jsonError(
  error: string,
  status = 400
): NextResponse<ApiResponse> {
  return NextResponse.json({ success: false, error }, { status });
}

/**
 * Mensagem segura para o cliente: só repassa erros de negócio (Error simples, em português).
 * Erros internos (Mongo, JWT, JSON inválido...) viram uma mensagem genérica e vão para o log.
 */
export function safeErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.name === "TokenExpiredError") {
    return "Sessão expirada. Entre novamente.";
  }
  if (error instanceof Error && error.constructor === Error) {
    return error.message;
  }
  console.error(error);
  return fallback;
}

const AUTH_ERRORS = new Set(["TokenExpiredError", "JsonWebTokenError", "NotBeforeError"]);

/**
 * Resposta de erro com o status certo: 401 para token ausente/expirado (o cliente renova a sessão
 * e repete o pedido), 403 para acesso negado, e o status informado para o resto.
 */
export function errorResponse(error: unknown, fallback: string, status = 400) {
  if (error instanceof Error && (AUTH_ERRORS.has(error.name) || error.message === "Não autenticado")) {
    return jsonError("Sessão expirada. Entre novamente.", 401);
  }
  const message = safeErrorMessage(error, fallback);
  return jsonError(message, message.includes("Acesso") ? 403 : status);
}
