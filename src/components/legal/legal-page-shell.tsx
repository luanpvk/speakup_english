import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

interface LegalPageShellProps {
  title: string;
  updatedAt: string;
  children: React.ReactNode;
}

const DOCS = [
  { href: "/termos", label: "Termos de Uso" },
  { href: "/privacidade", label: "Privacidade" },
  { href: "/cookies", label: "Cookies" },
  { href: "/contato", label: "Contato" },
];

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

          <header className="mb-8">
            <h1 className="font-display text-3xl font-bold md:text-4xl">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">Última atualização: {updatedAt}</p>
            <nav aria-label="Documentos" className="mt-5 flex flex-wrap gap-2">
              {DOCS.map((doc) => (
                <Link
                  key={doc.href}
                  href={doc.href}
                  className="rounded-full border-2 border-border px-3 py-1 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {doc.label}
                </Link>
              ))}
            </nav>
          </header>


          <article className="prose-legal space-y-8 leading-relaxed text-muted-foreground [&_h2]:mb-3 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-foreground [&_ul]:space-y-2">
            {children}
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
