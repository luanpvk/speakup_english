"use client";

import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useThemeStore } from "@/store/theme-store";
import { useAuthStore } from "@/store/auth-store";
import { authApi } from "@/services/auth.service";

function ThemeSync() {
  const applyToDocument = useThemeStore((s) => s.applyToDocument);

  useEffect(() => {
    applyToDocument();
  }, [applyToDocument]);

  return null;
}

async function resolveSession() {
  const me = await authApi.me();
  if (me.success && me.data?.user) {
    return me.data.user;
  }

  const refreshed = await authApi.refresh();
  if (!refreshed.success) {
    return null;
  }

  const retry = await authApi.me();
  if (retry.success && retry.data?.user) {
    return retry.data.user;
  }

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
      <NextThemesProvider attribute="class" defaultTheme="light" enableSystem>
        <ThemeSync />
        <AuthBootstrap />
        {children}
      </NextThemesProvider>
    </QueryClientProvider>
  );
}
