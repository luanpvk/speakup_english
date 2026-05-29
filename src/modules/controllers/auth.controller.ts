import { NextRequest } from "next/server";
import { setAuthCookies, clearAuthCookies, getRefreshTokenFromCookies } from "@/lib/auth/cookies";
import { jsonSuccess, jsonError } from "@/modules/utils/api-response";
import {
  registerParentSchema,
  loginParentSchema,
  loginChildSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/modules/utils/validators";
import * as authService from "@/modules/services/auth.service";
import { authenticateRequest } from "@/modules/middlewares/auth.middleware";

export async function handleRegister(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerParentSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Dados inválidos", 400);
    }

    const result = await authService.registerParent(parsed.data);
    await setAuthCookies(result.accessToken, result.refreshToken);

    return jsonSuccess({ user: result.user }, 201, "Conta criada com sucesso");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao registrar";
    return jsonError(message, 400);
  }
}

export async function handleLoginParent(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginParentSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Dados inválidos", 400);
    }

    const result = await authService.loginParent(parsed.data);
    await setAuthCookies(result.accessToken, result.refreshToken);

    return jsonSuccess({ user: result.user }, 200, "Login realizado");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao entrar";
    return jsonError(message, 401);
  }
}

export async function handleLoginChild(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginChildSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Dados inválidos", 400);
    }

    const result = await authService.loginChild(parsed.data);
    await setAuthCookies(result.accessToken, result.refreshToken);

    return jsonSuccess({ user: result.user }, 200, "Bem-vindo de volta!");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao entrar";
    return jsonError(message, 401);
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
    await clearAuthCookies();
    const message = error instanceof Error ? error.message : "Sessão inválida";
    return jsonError(message, 401);
  }
}

export async function handleLogout() {
  const refreshToken = await getRefreshTokenFromCookies();
  await authService.logoutUser(refreshToken);
  await clearAuthCookies();
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
  } catch {
    return jsonError("Não autenticado", 401);
  }
}

export async function handleForgotPassword(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Dados inválidos", 400);
    }

    const result = await authService.forgotPassword(parsed.data.email);
    return jsonSuccess(
      {
        message: "Se o e-mail existir, você receberá instruções em breve.",
        devResetToken: result.resetToken,
      },
      200
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao processar";
    return jsonError(message, 400);
  }
}

export async function handleResetPassword(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Dados inválidos", 400);
    }

    await authService.resetPassword(parsed.data.token, parsed.data.password);
    return jsonSuccess({ ok: true }, 200, "Senha atualizada");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao redefinir senha";
    return jsonError(message, 400);
  }
}
