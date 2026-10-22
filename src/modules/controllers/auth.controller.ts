import { NextRequest } from "next/server";
import { setAuthCookies, clearAuthCookies, getRefreshTokenFromCookies } from "@/lib/auth/cookies";
import { jsonSuccess, jsonError, errorResponse } from "@/modules/utils/api-response";
import {
  registerParentSchema,
  loginParentSchema,
  loginChildSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/modules/utils/validators";
import * as authService from "@/modules/services/auth.service";
import { authenticateRequest } from "@/modules/middlewares/auth.middleware";
import { clientIp, rateLimit, MINUTE, HOUR } from "@/modules/middlewares/rate-limit";

export async function handleRegister(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerParentSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues.map((i) => i.message).join(" · ") || "Dados inválidos", 400);
    }

    const limited = await rateLimit([
      { key: `register:${clientIp(request)}`, limit: 5, windowSeconds: HOUR },
    ]);
    if (limited) return limited;

    const result = await authService.registerParent(parsed.data);
    await setAuthCookies(result.accessToken, result.refreshToken);

    return jsonSuccess({ user: result.user }, 201, "Conta criada com sucesso");
  } catch (error) {
    return errorResponse(error, "Erro ao registrar", 400);
  }
}

export async function handleLoginParent(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginParentSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues.map((i) => i.message).join(" · ") || "Dados inválidos", 400);
    }

    // Por conta (senha adivinhada de vários IPs) e por IP (várias contas de um IP)
    const limited = await rateLimit([
      { key: `login-parent:${parsed.data.email.toLowerCase()}`, limit: 10, windowSeconds: 15 * MINUTE },
      { key: `login-parent-ip:${clientIp(request)}`, limit: 30, windowSeconds: 15 * MINUTE },
    ]);
    if (limited) return limited;

    const result = await authService.loginParent(parsed.data);
    await setAuthCookies(result.accessToken, result.refreshToken);

    return jsonSuccess({ user: result.user }, 200, "Login realizado");
  } catch (error) {
    return errorResponse(error, "Erro ao entrar", 401);
  }
}

export async function handleLoginChild(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginChildSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues.map((i) => i.message).join(" · ") || "Dados inválidos", 400);
    }

    const limited = await rateLimit([
      { key: `login-child-ip:${clientIp(request)}`, limit: 30, windowSeconds: 15 * MINUTE },
    ]);
    if (limited) return limited;

    const result = await authService.loginChild(parsed.data);
    await setAuthCookies(result.accessToken, result.refreshToken);

    return jsonSuccess({ user: result.user }, 200, "Bem-vindo de volta!");
  } catch (error) {
    return errorResponse(error, "Erro ao entrar", 401);
  }
}

export async function handleRefresh() {
  try {
    const refreshToken = await getRefreshTokenFromCookies();
    if (!refreshToken) {
      return jsonError("Sessão expirada", 401);
    }

    const result = await authService.refreshSession(refreshToken);
    await setAuthCookies(result.accessToken, result.refreshToken);

    return jsonSuccess({ ok: true }, 200);
  } catch (error) {
    const invalidToken =
      error instanceof Error &&
      (error.message === "Sessão expirada" ||
        error.name === "JsonWebTokenError" ||
        error.name === "TokenExpiredError");
    if (!invalidToken) {
      // Banco fora do ar etc.: mantém os cookies para tentar de novo depois
      console.error(error);
      return jsonError("Não foi possível renovar a sessão agora", 503);
    }
    await clearAuthCookies();
    return jsonError("Sessão expirada. Entre novamente.", 401);
  }
}

export async function handleLogout() {
  const refreshToken = await getRefreshTokenFromCookies();
  try {
    await authService.logoutUser(refreshToken);
  } finally {
    // Mesmo se o banco falhar, a sessão do navegador precisa acabar
    await clearAuthCookies();
  }
  return jsonSuccess({ ok: true }, 200, "Logout realizado");
}

export async function handleMe(request: NextRequest) {
  try {
    const tokenUser = authenticateRequest(request);
    const user = await authService.getCurrentUser(tokenUser.userId);
    if (!user) {
      return jsonError("Usuário não encontrado", 404);
    }
    return jsonSuccess({ user });
  } catch (error) {
    return errorResponse(error, "Não foi possível carregar sua conta", 503);
  }
}

export async function handleForgotPassword(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues.map((i) => i.message).join(" · ") || "Dados inválidos", 400);
    }

    const limited = await rateLimit([
      { key: `forgot:${clientIp(request)}`, limit: 5, windowSeconds: HOUR },
      { key: `forgot-email:${parsed.data.email.toLowerCase()}`, limit: 3, windowSeconds: HOUR },
    ]);
    if (limited) return limited;

    const result = await authService.forgotPassword(parsed.data.email);
    return jsonSuccess(
      {
        message: "Se o e-mail existir, você receberá instruções em breve.",
        devResetToken: result.resetToken,
      },
      200
    );
  } catch (error) {
    return errorResponse(error, "Erro ao processar", 400);
  }
}

export async function handleResetPassword(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues.map((i) => i.message).join(" · ") || "Dados inválidos", 400);
    }

    const limited = await rateLimit([
      { key: `reset:${clientIp(request)}`, limit: 10, windowSeconds: HOUR },
    ]);
    if (limited) return limited;

    await authService.resetPassword(parsed.data.token, parsed.data.password);
    return jsonSuccess({ ok: true }, 200, "Senha atualizada");
  } catch (error) {
    return errorResponse(error, "Erro ao redefinir senha", 400);
  }
}
