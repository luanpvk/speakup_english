import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/legal-page-shell";

export const metadata: Metadata = {
  title: "Política de Cookies",
  description: "Como o SpeakUp English utiliza cookies e tecnologias similares.",
};

export default function CookiesPage() {
  return (
    <LegalPageShell title="Política de Cookies" updatedAt="29 de maio de 2026">
      <section>
        <h2 className="font-display text-xl font-bold text-foreground">1. O que são cookies</h2>
        <p>
          Cookies são pequenos arquivos armazenados no seu navegador para lembrar preferências,
          manter sessões e melhorar a experiência de uso.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl font-bold text-foreground">2. Cookies que utilizamos</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-foreground">Essenciais:</strong> autenticação, segurança e
            funcionamento do login (responsáveis e crianças).
          </li>
          <li>
            <strong className="text-foreground">Preferências:</strong> tema claro/escuro, opções de
            acessibilidade e configurações salvas localmente.
          </li>
          <li>
            <strong className="text-foreground">Analíticos (futuros):</strong> se implementados,
            serão usados de forma agregada para entender uso da plataforma, com opção de recusa quando
            exigido.
          </li>
        </ul>
      </section>
      <section>
        <h2 className="font-display text-xl font-bold text-foreground">3. Como gerenciar</h2>
        <p>
          Você pode bloquear ou apagar cookies nas configurações do navegador. Isso pode afetar o
          login e algumas funcionalidades. Para sessão autenticada, cookies essenciais são
          necessários.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl font-bold text-foreground">4. Mais informações</h2>
        <p>
          Para detalhes sobre dados pessoais, consulte nossa Política de Privacidade. Para dúvidas,
          use a página de Contato.
        </p>
      </section>
    </LegalPageShell>
  );
}
