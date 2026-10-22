"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { ROUTES } from "@/utils/constants";
import { rememberParentEmail } from "@/features/auth/child-login-form";
import type { ChildListItem } from "@/services/parent.service";

interface ChildLoginButtonProps {
  child: Pick<ChildListItem, "username" | "displayName" | "avatarEmoji">;
  size?: "default" | "sm" | "lg";
  variant?: "default" | "outline" | "child";
  className?: string;
}

export function ChildLoginButton({
  child,
  size = "sm",
  variant = "outline",
  className,
}: ChildLoginButtonProps) {
  const router = useRouter();
  const { user, logoutSilent } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      if (user?.email) rememberParentEmail(user.email);
      await logoutSilent();
      router.push(ROUTES.loginChildFor(child.username, child.displayName));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      disabled={loading}
      onClick={handleClick}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      ) : (
        <LogIn className="h-4 w-4" aria-hidden />
      )}
      Login desta criança
    </Button>
  );
}
