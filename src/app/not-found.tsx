import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ErrorScreen } from "@/components/layout/error-screen";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/utils/constants";

export const metadata: Metadata = { title: "Página não encontrada" };

export default function NotFound() {
  return (
    <>
      <Navbar />
      <ErrorScreen
        code="404"
        title="Ops, essa página sumiu"
        text="Procuramos por todo canto e não achamos nada aqui. Pode ser um link antigo ou um errinho de digitação."
      >
        <Button asChild size="lg">
          <Link href={ROUTES.home}>Voltar ao início</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href={ROUTES.dashboard}>Ir para a trilha</Link>
        </Button>
      </ErrorScreen>
      <Footer />
    </>
  );
}
