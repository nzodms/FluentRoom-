"use client";

import {
  AlertTriangle,
  AudioLines,
  AudioWaveform,
  Blocks,
  BookMarked,
  Flame,
  Gauge,
  Gift,
  Headphones,
  Mic,
  MonitorPlay,
  Puzzle,
  RotateCcw,
  Sparkles,
  Swords,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Système d'icônes pédagogiques : une icône stable par concept,
 * rendue dans une capsule teintée selon son état.
 * Remplace progressivement les emojis dans l'UI structurelle.
 */

export type LearningIconName =
  | "listen"
  | "speak"
  | "phrase"
  | "lesson"
  | "review"
  | "streak"
  | "chest"
  | "fluency"
  | "fast"
  | "native"
  | "trap"
  | "build"
  | "shadowing"
  | "video"
  | "quest"
  | "reflex"
  | "warmup";

export type LearningIconVariant =
  | "default"
  | "active"
  | "completed"
  | "locked"
  | "reward";

const ICONS: Record<LearningIconName, LucideIcon> = {
  listen: Headphones,
  speak: Mic,
  phrase: BookMarked,
  lesson: Puzzle,
  review: RotateCcw,
  streak: Flame,
  chest: Gift,
  fluency: Gauge,
  fast: Zap,
  native: AudioWaveform,
  trap: AlertTriangle,
  build: Blocks,
  shadowing: AudioLines,
  video: MonitorPlay,
  quest: Swords,
  reflex: Sparkles,
  warmup: Flame,
};

/** Teinte "métier" de chaque concept (Listen bleu, Speak menthe, Review doré…). */
const CATEGORY_TONE: Partial<Record<LearningIconName, string>> = {
  speak: "bg-mint-50 text-mint-600",
  shadowing: "bg-mint-50 text-mint-600",
  review: "bg-gold-50 text-gold-500",
  chest: "bg-gold-50 text-gold-500",
  trap: "bg-coral-50 text-coral-500",
  streak: "bg-coral-50 text-coral-500",
  warmup: "bg-coral-50 text-coral-500",
  fast: "bg-coral-50 text-coral-500",
};

const VARIANT_CLASSES: Record<LearningIconVariant, string> = {
  default: "bg-primary-50 text-primary-600",
  active: "gradient-primary text-white glow-primary",
  completed: "gradient-mint text-white glow-mint",
  locked: "bg-ink/5 text-ink-faint",
  reward: "gradient-gold text-white glow-gold",
};

/** Variantes "active" par teinte métier. */
const ACTIVE_TONE: Partial<Record<LearningIconName, string>> = {
  speak: "gradient-mint text-white glow-mint",
  shadowing: "gradient-mint text-white glow-mint",
  review: "gradient-gold text-white glow-gold",
  chest: "gradient-gold text-white glow-gold",
  trap: "gradient-coral text-white",
  streak: "gradient-coral text-white",
  warmup: "gradient-coral text-white",
};

const SIZES = {
  sm: { box: "size-8 rounded-xl", icon: "size-3.5" },
  md: { box: "size-10 rounded-2xl", icon: "size-4" },
  lg: { box: "size-12 rounded-2xl", icon: "size-5" },
  xl: { box: "size-14 rounded-3xl", icon: "size-6" },
} as const;

interface LearningIconProps {
  name: LearningIconName;
  variant?: LearningIconVariant;
  size?: keyof typeof SIZES;
  className?: string;
}

export function LearningIcon({
  name,
  variant = "default",
  size = "md",
  className,
}: LearningIconProps) {
  const Icon = ICONS[name];
  const sizeConfig = SIZES[size];

  let tone: string = VARIANT_CLASSES[variant];
  if (variant === "default" && CATEGORY_TONE[name]) tone = CATEGORY_TONE[name];
  if (variant === "active" && ACTIVE_TONE[name]) tone = ACTIVE_TONE[name];

  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center",
        sizeConfig.box,
        tone,
        className,
      )}
    >
      <Icon className={sizeConfig.icon} strokeWidth={2.2} />
    </span>
  );
}

/** Icône nue (sans capsule) pour usages inline. */
export function LearningGlyph({
  name,
  className,
}: {
  name: LearningIconName;
  className?: string;
}) {
  const Icon = ICONS[name];
  return <Icon className={className} strokeWidth={2.2} />;
}
