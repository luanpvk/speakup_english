import { BookOpen, Gamepad2, Heart, Layers, LineChart, ShoppingBag, type LucideIcon } from "lucide-react";
import { SectionHeading } from "./section-heading";

const features: { icon: LucideIcon; title: string; text: string; tile: string }[] = [
  {
    icon: BookOpen,
    title: "Lições de 10 minutos",
    text: "História, palavras novas, um joguinho e um desafio. Curto o bastante para não cansar.",
    tile: "bg-primary/15 text-primary",
  },
  {
    icon: Gamepad2,
    title: "Joguinhos de verdade",
    text: "Memória, ligar pares, encaixar palavras e montar frases. Dá até para arrastar com o dedo.",
    tile: "bg-sky-500/15 text-sky-500",
  },
  {
    icon: Layers,
    title: "Flashcards todo dia",
    text: "As palavras voltam na hora certa para não serem esquecidas, um pouquinho por dia.",
    tile: "bg-secondary/15 text-secondary",
  },
  {
    icon: Heart,
    title: "Do jeito que ela gosta",
    text: "A criança escolhe um tema favorito, como espaço ou animais, e recebe lições sobre ele.",
    tile: "bg-rose-400/15 text-rose-500",
  },
  {
    icon: ShoppingBag,
    title: "Moedas e lojinha",
    text: "Cada lição vale moedas para comprar roupas, chapéus e fundos para o personagem.",
    tile: "bg-amber-400/15 text-amber-500",
  },
  {
    icon: LineChart,
    title: "Painel dos pais",
    text: "Você vê o nível e o XP de cada filho e cria os perfis em poucos cliques.",
    tile: "bg-teal-400/15 text-teal-500",
  },
];

export function Features() {
  return (
    <section id="features" className="bg-fade-muted px-4 py-16 md:py-24" aria-labelledby="features-heading">
      <SectionHeading
        id="features-heading"
        eyebrow="O que tem no app"
        title="Aprender sem estresse"
        text="Só o que ajuda a criança a aprender. Nada de tela cheia de coisa piscando."
      />
      <ul className="mx-auto mt-12 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, title, text, tile }) => (
          <li key={title} className="rounded-3xl border-2 border-border bg-card p-6">
            <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${tile}`}>
              <Icon className="h-7 w-7" strokeWidth={2.4} aria-hidden />
            </span>
            <h3 className="mt-4 font-display text-xl font-bold">{title}</h3>
            <p className="mt-1 text-muted-foreground">{text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
