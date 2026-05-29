import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen gradient-speakup">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
        <Logo />
        <div className="hidden md:block">
          <ThemeToggle compact />
        </div>
      </header>

      <main
        id="main-content"
        className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl flex-col items-center justify-center px-4 py-8 md:flex-row md:gap-12"
      >
        <div className="mb-8 hidden max-w-sm md:block">
          <h1 className="font-display text-3xl font-bold">
            Aprender inglês pode ser leve e divertido
          </h1>
          <p className="mt-4 text-muted-foreground">
            Ambiente seguro, visual calmo e progresso que motiva sem pressionar.
          </p>
          <nav className="mt-6 flex flex-wrap gap-4 text-sm" aria-label="Links de acesso">
            <Link href="/login/child" className="font-semibold text-secondary hover:underline">
              Área infantil
            </Link>
            <Link href="/login/parent" className="font-semibold text-primary hover:underline">
              Responsáveis
            </Link>
            <Link href="/register" className="font-semibold text-foreground hover:underline">
              Cadastro
            </Link>
          </nav>
        </div>
        {children}
      </main>
    </div>
  );
}
