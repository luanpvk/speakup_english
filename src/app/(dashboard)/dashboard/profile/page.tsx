"use client";

import { toast } from "@/store/toast-store";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AvatarPreview } from "@/components/gamification/avatar-preview";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useChildStats, useUpdateChildProfile } from "@/hooks/use-gamification";
import { useThemeStore } from "@/store/theme-store";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/utils/constants";
import { LoadingState } from "@/components/ui/loading-state";
import { HYPERFOCUS_THEMES } from "@/lib/data/hyperfocus";
import { KidIcon } from "@/lib/icons/kid-icons";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { data: stats, isLoading } = useChildStats();
  const updateProfile = useUpdateChildProfile();
  const prefs = useThemeStore();
  const setAccessibility = useThemeStore((s) => s.setAccessibility);
  const applyToDocument = useThemeStore((s) => s.applyToDocument);

  if (isLoading || !stats) {
    return <LoadingState message="Carregando perfil..." skeleton="profile" />;
  }

  const toggle = (key: keyof typeof prefs, value: boolean) => {
    setAccessibility({ [key]: value });
    applyToDocument();
  };

  const chooseFocus = async (id: string | null) => {
    const res = await updateProfile.mutateAsync({ hyperfocus: id });
    if (!res.success) {
      toast.error("Não deu para salvar o tema", res.error ?? "Tente de novo.");
    } else if (id) {
      toast.success("Tema escolhido!", "As lições dele já estão liberadas no seu painel.");
    } else {
      toast.info("Tema removido");
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-center font-display text-3xl font-bold">Meu perfil</h1>

      <Card className="border-2">
        <CardContent className="flex flex-col items-center gap-4 py-8 sm:flex-row sm:items-start">
          <AvatarPreview
            baseEmoji={stats.avatar.baseEmoji}
            hairSlug={stats.avatar.hairSlug}
            clothesSlug={stats.avatar.clothesSlug}
            accessorySlug={stats.avatar.accessorySlug}
            backgroundSlug={stats.avatar.backgroundSlug}
            size="lg"
          />
          <div className="text-center sm:text-left">
            <h2 className="font-display text-2xl font-bold">{stats.profile.displayName}</h2>
            <p className="text-muted-foreground">@{stats.profile.username}</p>
            <p className="mt-2">Nível {stats.profile.level} · {stats.profile.xp} XP</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
              <Button variant="outline" asChild>
                <Link href={ROUTES.avatar}>Personalizar personagem</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardHeader>
          <CardTitle>Meu tema favorito</CardTitle>
          <CardDescription>
            Escolha o assunto que você mais gosta. Vamos liberar e mostrar lições sobre ele no seu
            painel.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {HYPERFOCUS_THEMES.map((theme) => {
              const active = stats.profile.hyperfocus === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  disabled={updateProfile.isPending}
                  onClick={() => chooseFocus(active ? null : theme.id)}
                  aria-pressed={active}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border-2 p-3 text-left text-sm font-medium transition-colors disabled:opacity-60",
                    active ? "border-primary bg-speakup-green-soft" : "border-border hover:bg-muted/50"
                  )}
                >
                  <KidIcon emoji={theme.icon} size="sm" variant="plain" />
                  {theme.label}
                </button>
              );
            })}
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
          <CardDescription>Deixe tudo do jeito que fica melhor para você</CardDescription>
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
