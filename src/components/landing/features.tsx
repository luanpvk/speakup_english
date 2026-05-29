import { Gamepad2, LineChart, Users, Volume2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Gamepad2,
    title: "Gamificação suave",
    description:
      "XP, níveis e streaks sem pressão excessiva — celebração positiva e ritmo adaptável.",
    color: "text-speakup-yellow",
    bg: "bg-speakup-yellow-soft",
  },
  {
    icon: LineChart,
    title: "Progresso claro",
    description:
      "Pais acompanham evolução em tempo real com gráficos simples e objetivos diários.",
    color: "text-primary",
    bg: "bg-speakup-green-soft",
  },
  {
    icon: Users,
    title: "Perfis separados",
    description:
      "Login infantil com PIN e painel dos responsáveis — cada um na sua interface.",
    color: "text-secondary",
    bg: "bg-speakup-purple-soft",
  },
  {
    icon: Volume2,
    title: "Áudio opcional",
    description:
      "Controle total de sons e animações para quem prefere ambientes mais calmos.",
    color: "text-primary",
    bg: "bg-speakup-green-soft",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="px-4 py-16 md:py-24"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2
            id="features-heading"
            className="font-display text-3xl font-bold md:text-4xl"
          >
            Feito para aprender com alegria
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Tudo que uma plataforma educacional moderna precisa — sem poluir a tela.
          </p>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <li key={feature.title}>
              <Card className="h-full border-2 transition-shadow hover:shadow-md">
                <CardHeader>
                  <span
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg}`}
                    aria-hidden
                  >
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </span>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
