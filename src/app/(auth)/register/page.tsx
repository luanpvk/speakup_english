"use client";

import { useState } from "react";
import { AuthForm } from "@/features/auth/auth-form";
import { useAuth } from "@/hooks/use-auth";

export default function RegisterPage() {
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);

  return (
    <AuthForm
      variant="register"
      isLoading={register.isPending}
      error={error}
      onSubmit={async (data) => {
        const res = await register.mutateAsync({
          name: data.name,
          email: data.email,
          password: data.password,
        });
        if (!res.success) {
          setError(res.error ?? "Não foi possível criar a conta");
          throw new Error(res.error);
        }
      }}
    />
  );
}
