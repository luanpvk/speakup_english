"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthForm } from "@/features/auth/auth-form";
import { authApi } from "@/services/auth.service";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [devToken, setDevToken] = useState<string | null>(null);

  return (
    <>
      {success && (
        <p
          role="status"
          className="mb-4 max-w-md rounded-xl border-2 border-primary/40 bg-speakup-green-soft px-4 py-3 text-center text-sm"
        >
          {success}
          {devToken && (
            <>
              <br />
              <span className="text-xs">
                Dev token:{" "}
                <Link
                  href={`/reset-password?token=${devToken}`}
                  className="font-mono underline"
                >
                  redefinir senha
                </Link>
              </span>
            </>
          )}
        </p>
      )}
      <AuthForm
        variant="forgot"
        isLoading={isLoading}
        error={error}
        onSubmit={async (data) => {
          setIsLoading(true);
          setError(null);
          setSuccess(null);
          const res = await authApi.forgotPassword(data.email);
          setIsLoading(false);
          if (!res.success) {
            setError(res.error ?? "Erro ao enviar");
            throw new Error(res.error);
          }
          setSuccess(
            res.data?.message ??
              "Se o e-mail existir, você receberá instruções em breve."
          );
          if (res.data?.devResetToken) {
            setDevToken(res.data.devResetToken);
          }
        }}
      />
    </>
  );
}
