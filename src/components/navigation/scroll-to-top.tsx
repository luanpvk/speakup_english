"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Rola para o topo sempre que a rota muda. */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
