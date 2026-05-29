"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, UserPlus } from "lucide-react";
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
import { AVATAR_ICON_OPTIONS } from "@/lib/icons/kid-icons";

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
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { displayName: "", username: "", pin: "", avatarEmoji: "rabbit" },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setApiError(null);
    setSuccessMessage(null);

    const res = await createChild.mutateAsync({
      displayName: data.displayName.trim(),
      username: data.username.toLowerCase().trim(),
      pin,
      avatarEmoji: selectedEmoji,
    });

    if (!res.success) {
      setApiError(res.error ?? "Não foi possível cadastrar");
      return;
    }

    const created = res.data?.child;
    setSuccessMessage(
      created
        ? `Perfil de ${created.displayName} criado! Usuário: ${created.username} — use "Login desta criança" na lista abaixo com o PIN definido.`
        : "Perfil criado com sucesso!"
    );
    form.reset();
    setPin("");
    setSelectedEmoji("rabbit");
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
          {apiError && (
            <p role="alert" className="rounded-xl border-2 border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {apiError}
            </p>
          )}
          {successMessage && (
            <p role="status" className="rounded-xl border-2 border-primary/50 bg-speakup-green-soft/50 px-4 py-3 text-sm text-foreground">
              {successMessage}
            </p>
          )}

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
              {AVATAR_ICON_OPTIONS.map(({ id, Icon, label }) => (
                <button
                  key={id}
                  type="button"
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl border-2 p-3 transition-transform hover:scale-105",
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
                  <Icon className="h-8 w-8 text-primary" strokeWidth={2} />
                  <span className="text-[10px] font-medium">{label}</span>
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
            className="w-full"
            size="lg"
            disabled={createChild.isPending || pin.length !== 4}
          >
            {createChild.isPending && <Loader2 className="animate-spin" />}
            Criar perfil infantil
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
