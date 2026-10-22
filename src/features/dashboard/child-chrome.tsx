"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  User,
  ShoppingBag,
  Trophy,
  BarChart3,
  Award,
  Palette,
  Layers,
  LogOut,
  MoreHorizontal,
  Coins,
  Star,
  Flame,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { AvatarPreview } from "@/components/gamification/avatar-preview";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Button } from "@/components/ui/button";
import { KidIcon } from "@/lib/icons/kid-icons";
import { getHyperfocusTheme } from "@/lib/data/hyperfocus";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/utils/constants";
import type { ChildStats } from "@/types/gamification";

type NavItem = { href: string; label: string; icon: LucideIcon; color: string };

const NAV_ITEMS: NavItem[] = [
  { href: ROUTES.dashboard, label: "Aprender", icon: Home, color: "text-primary" },
  { href: ROUTES.lessons, label: "Lições", icon: BookOpen, color: "text-sky-500" },
  { href: ROUTES.flashcards, label: "Flashcards", icon: Layers, color: "text-secondary" },
  { href: ROUTES.ranking, label: "Ranking", icon: Trophy, color: "text-amber-500" },
  { href: ROUTES.shop, label: "Loja", icon: ShoppingBag, color: "text-rose-500" },
  { href: ROUTES.achievements, label: "Conquistas", icon: Award, color: "text-orange-500" },
  { href: ROUTES.progress, label: "Progresso", icon: BarChart3, color: "text-teal-500" },
  { href: ROUTES.avatar, label: "Avatar", icon: Palette, color: "text-fuchsia-500" },
  { href: ROUTES.profile, label: "Perfil", icon: User, color: "text-indigo-500" },
];

/** Itens que cabem na barra inferior do celular; o resto fica em "Mais" */
const MOBILE_PRIMARY = 4;

function isActive(pathname: string, href: string) {
  return href === ROUTES.dashboard ? pathname === href : pathname.startsWith(href);
}

export function ChildSidebar({
  onLogout,
  logoutPending,
  stats,
  displayName,
}: {
  onLogout: () => void;
  logoutPending?: boolean;
  stats?: ChildStats;
  displayName: string;
}) {
  const pathname = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r-2 border-border bg-card/60 px-4 py-6 backdrop-blur lg:flex">
      <Logo size="sm" href="/" className="mb-6 self-center [&_img]:object-center" />
      <nav aria-label="Navegação do painel" className="flex flex-1 flex-col gap-1.5 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon, color }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-4 rounded-2xl border-2 px-4 py-3 font-display text-base font-semibold uppercase tracking-wide transition-colors",
                active
                  ? "border-primary/50 bg-speakup-green-soft text-primary"
                  : "border-transparent text-muted-foreground hover:bg-muted"
              )}
            >
              <Icon className={cn("h-7 w-7 shrink-0", color)} strokeWidth={2.4} aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>
      {/* Quem está usando: personagem, nome e nível, com tema e sair ao lado */}
      <div className="mt-4 rounded-2xl border-2 border-border bg-card p-2">
        <Link
          href={ROUTES.profile}
          className="flex min-w-0 items-center gap-2.5 rounded-xl p-1.5 transition-colors hover:bg-muted"
          aria-label={`Meu perfil: ${displayName}`}
        >
          <AvatarPreview
            baseEmoji={stats?.avatar.baseEmoji}
            hairSlug={stats?.avatar.hairSlug}
            clothesSlug={stats?.avatar.clothesSlug}
            accessorySlug={stats?.avatar.accessorySlug}
            backgroundSlug={stats?.avatar.backgroundSlug}
            size="sm"
            className="h-11 w-11 border-2"
          />
          <span className="min-w-0">
            <span className="block truncate font-display font-bold leading-tight">{displayName}</span>
            <span className="block text-xs font-semibold text-primary">Nível {stats?.profile.level ?? 1}</span>
          </span>
        </Link>
        <div className="mt-2 grid grid-cols-2 gap-1 border-t-2 border-border pt-2">
          <ThemeToggle compact label="Tema" className="w-full text-muted-foreground hover:text-foreground" />
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            disabled={logoutPending}
            className="w-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-5 w-5" />
            Sair
          </Button>
        </div>
      </div>
    </aside>
  );
}

