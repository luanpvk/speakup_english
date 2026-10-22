"use client";

import { toast } from "@/store/toast-store";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthForm } from "@/features/auth/auth-form";
import { authApi } from "@/services/auth.service";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [isLoading, setIsLoading] = useState(false);

  if (!token) {
    return (
      <p role="alert" className="text-destructive">
        Link inválido. Solicite uma nova recuperação de senha.
      </p>
    );
  }

  return (
    <AuthForm
      variant="reset"
      isLoading={isLoading}
      onSubmit={async (data) => {
        setIsLoading(true);
        const res = await authApi.resetPassword(token, data.password);
        setIsLoading(false);
        if (!res.success) throw new Error(res.error ?? "O link pode ter expirado. Peça outro.");
        toast.success("Senha trocada!", "Agora é só entrar com a senha nova.");
        router.push("/login/parent");
      }}
    />
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p className="text-muted-foreground">Carregando...</p>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
