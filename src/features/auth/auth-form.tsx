"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type AuthFormVariant = "parent-login" | "child-login" | "register" | "forgot" | "reset";

interface AuthFormProps {
  variant: AuthFormVariant;
  onSubmit: (data: Record<string, string>) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
  resetToken?: string;
}

const schemas = {
  "parent-login": z.object({
    email: z.string().email("E-mail inválido"),
    password: z.string().min(1, "Senha obrigatória"),
  }),
  "child-login": z.object({
    username: z.string().min(3, "Usuário inválido"),
    pin: z.string().length(4, "PIN de 4 dígitos").regex(/^\d+$/, "Apenas números"),
  }),
  register: z.object({
    name: z.string().min(2, "Nome muito curto"),
    email: z.string().email("E-mail inválido"),
    password: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .regex(/[A-Za-z]/, "Inclua letras")
      .regex(/[0-9]/, "Inclua números"),
  }),
  forgot: z.object({
    email: z.string().email("E-mail inválido"),
  }),
  reset: z.object({
    password: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .regex(/[A-Za-z]/, "Inclua letras")
      .regex(/[0-9]/, "Inclua números"),
    confirmPassword: z.string(),
  }).refine((d) => d.password === d.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  }),
} satisfies Record<AuthFormVariant, z.ZodType<FieldValues>>;

const titles: Record<AuthFormVariant, { title: string; description: string }> = {
  "parent-login": {
    title: "Área dos responsáveis",
    description: "Gerencie perfis, progresso e configurações.",
  },
  "child-login": {
    title: "Oi, explorador! 👋",
    description: "Digite seu usuário e PIN de 4 números.",
  },
  register: {
    title: "Criar conta",
    description: "Cadastre-se para começar a jornada em inglês.",
  },
  forgot: {
    title: "Esqueceu a senha?",
    description: "Enviaremos instruções para o seu e-mail.",
  },
  reset: {
    title: "Nova senha",
    description: "Escolha uma senha segura para sua conta.",
  },
};

export function AuthForm({
  variant,
  onSubmit,
  isLoading,
  error,
  className,
}: AuthFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const meta = titles[variant];
  const schema = schemas[variant];

  const form = useForm({
    resolver: zodResolver(schema as z.ZodType<FieldValues, FieldValues>),
    defaultValues:
      variant === "child-login"
        ? { username: "", pin: "" }
        : variant === "register"
          ? { name: "", email: "", password: "" }
          : variant === "reset"
            ? { password: "", confirmPassword: "" }
            : { email: "", password: "" },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    setSubmitError(null);
    try {
      await onSubmit(data as unknown as Record<string, string>);
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Erro ao enviar");
    }
  });

  const displayError = error ?? submitError;

  return (
    <Card className={cn("w-full max-w-md border-2 shadow-lg", className)}>
      <CardHeader className="text-center">
        <CardTitle className={variant === "child-login" ? "text-3xl" : ""}>
          {meta.title}
        </CardTitle>
        <CardDescription>{meta.description}</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {displayError && (
            <p
              role="alert"
              className="rounded-xl border-2 border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              {displayError}
            </p>
          )}

          {variant === "register" && (
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input id="name" {...form.register("name")} autoComplete="name" />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {String(form.formState.errors.name.message)}
                </p>
              )}
            </div>
          )}

          {variant === "child-login" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="username">Seu usuário</Label>
                <Input
                  id="username"
                  className="text-lg"
                  {...form.register("username")}
                  autoComplete="username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pin">PIN (4 números)</Label>
                <Input
                  id="pin"
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  className="text-center text-2xl tracking-[0.5em]"
                  {...form.register("pin")}
                  autoComplete="off"
                />
              </div>
            </>
          ) : (
            <>
              {variant !== "reset" && (
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register("email")}
                    autoComplete="email"
                  />
                </div>
              )}

              {(variant === "parent-login" ||
                variant === "register" ||
                variant === "reset") && (
                <div className="space-y-2">
                  <Label htmlFor="password">
                    {variant === "reset" ? "Nova senha" : "Senha"}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    {...form.register("password")}
                    autoComplete={
                      variant === "register" ? "new-password" : "current-password"
                    }
                  />
                </div>
              )}

              {variant === "reset" && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...form.register("confirmPassword")}
                    autoComplete="new-password"
                  />
                </div>
              )}
            </>
          )}

          {(form.formState.errors.email ||
            form.formState.errors.password ||
            form.formState.errors.pin ||
            form.formState.errors.username) && (
            <p className="text-sm text-destructive" role="alert">
              Verifique os campos acima
            </p>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full"
            variant={variant === "child-login" ? "child" : "default"}
            size="lg"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="animate-spin" aria-hidden />}
            {variant === "child-login"
              ? "Entrar na aventura!"
              : variant === "register"
                ? "Criar conta"
                : variant === "forgot"
                  ? "Enviar link"
                  : variant === "reset"
                    ? "Salvar senha"
                    : "Entrar"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            {variant === "parent-login" && (
              <>
                <Link href="/forgot-password" className="text-primary hover:underline">
                  Esqueci minha senha
                </Link>
                <span className="mx-2">·</span>
                <Link href="/register" className="text-primary hover:underline">
                  Criar conta
                </Link>
              </>
            )}
            {variant === "child-login" && (
              <Link href="/login/parent" className="text-primary hover:underline">
                Sou responsável
              </Link>
            )}
            {variant === "register" && (
              <Link href="/login/parent" className="text-primary hover:underline">
                Já tenho conta
              </Link>
            )}
            {variant === "forgot" && (
              <Link href="/login/parent" className="text-primary hover:underline">
                Voltar ao login
              </Link>
            )}
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
