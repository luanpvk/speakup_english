"use client";

import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";

/** Indica fetch/mutation em curso ou bootstrap de sessão. */
export function useAppLoadingActive(): boolean {
  const authLoading = useAuthStore((s) => s.isLoading);
  const fetching = useIsFetching();
  const mutating = useIsMutating();
  return authLoading || fetching > 0 || mutating > 0;
}
