import { Contrast, Ear, Moon, PauseCircle, Type, Volume2, type LucideIcon } from "lucide-react";
import { SectionHeading } from "./section-heading";

const items: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: PauseCircle, title: "Menos movimento", text: "Desliga as animações para quem se incomoda com coisas mexendo." },
  { icon: Contrast, title: "Alto contraste", text: "Texto forte e bordas bem marcadas, no tema claro e no escuro." },
  { icon: Type, title: "Fonte mais fácil", text: "Uma fonte feita para facilitar a leitura de quem tem dificuldade." },
  { icon: Moon, title: "Tema escuro", text: "Menos brilho na tela, bom para a noite e para olhos sensíveis." },
  { icon: Volume2, title: "Áudio com calma", text: "Toda palavra pode ser ouvida de novo, inclusive bem devagar." },
  { icon: Ear, title: "Som só se quiser", text: "Os sons podem ser desligados a qualquer hora, direto no perfil." },
];

export function AccessibilitySection() {
  return (
    <section id="accessibility" className="px-4 py-16 md:py-24" aria-labelledby="a11y-heading">
      <SectionHeading
        id="a11y-heading"
        eyebrow="Acessibilidade"
        title="Pensado para cada jeito de aprender"
        text="As telas seguem sempre o mesmo padrão, então a criança sabe o que vem depois. E dá para ajustar tudo isto:"
      />
      <ul className="mx-auto mt-10 grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex gap-3 rounded-2xl border-2 border-border bg-card p-4">
            <Icon className="mt-0.5 h-6 w-6 shrink-0 text-secondary" strokeWidth={2.4} aria-hidden />
            <span>
              <span className="block font-display font-bold">{title}</span>
              <span className="text-sm text-muted-foreground">{text}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
