"use client";

import { toast } from "@/store/toast-store";

import { useState } from "react";
import Link from "next/link";
import { AuthForm } from "@/features/auth/auth-form";
import { authApi } from "@/services/auth.service";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [devToken, setDevToken] = useState<string | null>(null);

  return (
    <>
      {/* Só em desenvolvimento: atalho para testar sem e-mail configurado */}
      {devToken && (
        <p role="status" className="mb-4 max-w-md text-center text-xs">
          Dev token:{" "}
          <Link href={`/reset-password?token=${devToken}`} className="font-mono underline">
            redefinir senha
          </Link>
        </p>
      )}
      <AuthForm
        variant="forgot"
        isLoading={isLoading}
        onSubmit={async (data) => {
          setIsLoading(true);
          const res = await authApi.forgotPassword(data.email);
          setIsLoading(false);
          if (!res.success) throw new Error(res.error ?? "Tente de novo em instantes.");
          toast.success("Pronto!", "Se esse e-mail tiver conta, o link chega em instantes.");
          if (res.data?.devResetToken) {
            setDevToken(res.data.devResetToken);
          }
        }}
      />
    </>
  );
}
