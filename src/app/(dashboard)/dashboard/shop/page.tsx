"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Loader2, Check, Palette, Coins } from "lucide-react";
import { KidIcon } from "@/lib/icons/kid-icons";
import { LoadingState } from "@/components/ui/loading-state";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useShop } from "@/hooks/use-gamification";
import { useAuth } from "@/hooks/use-auth";
import { useGamificationStore } from "@/store/gamification-store";
import { gamificationApi } from "@/services/gamification.service";
import { gamificationKeys } from "@/hooks/use-gamification";
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
  const queryClient = useQueryClient();
  const showCelebration = useGamificationStore((s) => s.showCelebration);
  const [error, setError] = useState<string | null>(null);

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
        setError(res.error ?? "Não foi possível comprar");
        return;
      }
      setError(null);
      queryClient.invalidateQueries({ queryKey: ["gamification"] });
      showCelebration({
        title: "Compra feita!",
        message: variables.itemSlug
          ? "Item desbloqueado! Vá ao Avatar para equipar."
          : "Recompensa adicionada à sua conta!",
        coins: variables.itemSlug ? undefined : 0,
      });
    },
    onError: (e: Error) => setError(e.message),
  });

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
    return <LoadingState message="Abrindo a loja..." />;
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

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2">
            <ShoppingBag className="h-8 w-8 text-primary" />
            Loja do explorador
          </h1>
          <p className="text-muted-foreground">
            Gaste moedas em recompensas e itens para seu avatar
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-2xl border-2 border-accent bg-speakup-yellow-soft px-6 py-3 text-xl font-bold">
            🪙 {shop.coins}
          </div>
          <Button variant="outline" asChild>
            <Link href={ROUTES.avatar}>
              <Palette className="h-4 w-4" />
              Meu avatar
            </Link>
          </Button>
        </div>
      </header>

      {error && (
        <p role="alert" className="rounded-xl border-2 border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <section>
        <h2 className="mb-4 font-display text-xl font-bold">Recompensas especiais</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rewards.map((reward, i) => (
            <ShopCard
              key={reward.slug}
              delay={i * 0.05}
              icon={reward.icon}
              name={reward.name}
              description={reward.description}
              cost={reward.cost}
              owned={reward.owned}
              disabled={
                reward.owned ||
                shop.coins < reward.cost ||
                shop.level < reward.requiredLevel ||
                purchase.isPending
              }
              disabledReason={
                reward.owned
                  ? "Possui"
                  : shop.level < reward.requiredLevel
                    ? `Nível ${reward.requiredLevel}+`
                    : shop.coins < reward.cost
                      ? "Sem moedas"
                      : undefined
              }
              onBuy={() => purchase.mutate({ rewardSlug: reward.slug })}
              pending={purchase.isPending}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-display text-xl font-bold">Roupas e acessórios</h2>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {avatarItems.map((item, i) => (
            <motion.div
              key={item.slug}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card
                className={`border-2 h-full text-center transition-shadow hover:shadow-md ${
                  item.owned ? "border-primary/50 bg-speakup-green-soft/30" : ""
                }`}
              >
                <CardContent className="py-6">
                  <KidIcon emoji={item.icon} slug={item.slug} size="lg" className="mx-auto" />
                  <p className="mt-2 font-semibold">{item.name}</p>
                  <p className="text-xs capitalize text-muted-foreground">{item.type}</p>
                  <p className="mt-1 flex items-center justify-center gap-1 text-sm font-bold">
                    <Coins className="h-4 w-4 text-amber-600" />
                    {item.price}
                  </p>
                  {item.owned ? (
                    <p className="mt-3 flex items-center justify-center gap-1 text-sm text-primary">
                      <Check className="h-4 w-4" /> Desbloqueado
                    </p>
                  ) : (
                    <Button
                      className="mt-3 w-full"
                      size="sm"
                      disabled={!item.canAfford || !item.levelOk || purchase.isPending}
                      onClick={() => purchase.mutate({ itemSlug: item.slug })}
                    >
                      {purchase.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : !item.levelOk ? (
                        `Nível ${item.unlockLevel}+`
                      ) : !item.canAfford ? (
                        "Sem moedas"
                      ) : (
                        "Comprar"
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ShopCard({
  icon,
  name,
  description,
  cost,
  owned,
  disabled,
  disabledReason,
  onBuy,
  pending,
  delay,
}: {
  icon: string;
  name: string;
  description: string;
  cost: number;
  owned: boolean;
  disabled: boolean;
  disabledReason?: string;
  onBuy: () => void;
  pending: boolean;
  delay: number;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <Card className={`border-2 h-full ${owned ? "opacity-75" : ""}`}>
        <CardHeader>
          <KidIcon emoji={icon} size="lg" />
          <CardTitle className="text-lg">{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1 font-bold">
            <Coins className="h-4 w-4 text-amber-600" />
            {cost}
          </span>
          <Button size="sm" disabled={disabled} onClick={onBuy}>
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : owned || disabledReason ? (
              disabledReason ?? "Possui"
            ) : (
              "Comprar"
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
