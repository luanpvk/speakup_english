"use client";

import { toast } from "@/store/toast-store";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Check,
  Coins,
  Crown,
  Gift,
  Glasses,
  Loader2,
  Lock,
  Palette,
  Rainbow,
  Scissors,
  Shield,
  Shirt,
  Sparkles,
  Star,
  Waves,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useChildStats, useShop } from "@/hooks/use-gamification";
import { AvatarFigure } from "@/components/gamification/avatar-figure";
import { useAuth } from "@/hooks/use-auth";
import { useGamificationStore } from "@/store/gamification-store";
import { gamificationApi } from "@/services/gamification.service";
import { ROUTES } from "@/utils/constants";

type ShopReward = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  cost: number;
  owned: boolean;
  requiredLevel: number;
  type?: string;
};

type ShopAvatarItem = {
  slug: string;
  name: string;
  icon: string;
  price: number;
  owned: boolean;
  canAfford: boolean;
  levelOk: boolean;
  unlockLevel: number;
  type: string;
};

export default function ShopPage() {
  const { user } = useAuth();
  const isChild = user?.role === "child";
  const { data: shop, isLoading, error: loadError, refetch } = useShop(isChild);
  // Visual atual da criança: cada item da loja aparece vestido no personagem dela
  const { data: stats } = useChildStats(isChild);
  const queryClient = useQueryClient();
  const showCelebration = useGamificationStore((s) => s.showCelebration);

  const purchase = useMutation({
    mutationFn: async (payload: { rewardSlug?: string; itemSlug?: string }) => {
      if (payload.itemSlug) {
        return gamificationApi.purchaseAvatarItem(payload.itemSlug);
      }
      if (payload.rewardSlug) {
        return gamificationApi.purchaseReward(payload.rewardSlug);
      }
      throw new Error("Item inválido");
    },
    onSuccess: (res, variables) => {
      if (!res.success) {
        toast.error("Não deu para comprar", res.error ?? "Tente de novo daqui a pouco.");
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["gamification"] });
      showCelebration({
        title: "É seu!",
        message: variables.itemSlug
          ? "Vá em Avatar para usar o item novo."
          : "A recompensa já está na sua conta.",
        coins: variables.itemSlug ? undefined : 0,
      });
    },
    onError: () => toast.error("Não deu para comprar", "Confira sua internet e tente de novo."),
  });
  const [filter, setFilter] = useState<FilterId>("all");

  if (!isChild) {
    return (
      <Card className="border-2">
        <CardContent className="py-8 text-center">
          <p>A loja é só para exploradores. Entre na área da criança.</p>
          <Button className="mt-4" asChild>
            <Link href="/login/child">Login infantil</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return <LoadingState message="Abrindo a loja..." skeleton="grid" />;
  }

  if (loadError || !shop) {
    return (
      <Card className="border-2">
        <CardContent className="py-8 text-center space-y-3">
          <p>
            {loadError instanceof Error
              ? loadError.message
              : "Não foi possível abrir a loja."}
          </p>
          <Button className="mt-4" onClick={() => refetch()}>
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  const rewards = shop.rewards as ShopReward[];
  const avatarItems = shop.avatarItems as ShopAvatarItem[];
  // Só o botão do item sendo comprado mostra carregando; os outros ficam como estão
  const buyingSlug = purchase.isPending
    ? (purchase.variables?.itemSlug ?? purchase.variables?.rewardSlug)
    : undefined;
  const visibleItems = (
    filter === "all" ? avatarItems : avatarItems.filter((item) => item.type === filter)
  ).sort((a, b) => a.price - b.price);

  return (
    <div className="space-y-10">
      <header className="flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-end gap-3">
          <Image src="/mascot.png" alt="" width={84} height={84} className="shrink-0" />
          <div className="relative mb-3 rounded-2xl border-2 border-border bg-card px-4 py-2.5 shadow-[0_4px_0_hsl(var(--border-shadow))]">
            <p className="font-display text-lg font-bold leading-tight">Bem-vindo à lojinha!</p>
            <p className="text-sm text-muted-foreground">O que vai levar hoje?</p>
            <span className="absolute -left-[9px] bottom-4 h-4 w-4 rotate-45 border-b-2 border-l-2 border-border bg-card" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="flex items-center gap-2 rounded-2xl border-2 border-amber-400/60 bg-amber-400/10 px-4 py-2 font-display text-2xl font-bold text-amber-500"
            aria-label={`Você tem ${shop.coins} moedas`}
          >
            <Coins className="h-6 w-6" aria-hidden />
            {shop.coins}
          </span>
          <Button variant="outline" asChild>
            <Link href={ROUTES.avatar}>
              <Palette className="h-4 w-4" />
              Avatar
            </Link>
          </Button>
        </div>
      </header>

      <section>
        <h2 className="font-display text-2xl font-bold">Turbinadas</h2>
        <p className="mb-4 text-muted-foreground">Coisas que ajudam você a crescer mais rápido.</p>
        <ul className="divide-y-2 divide-border overflow-hidden rounded-3xl border-2 border-border bg-card">
          {rewards.map((reward) => {
            const look = REWARD_LOOK[reward.type ?? ""] ?? REWARD_LOOK.default;
            const Icon = ITEM_ICON[reward.slug] ?? look.icon;
            return (
              <li key={reward.slug} className="flex items-center gap-4 p-4">
                <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${look.tile}`}>
                  <Icon className="h-7 w-7" strokeWidth={2.4} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-lg font-bold leading-tight">{reward.name}</p>
                  <p className="text-sm text-muted-foreground">{reward.description}</p>
                </div>
                <PriceButton
                  price={reward.cost}
                  owned={reward.owned}
                  levelNeeded={shop.level < reward.requiredLevel ? reward.requiredLevel : undefined}
                  missingCoins={Math.max(0, reward.cost - shop.coins)}
                  buying={buyingSlug === reward.slug}
                  locked={Boolean(buyingSlug)}
                  onBuy={() => purchase.mutate({ rewardSlug: reward.slug })}
                />
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h2 className="font-display text-2xl font-bold">Visual do personagem</h2>
        <p className="mb-4 text-muted-foreground">Compre aqui e vista no seu avatar.</p>
        <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="Categorias">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-full border-2 px-4 py-1.5 text-sm font-bold transition-colors ${
                filter === f.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {visibleItems.map((item, i) => {
            const look = TYPE_LOOK[item.type] ?? TYPE_LOOK.accessory;
            const current = stats?.avatar;
            return (
              <motion.div
                key={item.slug}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex flex-col overflow-hidden rounded-3xl border-2 border-border bg-card"
              >
                <div className={`relative flex items-center justify-center p-3 ${look.tile}`}>
                  <span className="block h-24 w-24 overflow-hidden rounded-full border-4 border-card">
                    <AvatarFigure
                      base={current?.baseEmoji}
                      hair={item.type === "hair" ? item.slug : current?.hairSlug}
                      clothes={item.type === "clothes" ? item.slug : current?.clothesSlug}
                      accessory={item.type === "accessory" ? item.slug : current?.accessorySlug}
                      background={item.type === "background" ? item.slug : current?.backgroundSlug}
                      title={item.name}
                    />
                  </span>
                  {item.owned && (
                    <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                      <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                      Seu
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-3 p-3">
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-wide ${look.label}`}>{look.name}</p>
                    <p className="font-display text-base font-bold leading-tight">{item.name}</p>
                  </div>
                  <PriceButton
                    className="mt-auto w-full"
                    price={item.price}
                    owned={item.owned}
                    levelNeeded={item.levelOk ? undefined : item.unlockLevel}
                    missingCoins={Math.max(0, item.price - shop.coins)}
                    buying={buyingSlug === item.slug}
                    locked={Boolean(buyingSlug)}
                    onBuy={() => purchase.mutate({ itemSlug: item.slug })}
                    useHref={ROUTES.avatar}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

const FILTERS = [
  { id: "all", label: "Tudo" },
  { id: "hair", label: "Cabelo" },
  { id: "clothes", label: "Roupas" },
  { id: "accessory", label: "Acessórios" },
  { id: "background", label: "Fundos" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

const TYPE_LOOK: Record<string, { name: string; icon: LucideIcon; tile: string; label: string }> = {
  hair: { name: "Cabelo", icon: Scissors, tile: "bg-rose-400/15 text-rose-500", label: "text-rose-500" },
  clothes: { name: "Roupa", icon: Shirt, tile: "bg-sky-400/15 text-sky-500", label: "text-sky-500" },
  accessory: { name: "Acessório", icon: Glasses, tile: "bg-amber-400/15 text-amber-500", label: "text-amber-500" },
  background: { name: "Fundo", icon: Palette, tile: "bg-sky-400/15 text-sky-500", label: "text-sky-500" },
};

const REWARD_LOOK: Record<string, { icon: LucideIcon; tile: string }> = {
  boost: { icon: Zap, tile: "bg-amber-400/15 text-amber-500" },
  badge: { icon: Sparkles, tile: "bg-secondary/15 text-secondary" },
  cosmetic: { icon: Shield, tile: "bg-rose-400/15 text-rose-500" },
  default: { icon: Gift, tile: "bg-primary/15 text-primary" },
};

/** Ícone próprio de cada item (os emojis do banco viravam todos o mesmo ícone genérico) */
const ITEM_ICON: Record<string, LucideIcon> = {
  "hair-default": Scissors,
  "hair-curly": Waves,
  "hair-spiky": Zap,
  "clothes-default": Shirt,
  "clothes-cape": Shield,
  "clothes-rainbow": Rainbow,
  "acc-glasses": Glasses,
  "acc-hat": Crown,
  "acc-star": Star,
  "reward-xp-boost": Zap,
  "reward-star-pack": Sparkles,
  "reward-cape": Shield,
};

function PriceButton({
  price,
  owned,
  levelNeeded,
  missingCoins,
  buying,
  locked,
  onBuy,
  className,
  useHref,
}: {
  /** Item já comprado: mostra "Usar" levando para esta página */
  useHref?: string;
  price: number;
  owned: boolean;
  levelNeeded?: number;
  missingCoins: number;
  buying: boolean;
  locked: boolean;
  onBuy: () => void;
  className?: string;
}) {
  if (owned && useHref) {
    return (
      <Button size="sm" variant="outline" className={className} asChild>
        <Link href={useHref}>
          <Palette className="h-4 w-4" />
          Usar
        </Link>
      </Button>
    );
  }
  if (owned) {
    return (
      <span className={`flex h-10 items-center justify-center gap-1.5 rounded-xl px-4 text-sm font-bold text-primary ${className ?? ""}`}>
        <Check className="h-4 w-4" strokeWidth={3} aria-hidden />
        É seu
      </span>
    );
  }
  if (levelNeeded) {
    return (
      <span className={`flex h-10 items-center justify-center gap-1.5 rounded-xl bg-muted px-4 text-sm font-bold text-muted-foreground ${className ?? ""}`}>
        <Lock className="h-4 w-4" aria-hidden />
        Nível {levelNeeded}
      </span>
    );
  }
  const cantAfford = missingCoins > 0;
  return (
    <Button
      size="sm"
      variant={cantAfford ? "outline" : "accent"}
      className={className}
      disabled={cantAfford || (locked && !buying)}
      onClick={onBuy}
      aria-label={cantAfford ? `Faltam ${missingCoins} moedas` : `Comprar por ${price} moedas`}
      title={cantAfford ? `Faltam ${missingCoins} moedas` : undefined}
    >
      {buying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Coins className="h-4 w-4" />}
      {buying ? "Comprando" : price}
    </Button>
  );
}
