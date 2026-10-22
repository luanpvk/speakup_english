import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Personagem desenhado em camadas: fundo, cabelo de trás, capa, roupa, orelhas, cabeça,
 * rosto, cabelo da frente e acessório. Ids de base e de itens são os mesmos salvos no banco.
 */

type Base = { bg: string; face: string; hair: string; accent: string };

const BASES: Record<string, Base> = {
  rabbit: { bg: "#dbeafe", face: "#fafaf9", hair: "#d6d3d1", accent: "#fbcfe8" },
  cat: { bg: "#fef3c7", face: "#fdba74", hair: "#c2410c", accent: "#fecdd3" },
  dog: { bg: "#ffedd5", face: "#e3b384", hair: "#7c4a24", accent: "#92623a" },
  bird: { bg: "#ecfccb", face: "#7dd3fc", hair: "#0369a1", accent: "#fb923c" },
  fish: { bg: "#cffafe", face: "#5eead4", hair: "#0f766e", accent: "#14b8a6" },
  smile: { bg: "#fce7f3", face: "#f1c27d", hair: "#6b3f1d", accent: "#e0a96d" },
  star: { bg: "#fef9c3", face: "#fde047", hair: "#d97706", accent: "#facc15" },
  sparkles: { bg: "#ede9fe", face: "#faf5ff", hair: "#c084fc", accent: "#fbbf24" },
};

function resolveBase(base?: string): [string, Base] {
  const key = base && BASES[base] ? base : "rabbit";
  return [key, BASES[key]];
}

interface AvatarFigureProps {
  base?: string;
  hair?: string | null;
  clothes?: string | null;
  accessory?: string | null;
  background?: string | null;
  className?: string;
  title?: string;
}

export function AvatarFigure({
  base,
  hair = "hair-default",
  clothes = "clothes-default",
  accessory,
  background = "bg-default",
  className,
  title = "Avatar",
}: AvatarFigureProps) {
  const uid = useId().replace(/:/g, "");
  const [kind, c] = resolveBase(base);
  const id = (name: string) => `${name}-${uid}`;
  const hairStyle = hair ?? "hair-default";
  // Cabelo arco-íris usa o degradê no lugar da cor do personagem
  const hairColor = hairStyle === "hair-rainbow" ? `url(#${id("rainbow")})` : c.hair;
  const hasHat = ["acc-hat", "acc-wizard", "acc-cap", "acc-beanie", "acc-party", "acc-crown"].includes(
    accessory ?? ""
  );

  return (
    <svg viewBox="0 0 120 120" className={cn("h-full w-full", className)} role="img" aria-label={title}>
      <defs>
        <clipPath id={id("clip")}>
          <circle cx="60" cy="60" r="60" />
        </clipPath>
        <clipPath id={id("body")}>
          <path d={BODY_PATH} />
        </clipPath>
        <linearGradient id={id("rainbow")} x1="0" y1="0" x2="0" y2="1">
          {RAINBOW.map((color, i) => (
            <stop key={color} offset={i / (RAINBOW.length - 1)} stopColor={color} />
          ))}
        </linearGradient>
      </defs>

      <g clipPath={`url(#${id("clip")})`}>
        <Background kind={background} fallback={c.bg} id={id} />

        {kind !== "fish" && kind !== "star" && <HairBack style={hairStyle} color={hairColor} />}

        {clothes === "clothes-cape" && <path d="M26 94 Q60 82 94 94 L108 124 L12 124 Z" fill="#e11d48" />}

        <Clothes kind={clothes ?? "clothes-default"} bodyClip={`url(#${id("body")})`} rainbow={`url(#${id("rainbow")})`} />

        <Ears kind={kind} c={c} />

        {kind === "star" && (
          <path d="M60 16 L68 38 L92 38 L73 52 L80 76 L60 62 L40 76 L47 52 L28 38 L52 38 Z" fill={c.accent} />
        )}
        {kind === "fish" && (
          <>
            <path d="M33 56 L18 44 L20 68 Z" fill={c.accent} />
            <path d="M87 56 L102 44 L100 68 Z" fill={c.accent} />
          </>
        )}

        <circle cx="60" cy="58" r="28" fill={c.face} />
        <Face kind={kind} c={c} />

        <HairFront style={hairStyle} color={hairColor} small={kind === "fish" || kind === "star"} />

        {kind === "sparkles" && !hasHat && (
          <g>
            <path d="M60 6 L53 32 L67 32 Z" fill={c.accent} />
            <path d="M56 22 L64 19 M55 27 L65 24" stroke="#f59e0b" strokeWidth="1.5" />
          </g>
        )}

        <Accessory kind={accessory} />
      </g>
    </svg>
  );
}

