import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";
/** HTTPS forçado só quando o site é servido com certificado (senão quebraria um deploy em http) */
const isHttps = !isDev && (process.env.NEXT_PUBLIC_APP_URL ?? "").startsWith("https://");

/** Política de conteúdo: só scripts/estilos/imagens do próprio site (bloqueia XSS que carrega código externo) */
const csp = [
  "default-src 'self'",
  // 'unsafe-inline': scripts inline do Next e do tema; 'unsafe-eval' só no dev (HMR)
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  ...(isHttps ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  ...(isHttps
    ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]
    : []),
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Indicador do Next (só no dev) longe da logo da barra lateral
  devIndicators: { position: "bottom-right" },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  images: {
    remotePatterns: [],
    formats: ["image/avif", "image/webp"],
    // Imagens do site são estáticas: guarda a versão otimizada por 30 dias
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
