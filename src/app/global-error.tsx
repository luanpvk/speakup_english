"use client";

import "@/styles/globals.css";
import { ErrorScreen } from "@/components/layout/error-screen";
import { Button } from "@/components/ui/button";

// Só aparece se o próprio layout raiz quebrar: precisa do <html> e <body> próprios
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-background text-foreground">
        <ErrorScreen
          title="O SpeakUp não conseguiu abrir"
          text="Tivemos um problema sério ao carregar o site. Espere um instante e tente de novo."
        >
          <Button size="lg" onClick={reset}>
            Tentar de novo
          </Button>
        </ErrorScreen>
      </body>
    </html>
  );
}