const BODY_PATH = "M28 124 Q28 92 60 89 Q92 92 92 124 Z";
const RAINBOW = ["#ef4444", "#f97316", "#facc15", "#22c55e", "#3b82f6", "#a855f7"];

/* ---------------------------------- Fundo ---------------------------------- */

function Background({ kind, fallback, id }: { kind?: string | null; fallback: string; id: (n: string) => string }) {
  switch (kind) {
    case "bg-sky":
      return (
        <g>
          <rect width="120" height="120" fill="#7dd3fc" />
          <g fill="#fff" opacity="0.9">
            <ellipse cx="22" cy="28" rx="14" ry="7" />
            <ellipse cx="30" cy="24" rx="9" ry="7" />
            <ellipse cx="96" cy="40" rx="15" ry="7" />
            <ellipse cx="88" cy="36" rx="9" ry="7" />
          </g>
        </g>
      );
    case "bg-candy":
      return (
        <g>
          <rect width="120" height="120" fill="#fbcfe8" />
          <circle cx="20" cy="30" r="22" fill="#e9d5ff" />
          <circle cx="104" cy="22" r="18" fill="#bae6fd" />
          <g fill="#fff" opacity="0.8">
            {[[14, 70], [26, 90], [98, 72], [104, 96], [86, 14]].map(([x, y]) => (
              <circle key={`${x}${y}`} cx={x} cy={y} r="2.5" />
            ))}
          </g>
        </g>
      );
    case "bg-forest":
      return (
        <g>
          <rect width="120" height="120" fill="#bbf7d0" />
          <circle cx="98" cy="22" r="9" fill="#fde047" />
          <g fill="#15803d">
            <path d="M0 96 L14 50 L28 96 Z" />
            <path d="M16 100 L30 60 L44 100 Z" />
            <path d="M84 100 L98 58 L112 100 Z" />
            <path d="M96 96 L112 46 L126 96 Z" />
          </g>
          <rect y="94" width="120" height="26" fill="#4ade80" />
        </g>
      );
    case "bg-beach":
      return (
        <g>
          <rect width="120" height="120" fill="#bae6fd" />
          <circle cx="96" cy="24" r="10" fill="#fde047" />
          <rect y="70" width="120" height="22" fill="#38bdf8" />
          <path d="M0 74 Q15 70 30 74 T60 74 T90 74 T120 74" fill="none" stroke="#e0f2fe" strokeWidth="2" />
          <rect y="90" width="120" height="30" fill="#fde68a" />
        </g>
      );
    case "bg-sunset":
      return (
        <g>
          <defs>
            <linearGradient id={id("sunset")} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#7c3aed" />
              <stop offset="0.55" stopColor="#f472b6" />
              <stop offset="1" stopColor="#fb923c" />
            </linearGradient>
          </defs>
          <rect width="120" height="120" fill={`url(#${id("sunset")})`} />
          <circle cx="60" cy="96" r="30" fill="#fde047" opacity="0.85" />
        </g>
      );
    case "bg-night":
      return (
        <g>
          <rect width="120" height="120" fill="#1e1b4b" />
          <path d="M98 14 a12 12 0 1 0 8 20 a10 10 0 1 1 -8 -20 Z" fill="#fef9c3" />
          <Stars color="#fef9c3" />
        </g>
      );
    case "bg-space":
      return (
        <g>
          <rect width="120" height="120" fill="#0f172a" />
          <Stars color="#e2e8f0" />
          <circle cx="98" cy="28" r="10" fill="#f97316" />
          <ellipse cx="98" cy="28" rx="17" ry="4" fill="none" stroke="#fde68a" strokeWidth="2" />
          <circle cx="16" cy="88" r="6" fill="#a78bfa" />
        </g>
      );
    case "bg-rainbow":
      return (
        <g>
          <rect width="120" height="120" fill="#e0f2fe" />
          {RAINBOW.map((color, i) => (
            <circle key={color} cx="60" cy="120" r={110 - i * 10} fill="none" stroke={color} strokeWidth="10" />
          ))}
        </g>
      );
    default:
      return <rect width="120" height="120" fill={fallback} />;
  }
}

