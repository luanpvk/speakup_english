"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth-store";

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isLoading, setUser, logout: clearUser } = useAuthStore();

  const loginParent = useMutation({
    mutationFn: authApi.loginParent,
    onSuccess: (res) => {
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        queryClient.invalidateQueries();
        router.push("/dashboard");
      }
    },
  });

  const loginChild = useMutation({
    mutationFn: authApi.loginChild,
    onSuccess: (res) => {
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        router.push("/dashboard");
      }
    },
  });

  const register = useMutation({
    mutationFn: authApi.register,
    onSuccess: (res) => {
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        router.push("/dashboard");
      }
    },
  });

  const logout = useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      // Navegação completa: o painel não chega a ver o usuário nulo e disputar o redirecionamento
      window.location.replace("/");
    },
  });

  /** Encerra sessão sem redirecionar (ex.: trocar para login infantil) */
  const logoutSilent = async () => {
    try {
      await authApi.logout();
    } catch {
      // cookies podem já estar inválidos
    }
    clearUser();
    queryClient.clear();
  };

  return {
    user,
    isLoading,
    isAuthenticated: Boolean(user),
    loginParent,
    loginChild,
    register,
    logout,
    logoutSilent,
  };
}
