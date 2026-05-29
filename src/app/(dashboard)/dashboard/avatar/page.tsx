"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, ShoppingBag, Lock, Check, Coins } from "lucide-react";
import { AVATAR_ICON_OPTIONS } from "@/lib/icons/kid-icons";
import { KidIcon } from "@/lib/icons/kid-icons";
import { LoadingState } from "@/components/ui/loading-state";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AvatarPreview } from "@/components/gamification/avatar-preview";
import { useAvatar, useChildStats } from "@/hooks/use-gamification";
import { useAuth } from "@/hooks/use-auth";
import { useGamificationStore } from "@/store/gamification-store";
import { gamificationApi } from "@/services/gamification.service";
import { gamificationKeys } from "@/hooks/use-gamification";
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
  const showCelebration = useGamificationStore((s) => s.showCelebration);

  const [selectedHair, setSelectedHair] = useState<string | null>(null);
  const [selectedClothes, setSelectedClothes] = useState<string | null>(null);
  const [selectedAccessory, setSelectedAccessory] = useState<string | null | "">(null);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

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
        baseEmoji: selectedEmoji ?? data.avatar.baseEmoji,
      });
    },
    onSuccess: (res) => {
      if (!res.success) {
        setSaveError(res.error ?? "Erro ao salvar");
        return;
      }
      setSaveError(null);
      setSaved(true);
      showCelebration({
        title: "Avatar atualizado!",
        message: "Seu explorador está com visual novo!",
      });
      queryClient.invalidateQueries({ queryKey: ["gamification"] });
      setTimeout(() => setSaved(false), 3000);
    },
    onError: (e: Error) => setSaveError(e.message),
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
    return <LoadingState message="Montando seu avatar..." />;
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
  const hair = selectedHair ?? data.avatar.hairSlug;
  const clothes = selectedClothes ?? data.avatar.clothesSlug;
  const accessory =
    selectedAccessory === ""
      ? undefined
      : selectedAccessory ?? data.avatar.accessorySlug;
  const emoji = selectedEmoji ?? data.avatar.baseEmoji;

  const getItemIcon = (slug?: string) =>
    slug ? items.find((i) => i.slug === slug)?.icon : undefined;

  const itemsByType = (type: "hair" | "clothes" | "accessory") =>
    items.filter((i) => i.type === type);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Meu avatar</h1>
          <p className="text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              Personalize seu explorador ·
              <Coins className="h-4 w-4 text-amber-600" />
              {data.coins ?? stats?.profile.coins ?? 0} moedas
            </span>
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href={ROUTES.shop}>
            <ShoppingBag className="h-4 w-4" />
            Ir à loja
          </Link>
        </Button>
      </header>

      <Card className="border-2 border-primary/30 bg-gradient-to-br from-speakup-green-soft/40 to-card">
        <CardContent className="flex flex-col items-center gap-4 py-8">
          <AvatarPreview
            baseEmoji={emoji}
            hairIcon={getItemIcon(hair)}
            clothesIcon={getItemIcon(clothes)}
            accessoryIcon={accessory ? getItemIcon(accessory) : undefined}
            size="lg"
          />
          <p className="text-sm text-muted-foreground">Pré-visualização ao vivo</p>
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardHeader>
          <CardTitle>Personagem base</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap justify-center gap-2">
          {AVATAR_ICON_OPTIONS.map(({ id, Icon, label }) => (
            <button
              key={id}
              type="button"
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl border-2 p-3 transition-transform hover:scale-105",
                emoji === id ? "border-primary bg-speakup-green-soft ring-2 ring-primary/30" : "border-border"
              )}
              onClick={() => setSelectedEmoji(id)}
              aria-label={label}
            >
              <Icon className="h-8 w-8 text-primary" strokeWidth={2} />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          ))}
        </CardContent>
      </Card>

      {(["hair", "clothes", "accessory"] as const).map((type) => (
        <AvatarCategory
          key={type}
          type={type}
          items={itemsByType(type)}
          selectedSlug={
            type === "hair"
              ? (hair ?? "hair-default")
              : type === "clothes"
                ? (clothes ?? "clothes-default")
                : (accessory ?? "")
          }
          onSelect={(slug) => {
            if (type === "hair") setSelectedHair(slug);
            if (type === "clothes") setSelectedClothes(slug);
            if (type === "accessory") setSelectedAccessory(slug);
          }}
          onClearAccessory={type === "accessory" ? () => setSelectedAccessory("") : undefined}
        />
      ))}

      {saveError && (
        <p role="alert" className="text-sm text-destructive text-center">
          {saveError}
        </p>
      )}

      <Button
        className="w-full"
        size="lg"
        disabled={updateMutation.isPending}
        onClick={() => updateMutation.mutate()}
      >
        {updateMutation.isPending && <Loader2 className="animate-spin" />}
        {saved ? "Salvo!" : "Salvar avatar"}
      </Button>
    </div>
  );
}

function AvatarCategory({
  type,
  items,
  selectedSlug,
  onSelect,
  onClearAccessory,
}: {
  type: "hair" | "clothes" | "accessory";
  items: AvatarItemRow[];
  selectedSlug: string;
  onSelect: (slug: string) => void;
  onClearAccessory?: () => void;
}) {
  const title =
    type === "hair" ? "Cabelo" : type === "clothes" ? "Roupas" : "Acessórios";

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Itens bloqueados podem ser comprados na loja
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {items.map((item) => {
          const selected = selectedSlug === item.slug;
          return (
            <button
              key={item.slug}
              type="button"
              disabled={!item.owned}
              className={cn(
                "relative flex min-w-[88px] flex-col items-center gap-1 rounded-xl border-2 p-3 transition-all",
                item.owned
                  ? selected
                    ? "border-primary bg-speakup-green-soft shadow-md"
                    : "border-border hover:border-primary/50"
                  : "cursor-not-allowed border-dashed opacity-50"
              )}
              onClick={() => item.owned && onSelect(item.slug)}
            >
              {!item.owned && (
                <Lock className="absolute right-1 top-1 h-3 w-3 text-muted-foreground" />
              )}
              {item.owned && selected && (
                <Check className="absolute right-1 top-1 h-3 w-3 text-primary" />
              )}
              <KidIcon emoji={item.icon} slug={item.slug} size="sm" />
              <span className="text-xs font-medium text-center">{item.name}</span>
              {!item.owned && (
                <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                  <Coins className="h-3 w-3 text-amber-600" />
                  {item.price}
                </span>
              )}
            </button>
          );
        })}
        {onClearAccessory && selectedSlug && (
          <button
            type="button"
            className="rounded-xl border-2 border-dashed px-4 py-3 text-sm text-muted-foreground hover:border-primary"
            onClick={onClearAccessory}
          >
            Remover acessório
          </button>
        )}
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhum item nesta categoria.</p>
        )}
      </CardContent>
    </Card>
  );
}
