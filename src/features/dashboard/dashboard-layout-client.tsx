"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { DashboardShell } from "@/features/dashboard/dashboard-shell";
import { useAuth } from "@/hooks/use-auth";
import { TopLoadingBar } from "@/components/ui/top-loading-bar";
import { useNavigationLoading } from "@/hooks/use-navigation-loading";

export function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  // Cabeçalho do responsável só depois de saber quem entrou (evita aparecer para a criança)
  const isParent = !isLoading && user?.role === "parent";
  const loading = useNavigationLoading();

  return (
    <div className="quiet-glow min-h-screen">
      {isParent && (
        <header className="relative border-b-2 border-border bg-card/80 backdrop-blur-sm">
          <TopLoadingBar active={loading} placement="embedded" />
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3">
            <Logo size="sm" href="/" />
            <nav aria-label="Dashboard" className="flex items-center gap-2">
              <Link
                href="/"
                className="hidden text-sm font-semibold text-muted-foreground hover:text-foreground sm:inline"
              >
                Voltar ao site
              </Link>
              <ThemeToggle compact />
              <Button variant="outline" size="sm" onClick={() => logout.mutate()} disabled={logout.isPending}>
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </nav>
          </div>
        </header>
      )}
      <DashboardShell>{children}</DashboardShell>
    </div>
  );
}
