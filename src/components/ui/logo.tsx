import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  /** Destino ao clicar — padrão: página inicial */
  href?: string;
}

const imageSizes = {
  sm: { width: 200, height: 64, className: "h-14 w-auto min-w-[140px]" },
  md: { width: 260, height: 84, className: "h-16 w-auto min-w-[180px]" },
  lg: { width: 320, height: 100, className: "h-20 w-auto min-w-[220px]" },
  xl: { width: 400, height: 120, className: "h-24 w-auto min-w-[280px]" },
};

export function Logo({
  className,
  showTagline = false,
  size = "md",
  href = "/",
}: LogoProps) {
  const dims = imageSizes[size];

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-3 rounded-lg transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      aria-label="SpeakUp English — voltar para a página inicial"
    >
      <Image
        src="/logo.png"
        alt="SpeakUp English"
        width={dims.width}
        height={dims.height}
        className={cn(dims.className, "object-contain object-left")}
        priority
      />
      {showTagline && (
        <span className="hidden text-sm font-normal text-muted-foreground lg:inline">
          English for kids
        </span>
      )}
    </Link>
  );
}
