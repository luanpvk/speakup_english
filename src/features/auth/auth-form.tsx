"use client";

import { toast } from "@/store/toast-store";

import Link from "next/link";
import { useForm, useWatch, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, Loader2, X } from "lucide-react";
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
import { PASSWORD_RULES, passwordSchema } from "@/modules/utils/validators";

type AuthFormVariant = "parent-login" | "child-login" | "register" | "forgot" | "reset";

interface AuthFormProps {
  variant: AuthFormVariant;
  onSubmit: (data: Record<string, string>) => Promise<void>;
  isLoading?: boolean;
  className?: string;
  resetToken?: string;
}

const schemas = {
  "parent-login": z.object({
    email: z.string().email("E-mail inválido"),
    password: z.string().min(1, "Senha obrigatória"),
  }),
  "child-login": z.object({
    username: z.string().min(3, "O usuário precisa ter pelo menos 3 caracteres"),
    pin: z.string().length(4, "PIN de 4 dígitos").regex(/^\d+$/, "Apenas números"),
  }),
  register: z.object({
    name: z.string().min(2, "Nome muito curto"),
    email: z.string().email("E-mail inválido"),
    password: passwordSchema,
  }),
  forgot: z.object({
    email: z.string().email("E-mail inválido"),
  }),
  reset: z.object({
    password: passwordSchema,
    confirmPassword: z.string(),
  }).refine((d) => d.password === d.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  }),
} satisfies Record<AuthFormVariant, z.ZodType<FieldValues>>;

const ERROR_TITLE: Record<AuthFormVariant, string> = {
  "parent-login": "Não deu para entrar",
  "child-login": "Não deu para entrar",
  register: "Não deu para criar a conta",
  forgot: "Não deu para enviar o link",
  reset: "Não deu para trocar a senha",
};

const titles: Record<AuthFormVariant, { title: string; description: string }> = {
  "parent-login": {
    title: "Área dos responsáveis",
    description: "Acompanhe seus filhos e cuide dos perfis deles.",
  },
  "child-login": {
    title: "Oi, explorador! 👋",
    description: "Digite seu usuário e PIN de 4 números.",
  },
  register: {
    title: "Criar conta",
    description: "Leva só uns minutinhos.",
  },
  forgot: {
    title: "Esqueceu a senha?",
    description: "A gente manda um link para você criar outra.",
  },
  reset: {
    title: "Nova senha",
    description: "Escolha uma senha nova para entrar.",
  },
};

export function AuthForm({
  variant,
  onSubmit,
  isLoading,
  className,
}: AuthFormProps) {
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
    try {
      await onSubmit(data as unknown as Record<string, string>);
    } catch (e) {
      toast.error(ERROR_TITLE[variant], e instanceof Error && e.message ? e.message : "Tente de novo.");
    }
  });

  const errors = form.formState.errors;
  const fieldError = (name: string) => {
    const message = errors[name]?.message;
    return message ? (
      <p id={`${name}-error`} className="text-sm text-destructive" role="alert">
        {String(message)}
      </p>
    ) : null;
  };
  const showPasswordRules = variant === "register" || variant === "reset";
  const password = String(useWatch({ control: form.control, name: "password" }) ?? "");

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

          {variant === "register" && (
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input id="name" {...form.register("name")} autoComplete="name" />
              {fieldError("name")}
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
                {fieldError("username")}
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
                {fieldError("pin")}
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
                  {fieldError("email")}
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
                    aria-describedby={showPasswordRules ? "password-rules" : undefined}
                  />
                  {showPasswordRules && (
                    <ul id="password-rules" className="space-y-1 text-sm" aria-live="polite">
                      {PASSWORD_RULES.map((rule) => {
                        const ok = rule.test(password);
                        return (
                          <li
                            key={rule.label}
                            className={cn(
                              "flex items-center gap-2",
                              ok ? "text-primary" : "text-muted-foreground"
                            )}
                          >
                            {ok ? (
                              <Check className="h-4 w-4" aria-hidden />
                            ) : (
                              <X className="h-4 w-4" aria-hidden />
                            )}
                            {rule.label}
                            <span className="sr-only">{ok ? "(ok)" : "(faltando)"}</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                  {fieldError("password")}
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
                  {fieldError("confirmPassword")}
                </div>
              )}
            </>
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
