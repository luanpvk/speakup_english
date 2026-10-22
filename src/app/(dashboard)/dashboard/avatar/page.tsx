"use client";

import { toast } from "@/store/toast-store";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, ShoppingBag, Check, Coins, Undo2 } from "lucide-react";
import { AVATAR_ICON_OPTIONS } from "@/lib/icons/kid-icons";
import { AvatarFigure } from "@/components/gamification/avatar-figure";
import { LoadingState } from "@/components/ui/loading-state";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AvatarPreview } from "@/components/gamification/avatar-preview";
import { useAvatar, useChildStats } from "@/hooks/use-gamification";
import { useAuth } from "@/hooks/use-auth";
import { gamificationApi } from "@/services/gamification.service";
import { ROUTES } from "@/utils/constants";
import { cn } from "@/lib/utils";

type AvatarItemRow = {
  slug: string;
  name: string;
  icon: string;
  type: string;
  owned: boolean;
  price: number;
  unlockLevel: number;
};

export default function AvatarPage() {
  const { user } = useAuth();
  const isChild = user?.role === "child";
  const { data, isLoading, error, refetch } = useAvatar(isChild);
  const { data: stats } = useChildStats();
  const queryClient = useQueryClient();

  const [selectedHair, setSelectedHair] = useState<string | null>(null);
  const [selectedClothes, setSelectedClothes] = useState<string | null>(null);
  const [selectedAccessory, setSelectedAccessory] = useState<string | null | "">(null);
  const [selectedBackground, setSelectedBackground] = useState<string | null>(null);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [tab, setTab] = useState<TabId>("base");

  const updateMutation = useMutation({
    mutationFn: () => {
      if (!data) throw new Error("Carregando...");
      const accessoryValue =
        selectedAccessory === ""
          ? null
          : selectedAccessory ?? data.avatar.accessorySlug ?? null;

      return gamificationApi.updateAvatar({
        hairSlug: selectedHair ?? data.avatar.hairSlug,
        clothesSlug: selectedClothes ?? data.avatar.clothesSlug,
        accessorySlug: accessoryValue,
        backgroundSlug: selectedBackground ?? data.avatar.backgroundSlug ?? "bg-default",
        baseEmoji: selectedEmoji ?? data.avatar.baseEmoji,
      });
    },
    onSuccess: (res) => {
      if (!res.success) {
        toast.error("Não deu para salvar o avatar", res.error ?? "Tente de novo.");
        return;
      }
      toast.success("Visual salvo!", "Seu personagem já aparece assim em todo o site.");
      queryClient.invalidateQueries({ queryKey: ["gamification"] });
    },
    onError: () => toast.error("Não deu para salvar o avatar", "Confira sua internet e tente de novo."),
  });


  if (!isChild) {
    return (
      <Card className="border-2">
        <CardContent className="py-8 text-center">
          <p>Personalize o avatar entrando na área da criança.</p>
          <Button className="mt-4" asChild>
            <Link href="/login/child">Login infantil</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return <LoadingState message="Montando seu avatar..." skeleton="grid" />;
  }

  if (error || !data) {
    return (
      <Card className="border-2">
        <CardContent className="py-8 text-center space-y-4">
          <p>
            {error instanceof Error
              ? error.message
              : "Não foi possível carregar o avatar."}
          </p>
          <Button onClick={() => refetch()}>Tentar novamente</Button>
        </CardContent>
      </Card>
    );
  }

  const items = data.items as AvatarItemRow[];
  const saved = {
    base: data.avatar.baseEmoji,
    hair: data.avatar.hairSlug ?? "hair-default",
    clothes: data.avatar.clothesSlug ?? "clothes-default",
    accessory: data.avatar.accessorySlug ?? null,
    background: data.avatar.backgroundSlug ?? "bg-default",
  };
  const look = {
    base: selectedEmoji ?? saved.base,
    hair: selectedHair ?? saved.hair,
    clothes: selectedClothes ?? saved.clothes,
    accessory: selectedAccessory === "" ? null : (selectedAccessory ?? saved.accessory),
    background: selectedBackground ?? saved.background,
  };
  const dirty =
    look.base !== saved.base ||
    look.hair !== saved.hair ||
    look.clothes !== saved.clothes ||
    look.accessory !== saved.accessory ||
    look.background !== saved.background;

  const reset = () => {
    setSelectedEmoji(null);
    setSelectedHair(null);
    setSelectedClothes(null);
    setSelectedAccessory(null);
    setSelectedBackground(null);
  };

  const coins = data.coins ?? stats?.profile.coins ?? 0;
  const tabItems =
    tab === "base" ? [] : items.filter((i) => i.type === tab).sort((a, b) => a.price - b.price);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold">Meu avatar</h1>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-xl border-2 border-amber-400/60 bg-amber-400/10 px-3 py-1.5 font-display text-lg font-bold text-amber-500">
            <Coins className="h-5 w-5" aria-hidden />
            {coins}
          </span>
          <Button variant="outline" size="sm" asChild>
            <Link href={ROUTES.shop}>
              <ShoppingBag className="h-4 w-4" />
              Loja
            </Link>
          </Button>
        </div>
      </header>

      <section className="flex flex-col items-center gap-4 rounded-3xl border-2 border-border bg-card p-6">
        <div className="animate-float-gentle">
          <AvatarPreview
            baseEmoji={look.base}
            hairSlug={look.hair}
            clothesSlug={look.clothes}
            accessorySlug={look.accessory}
            backgroundSlug={look.background}
            size="xl"
          />
        </div>
        <div className="flex w-full max-w-xs gap-2">
          {dirty && (
            <Button variant="outline" className="flex-1" onClick={reset} disabled={updateMutation.isPending}>
              <Undo2 className="h-4 w-4" />
              Desfazer
            </Button>
          )}
          <Button
            className="flex-1"
            disabled={!dirty || updateMutation.isPending}
            onClick={() => updateMutation.mutate()}
          >
            {updateMutation.isPending ? (
              <Loader2 className="animate-spin" />
            ) : !dirty ? (
              <Check className="h-4 w-4" strokeWidth={3} />
            ) : null}
            {updateMutation.isPending ? "Salvando..." : dirty ? "Salvar visual" : "Tudo salvo"}
          </Button>
        </div>
      </section>

      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Partes do avatar">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "shrink-0 rounded-full border-2 px-4 py-1.5 text-sm font-bold transition-colors",
              tab === t.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:bg-muted"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4" role="tabpanel">
        {tab === "base" &&
          AVATAR_ICON_OPTIONS.map(({ id, label }) => (
            <OptionTile
              key={id}
              label={label}
              selected={look.base === id}
              onSelect={() => setSelectedEmoji(id)}
              figure={{ ...look, base: id }}
            />
          ))}

        {tab === "accessory" && (
          <OptionTile
            label="Nenhum"
            selected={!look.accessory}
            onSelect={() => setSelectedAccessory("")}
            figure={{ ...look, accessory: null }}
          />
        )}

        {tabItems.map((item) => (
          <OptionTile
            key={item.slug}
            label={item.name}
            selected={
              (item.type === "hair" && look.hair === item.slug) ||
              (item.type === "clothes" && look.clothes === item.slug) ||
              (item.type === "accessory" && look.accessory === item.slug) ||
              (item.type === "background" && look.background === item.slug)
            }
            locked={!item.owned}
            price={item.price}
            onSelect={() => {
              if (item.type === "hair") setSelectedHair(item.slug);
              if (item.type === "clothes") setSelectedClothes(item.slug);
              if (item.type === "accessory") setSelectedAccessory(item.slug);
              if (item.type === "background") setSelectedBackground(item.slug);
            }}
            figure={{
              ...look,
              [item.type === "hair"
                ? "hair"
                : item.type === "clothes"
                  ? "clothes"
                  : item.type === "background"
                    ? "background"
                    : "accessory"]: item.slug,
            }}
          />
        ))}
      </div>
    </div>
  );
}

