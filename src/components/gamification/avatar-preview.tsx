"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AvatarFigure } from "@/components/gamification/avatar-figure";

interface AvatarPreviewProps {
  /** Personagem base: rabbit, cat, dog… (emojis antigos viram o coelho) */
  baseEmoji?: string;
  hairSlug?: string | null;
  clothesSlug?: string | null;
  accessorySlug?: string | null;
  backgroundSlug?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  sm: "h-16 w-16",
  md: "h-24 w-24",
  lg: "h-32 w-32",
  xl: "h-48 w-48",
};

export function AvatarPreview({
  baseEmoji = "rabbit",
  hairSlug,
  clothesSlug,
  accessorySlug,
  backgroundSlug,
  size = "md",
  className,
}: AvatarPreviewProps) {
  return (
    <motion.div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full border-4 border-card shadow-[0_0_0_2px_hsl(var(--border))]",
        sizes[size],
        className
      )}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
        <AvatarFigure
          base={baseEmoji}
          hair={hairSlug ?? undefined}
          clothes={clothesSlug ?? undefined}
          accessory={accessorySlug}
          background={backgroundSlug}
        />
    </motion.div>
  );
}
