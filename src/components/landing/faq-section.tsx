import { ChevronDown } from "lucide-react";
import { SectionHeading } from "./section-heading";

const FAQ = [
  {
    q: "Meu filho nunca estudou inglês. Dá para começar?",
    a: "Dá sim. As primeiras lições começam do zero, com cumprimentos, cores e números, e vão ficando mais difíceis aos poucos.",
  },
  {
    q: "Meu filho é autista ou tem TDAH. Funciona para ele?",
    a: "Foi pensado para isso: lições curtas, telas que seguem sempre o mesmo padrão, erro sem bronca, opção de desligar sons e animações e o tema favorito para manter o interesse.",
  },
  {
    q: "A criança precisa saber ler?",
    a: "Ajuda, mas não é obrigatório. Toda palavra em inglês pode ser ouvida, inclusive devagar. Para as primeiras vezes, vale um adulto por perto.",
  },
  {
    q: "Quanto tempo por dia?",
    a: "Uma lição leva uns 10 minutos. Uma por dia, com os flashcards do dia, já é um ótimo ritmo.",
  },
  {
    q: "Tem anúncio ou compra dentro do app?",
    a: "Não. As moedas da lojinha só se ganham estudando, nada é comprado com dinheiro de verdade.",
  },
  {
    q: "Posso ter mais de um filho na mesma conta?",
    a: "Pode. Cada criança ganha o próprio perfil, com usuário, PIN, personagem e progresso separados.",
  },
];

export function FaqSection() {
  return (
    <section className="px-4 py-16 md:py-24" aria-labelledby="faq-heading">
      <SectionHeading id="faq-heading" eyebrow="Dúvidas" title="Perguntas frequentes" />
      <div className="mx-auto mt-10 max-w-3xl space-y-3">
        {FAQ.map(({ q, a }) => (
          <details key={q} className="group rounded-2xl border-2 border-border bg-card">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 font-display text-lg font-bold [&::-webkit-details-marker]:hidden">
              {q}
              <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden />
            </summary>
            <p className="px-5 pb-5 text-muted-foreground">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
