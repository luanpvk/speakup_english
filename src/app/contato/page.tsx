import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { Mail, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contato",
  description: "Entre em contato com a equipe SpeakUp English.",
};

export default function ContatoPage() {
  return (
    <LegalPageShell title="Contato" updatedAt="21 de outubro de 2026">
      <section>
        <p>
          Estamos à disposição para dúvidas sobre a plataforma, privacidade, acessibilidade ou
          suporte à conta de responsáveis.
        </p>
      </section>
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border-2 border-border bg-card p-5">
          <Mail className="mb-3 h-6 w-6 text-primary" aria-hidden />
          <h2 className="font-display text-lg font-bold text-foreground">E-mail</h2>
          <p className="mt-2">
            <a
              href="mailto:contato@speakupenglish.app"
              className="font-medium text-primary hover:underline"
            >
              contato@speakupenglish.app
            </a>
          </p>
          <p className="mt-2 text-sm">Resposta em até 2 dias úteis.</p>
        </div>
        <div className="rounded-2xl border-2 border-border bg-card p-5">
          <MessageCircle className="mb-3 h-6 w-6 text-primary" aria-hidden />
          <h2 className="font-display text-lg font-bold text-foreground">Suporte</h2>
          <p className="mt-2 text-sm">
            Para problemas de login, recuperação de senha ou perfil infantil, descreva o ocorrido
            com o e-mail da conta responsável.
          </p>
        </div>
      </section>
      <section>
        <h2 className="font-display text-xl font-bold text-foreground">Documentos legais</h2>
        <ul className="mt-2 space-y-1">
          <li>
            <Link href="/privacidade" className="text-primary hover:underline">
              Política de Privacidade
            </Link>
          </li>
          <li>
            <Link href="/termos" className="text-primary hover:underline">
              Termos de Uso
            </Link>
          </li>
          <li>
            <Link href="/cookies" className="text-primary hover:underline">
              Política de Cookies
            </Link>
          </li>
        </ul>
      </section>
    </LegalPageShell>
  );
}
