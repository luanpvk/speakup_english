import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/legal-page-shell";

export const metadata: Metadata = {
  title: "Política de Cookies",
  description: "Os cookies e informações guardadas no navegador pelo SpeakUp English, um por um.",
};

const COOKIES = [
  {
    name: "speakup_access",
    what: "Mantém você conectado enquanto usa o site.",
    time: "15 minutos (renovado automaticamente)",
  },
  {
    name: "speakup_refresh",
    what: "Renova a sessão sem pedir a senha de novo.",
    time: "7 dias sem uso",
  },
];

const STORAGE = [
  { name: "speakup-theme", what: "Tema claro ou escuro e preferências de acessibilidade." },
  { name: "speakup-tutorial-seen", what: "Lembra que o tutorial já foi visto, para não abrir de novo." },
  { name: "speakup-last-role", what: "Se a última conta foi de responsável ou de criança, para mostrar a tela de carregamento certa." },
  { name: "speakup-parent-email", what: "O e-mail do responsável, para a criança não precisar digitar no login." },
];

export default function CookiesPage() {
  return (
    <LegalPageShell
      title="Política de Cookies"
      updatedAt="21 de outubro de 2026"
    >
      <section>
        <h2>1. O que são</h2>
        <p>
          Cookies são pequenos arquivos que o site guarda no seu navegador. Também usamos o &ldquo;armazenamento
          local&rdquo; do navegador, que funciona de forma parecida mas fica só no seu aparelho e não é enviado
          para o nosso servidor.
        </p>
      </section>

      <section>
        <h2>2. Cookies que usamos</h2>
        <p>
          São cookies essenciais: sem eles não dá para entrar na conta. Eles são protegidos para que o código da
          página não consiga lê-los.
        </p>
        <div className="mt-3 overflow-x-auto rounded-2xl border-2 border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/60 text-foreground">
              <tr>
                <th className="p-3 font-bold">Nome</th>
                <th className="p-3 font-bold">Para que serve</th>
                <th className="p-3 font-bold">Duração</th>
              </tr>
            </thead>
            <tbody>
              {COOKIES.map((c) => (
                <tr key={c.name} className="border-t-2 border-border">
                  <td className="p-3 font-mono text-xs text-foreground">{c.name}</td>
                  <td className="p-3">{c.what}</td>
                  <td className="p-3">{c.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>3. O que fica guardado no seu aparelho</h2>
        <p>Estas informações ficam só no navegador e servem para deixar o uso mais confortável:</p>
        <div className="mt-3 overflow-x-auto rounded-2xl border-2 border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/60 text-foreground">
              <tr>
                <th className="p-3 font-bold">Nome</th>
                <th className="p-3 font-bold">Para que serve</th>
              </tr>
            </thead>
            <tbody>
              {STORAGE.map((s) => (
                <tr key={s.name} className="border-t-2 border-border">
                  <td className="p-3 font-mono text-xs text-foreground">{s.name}</td>
                  <td className="p-3">{s.what}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3">
          Em um computador compartilhado, o e-mail do responsável fica visível no login da criança. Para
          removê-lo, limpe os dados do site no navegador.
        </p>
      </section>

      <section>
        <h2>4. O que não usamos</h2>
        <p>
          Nenhum cookie de propaganda, de redes sociais ou de ferramentas de análise de terceiros. Se um dia isso
          mudar, esta página será atualizada antes e, quando a lei exigir, pediremos sua permissão.
        </p>
      </section>

      <section>
        <h2>5. Como apagar</h2>
        <p>
          Você pode apagar cookies e dados do site nas configurações do navegador. Ao apagar os cookies de
          sessão, você sai da conta; ao apagar o armazenamento local, as preferências voltam ao padrão.
        </p>
      </section>
    </LegalPageShell>
  );
}
