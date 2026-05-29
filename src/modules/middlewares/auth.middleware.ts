import { NextRequest } from "next/server";
import { verifyAccessToken, type TokenUser } from "@/lib/auth/jwt";
import { ACCESS_COOKIE } from "@/lib/auth/constants";

export function getTokenFromRequest(request: NextRequest): string | null {
  const bearer = request.headers.get("authorization");
  if (bearer?.startsWith("Bearer ")) {
    return bearer.slice(7);
  }
  return request.cookies.get(ACCESS_COOKIE)?.value ?? null;
}

export function authenticateRequest(request: NextRequest): TokenUser {
  const token = getTokenFromRequest(request);
  if (!token) {
    throw new Error("Não autenticado");
  }
  return verifyAccessToken(token);
}

export function requireRole(user: TokenUser, roles: TokenUser["role"][]): void {
  if (!roles.includes(user.role)) {
    throw new Error("Acesso negado");
  }
}
