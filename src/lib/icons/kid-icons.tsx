import { createElement } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Hand,
  Badge,
  MessageCircle,
  Palette,
  PawPrint,
  Rainbow,
  BookOpen,
  Cat,
  Dog,
  Bird,
  Fish,
  Rabbit,
  Smile,
  Star,
  Sparkles,
  Trophy,
  Heart,
  Sun,
  Moon,
  Apple,
  Languages,
  GraduationCap,
  Volume2,
  Puzzle,
  Layers,
  HelpCircle,
  Bus,
  Briefcase,
  Dumbbell,
  Gamepad2,
  Music,
  TreePine,
  Waves,
  Rocket,
  Gift,
  ShoppingCart,
  Coins,
  Stethoscope,
  Droplets,
  ChefHat,
  Flower2,
  Bug,
  Shapes,
  Ruler,
  ArrowLeftRight,
  MapPin,
  CircleHelp,
  Sparkle,
  Calendar,
  PartyPopper,
  Plane,
  Laptop,
  Leaf,
  TrainFront,
  Hash,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";

/** Mapeia emojis legados do conteúdo → ícones Lucide infantis */
const EMOJI_ICON: Record<string, LucideIcon> = {
  "👋": Hand,
  "📛": Badge,
  "💬": MessageCircle,
  "🎨": Palette,
  "🌈": Rainbow,
  "🐾": PawPrint,
  "🐄": PawPrint,
  "🦁": PawPrint,
  "👤": Smile,
  "🦊": Rabbit,
  "😊": Smile,
  "🤝": Heart,
  "❓": HelpCircle,
  "🙏": Heart,
  "🔴": Palette,
  "🔵": Palette,
  "🟢": Palette,
  "🟡": Palette,
  "🟣": Palette,
  "🟠": Palette,
  "⬛": Moon,
  "⬜": Sun,
  "🐱": Cat,
  "🐶": Dog,
  "🐦": Bird,
  "🐟": Fish,
  "🐘": PawPrint,
  "🐵": PawPrint,
  "✨": Sparkles,
  "📚": BookOpen,
  "🏆": Trophy,
  "🎉": Sparkles,
  "🪙": Star,
  "🔒": HelpCircle,
  // Temas de hiperfoco e tutorial
  "🚀": Rocket,
  "🚆": TrainFront,
  "📅": Calendar,
  "🔢": Hash,
  "🎮": Gamepad2,
  "🎵": Music,
  "⚽": Dumbbell,
  "🌳": TreePine,
  "🍳": ChefHat,
  "🌊": Waves,
  "🃏": Layers,
  "💡": Lightbulb,
  "⭐": Star,
};

const SLUG_ICON: Record<string, LucideIcon> = {
  greetings: Hand,
  colors: Palette,
  animals: PawPrint,
  numbers: GraduationCap,
  family: Heart,
  body: Smile,
  food: Apple,
  clothes: Badge,
  weather: Sun,
  school: BookOpen,
  house: Layers,
  actions: Volume2,
  feelings: Sparkles,
  time: Moon,
  places: Languages,
  transport: Bus,
  jobs: Briefcase,
  sports: Dumbbell,
  hobbies: Gamepad2,
  music: Music,
  nature: TreePine,
  ocean: Waves,
  space: Rocket,
  toys: Gift,
  party: PartyPopper,
  shopping: ShoppingCart,
  money: Coins,
  health: Stethoscope,
  hygiene: Droplets,
  kitchen: ChefHat,
  garden: Flower2,
  insects: Bug,
  birds: Bird,
  shapes: Shapes,
  sizes: Ruler,
  opposites: ArrowLeftRight,
  prepositions: MapPin,
  questions: CircleHelp,
  adjectives: Sparkle,
  routine: Sun,
  months: Calendar,
  holidays: PartyPopper,
  travel: Plane,
  technology: Laptop,
  environment: Leaf,
  "hello-goodbye": Hand,
  "my-name": Badge,
  "how-are-you": MessageCircle,
  "basic-colors": Rainbow,
  "more-colors": Palette,
  "farm-animals": PawPrint,
  "wild-animals": PawPrint,
};

const WORD_HINT_ICON: [RegExp, LucideIcon][] = [
  [/hello|hi|bye|goodbye/i, Hand],
  [/name/i, Badge],
  [/how|fine|thank/i, MessageCircle],
  [/red|blue|green|yellow|color|purple|orange|black|white/i, Palette],
  [/cat|dog|cow|bird|lion|elephant|monkey|fish|animal/i, PawPrint],
  [/apple|food|eat/i, Apple],
];

export function resolveKidIcon(
  input?: string | null,
  options?: { slug?: string }
): LucideIcon {
  if (!input && options?.slug) {
    return SLUG_ICON[options.slug] ?? BookOpen;
  }
  if (!input) return BookOpen;

  if (EMOJI_ICON[input]) return EMOJI_ICON[input];
  if (SLUG_ICON[input]) return SLUG_ICON[input];

  for (const [re, icon] of WORD_HINT_ICON) {
    if (re.test(input)) return icon;
  }

  return Sparkles;
}

const SIZE_CLASS = {
  xs: "h-4 w-4",
  sm: "h-5 w-5",
  md: "h-8 w-8",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

const BOX_SIZE = {
  xs: "h-8 w-8 rounded-lg p-1",
  sm: "h-10 w-10 rounded-xl p-1.5",
  md: "h-16 w-16 rounded-2xl p-3",
  lg: "h-24 w-24 rounded-2xl p-4",
  xl: "h-32 w-32 rounded-3xl p-5",
};

export interface KidIconProps {
  emoji?: string | null;
  word?: string | null;
  slug?: string;
  size?: keyof typeof SIZE_CLASS;
  variant?: "plain" | "boxed";
  className?: string;
  iconClassName?: string;
}

export function KidIcon({
  emoji,
  word,
  slug,
  size = "md",
  variant = "boxed",
  className,
  iconClassName,
}: KidIconProps) {
  const iconEl = createElement(resolveKidIcon(emoji ?? word, { slug }), {
    className: cn(SIZE_CLASS[size], "text-primary shrink-0", iconClassName),
    strokeWidth: 2.25,
    "aria-hidden": true,
  });

  if (variant === "plain") {
    return <span className={cn("inline-flex", className)}>{iconEl}</span>;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center bg-gradient-to-br from-speakup-green-soft/80 to-speakup-yellow-soft/60 shadow-sm",
        BOX_SIZE[size],
        className
      )}
    >
      {iconEl}
    </span>
  );
}

/** Ícones para escolha de avatar (substitui emojis) */
export const AVATAR_ICON_OPTIONS = [
  { id: "rabbit", Icon: Rabbit, label: "Coelho" },
  { id: "cat", Icon: Cat, label: "Gato" },
  { id: "dog", Icon: Dog, label: "Cachorro" },
  { id: "bird", Icon: Bird, label: "Passarinho" },
  { id: "fish", Icon: Fish, label: "Peixinho" },
  { id: "smile", Icon: Smile, label: "Criança" },
  { id: "star", Icon: Star, label: "Estrelinha" },
  { id: "sparkles", Icon: Sparkles, label: "Unicórnio" },
] as const;

export {
  BookOpen,
  GraduationCap,
  Volume2,
  Puzzle,
  Layers,
  Trophy,
  Sparkles,
  Languages,
};
