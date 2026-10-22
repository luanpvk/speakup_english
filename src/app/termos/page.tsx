import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/legal-page-shell";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "As regras para usar o SpeakUp English, escritas de forma clara.",
};

const CONTACT = "contato@speakupenglish.app";

export default function TermosPage() {
  return (
    <LegalPageShell
      title="Termos de Uso"
      updatedAt="21 de outubro de 2026"
    >
      <section>
        <h2>1. Aceitação</h2>
        <p>
          Estes Termos explicam as regras para usar o SpeakUp English. Ao criar uma conta ou usar a plataforma,
          você concorda com eles e com a{" "}
          <Link href="/privacidade" className="text-primary hover:underline">
            Política de Privacidade
          </Link>
          . Se não concordar, não use o serviço.
        </p>
      </section>

      <section>
        <h2>2. Quem pode criar conta</h2>
        <p>
          Apenas adultos com 18 anos ou mais, que sejam pai, mãe ou responsável legal pelas crianças cadastradas.
          Os perfis infantis são criados e administrados pelo responsável. Ao cadastrar uma criança, você confirma
          que tem autoridade para isso e consente com o uso dos dados dela conforme a Política de Privacidade.
        </p>
      </section>

      <section>
        <h2>3. Conta, senha e PIN</h2>
        <ul>
          <li>Use informações verdadeiras e mantenha seu e-mail atualizado.</li>
          <li>Guarde sua senha com cuidado e não a compartilhe.</li>
          <li>
            O PIN da criança é para uso dentro da família. Depois de 5 PINs errados, o login daquele perfil fica
            pausado por 15 minutos, para proteger a criança.
          </li>
          <li>Você é responsável pelo uso feito na sua conta e nos perfis que criou.</li>
          <li>Se perceber um acesso estranho, troque a senha e fale com a gente.</li>
        </ul>
      </section>

      <section>
        <h2>4. O que pode e o que não pode</h2>
        <p>O SpeakUp é para aprender inglês em casa ou na escola. Não é permitido:</p>
        <ul>
          <li>tentar invadir contas, burlar limites de tentativas ou acessar dados de outras pessoas;</li>
          <li>usar robôs ou programas para jogar lições, ganhar moedas ou subir no ranking;</li>
          <li>copiar, revender ou redistribuir o conteúdo das lições;</li>
          <li>usar apelidos ofensivos ou com dados pessoais de terceiros.</li>
        </ul>
        <p>
          Podemos alterar apelidos inadequados e suspender contas que descumprirem estas regras, avisando o
          responsável sempre que possível.
        </p>
      </section>

      <section>
        <h2>5. Moedas, XP e itens do personagem</h2>
        <p>
          Moedas, XP, estrelas, conquistas e itens do personagem existem só dentro do SpeakUp. Eles são ganhos
          estudando, <strong>não têm valor em dinheiro</strong>, não podem ser comprados nem trocados por dinheiro
          ou passados para outra conta. Podemos ajustar preços, recompensas e itens para manter o jogo justo,
          inclusive corrigir pontos obtidos por erro ou trapaça.
        </p>
      </section>

      <section>
        <h2>6. Conteúdo e propriedade</h2>
        <p>
          Lições, textos, ilustrações, o mascote, a marca e o código do SpeakUp pertencem a nós ou a quem nos
          licenciou. Você pode usá-los apenas para aprender dentro da plataforma.
        </p>
      </section>

      <section>
        <h2>7. Caráter educacional</h2>
        <p>
          O SpeakUp é uma ferramenta de apoio ao aprendizado de inglês. Ele não substitui a escola, nem
          acompanhamento terapêutico, médico ou pedagógico. As adaptações de acessibilidade ajudam muitas
          crianças, mas cada uma é única: acompanhe como seu filho se sente usando o app.
        </p>
      </section>

      <section>
        <h2>8. Disponibilidade e mudanças</h2>
        <p>
          Trabalhamos para manter o SpeakUp sempre no ar, mas podem ocorrer pausas para manutenção ou
          problemas técnicos. Podemos melhorar, mudar ou retirar funções. Mudanças importantes nestes Termos
          serão avisadas no site ou por e-mail antes de valer.
        </p>
      </section>

      <section>
        <h2>9. Responsabilidade</h2>
        <p>
          Respondemos pelos nossos serviços nos termos do Código de Defesa do Consumidor e da legislação
          brasileira. Não nos responsabilizamos por danos causados por mau uso da conta, por senhas compartilhadas
          ou por falhas na internet ou no aparelho do usuário.
        </p>
      </section>

      <section>
        <h2>10. Encerrar a conta</h2>
        <p>
          Você pode encerrar sua conta, ou só o perfil de uma criança, a qualquer momento escrevendo para{" "}
          <a href={`mailto:${CONTACT}`} className="font-semibold text-primary hover:underline">
            {CONTACT}
          </a>{" "}
          com o e-mail da conta. Os dados serão apagados conforme a Política de Privacidade.
        </p>
      </section>

      <section>
        <h2>11. Lei aplicável</h2>
        <p>
          Estes Termos seguem a legislação brasileira. Eventuais conflitos podem ser resolvidos no foro do
          domicílio do consumidor.
        </p>
      </section>
    </LegalPageShell>
  );
}
