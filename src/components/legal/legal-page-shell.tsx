import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ArrowLeft } from "lucide-react";

interface LegalPageShellProps {
  title: string;
  updatedAt: string;
  children: React.ReactNode;
}

export function LegalPageShell({ title, updatedAt, children }: LegalPageShellProps) {
  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-[60vh] px-4 py-10 md:py-14">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Voltar ao início
          </Link>
          <header className="mb-8 border-b-2 border-border pb-6">
            <h1 className="font-display text-3xl font-bold md:text-4xl">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">Última atualização: {updatedAt}</p>
          </header>
          <article className="prose-legal space-y-6 text-muted-foreground">{children}</article>
        </div>
      </main>
      <Footer />
    </>
  );
}
