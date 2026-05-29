import { UserPlus, KeyRound, TrendingUp } from "lucide-react";

const steps = [
  {
    step: "1",
    icon: UserPlus,
    title: "Cadastre-se como responsável",
    description: "Crie sua conta e configure o perfil da criança com PIN seguro.",
  },
  {
    step: "2",
    icon: KeyRound,
    title: "A criança entra na área kids",
    description: "Interface grande, colorida e calma — login com usuário e PIN de 4 dígitos.",
  },
  {
    step: "3",
    icon: TrendingUp,
    title: "Aprenda e acompanhe",
    description: "Lições curtas, streak gentil e painel para pais verem o progresso.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-muted/30 px-4 py-16 md:py-24"
      aria-labelledby="how-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 id="how-heading" className="font-display text-3xl font-bold md:text-4xl">
            Como funciona
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Três passos simples para começar a jornada em inglês.
          </p>
        </div>
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((item) => (
            <li
              key={item.step}
              className="relative rounded-2xl border-2 border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-display text-lg font-bold text-primary-foreground"
                  aria-hidden
                >
                  {item.step}
                </span>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-speakup-green-soft">
                  <item.icon className="h-5 w-5 text-primary" aria-hidden />
                </span>
              </div>
              <h3 className="mt-4 font-display text-xl font-bold">{item.title}</h3>
              <p className="mt-2 text-muted-foreground">{item.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
