"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAppLoadingActive } from "@/hooks/use-app-loading";

const MIN_ROUTE_MS = 380;

/** Loading de rede + transição entre páginas (para a barra do header). */
export function useNavigationLoading(): boolean {
  const pathname = usePathname();
  const appLoading = useAppLoadingActive();
  const [routeLoading, setRouteLoading] = useState(false);

  useEffect(() => {
    setRouteLoading(true);
    const t = window.setTimeout(() => setRouteLoading(false), MIN_ROUTE_MS);
    return () => window.clearTimeout(t);
  }, [pathname]);

  return appLoading || routeLoading;
}