function Stars({ color }: { color: string }) {
  return (
    <g fill={color}>
      {[[14, 18, 1.6], [30, 40, 1], [12, 60, 1.2], [44, 12, 1.2], [80, 50, 1], [108, 64, 1.4], [70, 10, 1], [24, 96, 1.2], [104, 100, 1]].map(
        ([x, y, r]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />
        )
      )}
    </g>
  );
}

/* --------------------------------- Roupas ---------------------------------- */

function Clothes({ kind, bodyClip, rainbow }: { kind: string; bodyClip: string; rainbow: string }) {
  const body = (fill: string) => <path d={BODY_PATH} fill={fill} />;

  switch (kind) {
    case "clothes-stripes":
      return (
        <g>
          {body("#f8fafc")}
          <g clipPath={bodyClip} fill="#3b82f6">
            {[96, 106, 116].map((y) => (
              <rect key={y} x="0" y={y} width="120" height="5" />
            ))}
          </g>
          <Collar color="#cbd5e1" />
        </g>
      );
    case "clothes-hoodie":
      return (
        <g>
          {body("#8b5cf6")}
          <path d="M42 92 Q60 102 78 92 L74 88 Q60 96 46 88 Z" fill="#6d28d9" />
          <path d="M54 96 L53 108 M66 96 L67 108" stroke="#ede9fe" strokeWidth="2" strokeLinecap="round" />
          <rect x="46" y="110" width="28" height="10" rx="4" fill="#7c3aed" />
        </g>
      );
    case "clothes-scarf":
      return (
        <g>
          {body("#64748b")}
          <rect x="40" y="85" width="40" height="10" rx="5" fill="#ef4444" />
          <rect x="62" y="92" width="9" height="20" rx="3" fill="#dc2626" />
          <path d="M44 88 h32" stroke="#fecaca" strokeWidth="2" strokeDasharray="3 3" />
        </g>
      );
    case "clothes-overalls":
      return (
        <g>
          {body("#facc15")}
          <g clipPath={bodyClip}>
            <rect x="40" y="100" width="40" height="30" fill="#2563eb" />
            <rect x="40" y="96" width="40" height="8" fill="#1d4ed8" />
          </g>
          <path d="M44 100 L40 90 M76 100 L80 90" stroke="#1d4ed8" strokeWidth="5" strokeLinecap="round" />
          <circle cx="46" cy="102" r="2" fill="#fde047" />
          <circle cx="74" cy="102" r="2" fill="#fde047" />
        </g>
      );
    case "clothes-dress":
      return (
        <g>
          <path d="M22 124 Q30 94 60 89 Q90 94 98 124 Z" fill="#f472b6" />
          <path d="M48 91 Q60 100 72 91" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          <g fill="#fdf2f8">
            {[[44, 106], [60, 112], [76, 106], [52, 118], [68, 118]].map(([x, y]) => (
              <circle key={`${x}${y}`} cx={x} cy={y} r="2" />
            ))}
          </g>
        </g>
      );
    case "clothes-sport":
      return (
        <g>
          {body("#facc15")}
          <path d="M50 90 L60 98 L70 90" fill="none" stroke="#16a34a" strokeWidth="4" strokeLinejoin="round" />
          <text x="60" y="117" textAnchor="middle" fontSize="15" fontWeight="800" fill="#16a34a" fontFamily="sans-serif">
            10
          </text>
        </g>
      );
    case "clothes-rainbow":
      return (
        <g>
          {body(rainbow)}
          <Collar color="#fff" />
        </g>
      );
    case "clothes-doctor":
      return (
        <g>
          {body("#f8fafc")}
          <path d="M52 90 L60 106 L68 90 Z" fill="#60a5fa" />
          <path d="M52 90 L58 112 M68 90 L62 112" stroke="#cbd5e1" strokeWidth="2" />
          <path d="M44 96 Q42 112 54 112" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="55" cy="112" r="3" fill="#475569" />
        </g>
      );
    case "clothes-cape":
      return (
        <g>
          {body("#1e3a8a")}
          <path d="M60 98 l3 6 6 1 -4.5 4 1 6 -5.5 -3 -5.5 3 1 -6 -4.5 -4 6 -1 Z" fill="#facc15" />
        </g>
      );
    case "clothes-tuxedo":
      return (
        <g>
          {body("#111827")}
          <path d="M50 90 L60 120 L70 90 Z" fill="#f9fafb" />
          <path d="M52 94 L60 98 L52 102 Z M68 94 L60 98 L68 102 Z" fill="#dc2626" />
          <circle cx="60" cy="98" r="2" fill="#b91c1c" />
          <circle cx="60" cy="108" r="1.3" fill="#111827" />
          <circle cx="60" cy="114" r="1.3" fill="#111827" />
        </g>
      );
    case "clothes-pirate":
      return (
        <g>
          {body("#f8fafc")}
          <g clipPath={bodyClip} fill="#dc2626">
            {[94, 104, 114].map((y) => (
              <rect key={y} x="0" y={y} width="120" height="5" />
            ))}
          </g>
          <g clipPath={bodyClip} fill="#292524">
            <rect x="20" y="88" width="24" height="40" />
            <rect x="76" y="88" width="24" height="40" />
          </g>
          <rect x="40" y="112" width="40" height="5" fill="#a16207" />
        </g>
      );
    case "clothes-princess":
      return (
        <g>
          <path d="M22 124 Q30 94 60 89 Q90 94 98 124 Z" fill="#a855f7" />
          <circle cx="34" cy="98" r="8" fill="#c084fc" />
          <circle cx="86" cy="98" r="8" fill="#c084fc" />
          <path d="M48 92 Q60 102 72 92" fill="none" stroke="#fbbf24" strokeWidth="2.5" />
          <circle cx="60" cy="100" r="3" fill="#f472b6" stroke="#fbbf24" strokeWidth="1.5" />
        </g>
      );
    case "clothes-dino":
      return (
        <g>
          {body("#4ade80")}
          <path d="M44 124 Q46 102 60 100 Q74 102 76 124 Z" fill="#bbf7d0" />
          <g fill="#f97316">
            <path d="M30 104 L34 94 L38 104 Z" />
            <path d="M38 96 L43 86 L47 96 Z" />
            <path d="M73 96 L77 86 L82 96 Z" />
            <path d="M82 104 L86 94 L90 104 Z" />
          </g>
        </g>
      );
    case "clothes-astronaut":
      return (
        <g>
          {body("#e5e7eb")}
          <path d="M40 92 Q60 98 80 92" fill="none" stroke="#9ca3af" strokeWidth="5" strokeLinecap="round" />
          <rect x="48" y="104" width="24" height="14" rx="3" fill="#475569" />
          <circle cx="54" cy="111" r="2.2" fill="#ef4444" />
          <circle cx="60" cy="111" r="2.2" fill="#facc15" />
          <circle cx="66" cy="111" r="2.2" fill="#22c55e" />
          <rect x="32" y="104" width="8" height="5" rx="1" fill="#3b82f6" />
        </g>
      );
    default:
      return (
        <g>
          {body("#22c55e")}
          <path d="M50 90 Q60 99 70 90" fill="none" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
  }
}

function Collar({ color }: { color: string }) {
  return <path d="M50 90 Q60 99 70 90" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />;
}

/* --------------------------------- Cabeça ---------------------------------- */

function Ears({ kind, c }: { kind: string; c: Base }) {
  switch (kind) {
    case "rabbit":
      return (
        <g>
          <ellipse cx="48" cy="22" rx="7" ry="19" fill={c.face} />
          <ellipse cx="72" cy="22" rx="7" ry="19" fill={c.face} />
          <ellipse cx="48" cy="23" rx="3.5" ry="13" fill={c.accent} />
          <ellipse cx="72" cy="23" rx="3.5" ry="13" fill={c.accent} />
        </g>
      );
    case "cat":
      return (
        <g>
          <path d="M34 44 L38 16 L56 32 Z" fill={c.face} />
          <path d="M86 44 L82 16 L64 32 Z" fill={c.face} />
          <path d="M39 38 L41 24 L50 32 Z" fill={c.accent} />
          <path d="M81 38 L79 24 L70 32 Z" fill={c.accent} />
        </g>
      );
    case "dog":
      return (
        <g fill={c.accent}>
          <ellipse cx="34" cy="54" rx="9" ry="19" transform="rotate(18 34 54)" />
          <ellipse cx="86" cy="54" rx="9" ry="19" transform="rotate(-18 86 54)" />
        </g>
      );
    case "smile":
      return (
        <g fill={c.face}>
          <circle cx="32" cy="60" r="6" />
          <circle cx="88" cy="60" r="6" />
        </g>
      );
    case "sparkles":
      return (
        <g fill={c.face}>
          <path d="M38 40 L40 22 L52 34 Z" />
          <path d="M82 40 L80 22 L68 34 Z" />
        </g>
      );
    default:
      return null;
  }
}

function Face({ kind, c }: { kind: string; c: Base }) {
  return (
    <g>
      <ellipse cx="50" cy="57" rx="3.6" ry="4.4" fill="#1f2937" />
      <ellipse cx="70" cy="57" rx="3.6" ry="4.4" fill="#1f2937" />
      <circle cx="51.3" cy="55.4" r="1.3" fill="#fff" />
      <circle cx="71.3" cy="55.4" r="1.3" fill="#fff" />
      <circle cx="43" cy="66" r="4.2" fill="#fb7185" opacity="0.45" />
      <circle cx="77" cy="66" r="4.2" fill="#fb7185" opacity="0.45" />

      {kind === "bird" ? (
        <path d="M54 64 L66 64 L60 72 Z" fill={c.accent} />
      ) : kind === "dog" ? (
        <>
          <ellipse cx="60" cy="64" rx="4.5" ry="3.2" fill="#1f2937" />
          <path d="M55 69 Q60 74 65 69" fill="none" stroke="#1f2937" strokeWidth="2.4" strokeLinecap="round" />
        </>
      ) : (
        <path d="M54 67 Q60 73 66 67" fill="none" stroke="#1f2937" strokeWidth="2.4" strokeLinecap="round" />
      )}

      {kind === "cat" && (
        <g stroke="#7c2d12" strokeWidth="1.4" strokeLinecap="round" opacity="0.7">
          <path d="M60 63 l-2 -2 h4 Z" fill="#fb7185" stroke="none" />
          <path d="M40 63 L30 61 M40 67 L30 68" />
          <path d="M80 63 L90 61 M80 67 L90 68" />
        </g>
      )}
      {kind === "rabbit" && <path d="M58 63 h4 l-2 2.5 Z" fill="#fb7185" />}
      {kind === "fish" && (
        <g fill="none" stroke="#0e7490" strokeWidth="1.2" opacity="0.8">
          <circle cx="98" cy="28" r="4" />
          <circle cx="106" cy="16" r="2.5" />
        </g>
      )}
    </g>
  );
}

/* --------------------------------- Cabelo ---------------------------------- */

/** Parte do cabelo que fica atrás da cabeça (cabelos longos, presos, volumosos) */
function HairBack({ style, color }: { style: string; color: string }) {
  switch (style) {
    case "hair-bob":
      return <path d="M28 60 Q26 26 60 25 Q94 26 92 60 L92 80 Q86 84 82 78 L38 78 Q34 84 28 80 Z" fill={color} />;
    case "hair-long":
    case "hair-rainbow":
      return <path d="M28 56 Q26 24 60 24 Q94 24 92 56 L98 104 L22 104 Z" fill={color} />;
    case "hair-ponytail":
      return (
        <g fill={color}>
          <ellipse cx="94" cy="56" rx="9" ry="20" transform="rotate(24 94 56)" />
          <circle cx="86" cy="38" r="4" fill="#ec4899" />
        </g>
      );
    case "hair-bun":
      return (
        <g fill={color}>
          <circle cx="60" cy="22" r="12" />
        </g>
      );
    case "hair-pigtails":
      return (
        <g fill={color}>
          <ellipse cx="24" cy="66" rx="9" ry="16" transform="rotate(14 24 66)" />
          <ellipse cx="96" cy="66" rx="9" ry="16" transform="rotate(-14 96 66)" />
          <circle cx="31" cy="50" r="3.5" fill="#ec4899" />
          <circle cx="89" cy="50" r="3.5" fill="#ec4899" />
        </g>
      );
    case "hair-afro":
      return (
        <g fill={color}>
          {[[60, 30, 22], [38, 40, 16], [82, 40, 16], [32, 58, 13], [88, 58, 13], [46, 24, 14], [74, 24, 14]].map(
            ([cx, cy, r]) => (
              <circle key={`${cx}${cy}`} cx={cx} cy={cy} r={r} />
            )
          )}
        </g>
      );
    case "hair-braids":
      return (
        <g fill={color}>
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <circle cx={32 - i} cy={70 + i * 8} r="5" />
              <circle cx={88 + i} cy={70 + i * 8} r="5" />
            </g>
          ))}
          <circle cx="28" cy="110" r="3" fill="#ec4899" />
          <circle cx="92" cy="110" r="3" fill="#ec4899" />
        </g>
      );
    default:
      return null;
  }
}

