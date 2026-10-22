import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  Produto: [
    { href: "/#features", label: "Recursos" },
    { href: "/#how-it-works", label: "Como funciona" },
    { href: "/register", label: "Cadastro" },
  ],
  Acesso: [
    { href: "/login/parent", label: "Responsáveis" },
    { href: "/login/child", label: "Crianças" },
    { href: "/forgot-password", label: "Recuperar senha" },
  ],
  Legal: [
    { href: "/privacidade", label: "Privacidade" },
    { href: "/termos", label: "Termos de uso" },
    { href: "/cookies", label: "Cookies" },
    { href: "/contato", label: "Contato" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t-2 border-border bg-muted/40" role="contentinfo">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Logo size="lg" href="/" />
            <p className="mt-4 max-w-xs text-muted-foreground">
              Inglês para crianças aprenderem no ritmo delas, com calma e muita comemoração a
              cada acerto.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-display text-lg font-bold">{title}</h3>
              <ul className="mt-4 space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} SpeakUp English. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
