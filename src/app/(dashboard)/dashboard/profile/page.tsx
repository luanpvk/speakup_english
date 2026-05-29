"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AvatarPreview } from "@/components/gamification/avatar-preview";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useChildStats } from "@/hooks/use-gamification";
import { useThemeStore } from "@/store/theme-store";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/utils/constants";
import { LoadingState } from "@/components/ui/loading-state";

export default function ProfilePage() {
  const { data: stats, isLoading } = useChildStats();
  const prefs = useThemeStore();
  const setAccessibility = useThemeStore((s) => s.setAccessibility);
  const applyToDocument = useThemeStore((s) => s.applyToDocument);

  if (isLoading || !stats) {
    return <LoadingState message="Carregando perfil..." />;
  }

  const toggle = (key: keyof typeof prefs, value: boolean) => {
    setAccessibility({ [key]: value });
    applyToDocument();
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-display text-3xl font-bold">Meu perfil</h1>

      <Card className="border-2">
        <CardContent className="flex flex-col items-center gap-4 py-8 sm:flex-row sm:items-start">
          <AvatarPreview baseEmoji={stats.avatar.baseEmoji} size="lg" />
          <div className="text-center sm:text-left">
            <h2 className="font-display text-2xl font-bold">{stats.profile.displayName}</h2>
            <p className="text-muted-foreground">@{stats.profile.username}</p>
            <p className="mt-2">Nível {stats.profile.level} · {stats.profile.xp} XP</p>
            <Button className="mt-4" variant="outline" asChild>
              <Link href={ROUTES.avatar}>Personalizar avatar</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardHeader>
          <CardTitle>Progresso de XP</CardTitle>
        </CardHeader>
        <CardContent>
          <ProgressBar value={stats.xpProgress.percent} label={`Nível ${stats.profile.level}`} />
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardHeader>
          <CardTitle>Acessibilidade</CardTitle>
          <CardDescription>Personalize a experiência para seu conforto</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { id: "reduce-motion", label: "Reduzir animações", key: "reduceMotion" as const },
            { id: "high-contrast", label: "Alto contraste", key: "highContrast" as const },
            { id: "accessible-font", label: "Fonte acessível", key: "accessibleFont" as const },
            { id: "low-stimulus", label: "Modo baixo estímulo", key: "lowStimulusMode" as const },
            { id: "sound", label: "Sons ativados", key: "soundEnabled" as const },
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4">
              <Label htmlFor={item.id}>{item.label}</Label>
              <Switch
                id={item.id}
                checked={prefs[item.key]}
                onCheckedChange={(v) => toggle(item.key, v)}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