/** Parte do cabelo na frente da cabeça (franjas, topetes) */
function HairFront({ style, color, small }: { style: string; color: string; small: boolean }) {
  // Peixinho e estrelinha: só um topete pequeno
  const t = small ? "translate(60 30) scale(0.55) translate(-60 -30)" : undefined;

  const shape = (() => {
    switch (style) {
      case "hair-curly":
        return (
          <g fill={color}>
            {[[36, 44, 8], [42, 34, 8], [51, 28, 8.5], [60, 26, 9], [69, 28, 8.5], [78, 34, 8], [84, 44, 8]].map(
              ([cx, cy, r]) => (
                <circle key={cx} cx={cx} cy={cy} r={r} />
              )
            )}
          </g>
        );
      case "hair-spiky":
        return (
          <path
            d="M32 50 L34 26 L44 36 L48 16 L57 32 L62 12 L68 32 L76 16 L79 36 L88 24 L88 50 Q60 34 32 50 Z"
            fill={color}
          />
        );
      case "hair-bob":
        return <path d="M31 52 Q31 28 60 28 Q89 28 89 52 L84 45 Q60 40 36 45 Z" fill={color} />;
      case "hair-side":
        return (
          <path d="M30 52 Q28 24 62 25 Q92 27 89 50 Q80 34 54 40 Q40 44 30 52 Z M60 26 Q74 14 86 22 Q74 22 66 30 Z" fill={color} />
        );
      case "hair-mohawk":
        return <path d="M52 36 L50 10 L57 20 L60 4 L64 20 L70 10 L68 36 Q60 32 52 36 Z" fill={color} />;
      case "hair-afro":
        return <path d="M34 48 Q38 30 60 30 Q82 30 86 48 Q74 38 60 40 Q46 38 34 48 Z" fill={color} />;
      case "hair-pigtails":
        return <path d="M32 52 Q32 27 60 27 L60 38 Q46 38 32 52 Z M88 52 Q88 27 60 27 L60 38 Q74 38 88 52 Z" fill={color} />;
      default:
        // Clássico e os presos/longos usam a franja arredondada
        return (
          <path
            d="M32 54 Q30 26 60 27 Q90 26 88 54 Q84 40 70 40 Q66 46 60 42 Q52 46 46 40 Q36 41 32 54 Z"
            fill={color}
          />
        );
    }
  })();

  return <g transform={t}>{shape}</g>;
}

