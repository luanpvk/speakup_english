import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/** Bloco cinza com brilho deslizando (some com "Reduzir animações") */
export function Skeleton({ className, style }: { className?: string; style?: CSSProperties }) {
  return <div className={cn("skeleton rounded-2xl", className)} style={style} aria-hidden />;
}

/** Imita a trilha: banner do capítulo + bolinhas em zigue-zague */
export function PathSkeleton() {
  const offsets = [0, 44, 72, 44, 0, -44];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>
      <Skeleton className="h-28 w-full rounded-3xl" />
      <div className="flex flex-col items-center gap-12 py-6">
        {offsets.map((x, i) => (
          <Skeleton
            key={i}
            className="h-[72px] w-[72px] rounded-full"
            // mesmo deslocamento da trilha real, para não "pular" quando carregar
            style={{ transform: `translateX(${x}px)` }}
          />
        ))}
      </div>
    </div>
  );
}

/** Imita a tela de lição: barra de progresso, título e cartão com opções */
export function LessonSkeleton() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-4 flex-1 rounded-full" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="h-3 w-48" />
        <Skeleton className="h-7 w-64" />
      </div>
      <div className="space-y-3 rounded-3xl border-2 border-border p-6">
        <Skeleton className="mx-auto h-20 w-20 rounded-2xl" />
        <Skeleton className="mx-auto h-5 w-3/4" />
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    </div>
  );
}

/** Título centralizado + grade de cartões (loja, conquistas, avatar) */
export function GridSkeleton({ items = 6 }: { items?: number }) {
  return (
    <div className="space-y-6">
      <TitleSkeleton />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: items }, (_, i) => (
          <div key={i} className="space-y-3 rounded-3xl border-2 border-border p-5">
            <Skeleton className="h-14 w-14" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Título + lista de linhas (ranking, perfis cadastrados) */
export function ListSkeleton({ rows = 5, title = true }: { rows?: number; title?: boolean }) {
  return (
    <div className="space-y-6">
      {title && <TitleSkeleton />}
      <div className="space-y-3">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-2xl border-2 border-border p-4">
            <Skeleton className="h-11 w-11 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <Skeleton className="h-6 w-14" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Perfil/progresso: cartão com avatar + blocos de conteúdo */
export function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <TitleSkeleton />
      <div className="flex flex-col items-center gap-4 rounded-3xl border-2 border-border p-8 sm:flex-row">
        <Skeleton className="h-32 w-32 rounded-full" />
        <div className="w-full flex-1 space-y-3">
          <Skeleton className="h-7 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-10 w-48 rounded-xl" />
        </div>
      </div>
      {[0, 1].map((i) => (
        <div key={i} className="space-y-3 rounded-3xl border-2 border-border p-6">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-full rounded-full" />
          <Skeleton className="h-4 w-5/6 rounded-full" />
        </div>
      ))}
    </div>
  );
}

/** Formulário de login */
export function FormSkeleton() {
  return (
    <div className="w-full max-w-md space-y-4 rounded-3xl border-2 border-border bg-card p-6">
      <Skeleton className="mx-auto h-20 w-20 rounded-full" />
      <Skeleton className="mx-auto h-8 w-1/2" />
      {[0, 1].map((i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      ))}
      <Skeleton className="h-14 w-full" />
    </div>
  );
}

function TitleSkeleton() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Skeleton className="h-9 w-56" />
      <Skeleton className="h-4 w-72 max-w-full" />
    </div>
  );
}

/** Linhas sem título (lista dentro de uma página que já tem cabeçalho) */
export function RowsSkeleton() {
  return <ListSkeleton rows={4} title={false} />;
}

/** Flashcards: progresso do dia + cartão grande + botões de resposta */
export function FlashcardSkeleton() {
  return (
    <div className="mx-auto max-w-xl space-y-5">
      <Skeleton className="h-8 w-52" />
      <Skeleton className="h-4 w-full rounded-full" />
      <Skeleton className="h-72 w-full rounded-3xl" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
    </div>
  );
}

/** Área do responsável: cabeçalho, saudação, cartão de ações e formulário de cadastro */
export function ParentDashboardSkeleton() {
  return (
    <div>
      <div className="border-b-2 border-border">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Skeleton className="h-14 w-36" />
          <div className="flex items-center gap-3">
            <Skeleton className="hidden h-4 w-24 sm:block" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-xl" />
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-9 w-64" />
        </div>
        <div className="space-y-4 rounded-3xl border-2 border-border p-6">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex gap-3">
            <Skeleton className="h-12 w-52" />
            <Skeleton className="h-12 w-36" />
          </div>
        </div>
        <div className="space-y-5 rounded-3xl border-2 border-border p-6">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-2/3" />
          {[0, 1].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          ))}
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 8 }, (_, i) => (
              <Skeleton key={i} className="h-[74px] w-[60px] rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const CHILD_PAGE_SKELETON: [string, () => React.ReactNode][] = [
  ["/dashboard/lessons", () => <PathSkeleton />],
  ["/dashboard/flashcards", () => <FlashcardSkeleton />],
  ["/dashboard/ranking", () => <ListSkeleton />],
  ["/dashboard/profile", () => <ProfileSkeleton />],
  ["/dashboard/progress", () => <ProfileSkeleton />],
  ["/dashboard/shop", () => <GridSkeleton />],
  ["/dashboard/achievements", () => <GridSkeleton />],
  ["/dashboard/avatar", () => <GridSkeleton />],
];

/** Área da criança: menu lateral, conteúdo da página atual e painel direito */
export function ChildShellSkeleton({ pathname }: { pathname: string }) {
  if (pathname.startsWith("/dashboard/lessons/")) {
    return (
      <div className="px-4 py-6">
        <LessonSkeleton />
      </div>
    );
  }
  const page = CHILD_PAGE_SKELETON.find(([prefix]) => pathname.startsWith(prefix))?.[1];

  return (
    <div>
      <div className="fixed inset-y-0 left-0 hidden w-64 space-y-2 border-r-2 border-border px-4 py-6 lg:block">
        <Skeleton className="mb-6 h-14 w-36" />
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3">
            <Skeleton className="h-7 w-7 rounded-lg" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
      <div className="lg:pl-64">
        <div className="mx-auto flex max-w-5xl justify-center gap-10 px-4 pb-28 pt-4 xl:pt-6">
          <div className="w-full max-w-2xl">
            <div className="mb-4 flex items-center justify-between border-b-2 border-border pb-2 xl:hidden">
              <div className="flex items-center gap-2">
                <Skeleton className="h-11 w-11 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-6 w-36" />
            </div>
            {page ? page() : <PathSkeleton />}
          </div>
          <div className="hidden w-80 shrink-0 space-y-4 xl:block">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-24 w-full rounded-3xl" />
            <Skeleton className="h-28 w-full rounded-3xl" />
            <Skeleton className="h-24 w-full rounded-3xl" />
          </div>
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 flex justify-around border-t-2 border-border px-2 py-3 lg:hidden">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-10 w-12 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
