import mongoose from "mongoose";
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { RateLimit } from "@/modules/repositories/models";
import { jsonError } from "@/modules/utils/api-response";

/**
 * IP do cliente. shortcut: x-forwarded-for só é confiável atrás de um proxy que o reescreve
 * (Vercel, Nginx, Cloudflare); exposto direto na internet, o atacante pode trocar o IP a cada pedido.
 */
export function clientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

async function hit(key: string, windowSeconds: number): Promise<number> {
  await connectDB();
  const now = new Date();
  const current = await RateLimit.findOneAndUpdate(
    { key, expiresAt: mongoose.trusted({ $gt: now }) },
    { $inc: { count: 1 } },
    { returnDocument: "after" }
  ).lean();
  if (current) return current.count;

  try {
    await RateLimit.updateOne(
      { key },
      { $set: { count: 1, expiresAt: new Date(now.getTime() + windowSeconds * 1000) } },
      { upsert: true }
    );
  } catch {
    // corrida entre dois pedidos simultâneos criando a mesma janela: o outro já criou
  }
  return 1;
}

/**
 * Conta um pedido para cada chave; devolve resposta 429 se alguma passou do limite, senão null.
 * Uso: `const limited = await rateLimit([...]); if (limited) return limited;`
 */
export async function rateLimit(
  rules: { key: string; limit: number; windowSeconds: number }[]
) {
  for (const rule of rules) {
    const count = await hit(rule.key, rule.windowSeconds);
    if (count > rule.limit) {
      return jsonError("Muitas tentativas. Aguarde alguns minutos e tente de novo.", 429);
    }
  }
  return null;
}

export const MINUTE = 60;
export const HOUR = 60 * 60;
