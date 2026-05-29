import { Eye, Ear, Brain } from "lucide-react";

export function AccessibilitySection() {
  return (
    <section
      id="accessibility"
      className="px-4 py-16 md:py-24"
      aria-labelledby="a11y-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 id="a11y-heading" className="font-display text-3xl font-bold md:text-4xl">
              Acessibilidade em primeiro lugar
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Controles de animação, alto contraste, fonte legível e modo de baixo
              estímulo — porque aprender deve ser confortável para todos os cérebros.
            </p>
          </div>

          <ul className="space-y-4">
            {[
              {
                icon: Eye,
                title: "Contraste adequado",
                text: "Paleta amarelo, verde e roxo com modos de alto contraste.",
              },
              {
                icon: Brain,
                title: "Neuroinclusivo",
                text: "Layouts limpos, feedback previsível e sem sobrecarga visual.",
              },
              {
                icon: Ear,
                title: "Som opcional",
                text: "Efeitos sonoros podem ser desligados a qualquer momento.",
              },
            ].map((item) => (
              <li
                key={item.title}
                className="flex gap-4 rounded-2xl border-2 border-border bg-card p-4"
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-speakup-purple-soft"
                  aria-hidden
                >
                  <item.icon className="h-5 w-5 text-secondary" />
                </span>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
