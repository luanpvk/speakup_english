import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/legal-page-shell";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Como o SpeakUp English trata dados de responsáveis e crianças.",
};

export default function PrivacidadePage() {
  return (
    <LegalPageShell title="Política de Privacidade" updatedAt="29 de maio de 2026">
      <section>
        <h2 className="font-display text-xl font-bold text-foreground">1. Quem somos</h2>
        <p>
          O SpeakUp English é uma plataforma educacional de inglês para crianças. Esta política
          explica quais dados coletamos, por que usamos e como você pode exercer seus direitos.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl font-bold text-foreground">2. Dados que coletamos</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-foreground">Responsáveis:</strong> nome, e-mail, senha
            (armazenada de forma criptografada) e dados de cadastro da conta.
          </li>
          <li>
            <strong className="text-foreground">Crianças:</strong> nome de exibição, nome de
            usuário, PIN (hash), avatar, progresso nas lições, pontuação, conquistas e preferências
            de acessibilidade.
          </li>
          <li>
            <strong className="text-foreground">Técnicos:</strong> cookies de sessão, logs básicos
            de acesso e informações do dispositivo/navegador para segurança e funcionamento.
          </li>
        </ul>
      </section>
      <section>
        <h2 className="font-display text-xl font-bold text-foreground">3. Finalidade do uso</h2>
        <p>Utilizamos os dados para autenticar usuários, personalizar a experiência de aprendizado, salvar progresso, gamificação educativa, suporte e melhoria contínua da plataforma.</p>
      </section>
      <section>
        <h2 className="font-display text-xl font-bold text-foreground">4. Compartilhamento</h2>
        <p>
          Não vendemos dados pessoais. Podemos compartilhar informações apenas com prestadores
          essenciais (hospedagem, e-mail transacional) sob contratos de confidencialidade, ou quando
          exigido por lei.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl font-bold text-foreground">5. Crianças e responsáveis</h2>
        <p>
          Perfis infantis são criados e gerenciados por um responsável legal. O login da criança usa
          PIN definido pelo responsável. Recomendamos supervisão no uso da plataforma.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl font-bold text-foreground">6. Seus direitos (LGPD)</h2>
        <p>
          Você pode solicitar acesso, correção, exclusão ou portabilidade dos dados, além de revogar
          consentimentos quando aplicável. Entre em contato pelo e-mail indicado na página de
          Contato.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl font-bold text-foreground">7. Retenção e segurança</h2>
        <p>
          Mantemos os dados enquanto a conta estiver ativa ou conforme necessário para cumprir
          obrigações legais. Adotamos medidas técnicas e organizacionais para proteger as
          informações.
        </p>
      </section>
    </LegalPageShell>
  );
}
