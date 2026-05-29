"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { LogOut, Coins, Star, Flame } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { AvatarPreview } from "@/components/gamification/avatar-preview";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ROUTES } from "@/utils/constants";
import type { ChildStats } from "@/types/gamification";
import { TopLoadingBar } from "@/components/ui/top-loading-bar";
import { useNavigationLoading } from "@/hooks/use-navigation-loading";

interface ChildDashboardHeaderProps {
  displayName: string;
  avatarEmoji?: string;
  stats?: ChildStats;
  onLogout: () => void;
  logoutPending?: boolean;
}

export function ChildDashboardHeader({
  displayName,
  avatarEmoji = "rabbit",
  stats,
  onLogout,
  logoutPending,
}: ChildDashboardHeaderProps) {
  const avatar = stats?.avatar;
  const profile = stats?.profile;
  const loading = useNavigationLoading();

  return (
    <header className="relative rounded-3xl border-2 border-primary/25 bg-gradient-to-br from-speakup-green-soft/60 via-card to-speakup-yellow-soft/50 shadow-md">
      <TopLoadingBar active={loading} placement="embedded" />
      <div className="flex flex-col gap-4 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Logo size="lg" href="/" />
          <div className="flex items-center gap-2">
            <ThemeToggle compact />
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              disabled={logoutPending}
              className="gap-1 text-muted-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={ROUTES.avatar}
            className="flex items-center gap-4 rounded-2xl bg-card/80 p-3 transition-shadow hover:shadow-md"
          >
            <AvatarPreview
              baseEmoji={avatar?.baseEmoji ?? avatarEmoji}
              size="md"
            />
            <div>
              <p className="text-sm font-medium text-primary">
                Nível {profile?.level ?? 1} · Explorador
              </p>
              <h1 className="font-display text-2xl font-bold leading-tight">
                Olá, {displayName}!
              </h1>
              <p className="text-sm text-muted-foreground">
                Toque no avatar para personalizar
              </p>
            </div>
          </Link>

          <div className="flex flex-wrap gap-2 sm:justify-end">
            <StatPill icon={<Coins className="h-4 w-4 text-amber-600" />} label="Moedas" value={profile?.coins ?? 0} />
            <StatPill icon={<Star className="h-4 w-4 text-secondary" />} label="Estrelas" value={profile?.stars ?? 0} />
            <StatPill icon={<Flame className="h-4 w-4 text-orange-500" />} label="Streak" value={`${stats?.streak.current ?? 0}d`} />
          </div>
        </div>

        {stats?.xpProgress && (
          <div className="rounded-xl bg-card/70 px-3 py-2">
            <ProgressBar
              value={stats.xpProgress.percent}
              label={`${stats.xpProgress.current} / ${stats.xpProgress.needed} XP`}
              color="primary"
            />
          </div>
        )}
      </div>
    </header>
  );
}

function StatPill({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div
      className="flex min-w-[100px] items-center gap-2 rounded-xl border-2 border-border/60 bg-card px-3 py-2 shadow-sm"
      title={label}
    >
      {icon}
      <div className="leading-tight">
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="font-display text-lg font-bold">{value}</p>
      </div>
    </div>
  );
}