export function ChildBottomNav({ onLogout }: { onLogout: () => void }) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const primary = NAV_ITEMS.slice(0, MOBILE_PRIMARY);
  const rest = NAV_ITEMS.slice(MOBILE_PRIMARY);
  const restActive = rest.some((i) => isActive(pathname, i.href));

  return (
    <>
      {moreOpen && (
        <div className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden" onClick={() => setMoreOpen(false)}>
          <div
            className="absolute inset-x-3 bottom-24 grid grid-cols-3 gap-2 rounded-3xl border-2 border-border bg-card p-3 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {rest.map(({ href, label, icon: Icon, color }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMoreOpen(false)}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-2xl p-3 text-xs font-bold",
                  isActive(pathname, href) ? "bg-speakup-green-soft text-primary" : "hover:bg-muted"
                )}
              >
                <Icon className={cn("h-7 w-7", color)} strokeWidth={2.4} aria-hidden />
                {label}
              </Link>
            ))}
            <button
              type="button"
              onClick={onLogout}
              className="flex flex-col items-center gap-1 rounded-2xl p-3 text-xs font-bold text-muted-foreground hover:bg-muted"
            >
              <LogOut className="h-7 w-7" aria-hidden />
              Sair
            </button>
          </div>
        </div>
      )}
      <nav
        aria-label="Navegação do painel"
        className="fixed inset-x-0 bottom-0 z-50 flex justify-around border-t-2 border-border bg-card/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur lg:hidden"
      >
        {primary.map(({ href, label, icon: Icon, color }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-w-14 flex-col items-center gap-0.5 rounded-2xl border-2 px-2 py-1.5 text-[11px] font-bold",
                active ? "border-primary/50 bg-speakup-green-soft text-primary" : "border-transparent text-muted-foreground"
              )}
            >
              <Icon className={cn("h-6 w-6", color)} strokeWidth={2.4} aria-hidden />
              {label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setMoreOpen((o) => !o)}
          aria-expanded={moreOpen}
          className={cn(
            "flex min-w-14 flex-col items-center gap-0.5 rounded-2xl border-2 px-2 py-1.5 text-[11px] font-bold",
            restActive || moreOpen ? "border-primary/50 bg-speakup-green-soft text-primary" : "border-transparent text-muted-foreground"
          )}
        >
          <MoreHorizontal className="h-6 w-6" strokeWidth={2.4} aria-hidden />
          Mais
        </button>
      </nav>
    </>
  );
}

function StatPill({ icon, value, label, className }: { icon: ReactNode; value: ReactNode; label: string; className?: string }) {
  return (
    <span
      className={cn("flex items-center gap-1.5 rounded-xl px-2 py-1 font-display text-lg font-bold", className)}
      title={label}
      aria-label={`${label}: ${value}`}
    >
      {icon}
      {value}
    </span>
  );
}

export function ChildStatPills({ stats }: { stats?: ChildStats }) {
  return (
    <div className="flex items-center gap-1">
      <StatPill
        label="Dias seguidos"
        value={stats?.streak.current ?? 0}
        className="text-orange-500"
        icon={<Flame className="h-6 w-6 fill-orange-400" aria-hidden />}
      />
      <StatPill
        label="Moedas"
        value={stats?.profile.coins ?? 0}
        className="text-amber-500"
        icon={<Coins className="h-6 w-6" aria-hidden />}
      />
      <StatPill
        label="Estrelas"
        value={stats?.profile.stars ?? 0}
        className="text-secondary"
        icon={<Star className="h-6 w-6 fill-current" aria-hidden />}
      />
    </div>
  );
}

