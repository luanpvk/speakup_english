"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Rabbit } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { useAuth } from "@/hooks/use-auth";

const navLinks = [
  { href: "/#features", label: "Recursos" },
  { href: "/#how-it-works", label: "Como funciona" },
  { href: "/#accessibility", label: "Acessibilidade" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b-2 border-border/60 bg-background/90 backdrop-blur-md">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6"
        aria-label="Principal"
      >
        <Logo size="md" href="/" className="shrink-0" />

        <ul className="hidden items-center gap-1 rounded-full border-2 border-border/60 bg-muted/50 p-1 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-card hover:text-foreground hover:shadow-sm"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden shrink-0 items-center gap-2 whitespace-nowrap lg:flex">
          <ThemeToggle compact />
          {!isLoading && isAuthenticated ? (
            <UserMenu />
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login/parent">Entrar</Link>
              </Button>
              <Button variant="child" size="sm" asChild>
                <Link href="/login/child">
                  <Rabbit className="h-4 w-4" aria-hidden />
                  Criança
                </Link>
              </Button>
              <Button asChild>
                <Link href="/register">Começar grátis</Link>
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-border lg:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <div
        className={cn(
          "border-t-2 border-border bg-background px-4 py-4 lg:hidden",
          open ? "block" : "hidden"
        )}
      >
        <ul className="flex flex-col gap-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block font-medium"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="flex flex-col gap-2 pt-2">
            <ThemeToggle />
            {!isLoading && isAuthenticated ? (
              <>
                <UserMenu compact />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setOpen(false)}
                  asChild
                >
                  <Link href="/dashboard">Meu painel</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/login/parent">Entrar (responsáveis)</Link>
                </Button>
                <Button asChild className="w-full">
                  <Link href="/register">Começar grátis</Link>
                </Button>
                <Button variant="child" asChild className="w-full">
                  <Link href="/login/child">Área da criança</Link>
                </Button>
              </>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
}
