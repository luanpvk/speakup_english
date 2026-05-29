import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/legal-page-shell";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Termos e condições de uso do SpeakUp English.",
};

export default function TermosPage() {
  return (
    <LegalPageShell title="Termos de Uso" updatedAt="29 de maio de 2026">
      <section>
        <h2 className="font-display text-xl font-bold text-foreground">1. Aceitação</h2>
        <p>
          Ao criar uma conta ou utilizar o SpeakUp English, você concorda com estes Termos. Se não
          concordar, não utilize a plataforma.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl font-bold text-foreground">2. Contas</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Responsáveis devem fornecer informações verdadeiras e manter a senha em segurança.</li>
          <li>Perfis de crianças devem ser criados por um responsável legal.</li>
          <li>Você é responsável por toda atividade realizada na sua conta.</li>
        </ul>
      </section>
      <section>
        <h2 className="font-display text-xl font-bold text-foreground">3. Uso permitido</h2>
        <p>
          A plataforma destina-se ao aprendizado de inglês em ambiente educacional e familiar. É
          proibido usar o serviço para fins ilegais, abusivos, para tentar acessar dados de
          terceiros ou interferir no funcionamento do sistema.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl font-bold text-foreground">4. Conteúdo e propriedade</h2>
        <p>
          Lições, jogos, textos, marcas e elementos visuais são de propriedade do SpeakUp English
          ou licenciados. É vedada a cópia, revenda ou redistribuição não autorizada.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl font-bold text-foreground">5. Disponibilidade</h2>
        <p>
          Buscamos manter o serviço disponível, mas podemos realizar manutenções ou atualizações que
          causem indisponibilidade temporária, sem garantia de funcionamento ininterrupto.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl font-bold text-foreground">6. Limitação de responsabilidade</h2>
        <p>
          O SpeakUp English é uma ferramenta de apoio educacional. Resultados de aprendizado variam
          conforme uso, idade e contexto. Não nos responsabilizamos por danos indiretos decorrentes
          do uso da plataforma, na extensão permitida pela lei.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl font-bold text-foreground">7. Alterações e contato</h2>
        <p>
          Podemos atualizar estes Termos. A data de revisão será indicada no topo desta página.
          Dúvidas podem ser enviadas pela página de Contato.
        </p>
      </section>
    </LegalPageShell>
  );
}
