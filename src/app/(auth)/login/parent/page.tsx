"use client";

import { useState } from "react";
import { AuthForm } from "@/features/auth/auth-form";
import { useAuth } from "@/hooks/use-auth";

export default function ParentLoginPage() {
  const { loginParent } = useAuth();
  const [error, setError] = useState<string | null>(null);

  return (
    <AuthForm
      variant="parent-login"
      isLoading={loginParent.isPending}
      error={error ?? (loginParent.data && !loginParent.data.success ? loginParent.data.error ?? null : null)}
      onSubmit={async (data) => {
        const res = await loginParent.mutateAsync({
          email: data.email,
          password: data.password,
        });
        if (!res.success) {
          setError(res.error ?? "Credenciais inválidas");
          throw new Error(res.error);
        }
      }}
    />
  );
}
