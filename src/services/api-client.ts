import type { ApiResponse } from "@/types";

/**
 * Cliente único das APIs. O token de acesso dura 15 min; quando um pedido volta 401,
 * renovamos a sessão com o refresh token (cookie httpOnly) e repetimos o pedido uma vez.
 */

/** Rotas que não devem disparar renovação (evita laço infinito) */
const NO_REFRESH = ["/api/auth/refresh", "/api/auth/login", "/api/auth/register", "/api/auth/logout"];

type RefreshResult = "ok" | "expired" | "offline";

let refreshing: Promise<RefreshResult> | null = null;
let lastRefreshAt = 0;
let sessionLost = false;
const sessionLostListeners = new Set<() => void>();

/** Avisa a UI quando a sessão acabou de vez (o refresh token também foi recusado) */
export function onSessionLost(listener: () => void) {
  sessionLostListeners.add(listener);
  return () => sessionLostListeners.delete(listener);
}

/**
 * Renova a sessão; pedidos simultâneos compartilham a mesma renovação.
 * "offline" (sem internet, servidor fora) não desloga: só "expired" (recusado pelo servidor).
 */
export function refreshSession(): Promise<RefreshResult> {
  refreshing ??= fetch("/api/auth/refresh", { method: "POST", credentials: "include" })
    .then((res): RefreshResult => {
      if (res.ok) {
        lastRefreshAt = Date.now();
        sessionLost = false;
        return "ok";
      }
      return res.status === 401 ? "expired" : "offline";
    })
    .catch((): RefreshResult => "offline")
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

/** Chamado quando há usuário logado: permite avisar de novo numa próxima perda de sessão */
export function markSessionActive() {
  sessionLost = false;
}

export function msSinceLastRefresh() {
  return Date.now() - lastRefreshAt;
}

/** Dispara o aviso uma vez só, mesmo se vários pedidos falharem juntos */
function notifySessionLost() {
  if (sessionLost) return;
  sessionLost = true;
  sessionLostListeners.forEach((listener) => listener());
}

async function send(url: string, options?: RequestInit) {
  return fetch(url, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
}

export async function apiFetch<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    let res = await send(url, options);

    if (res.status === 401 && !NO_REFRESH.some((path) => url.startsWith(path))) {
      const result = await refreshSession();
      if (result === "ok") {
        res = await send(url, options);
      } else if (result === "expired") {
        notifySessionLost();
      }
    }

    const data = (await res.json().catch(() => ({}))) as ApiResponse<T>;
    if (!res.ok && !data.error) {
      return { success: false, error: `Erro do servidor (${res.status})` };
    }
    return data;
  } catch {
    return { success: false, error: "Não foi possível conectar ao servidor" };
  }
}
