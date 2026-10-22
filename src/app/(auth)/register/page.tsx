"use client";

import { toast } from "@/store/toast-store";

import { AuthForm } from "@/features/auth/auth-form";
import { useAuth } from "@/hooks/use-auth";

export default function RegisterPage() {
  const { register } = useAuth();

  return (
    <AuthForm
      variant="register"
      isLoading={register.isPending}
      onSubmit={async (data) => {
        const res = await register.mutateAsync({
          name: data.name,
          email: data.email,
          password: data.password,
        });
        if (!res.success) throw new Error(res.error ?? "Tente de novo em instantes.");
        toast.success("Conta criada!", "Agora cadastre a criança para ela começar.");
      }}
    />
  );
}
