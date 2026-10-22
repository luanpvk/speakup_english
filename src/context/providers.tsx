"use client";

import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useThemeStore } from "@/store/theme-store";
import { useAuthStore } from "@/store/auth-store";
import { authApi } from "@/services/auth.service";
import { markSessionActive, msSinceLastRefresh, onSessionLost, refreshSession } from "@/services/api-client";
import { toast } from "@/store/toast-store";
import { Toaster } from "@/components/ui/toaster";

function ThemeSync() {
  const applyToDocument = useThemeStore((s) => s.applyToDocument);

  useEffect(() => {
    applyToDocument();
  }, [applyToDocument]);

  return null;
}

async function resolveSession() {
  // apiFetch já renova a sessão sozinho se o token de acesso tiver expirado
  const me = await authApi.me();
  return me.success && me.data?.user ? me.data.user : null;
}

/** Renova antes do token de acesso (15 min) expirar */
const KEEP_ALIVE_MS = 10 * 60_000;

/** Mantém a sessão viva enquanto a aba está aberta e avisa se ela acabar de vez */
function SessionKeeper() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    if (!user) return;
    markSessionActive();

    const interval = window.setInterval(() => void refreshSession(), KEEP_ALIVE_MS);
    // Ao voltar para a aba (ex.: computador dormiu), renova se já passou do ponto
    const onVisible = () => {
      if (document.visibilityState === "visible" && msSinceLastRefresh() > KEEP_ALIVE_MS) {
        void refreshSession();
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    const stopListening = onSessionLost(() => {
      setUser(null);
      toast.warning("Sua sessão acabou", "Entre de novo para continuar de onde parou.");
    });

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
      stopListening();
    };
  }, [user, setUser]);

  return null;
}

function AuthBootstrap() {
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const user = await resolveSession();
        if (cancelled) return;

        if (user) {
          setUser(user);
          return;
        }

        // Não apagar usuário já definido por login (corrida com bootstrap anterior)
        const existing = useAuthStore.getState().user;
        if (!existing) {
          setUser(null);
        } else {
          setLoading(false);
        }
      } catch {
        if (cancelled) return;
        const existing = useAuthStore.getState().user;
        if (!existing) {
          setUser(null);
        } else {
          setLoading(false);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [setUser, setLoading]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeSync />
      <AuthBootstrap />
      <SessionKeeper />
      {children}
      <Toaster />
    </QueryClientProvider>
  );
}
