"use client";

import Link from "next/link";
import { ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { ROUTES } from "@/utils/constants";
import { cn } from "@/lib/utils";
import { resolveAvatarIcon } from "@/lib/icons/kid-icons";

interface UserMenuProps {
  compact?: boolean;
}

export function UserMenu({ compact }: UserMenuProps) {
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  if (isLoading) {
    return (
      <div
        className="h-10 w-28 animate-pulse rounded-xl bg-muted"
        aria-hidden
      />
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const avatarKey = user.avatarEmoji ?? (user.role === "child" ? "rabbit" : "smile");
  const AvatarIcon = resolveAvatarIcon(avatarKey);
  const dashboardHref = ROUTES.dashboard;

  return (
    <div className={cn("flex items-center gap-2", compact && "flex-col")}>
      <Link
        href={dashboardHref}
        className="group flex items-center gap-2 rounded-2xl border-2 border-primary/20 bg-speakup-green-soft/40 px-3 py-2 transition-all hover:border-primary hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`Ir para o painel de ${user.name}`}
      >
        <span
          className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-sm"
          aria-hidden
        >
          <AvatarIcon className="h-6 w-6 text-primary" strokeWidth={2.25} />
        </span>
        <span className="hidden max-w-[120px] truncate font-semibold sm:inline">
          {user.name}
        </span>
        <LayoutDashboard className="hidden h-4 w-4 text-muted-foreground group-hover:text-primary sm:block" />
        <ChevronDown className="h-4 w-4 text-muted-foreground sm:hidden" />
      </Link>
      {!compact && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          aria-label="Sair"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
