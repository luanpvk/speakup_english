"use client";

import Link from "next/link";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/utils/constants";

const navItems = [
  { href: ROUTES.dashboard, label: "Início", icon: Home },
  { href: ROUTES.lessons, label: "Lições", icon: BookOpen },
  { href: ROUTES.flashcards, label: "Flashcards", icon: Layers },
  { href: ROUTES.progress, label: "Progresso", icon: BarChart3 },
  { href: ROUTES.achievements, label: "Conquistas", icon: Award },
  { href: ROUTES.shop, label: "Loja", icon: ShoppingBag },
  { href: ROUTES.ranking, label: "Ranking", icon: Trophy },
  { href: ROUTES.avatar, label: "Avatar", icon: Palette },
  { href: ROUTES.profile, label: "Perfil", icon: User },
];

export function ChildNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex flex-wrap gap-1 rounded-2xl border-2 border-border bg-card p-2"
      aria-label="Navegação do painel"
    >
      {navItems.map(({ href, label, icon: Icon }) => {
        const active =
          href === ROUTES.dashboard
            ? pathname === href
            : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            <span className="hidden lg:inline">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
