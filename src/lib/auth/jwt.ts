import jwt, { type SignOptions } from "jsonwebtoken";

/** Algoritmo fixo: impede tokens forjados com "none" ou outro algoritmo */
const ALGORITHM = "HS256" as const;
import type { JwtPayload, UserRole } from "@/types";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? "";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? "";
const ACCESS_EXPIRES = (process.env.JWT_ACCESS_EXPIRES_IN ?? "15m") as SignOptions["expiresIn"];
const REFRESH_EXPIRES = (process.env.JWT_REFRESH_EXPIRES_IN ?? "7d") as SignOptions["expiresIn"];

export interface TokenUser {
  userId: string;
  email: string;
  role: UserRole;
  childProfileId?: string;
}

export function signAccessToken(payload: TokenUser): string {
  if (!ACCESS_SECRET) throw new Error("JWT_ACCESS_SECRET is not configured");
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES, algorithm: ALGORITHM });
}

export function signRefreshToken(payload: TokenUser & { tokenId: string }): string {
  if (!REFRESH_SECRET) throw new Error("JWT_REFRESH_SECRET is not configured");
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES, algorithm: ALGORITHM });
}

export function verifyAccessToken(token: string): TokenUser {
  if (!ACCESS_SECRET) throw new Error("JWT_ACCESS_SECRET is not configured");
  return jwt.verify(token, ACCESS_SECRET, { algorithms: [ALGORITHM] }) as TokenUser;
}

export function verifyRefreshToken(token: string): TokenUser & { tokenId: string } {
  if (!REFRESH_SECRET) throw new Error("JWT_REFRESH_SECRET is not configured");
  return jwt.verify(token, REFRESH_SECRET, { algorithms: [ALGORITHM] }) as TokenUser & {
    tokenId: string;
  };
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch {
    return null;
  }
}
