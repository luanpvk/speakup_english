"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { ChildNav } from "@/features/dashboard/child-nav";
import { ChildDashboardHeader } from "@/features/dashboard/child-dashboard-header";
import { CelebrationModal } from "@/components/gamification/celebration-modal";
import { LoadingState } from "@/components/ui/loading-state";
import { useChildStats } from "@/hooks/use-gamification";

function DashboardLoading({ message, variant = "default" as const }: { message: string; variant?: "default" | "lesson" }) {
  return (
    <main id="main-content" className="mx-auto max-w-6xl px-4">
      <LoadingState message={message} variant={variant} fullScreen />
    </main>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const isChild = user?.role === "child";
  const { data: stats } = useChildStats(isChild && isAuthenticated);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login/parent");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <DashboardLoading message="Carregando seu painel..." />;
  }

  if (!user) {
    return <DashboardLoading message="Redirecionando para o login..." />;
  }

  if (!isChild) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Área dos responsáveis</p>
            <h1 className="font-display text-2xl font-bold">Olá, {user.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle compact />
            <Button variant="outline" onClick={() => logout.mutate()} disabled={logout.isPending}>
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </header>
        {children}
      </div>
    );
  }

  return (
    <>
      <CelebrationModal />
      <div className="mx-auto max-w-6xl space-y-5 px-4 py-5">
        <ChildDashboardHeader
          displayName={user.name}
          avatarEmoji={user.avatarEmoji}
          stats={stats}
          onLogout={() => logout.mutate()}
          logoutPending={logout.isPending}
        />

        {!pathname.includes("/lessons/") && <ChildNav />}
        <main id="main-content">{children}</main>
      </div>
    </>
  );
}
