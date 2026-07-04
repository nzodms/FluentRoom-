import type { LearningIconName } from "@/components/icons/learning-icons";

/**
 * Thème visuel par type d'exercice : chaque famille de question a son
 * accent, son icône et son halo — le même layout ne se répète jamais
 * à l'identique.
 */
export type ExerciseTheme =
  | "pattern"
  | "nuance"
  | "trap"
  | "listening"
  | "speaking"
  | "reflex";

export interface ExerciseThemeConfig {
  icon: LearningIconName;
  /** Ton du chip de label. */
  chipTone: "primary" | "coral" | "mint" | "gold";
  /** Halo très subtil derrière la question. */
  halo: string;
  /** Accent du panneau de feedback correct. */
  accentText: string;
}

export const EXERCISE_THEMES: Record<ExerciseTheme, ExerciseThemeConfig> = {
  pattern: {
    icon: "lesson",
    chipTone: "primary",
    halo: "rgba(88,92,226,0.10)",
    accentText: "text-primary-600",
  },
  nuance: {
    icon: "native",
    chipTone: "primary",
    halo: "rgba(88,92,226,0.08)",
    accentText: "text-primary-600",
  },
  trap: {
    icon: "trap",
    chipTone: "coral",
    halo: "rgba(255,107,87,0.10)",
    accentText: "text-coral-600",
  },
  listening: {
    icon: "listen",
    chipTone: "primary",
    halo: "rgba(88,92,226,0.10)",
    accentText: "text-primary-600",
  },
  speaking: {
    icon: "speak",
    chipTone: "mint",
    halo: "rgba(44,183,131,0.10)",
    accentText: "text-mint-600",
  },
  reflex: {
    icon: "reflex",
    chipTone: "gold",
    halo: "rgba(224,163,46,0.10)",
    accentText: "text-gold-500",
  },
};
