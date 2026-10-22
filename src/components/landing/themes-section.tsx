import Image from "next/image";
import { KidIcon } from "@/lib/icons/kid-icons";
import { HYPERFOCUS_THEMES } from "@/lib/data/hyperfocus";

/** Tema favorito (hiperfoco): o diferencial para crianças com interesses intensos */
export function ThemesSection() {
  return (
    <section className="px-4 py-16 md:py-24" aria-labelledby="themes-heading">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
        <div className="text-center lg:text-left">
          <p className="text-sm font-bold uppercase tracking-wider text-primary">Tema favorito</p>
          <h2 id="themes-heading" className="mt-1 font-display text-3xl font-bold text-balance md:text-4xl">
            Ela aprende inglês com o que mais ama
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Muita criança, principalmente autista, tem um assunto que ama de paixão. No SpeakUp ela escolhe
            esse tema e as lições sobre ele aparecem primeiro, já liberadas. Fica muito mais fácil prestar
            atenção quando o assunto é foguete, bicho ou trem.
          </p>
          <div className="mt-6 hidden items-end gap-3 lg:flex">
            <Image src="/mascot.png" alt="" width={72} height={72} />
            <p className="mb-3 rounded-2xl border-2 border-border bg-card px-4 py-2 font-display font-bold shadow-[0_4px_0_hsl(var(--border-shadow))]">
              Qual é o seu favorito?
            </p>
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {HYPERFOCUS_THEMES.map((theme) => (
            <li
              key={theme.id}
              className="flex items-center gap-3 rounded-2xl border-2 border-border bg-card p-3 shadow-[0_4px_0_hsl(var(--border-shadow))]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-speakup-green-soft">
                <KidIcon emoji={theme.icon} size="sm" variant="plain" />
              </span>
              <span className="text-sm font-bold leading-tight">{theme.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