/** Barra superior para telas sem o painel lateral direito */
export function ChildTopBar({ stats, displayName }: { stats?: ChildStats; displayName: string }) {
  return (
    <div className="sticky top-0 z-30 -mx-4 mb-4 flex items-center justify-between gap-2 border-b-2 border-border bg-background/90 px-4 py-2 backdrop-blur xl:hidden">
      <Link href={ROUTES.profile} className="flex min-w-0 items-center gap-2" aria-label="Meu perfil">
        <AvatarPreview
          baseEmoji={stats?.avatar.baseEmoji}
          hairSlug={stats?.avatar.hairSlug}
          clothesSlug={stats?.avatar.clothesSlug}
          accessorySlug={stats?.avatar.accessorySlug}
          backgroundSlug={stats?.avatar.backgroundSlug}
          size="sm"
          className="h-11 w-11 border-2"
        />
        <span className="truncate font-display font-bold">
          {displayName}
          <span className="block text-xs font-semibold text-primary">Nível {stats?.profile.level ?? 1}</span>
        </span>
      </Link>
      <ChildStatPills stats={stats} />
    </div>
  );
}

/** Painel direito (telas largas): perfil, XP, missões e tema favorito */
export function ChildRightRail({ stats, displayName }: { stats?: ChildStats; displayName: string }) {
  const theme = getHyperfocusTheme(stats?.profile.hyperfocus);
  return (
    <aside className="sticky top-6 hidden w-80 shrink-0 space-y-4 self-start xl:block">
      <ChildStatPills stats={stats} />

      <Link
        href={ROUTES.profile}
        className="flex items-center gap-3 rounded-3xl border-2 border-border bg-card p-4 transition-colors hover:bg-muted/40"
      >
        <AvatarPreview
          baseEmoji={stats?.avatar.baseEmoji}
          hairSlug={stats?.avatar.hairSlug}
          clothesSlug={stats?.avatar.clothesSlug}
          accessorySlug={stats?.avatar.accessorySlug}
          backgroundSlug={stats?.avatar.backgroundSlug}
          size="md"
        />
        <div className="min-w-0">
          <p className="truncate font-display text-xl font-bold">{displayName}</p>
          <p className="text-sm font-semibold text-primary">Nível {stats?.profile.level ?? 1} · Explorador</p>
        </div>
      </Link>

      {stats && (
        <section className="rounded-3xl border-2 border-border bg-card p-5">
          <h2 className="font-display text-lg font-bold">Meta de XP</h2>
          <p className="mb-3 text-sm text-muted-foreground">
            Faltam {Math.max(stats.xpProgress.needed - stats.xpProgress.current, 0)} XP para o nível{" "}
            {stats.profile.level + 1}
          </p>
          <ProgressBar value={stats.xpProgress.percent} color="primary" label={`${stats.xpProgress.current} / ${stats.xpProgress.needed} XP`} />
        </section>
      )}

      <section className="rounded-3xl border-2 border-border bg-card p-5">
        <h2 className="mb-3 font-display text-lg font-bold">Missão do dia</h2>
        <Link href={ROUTES.flashcards} className="flex items-center gap-3 rounded-2xl p-2 hover:bg-muted">
          <Layers className="h-9 w-9 text-secondary" aria-hidden />
          <span className="text-sm font-semibold">Revisar seus flashcards de hoje</span>
        </Link>
      </section>

      <Link
        href={ROUTES.profile}
        className="flex items-center gap-3 rounded-3xl border-2 border-border bg-card p-4 transition-colors hover:bg-muted/40"
      >
        {theme ? (
          <>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary/15">
              <KidIcon emoji={theme.icon} size="md" variant="plain" iconClassName="text-secondary" />
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Tema favorito
              </span>
              <span className="block font-display text-lg font-bold leading-tight">{theme.label}</span>
            </span>
          </>
        ) : (
          <>
            <Image src="/mascot.png" alt="" width={48} height={48} className="shrink-0" />
            <span className="text-sm">
              Escolha seu <strong>tema favorito</strong> no perfil e ganhe lições sobre ele!
            </span>
          </>
        )}
      </Link>
    </aside>
  );
}
