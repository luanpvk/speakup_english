import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/auth/constants";

/** Rotas de login de responsável/cadastro: redireciona ao dashboard se já logado */
const parentAuthPaths = ["/login", "/login/parent", "/register"];

function isParentAuthPath(pathname: string): boolean {
  return parentAuthPaths.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

/** Anti-CSRF: pedidos que alteram dados só podem vir do próprio site */
function isCrossSiteMutation(request: NextRequest): boolean {
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) return false;
  if (request.headers.get("sec-fetch-site") === "cross-site") return true;
  const origin = request.headers.get("origin");
  if (!origin) return false; // clientes sem navegador não carregam os cookies da vítima
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host !== host;
  } catch {
    return true;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api")) {
    return isCrossSiteMutation(request)
      ? NextResponse.json({ success: false, error: "Origem não permitida" }, { status: 403 })
      : NextResponse.next();
  }

  if (pathname.startsWith("/_next") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  const isAuthenticated = Boolean(accessToken || refreshToken);

  if (pathname.startsWith("/dashboard") && !isAuthenticated) {
    const loginUrl = new URL("/login/parent", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Login infantil permanece acessível mesmo com sessão de responsável
  if (isParentAuthPath(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