const TABS = [
  { id: "base", label: "Personagem" },
  { id: "hair", label: "Cabelo" },
  { id: "clothes", label: "Roupa" },
  { id: "accessory", label: "Acessório" },
  { id: "background", label: "Fundo" },
] as const;

type TabId = (typeof TABS)[number]["id"];

type Look = { base: string; hair: string; clothes: string; accessory: string | null; background: string };

/** Opção mostrada como miniatura do próprio personagem usando a peça */
function OptionTile({
  label,
  selected,
  locked = false,
  price,
  onSelect,
  figure,
}: {
  label: string;
  selected: boolean;
  locked?: boolean;
  price?: number;
  onSelect: () => void;
  figure: Look;
}) {
  const content = (
    <>
      <span className="relative block aspect-square w-full overflow-hidden rounded-2xl">
        <AvatarFigure
          base={figure.base}
          hair={figure.hair}
          clothes={figure.clothes}
          accessory={figure.accessory}
          background={figure.background}
          className={cn(locked && "opacity-40 grayscale")}
        />
        {locked && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex items-center gap-1 rounded-full bg-card/95 px-2 py-1 text-xs font-bold text-amber-500 shadow">
              <Coins className="h-3.5 w-3.5" aria-hidden />
              {price}
            </span>
          </span>
        )}
        {selected && (
          <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="h-4 w-4" strokeWidth={3} aria-hidden />
          </span>
        )}
      </span>
      <span className="mt-1.5 block text-center text-xs font-bold leading-tight">{label}</span>
    </>
  );

  const base = cn(
    "rounded-3xl border-2 p-2 text-left transition-all",
    selected ? "border-primary bg-speakup-green-soft" : "border-border bg-card hover:border-primary/50"
  );

  // Bloqueado: leva para a loja em vez de equipar
  if (locked) {
    return (
      <Link href={ROUTES.shop} className={cn(base, "border-dashed")} aria-label={`${label}: comprar na loja por ${price} moedas`}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onSelect} className={base} aria-pressed={selected} aria-label={label}>
      {content}
    </button>
  );
}
