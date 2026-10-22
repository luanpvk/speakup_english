"use client";

import { AuthForm } from "@/features/auth/auth-form";
import { useAuth } from "@/hooks/use-auth";

export default function ParentLoginPage() {
  const { loginParent } = useAuth();

  return (
    <AuthForm
      variant="parent-login"
      isLoading={loginParent.isPending}
      onSubmit={async (data) => {
        const res = await loginParent.mutateAsync({
          email: data.email,
          password: data.password,
        });
        if (!res.success) throw new Error(res.error ?? "E-mail ou senha incorretos.");
      }}
    />
  );
}
