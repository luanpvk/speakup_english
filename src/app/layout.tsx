import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Nunito, Fredoka, Atkinson_Hyperlegible } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "@/context/providers";
import { ScrollToTop } from "@/components/navigation/scroll-to-top";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  display: "swap",
});

const atkinson = Atkinson_Hyperlegible({
  variable: "--font-atkinson",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  // Só usada quando a criança liga "Fonte acessível": não precisa atrasar o primeiro carregamento
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "SpeakUp English | Inglês para crianças",
    template: "%s | SpeakUp English",
  },
  description:
    "Inglês para crianças em lições curtas e calmas, pensado também para crianças autistas e com TDAH.",
  keywords: ["inglês", "crianças", "educação", "acessibilidade", "gamificação"],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FEF9E7" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1625" },
  ],
  width: "device-width",
  initialScale: 1,
};

/** Aplica tema e acessibilidade salvos antes da primeira pintura (evita voltar ao claro no F5) */
const THEME_BOOT_SCRIPT = `try{var s=(JSON.parse(localStorage.getItem("speakup-theme"))||{}).state||{};var r=document.documentElement;var d=s.theme!=="light"&&(s.theme!=="system"||matchMedia("(prefers-color-scheme: dark)").matches);r.classList.toggle("dark",d);r.classList.toggle("reduce-motion",!!s.reduceMotion);r.classList.toggle("high-contrast",!!s.highContrast);r.classList.toggle("accessible-font",!!s.accessibleFont);r.classList.toggle("low-stimulus",!!s.lowStimulusMode)}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <Script id="theme-boot" strategy="beforeInteractive">
          {THEME_BOOT_SCRIPT}
        </Script>
      </head>
      <body
        className={`${nunito.variable} ${fredoka.variable} ${atkinson.variable} min-h-screen antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Pular para o conteúdo
        </a>
        <Providers>
          <ScrollToTop />
          {children}
        </Providers>
      </body>
    </html>
  );
}
