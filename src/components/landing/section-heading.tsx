import { cn } from "@/lib/utils";

/** Título padrão das seções da página inicial */
export function SectionHeading({
  id,
  eyebrow,
  title,
  text,
  className,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  text?: string;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-2xl text-center", className)}>
      {eyebrow && <p className="text-sm font-bold uppercase tracking-wider text-primary">{eyebrow}</p>}
      <h2 id={id} className="mt-1 font-display text-3xl font-bold text-balance md:text-4xl">
        {title}
      </h2>
      {text && <p className="mt-3 text-lg text-muted-foreground">{text}</p>}
    </div>
  );
}
