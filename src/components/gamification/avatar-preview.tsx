"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { KidIcon, resolveAvatarIcon } from "@/lib/icons/kid-icons";

interface AvatarPreviewProps {
  /** Slug do avatar: rabbit, cat, dog… ou emoji legado */
  baseEmoji?: string;
  hairIcon?: string;
  clothesIcon?: string;
  accessoryIcon?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "h-16 w-16",
  md: "h-24 w-24",
  lg: "h-32 w-32",
};

const iconSizes = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-16 w-16",
};

const badgeSizes = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export function AvatarPreview({
  baseEmoji = "rabbit",
  hairIcon,
  clothesIcon,
  accessoryIcon,
  size = "md",
  className,
}: AvatarPreviewProps) {
  const Icon = resolveAvatarIcon(baseEmoji);

  return (
    <motion.div
      className={cn(
        "relative flex items-center justify-center rounded-full border-4 border-primary/30 bg-gradient-to-br from-speakup-yellow-soft to-speakup-green-soft shadow-lg",
        sizes[size],
        className
      )}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400 }}
      aria-label="Avatar"
    >
      <Icon className={cn(iconSizes[size], "text-primary")} strokeWidth={2.25} aria-hidden />
      {hairIcon && (
        <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 rounded-full bg-card p-0.5 shadow-sm">
          <KidIcon emoji={hairIcon} size="xs" variant="plain" iconClassName={badgeSizes[size]} />
        </span>
      )}
      {clothesIcon && (
        <span className="absolute bottom-0 right-0 rounded-full bg-card p-0.5 shadow-sm">
          <KidIcon emoji={clothesIcon} size="xs" variant="plain" iconClassName={badgeSizes[size]} />
        </span>
      )}
      {accessoryIcon && (
        <span className="absolute top-0 right-0 rounded-full bg-card p-0.5 shadow-sm">
          <KidIcon emoji={accessoryIcon} size="xs" variant="plain" iconClassName={badgeSizes[size]} />
        </span>
      )}
    </motion.div>
  );
}
