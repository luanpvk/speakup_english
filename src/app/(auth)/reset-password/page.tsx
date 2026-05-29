"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AuthForm } from "@/features/auth/auth-form";
import { authApi } from "@/services/auth.service";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      error={error}
      onSubmit={async (data) => {
        setIsLoading(true);
        setError(null);
        const res = await authApi.resetPassword(token, data.password);
        setIsLoading(false);
        if (!res.success) {
          setError(res.error ?? "Não foi possível redefinir a senha");
          throw new Error(res.error);
        }
        window.location.href = "/login/parent";
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
