import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoVariant = "full" | "icon" | "wordmark";

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  /** full: selo do gatinho + escrita; icon: só o selo; wordmark: só a escrita */
  variant?: LogoVariant;
  /** Destino ao clicar: padrão: página inicial */
  href?: string;
}

/** Selo 3D (PNG sem fundo) e escrita (SVG, com versão para o tema escuro) */
const ICON = { src: "/logo-icon.png", width: 924, height: 924 };
const WORDMARK = { light: "/logo-wordmark.svg", dark: "/logo-wordmark-dark.svg", width: 374, height: 156 };

/** Altura do selo e da escrita em cada tamanho */
const SIZES = {
  sm: { icon: "h-12", text: "h-10" },
  md: { icon: "h-14", text: "h-11" },
  lg: { icon: "h-16", text: "h-12" },
  xl: { icon: "h-20", text: "h-16" },
};

export function Logo({
  className,
  showTagline = false,
  size = "md",
  variant = "full",
  href = "/",
}: LogoProps) {
  const sizes = SIZES[size];
  const showIcon = variant !== "wordmark";
  const showWordmark = variant !== "icon";
  const textClass = cn(variant === "wordmark" ? sizes.icon : sizes.text, "w-auto object-contain object-left");

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      aria-label="SpeakUp English, voltar para a página inicial"
    >
      {showIcon && (
        <Image
          src={ICON.src}
          alt={showWordmark ? "" : "SpeakUp English"}
          width={ICON.width}
          height={ICON.height}
          sizes="80px"
          className={cn(sizes.icon, "w-auto shrink-0")}
          priority
        />
      )}
      {showWordmark && (
        <>
          <Image
            src={WORDMARK.light}
            alt="SpeakUp English"
            width={WORDMARK.width}
            height={WORDMARK.height}
            className={cn(textClass, "dark:hidden")}
            unoptimized
            priority
          />
          <Image
            src={WORDMARK.dark}
            alt="SpeakUp English"
            width={WORDMARK.width}
            height={WORDMARK.height}
            className={cn(textClass, "hidden dark:block")}
            unoptimized
            priority
          />
        </>
      )}
      {showTagline && (
        <span className="hidden text-sm font-normal text-muted-foreground lg:inline">
          English for kids
        </span>
      )}
    </Link>
  );
}
