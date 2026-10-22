"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { ErrorScreen } from "@/components/layout/error-screen";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/utils/constants";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorScreen
      title="Algo deu errado por aqui"
      text="A página tropeçou e não carregou direito. Tente de novo; se continuar, volte ao início e entre outra vez."
    >
      <Button size="lg" onClick={reset}>
        <RotateCcw className="h-4 w-4" aria-hidden />
        Tentar de novo
      </Button>
      <Button asChild size="lg" variant="outline">
        <Link href={ROUTES.home}>Voltar ao início</Link>
      </Button>
    </ErrorScreen>
  );
}
