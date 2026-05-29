import Link from "next/link";
import { Rabbit } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section
      className="mx-4 mb-16 rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-speakup-green-soft/80 via-card to-speakup-yellow-soft/40 p-8 md:mx-auto md:max-w-6xl md:p-12"
      aria-labelledby="cta-heading"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2 id="cta-heading" className="font-display text-3xl font-bold md:text-4xl">
          Pronto para o primeiro &quot;Hello&quot;?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Crie sua conta em menos de 2 minutos. Sem cartão de crédito no plano inicial.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
          <Button size="lg" asChild>
            <Link href="/register">Criar conta grátis</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/login/parent">Já tenho conta</Link>
          </Button>
          <Button size="lg" variant="child" asChild className="sm:min-w-[220px]">
            <Link href="/login/child">
              <Rabbit className="h-5 w-5" aria-hidden />
              Área da criança
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
