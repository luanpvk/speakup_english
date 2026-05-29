"use client";

import { TopLoadingBar } from "@/components/ui/top-loading-bar";
import { useAppLoadingActive } from "@/hooks/use-app-loading";

/** Barra global (login, páginas sem header infantil). */
export function GlobalLoading() {
  const active = useAppLoadingActive();
  return <TopLoadingBar active={active} placement="fixed" />;
}
