"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import {
  ChildBottomNav,
  ChildRightRail,
  ChildSidebar,
  ChildTopBar,
} from "@/features/dashboard/child-chrome";
import { TopLoadingBar } from "@/components/ui/top-loading-bar";
import { useNavigationLoading } from "@/hooks/use-navigation-loading";
import { CelebrationModal } from "@/components/gamification/celebration-modal";
import { useChildStats } from "@/hooks/use-gamification";

import { readLastRole } from "@/store/auth-store";
import { ChildShellSkeleton, ParentDashboardSkeleton } from "@/components/ui/skeleton";

const noSubscribe = () => () => {};

/** Skeleton com a cara da área que vai abrir (responsável ou criança) */
function DashboardLoading({ message }: { message: string }) {
  const pathname = usePathname();
  // No servidor não há storage: começa neutro e troca logo após hidratar, sem erro de hidratação
  const lastRole = useSyncExternalStore(noSubscribe, readLastRole, () => null);

  return (
    <main id="main-content" role="status" aria-busy="true" className="animate-fade-in">
      <span className="sr-only">{message}</span>
      {lastRole === "parent" ? (
        <ParentDashboardSkeleton />
      ) : lastRole === "child" ? (
        <ChildShellSkeleton pathname={pathname} />
      ) : null}
    </main>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const isChild = user?.role === "child";
  const { data: stats } = useChildStats(isChild && isAuthenticated);
  const navLoading = useNavigationLoading();

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
        <header className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Área dos responsáveis</p>
          <h1 className="font-display text-3xl font-bold">Olá, {user.name}!</h1>
        </header>
        {children}
      </div>
    );
  }

  const onLogout = () => logout.mutate();

  // Dentro da lição: modo foco, sem menus (como no Duolingo)
  if (pathname.includes("/lessons/")) {
    return (
      <>
        <CelebrationModal />
        <TopLoadingBar active={navLoading} />
        <main id="main-content" className="mx-auto max-w-2xl px-4 py-6">
          {children}
        </main>
      </>
    );
  }

  return (
    <>
      <CelebrationModal />
      <TopLoadingBar active={navLoading} />
      <ChildSidebar onLogout={onLogout} logoutPending={logout.isPending} stats={stats} displayName={user.name} />
      <div className="lg:pl-64">
        <div className="mx-auto flex max-w-5xl justify-center gap-10 px-4 pb-28 pt-0 lg:pb-12 xl:pt-6">
          <div className="w-full min-w-0 max-w-2xl">
            <ChildTopBar stats={stats} displayName={user.name} />
            <main id="main-content" className="pt-2 lg:pt-4">
              {children}
            </main>
          </div>
          <ChildRightRail stats={stats} displayName={user.name} />
        </div>
      </div>
      <ChildBottomNav onLogout={onLogout} />
    </>
  );
}
