import { BadgeCheck, EyeOff, KeyRound, LockKeyhole, Users, type LucideIcon } from "lucide-react";

const points: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: KeyRound,
    title: "Entrada protegida",
    text: "A criança entra com o seu e-mail, o usuário dela e um PIN. Depois de 5 PINs errados, o login pausa por 15 minutos.",
  },
  {
    icon: EyeOff,
    title: "Sem anúncios",
    text: "Nenhuma propaganda e nenhum link para fora no meio das lições.",
  },
  {
    icon: LockKeyhole,
    title: "Dados guardados com cuidado",
    text: "Senhas e PINs ficam criptografados. Pedimos só o necessário: apelido, usuário e o progresso.",
  },
  {
    icon: Users,
    title: "Vários filhos, uma conta",
    text: "Crie um perfil para cada criança e acompanhe o nível e o XP de cada uma.",
  },
];

export function ParentsSection() {
  return (
    <section className="bg-fade-muted px-4 py-16 md:py-24" aria-labelledby="parents-heading">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="text-center lg:text-left">
          <p className="text-sm font-bold uppercase tracking-wider text-primary">Para os pais</p>
          <h2 id="parents-heading" className="mt-1 font-display text-3xl font-bold text-balance md:text-4xl">
            Um lugar seguro para ela estudar sozinha
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Você cria a conta e os perfis. A criança só vê a área dela, feita para ser usada sem ajuda.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 font-semibold text-primary">
            <BadgeCheck className="h-5 w-5" aria-hidden />
            Você controla os dados do seu filho
          </p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {points.map(({ icon: Icon, title, text }) => (
            <li key={title} className="rounded-3xl border-2 border-border bg-card p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Icon className="h-6 w-6" strokeWidth={2.4} aria-hidden />
              </span>
              <h3 className="mt-3 font-display text-lg font-bold">{title}</h3>
              <p className="text-sm text-muted-foreground">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
