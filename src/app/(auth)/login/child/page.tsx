import { Suspense } from "react";
import { ChildLoginForm } from "@/features/auth/child-login-form";
import { LoadingState } from "@/components/ui/loading-state";

function ChildLoginFallback() {
  return (
    <div className="w-full max-w-md">
      <LoadingState message="Carregando login..." skeleton="form" />
    </div>
  );
}

export default async function ChildLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ username?: string; name?: string }>;
}) {
  const params = await searchParams;
  const initialUsername = params.username?.toLowerCase().trim() ?? "";
  const initialDisplayName = params.name ?? "";

  return (
    <Suspense fallback={<ChildLoginFallback />}>
      <ChildLoginForm
        initialUsername={initialUsername}
        initialDisplayName={initialDisplayName}
      />
    </Suspense>
  );
}
