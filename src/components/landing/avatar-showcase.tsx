import { Coins } from "lucide-react";
import { AvatarFigure } from "@/components/gamification/avatar-figure";

const LOOKS = [
  { base: "cat", hair: "hair-default", clothes: "clothes-astronaut", accessory: "acc-headphones", background: "bg-space" },
  { base: "smile", hair: "hair-pigtails", clothes: "clothes-princess", accessory: "acc-crown", background: "bg-candy" },
  { base: "dog", hair: "hair-spiky", clothes: "clothes-sport", accessory: "acc-cap", background: "bg-forest" },
  { base: "sparkles", hair: "hair-rainbow", clothes: "clothes-rainbow", accessory: "acc-flower", background: "bg-rainbow" },
  { base: "rabbit", hair: "hair-curly", clothes: "clothes-pirate", accessory: "acc-pirate", background: "bg-beach" },
  { base: "bird", hair: "hair-mohawk", clothes: "clothes-dino", accessory: "acc-sunglasses", background: "bg-sunset" },
];

export function AvatarShowcase() {
  return (
    <section className="bg-fade-muted px-4 py-16 md:py-24" aria-labelledby="avatar-heading">
      <div className="mx-auto max-w-6xl text-center">
        <p className="text-sm font-bold uppercase tracking-wider text-primary">Personagem</p>
        <h2 id="avatar-heading" className="mt-1 font-display text-3xl font-bold md:text-4xl">
          Cada lição vale moedas
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
          Com as moedas a criança monta o próprio personagem: são 8 bichinhos e mais de 50 roupas,
          cabelos, chapéus e fundos na lojinha.
        </p>

        <ul className="mt-10 grid grid-cols-3 gap-4 sm:grid-cols-6">
          {LOOKS.map((look, i) => (
            <li key={look.base} className={i % 2 ? "sm:translate-y-6" : undefined}>
              <span className="mx-auto block aspect-square w-full max-w-36 overflow-hidden rounded-full border-4 border-card shadow-[0_0_0_2px_hsl(var(--border))]">
                <AvatarFigure {...look} title="Exemplo de personagem" />
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-16 inline-flex items-center gap-2 rounded-full bg-amber-400/15 px-4 py-2 font-semibold">
          <Coins className="h-5 w-5 text-amber-500" aria-hidden />
          Sem compras com dinheiro de verdade. Tudo se ganha estudando.
        </p>
      </div>
    </section>
  );
}
