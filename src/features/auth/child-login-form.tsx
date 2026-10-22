"use client";

import { toast } from "@/store/toast-store";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Rabbit } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
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

const PARENT_EMAIL_KEY = "speakup-parent-email";

/** Lembra o e-mail do responsável neste aparelho para a criança não precisar digitar */
export function rememberParentEmail(email: string) {
  try {
    localStorage.setItem(PARENT_EMAIL_KEY, email.toLowerCase().trim());
  } catch {
    // sem storage: a criança digita o e-mail
  }
}

const schema = z.object({
  parentEmail: z.string().email("Digite o e-mail do responsável"),
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
  const [pin, setPin] = useState("");

  const normalizedUsername = initialUsername.toLowerCase().trim();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      parentEmail: "",
      username: normalizedUsername,
      pin: "",
    },
  });

  useEffect(() => {
    if (normalizedUsername) {
      form.setValue("username", normalizedUsername);
    }
  }, [normalizedUsername, form]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PARENT_EMAIL_KEY);
      if (saved) form.setValue("parentEmail", saved);
    } catch {
      // sem storage
    }
  }, [form]);

  const username = useWatch({ control: form.control, name: "username" });
  const parentEmail = useWatch({ control: form.control, name: "parentEmail" });

  const handleSubmit = form.handleSubmit(async (data) => {
    const pinValue = pin.length === 4 ? pin : data.pin;

    try {
      const res = await loginChild.mutateAsync({
        parentEmail: data.parentEmail.toLowerCase().trim(),
        username: data.username.toLowerCase().trim(),
        pin: pinValue,
      });
      if (!res.success) {
        toast.error("Não deu para entrar", res.error ?? "Confira o e-mail do responsável, o usuário e o PIN.");
        setPin("");
        form.setValue("pin", "");
      } else {
        rememberParentEmail(data.parentEmail);
      }
    } catch (e) {
      toast.error("Não deu para entrar", e instanceof Error ? e.message : "Tente de novo.");
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
                Digite seu PIN para entrar.
              </>
            ) : (
              <>
                Vamos começar a aventura!
              </>
            )}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">

            <div className="space-y-2">
              <Label htmlFor="parentEmail">E-mail do responsável</Label>
              <Input
                id="parentEmail"
                type="email"
                inputMode="email"
                placeholder="ex: mae@email.com"
                autoComplete="email"
                {...form.register("parentEmail")}
              />
              {form.formState.errors.parentEmail && (
                <p className="text-sm text-destructive" role="alert">
                  {form.formState.errors.parentEmail.message}
                </p>
              )}
            </div>

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
                <Link href="/login/child" className="text-xs text-primary hover:underline">
                  Entrar com outra conta
                </Link>
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
              disabled={loginChild.isPending || !parentEmail || !username || pin.length !== 4}
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
