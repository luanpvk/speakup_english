import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="px-4 pb-20 pt-4" aria-labelledby="cta-heading">
      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-6 overflow-hidden rounded-[2rem] bg-[hsl(var(--primary-shadow))] px-6 py-12 text-center text-white md:flex-row md:px-12 md:text-left">
        <Image src="/mascot.png" alt="" width={180} height={180} className="shrink-0 animate-float-gentle" />
        <div className="flex-1">
          <h2 id="cta-heading" className="font-display text-3xl font-bold md:text-4xl">
            Bora para o primeiro &quot;Hello&quot;?
          </h2>
          <p className="mt-2 text-lg text-white/90">
            Criar a conta leva uns dois minutinhos. Depois é só chamar a criança e começar.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
            <Button size="lg" variant="accent" asChild>
              <Link href="/register">
                Criar conta grátis
                <ArrowRight className="h-5 w-5" aria-hidden />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white/40 bg-transparent text-white hover:bg-white/10">
              <Link href="/login/child">Entrar como criança</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
