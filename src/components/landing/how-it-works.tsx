import { KeyRound, Sprout, UserPlus, type LucideIcon } from "lucide-react";
import { SectionHeading } from "./section-heading";

const steps: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: UserPlus,
    title: "Você cria a conta",
    text: "Leva uns dois minutos. Depois cadastre a criança e escolha um PIN de 4 números para ela.",
  },
  {
    icon: KeyRound,
    title: "A criança entra",
    text: "Com o seu e-mail, o usuário dela e o PIN. Botões grandes e telas calmas desde o primeiro toque.",
  },
  {
    icon: Sprout,
    title: "Um pouquinho por dia",
    text: "Uma lição curta por dia já faz diferença. A trilha mostra sempre qual é a próxima.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-4 py-16 md:py-24" aria-labelledby="how-heading">
      <SectionHeading id="how-heading" eyebrow="Começar é fácil" title="Como funciona" />
      <ol className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
        {steps.map(({ icon: Icon, title, text }, i) => (
          <li key={title} className="relative flex flex-col items-center text-center">
            <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_6px_0_hsl(var(--primary-shadow))]">
              <Icon className="h-9 w-9" strokeWidth={2.3} aria-hidden />
              <span className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-background bg-accent font-display text-sm font-bold text-accent-foreground">
                {i + 1}
              </span>
            </span>
            <h3 className="mt-5 font-display text-xl font-bold">{title}</h3>
            <p className="mt-1 max-w-xs text-muted-foreground">{text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
