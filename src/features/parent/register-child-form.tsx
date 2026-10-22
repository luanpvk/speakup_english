"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, Loader2, UserPlus } from "lucide-react";
import { toast } from "@/store/toast-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PinPad } from "@/features/auth/pin-pad";
import { useCreateChild } from "@/hooks/use-parent-children";
import { cn } from "@/lib/utils";
import { AVATAR_ICON_OPTIONS, KidIcon } from "@/lib/icons/kid-icons";
import { AvatarFigure } from "@/components/gamification/avatar-figure";
import { HYPERFOCUS_THEMES, type HyperfocusId } from "@/lib/data/hyperfocus";

const schema = z.object({
  displayName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  username: z
    .string()
    .min(3, "Mínimo 3 caracteres")
    .max(20)
    .regex(/^[a-z0-9_]+$/, "Use apenas letras minúsculas, números e _"),
  pin: z
    .string()
    .length(4, "PIN de 4 dígitos")
    .regex(/^\d+$/, "Apenas números"),
  avatarEmoji: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface RegisterChildFormProps {
  onSuccess?: () => void;
  className?: string;
}

export function RegisterChildForm({ onSuccess, className }: RegisterChildFormProps) {
  const createChild = useCreateChild();
  const [pin, setPin] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("rabbit");
  const [hyperfocus, setHyperfocus] = useState<HyperfocusId | null>(null);
  // Botão mostra "Perfil criado!" por alguns segundos depois de dar certo
  const [justCreated, setJustCreated] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { displayName: "", username: "", pin: "", avatarEmoji: "rabbit" },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const res = await createChild.mutateAsync({
      displayName: data.displayName.trim(),
      username: data.username.toLowerCase().trim(),
      pin,
      avatarEmoji: selectedEmoji,
      hyperfocus: hyperfocus ?? undefined,
    });

    if (!res.success) {
      toast.error("Não deu para criar o perfil", res.error ?? "Tente de novo em instantes.");
      return;
    }

    const created = res.data?.child;
    toast.success(
      created ? `${created.displayName} já tem perfil!` : "Perfil criado!",
      created
        ? `Para entrar: seu e-mail, o usuário ${created.username} e o PIN que você escolheu.`
        : undefined
    );
    setJustCreated(true);
    window.setTimeout(() => setJustCreated(false), 3000);
    form.reset();
    setPin("");
    setSelectedEmoji("rabbit");
    setHyperfocus(null);
    onSuccess?.();
  });

  return (
    <Card className={cn("border-2", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-6 w-6 text-primary" />
          Cadastrar criança
        </CardTitle>
        <CardDescription>
          Crie o perfil do explorador com nome, usuário e PIN de 4 números para login.
        </CardDescription>
      </CardHeader>

      <form onSubmit={onSubmit}>
        <CardContent className="space-y-5">

          <div className="space-y-2">
            <Label htmlFor="displayName">Nome da criança</Label>
            <Input
              id="displayName"
              placeholder="Ex: Ana"
              {...form.register("displayName")}
            />
            {form.formState.errors.displayName && (
              <p className="text-sm text-destructive">{form.formState.errors.displayName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Usuário para login</Label>
            <Input
              id="username"
              placeholder="ex: ana_fox"
              className="lowercase"
              {...form.register("username", {
                onChange: (e) => {
                  e.target.value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
                },
              })}
            />
            <p className="text-xs text-muted-foreground">
              Só letras minúsculas, números e _. Será usado na área da criança.
            </p>
            {form.formState.errors.username && (
              <p className="text-sm text-destructive">{form.formState.errors.username.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Personagem</Label>
            <div className="flex flex-wrap gap-2">
              {AVATAR_ICON_OPTIONS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  className={cn(
                    "flex w-[76px] flex-col items-center gap-1 rounded-2xl border-2 p-1.5 transition-transform hover:scale-105",
                    selectedEmoji === id
                      ? "border-primary bg-speakup-green-soft"
                      : "border-border"
                  )}
                  onClick={() => {
                    setSelectedEmoji(id);
                    form.setValue("avatarEmoji", id);
                  }}
                  aria-label={`Escolher ${label}`}
                  aria-pressed={selectedEmoji === id}
                >
                  <span className="block h-14 w-14 overflow-hidden rounded-xl">
                    <AvatarFigure base={id} />
                  </span>
                  <span className="text-[11px] font-semibold">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Hiperfoco / tema favorito (opcional)</Label>
            <div className="flex flex-wrap gap-2">
              {HYPERFOCUS_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  className={cn(
                    "flex items-center gap-1 rounded-xl border-2 px-3 py-2 text-sm font-medium",
                    hyperfocus === theme.id
                      ? "border-primary bg-speakup-green-soft"
                      : "border-border"
                  )}
                  onClick={() => setHyperfocus(hyperfocus === theme.id ? null : theme.id)}
                  aria-pressed={hyperfocus === theme.id}
                >
                  <KidIcon emoji={theme.icon} size="xs" variant="plain" />
                  {theme.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>PIN de login (4 números)</Label>
            <PinPad
              value={pin}
              onChange={(v) => {
                setPin(v);
                form.setValue("pin", v);
              }}
              disabled={createChild.isPending}
            />
            {form.formState.errors.pin && (
              <p className="text-sm text-destructive">{form.formState.errors.pin.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className={cn("w-full transition-colors", justCreated && "pointer-events-none")}
            size="lg"
            disabled={createChild.isPending || (pin.length !== 4 && !justCreated)}
          >
            {createChild.isPending ? (
              <Loader2 className="animate-spin" />
            ) : justCreated ? (
              <Check className="animate-pop" strokeWidth={3} />
            ) : null}
            {createChild.isPending ? "Criando..." : justCreated ? "Perfil criado!" : "Criar perfil infantil"}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
