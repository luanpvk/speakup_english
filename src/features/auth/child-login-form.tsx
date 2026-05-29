"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Rabbit } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PinPad } from "@/features/auth/pin-pad";
import { useAuth } from "@/hooks/use-auth";

const schema = z.object({
  username: z.string().min(3, "Usuário inválido"),
  pin: z.string().length(4, "PIN de 4 dígitos").regex(/^\d+$/, "Apenas números"),
});

interface ChildLoginFormProps {
  initialUsername?: string;
  initialDisplayName?: string;
}

export function ChildLoginForm({
  initialUsername = "",
  initialDisplayName = "",
}: ChildLoginFormProps) {
  const { loginChild } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [pin, setPin] = useState("");

  const normalizedUsername = initialUsername.toLowerCase().trim();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      username: normalizedUsername,
      pin: "",
    },
  });

  useEffect(() => {
    if (normalizedUsername) {
      form.setValue("username", normalizedUsername);
    }
  }, [normalizedUsername, form]);

  const username = form.watch("username");

  const handleSubmit = form.handleSubmit(async (data) => {
    setError(null);
    const pinValue = pin.length === 4 ? pin : data.pin;

    try {
      const res = await loginChild.mutateAsync({
        username: data.username.toLowerCase().trim(),
        pin: pinValue,
      });
      if (!res.success) {
        setError(res.error ?? "Usuário ou PIN incorretos");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível entrar");
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <Card className="border-2 border-accent/50 shadow-xl">
        <CardHeader className="text-center">
          <motion.div
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-primary/30 bg-gradient-to-br from-speakup-green-soft to-speakup-yellow-soft"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3, repeatDelay: 2 }}
            aria-hidden
          >
            <Rabbit className="h-10 w-10 text-primary" strokeWidth={2} />
          </motion.div>
          <CardTitle className="text-3xl">
            {initialDisplayName ? `Oi, ${initialDisplayName}!` : "Oi, explorador!"}
          </CardTitle>
          <CardDescription>
            {normalizedUsername ? (
              <>
                Conta <strong>@{normalizedUsername}</strong> — digite o PIN de 4 números
                para entrar.
              </>
            ) : (
              <>
                Digite seu usuário e PIN de 4 números para começar a aventura.
              </>
            )}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {error && (
              <p
                role="alert"
                className="rounded-xl border-2 border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              >
                {error}
              </p>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Seu usuário</Label>
              <Input
                id="username"
                className="text-lg"
                placeholder="ex: ana_fox"
                readOnly={Boolean(normalizedUsername)}
                aria-readonly={Boolean(normalizedUsername)}
                {...form.register("username", {
                  setValueAs: (v: string) => v.toLowerCase().trim(),
                })}
                autoComplete="username"
              />
              {normalizedUsername && (
                <p className="text-xs text-muted-foreground">
                  Usuário definido pelo responsável. Para outra conta,{" "}
                  <Link href="/login/child" className="text-primary hover:underline">
                    login geral
                  </Link>
                  .
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Seu PIN secreto</Label>
              <PinPad
                value={pin}
                onChange={(v) => {
                  setPin(v);
                  form.setValue("pin", v, { shouldValidate: true });
                }}
                disabled={loginChild.isPending}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full"
              variant="child"
              size="lg"
              disabled={loginChild.isPending || !username || pin.length !== 4}
            >
              {loginChild.isPending && <Loader2 className="animate-spin" />}
              Entrar na aventura!
            </Button>
            <Link
              href="/login/parent"
              className="text-center text-sm text-primary hover:underline"
            >
              Sou responsável
            </Link>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}