/* ------------------------------- Acessórios -------------------------------- */

function Accessory({ kind }: { kind?: string | null }) {
  switch (kind) {
    case "acc-glasses":
      return (
        <g fill="rgba(255,255,255,0.25)" stroke="#1f2937" strokeWidth="2.6">
          <circle cx="50" cy="57" r="8" />
          <circle cx="70" cy="57" r="8" />
          <path d="M58 57 h4" fill="none" />
        </g>
      );
    case "acc-sunglasses":
      return (
        <g>
          <rect x="40" y="51" width="18" height="12" rx="5" fill="#111827" />
          <rect x="62" y="51" width="18" height="12" rx="5" fill="#111827" />
          <path d="M58 55 h4" stroke="#111827" strokeWidth="2.5" />
          <path d="M43 54 l5 0" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M65 54 l5 0" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      );
    case "acc-hat":
      return (
        <g>
          <rect x="42" y="4" width="36" height="26" rx="4" fill="#6d28d9" />
          <rect x="42" y="22" width="36" height="5" fill="#facc15" />
          <ellipse cx="60" cy="30" rx="28" ry="5.5" fill="#5b21b6" />
          <path d="M60 9 l1.8 3.8 4 .5 -3 2.7 .8 4 -3.6 -2 -3.6 2 .8 -4 -3 -2.7 4 -.5 Z" fill="#fde68a" />
        </g>
      );
    case "acc-wizard":
      return (
        <g>
          <path d="M60 -2 Q76 10 78 32 L42 32 Q48 12 60 -2 Z M60 -2 Q50 -4 46 6" fill="#2563eb" />
          <ellipse cx="60" cy="32" rx="26" ry="5" fill="#1d4ed8" />
          <g fill="#fde047">
            <circle cx="56" cy="16" r="2" />
            <circle cx="66" cy="24" r="1.6" />
            <circle cx="62" cy="10" r="1.3" />
          </g>
        </g>
      );
    case "acc-cap":
      return (
        <g>
          <path d="M32 46 Q32 22 60 22 Q88 22 88 46 Z" fill="#ef4444" />
          <path d="M34 45 Q18 44 10 50 Q24 52 44 48 Z" fill="#dc2626" />
          <circle cx="60" cy="22" r="3" fill="#b91c1c" />
        </g>
      );
    case "acc-beanie":
      return (
        <g>
          <path d="M31 46 Q30 18 60 18 Q90 18 89 46 Z" fill="#3b82f6" />
          <rect x="29" y="40" width="62" height="10" rx="5" fill="#2563eb" />
          <circle cx="60" cy="15" r="7" fill="#f8fafc" />
        </g>
      );
    case "acc-party":
      return (
        <g>
          <path d="M60 0 L46 32 L74 32 Z" fill="#f472b6" />
          <path d="M53 16 L67 16 M50 24 L70 24" stroke="#fde047" strokeWidth="3" />
          <circle cx="60" cy="2" r="4" fill="#facc15" />
        </g>
      );
    case "acc-crown":
      return (
        <g>
          <path d="M40 34 L42 12 L51 24 L60 8 L69 24 L78 12 L80 34 Z" fill="#facc15" stroke="#d97706" strokeWidth="1.5" />
          <circle cx="60" cy="27" r="3" fill="#ef4444" />
          <circle cx="48" cy="29" r="2" fill="#3b82f6" />
          <circle cx="72" cy="29" r="2" fill="#22c55e" />
        </g>
      );
    case "acc-halo":
      return <ellipse cx="60" cy="16" rx="18" ry="5" fill="none" stroke="#facc15" strokeWidth="3.5" />;
    case "acc-headphones":
      return (
        <g>
          <path d="M32 58 Q30 22 60 22 Q90 22 88 58" fill="none" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
          <rect x="24" y="50" width="12" height="18" rx="5" fill="#ef4444" />
          <rect x="84" y="50" width="12" height="18" rx="5" fill="#ef4444" />
        </g>
      );
    case "acc-bow":
      return (
        <g fill="#ec4899">
          <path d="M80 32 L70 24 L70 40 Z" />
          <path d="M80 32 L90 24 L90 40 Z" />
          <circle cx="80" cy="32" r="3.5" fill="#be185d" />
        </g>
      );
    case "acc-flower":
      return (
        <g>
          <g fill="#f9a8d4">
            {[0, 72, 144, 216, 288].map((a) => (
              <circle key={a} cx={80 + 5 * Math.cos((a * Math.PI) / 180)} cy={32 + 5 * Math.sin((a * Math.PI) / 180)} r="4" />
            ))}
          </g>
          <circle cx="80" cy="32" r="3" fill="#facc15" />
        </g>
      );
    case "acc-bandana":
      return (
        <g>
          <path d="M31 46 Q34 30 60 30 Q86 30 89 46 Q60 38 31 46 Z" fill="#dc2626" />
          <path d="M88 44 L98 40 L96 50 Z" fill="#b91c1c" />
          <g fill="#fecaca">
            <circle cx="48" cy="38" r="1.3" />
            <circle cx="60" cy="35" r="1.3" />
            <circle cx="72" cy="38" r="1.3" />
          </g>
        </g>
      );
    case "acc-pirate":
      return (
        <g>
          <path d="M34 44 L88 64" stroke="#111827" strokeWidth="2.5" />
          <ellipse cx="70" cy="57" rx="7" ry="6" fill="#111827" />
        </g>
      );
    case "acc-mask":
      return (
        <g>
          <path d="M36 52 Q60 46 84 52 Q86 62 76 63 Q68 63 60 58 Q52 63 44 63 Q34 62 36 52 Z" fill="#111827" />
          <ellipse cx="50" cy="56" rx="4" ry="3.4" fill="#fff" />
          <ellipse cx="70" cy="56" rx="4" ry="3.4" fill="#fff" />
          <circle cx="50" cy="56" r="2" fill="#1f2937" />
          <circle cx="70" cy="56" r="2" fill="#1f2937" />
        </g>
      );
    case "acc-mustache":
      return (
        <path
          d="M60 64 Q54 60 48 64 Q44 67 40 64 Q44 70 52 67 Q57 66 60 65 Q63 66 68 67 Q76 70 80 64 Q76 67 72 64 Q66 60 60 64 Z"
          fill="#4b2e1a"
        />
      );
    case "acc-freckles":
      return (
        <g fill="#b45309" opacity="0.7">
          {[[41, 62], [45, 65], [40, 67], [79, 62], [75, 65], [80, 67]].map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r="1.1" />
          ))}
        </g>
      );
    case "acc-star":
      return (
        <path
          d="M84 28 l3.6 7.4 8.1 1.2 -5.9 5.7 1.4 8.1 -7.2 -3.8 -7.2 3.8 1.4 -8.1 -5.9 -5.7 8.1 -1.2 Z"
          fill="#facc15"
          stroke="#f59e0b"
          strokeWidth="1.5"
        />
      );
    default:
      return null;
  }
}
