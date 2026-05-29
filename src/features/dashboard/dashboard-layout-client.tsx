"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { DashboardShell } from "@/features/dashboard/dashboard-shell";
import { useAuth } from "@/hooks/use-auth";
import { TopLoadingBar } from "@/components/ui/top-loading-bar";
import { useNavigationLoading } from "@/hooks/use-navigation-loading";

export function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const isChild = !isLoading && user?.role === "child";
  const loading = useNavigationLoading();

  return (
    <div className="min-h-screen bg-background">
      {!isChild && (
        <header className="relative border-b-2 border-border bg-card/80 backdrop-blur-sm">
          <TopLoadingBar active={loading} placement="embedded" />
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Logo showTagline size="lg" href="/" />
            <nav aria-label="Dashboard">
              <Link
                href="/"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Voltar ao site
              </Link>
            </nav>
          </div>
        </header>
      )}
      <DashboardShell>{children}</DashboardShell>
    </div>
  );
}
