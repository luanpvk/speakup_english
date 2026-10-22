import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/legal-page-shell";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Quais dados o SpeakUp English usa, por que usa e como você controla os dados do seu filho.",
};

const CONTACT = "contato@speakupenglish.app";

export default function PrivacidadePage() {
  return (
    <LegalPageShell
      title="Política de Privacidade"
      updatedAt="21 de outubro de 2026"
    >
      <section>
        <h2>1. Quem somos</h2>
        <p>
          O SpeakUp English (&ldquo;SpeakUp&rdquo;, &ldquo;nós&rdquo;) é uma plataforma de ensino de inglês para
          crianças. Somos os responsáveis pelo tratamento dos dados descritos aqui, como controladores, nos
          termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018, a &ldquo;LGPD&rdquo;). Para qualquer
          assunto de privacidade, inclusive para falar com o nosso encarregado de dados, escreva para{" "}
          <a href={`mailto:${CONTACT}`} className="font-semibold text-primary hover:underline">
            {CONTACT}
          </a>
          .
        </p>
      </section>

      <section>
        <h2>2. Para quem é o SpeakUp</h2>
        <p>
          A conta é criada por um adulto, maior de 18 anos, que seja pai, mãe ou responsável legal pela criança.
          A criança não cria conta sozinha: ela usa um perfil criado pelo responsável. Ao criar esse perfil, o
          responsável dá o consentimento específico para o tratamento dos dados da criança, como pede o artigo
          14 da LGPD.
        </p>
      </section>

      <section>
        <h2>3. Quais dados usamos</h2>
        <p>
          <strong>Do responsável:</strong>
        </p>
        <ul>
          <li>nome e e-mail;</li>
          <li>senha, guardada só de forma protegida por hash (nem nós conseguimos ver a senha);</li>
          <li>a lista de perfis infantis criados por ele.</li>
        </ul>
        <p>
          <strong>Da criança:</strong>
        </p>
        <ul>
          <li>apelido (nome de exibição) e nome de usuário;</li>
          <li>PIN de 4 números, guardado só de forma protegida por hash;</li>
          <li>personagem escolhido (bichinho, roupas, acessórios e fundo) e itens comprados com moedas do app;</li>
          <li>tema favorito, se o responsável ou a criança escolher um;</li>
          <li>
            progresso: lições feitas, notas, tempo nas lições, XP, nível, moedas, estrelas, conquistas, dias
            seguidos de estudo e revisões de flashcards.
          </li>
        </ul>
        <p>
          <strong>Não pedimos</strong> foto, endereço, telefone, CPF, escola, localização ou qualquer informação
          de saúde. O tema favorito serve só para escolher lições e não indica nenhum diagnóstico.
        </p>
        <p>
          <strong>Dados técnicos:</strong>
        </p>
        <ul>
          <li>
            cookies de sessão, que mantêm a pessoa conectada (veja a{" "}
            <Link href="/cookies" className="text-primary hover:underline">
              Política de Cookies
            </Link>
            );
          </li>
          <li>
            registros temporários de tentativas de login, com o endereço IP e o e-mail ou a conta usados, para
            barrar quem tenta adivinhar senhas. Eles são apagados sozinhos em até 1 hora;
          </li>
          <li>contagem de PINs errados no perfil da criança, para pausar o login após 5 erros;</li>
          <li>registros de erro do servidor, usados só para corrigir problemas.</li>
        </ul>
      </section>

      <section>
        <h2>4. Para que usamos e com qual base legal</h2>
        <ul>
          <li>
            <strong>Prestar o serviço</strong> (criar a conta, mostrar lições, salvar o progresso, a loja de moedas e
            o painel dos pais): execução do contrato com o responsável e, para os dados da criança, o
            consentimento do responsável.
          </li>
          <li>
            <strong>Segurança</strong> (limitar tentativas de login, pausar PINs errados, investigar abusos):
            legítimo interesse e proteção da própria criança.
          </li>
          <li>
            <strong>Atendimento</strong> (responder mensagens e pedidos): execução do contrato.
          </li>
          <li>
            <strong>Cumprir a lei</strong> quando formos obrigados.
          </li>
        </ul>
      </section>

      <section>
        <h2>5. O que nunca fazemos</h2>
        <ul>
          <li>vender ou alugar dados;</li>
          <li>mostrar anúncios ou usar dados para publicidade;</li>
          <li>criar perfis de comportamento para marketing;</li>
          <li>pedir compras com dinheiro de verdade dentro da área da criança.</li>
        </ul>
      </section>

      <section>
        <h2>6. O que outras crianças podem ver</h2>
        <p>
          No ranking aparecem o <strong>apelido</strong>, o <strong>personagem</strong> e o <strong>XP</strong> de
          cada criança. Por isso, recomendamos usar um apelido em vez do nome completo. Nenhum outro dado do
          perfil fica visível para outras pessoas, e não existe chat entre crianças.
        </p>
      </section>

      <section>
        <h2>7. Com quem compartilhamos</h2>
        <p>
          Só com empresas que nos ajudam a manter o site no ar, como hospedagem e banco de dados. Elas tratam os
          dados apenas para nos prestar esse serviço e não podem usá-los para outros fins. Esses provedores
          podem estar fora do Brasil; nesse caso, a transferência segue as regras da LGPD. Também podemos
          compartilhar dados quando a lei ou uma autoridade exigir.
        </p>
      </section>

      <section>
        <h2>8. Por quanto tempo guardamos</h2>
        <p>
          Enquanto a conta existir. Se o responsável pedir a exclusão, apagamos a conta e os perfis infantis,
          mantendo apenas o que a lei nos obrigar a guardar. Os registros de tentativas de login somem em até 1
          hora e as sessões expiram depois de 7 dias sem uso.
        </p>
      </section>

      <section>
        <h2>9. Como protegemos</h2>
        <ul>
          <li>senhas e PINs guardados com hash, nunca em texto;</li>
          <li>cookies de sessão que o JavaScript da página não consegue ler;</li>
          <li>limite de tentativas de login e pausa automática após PINs errados;</li>
          <li>conexão protegida (HTTPS) no site publicado;</li>
          <li>acesso aos dados restrito a quem precisa para manter o serviço.</li>
        </ul>
        <p>
          Nenhum sistema é 100% invulnerável. Se acontecer um incidente que possa causar risco, avisaremos os
          responsáveis afetados e a Autoridade Nacional de Proteção de Dados (ANPD), como manda a lei.
        </p>
      </section>

      <section>
        <h2>10. Seus direitos</h2>
        <p>Pela LGPD, o responsável pode, sobre os próprios dados e os da criança:</p>
        <ul>
          <li>confirmar se tratamos dados e ter acesso a eles;</li>
          <li>corrigir dados incompletos ou errados;</li>
          <li>pedir anonimização, bloqueio ou exclusão;</li>
          <li>pedir a portabilidade dos dados;</li>
          <li>saber com quem compartilhamos;</li>
          <li>revogar o consentimento, o que encerra o perfil da criança;</li>
          <li>reclamar à ANPD.</li>
        </ul>
        <p>
          Para qualquer pedido, escreva para{" "}
          <a href={`mailto:${CONTACT}`} className="font-semibold text-primary hover:underline">
            {CONTACT}
          </a>{" "}
          usando o e-mail da conta. Respondemos em até 15 dias.
        </p>
      </section>

      <section>
        <h2>11. Mudanças nesta política</h2>
        <p>
          Se mudarmos algo importante, avisaremos no site ou por e-mail antes de a mudança valer. A data no topo
          mostra a última atualização.
        </p>
      </section>
    </LegalPageShell>
  );
}
