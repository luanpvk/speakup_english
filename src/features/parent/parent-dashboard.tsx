"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ExternalLink, Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterChildForm } from "@/features/parent/register-child-form";
import { LoadingState } from "@/components/ui/loading-state";
import { ChildLoginButton } from "@/features/parent/child-login-button";
import { useParentChildren } from "@/hooks/use-parent-children";
import { useAuth } from "@/hooks/use-auth";
import { ROUTES } from "@/utils/constants";

export function ParentDashboard() {
  const router = useRouter();
  const { logoutSilent } = useAuth();
  const { data: children, isLoading, refetch } = useParentChildren();
  const [openingChildLogin, setOpeningChildLogin] = useState(false);

  const openChildLogin = async () => {
    setOpeningChildLogin(true);
    try {
      await logoutSilent();
      router.push(ROUTES.loginChild);
    } finally {
      setOpeningChildLogin(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Painel dos responsáveis</CardTitle>
          <CardDescription>
            Cadastre perfis infantis e acesse a área da criança para ela estudar.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="child"
            disabled={openingChildLogin}
            onClick={openChildLogin}
          >
            {openingChildLogin ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogIn className="h-4 w-4" />
            )}
            Entrar como criança
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <ExternalLink className="h-4 w-4" />
              Ver site
            </Link>
          </Button>
        </CardContent>
      </Card>

      <RegisterChildForm onSuccess={() => refetch()} />

      <Card className="border-2">
        <CardHeader>
          <CardTitle>Perfis cadastrados</CardTitle>
          <CardDescription>
            {isLoading
              ? "Carregando..."
              : children?.length
                ? `${children.length} explorador(es) na conta`
                : "Nenhum perfil ainda — cadastre acima"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingState message="Carregando perfis..." />
          ) : !children?.length ? (
            <p className="rounded-xl border-2 border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
              Após cadastrar, clique em &quot;Login desta criança&quot; e digite o PIN
              que você definiu no cadastro.
            </p>
          ) : (
            <ul className="space-y-3">
              {children.map((child) => (
                <li
                  key={child.childProfileId}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border-2 border-border bg-muted/30 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-card text-2xl shadow-sm">
                      {child.avatarEmoji}
                    </span>
                    <div>
                      <p className="font-semibold">{child.displayName}</p>
                      <p className="text-sm text-muted-foreground">
                        @{child.username} · Nível {child.level} · {child.xp} XP
                      </p>
                    </div>
                  </div>
                  <ChildLoginButton child={child} />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
