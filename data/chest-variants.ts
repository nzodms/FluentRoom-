/**
 * Variantes visuelles du coffre : chaque type a sa palette,
 * son glow et son intensité de particules.
 */
export type ChestVariant = "daily" | "rare" | "epic" | "event" | "boss";

export interface ChestRarityStyle {
  /** Bois / corps du coffre. */
  base: string;
  baseDark: string;
  /** Couvercle. */
  lid: string;
  lidDark: string;
  /** Ferrures et serrure. */
  metal: string;
  metalDark: string;
  /** Lumière interne / faisceau. */
  glow: string;
  /** Halo derrière le coffre. */
  halo: string;
  /** Intensité des particules (0–1). */
  particles: number;
  /** Échelle relative. */
  scale: number;
  label: string;
}

export const CHEST_STYLES: Record<ChestVariant, ChestRarityStyle> = {
  daily: {
    base: "#8B5CF6",
    baseDark: "#6D45D6",
    lid: "#7C4FE0",
    lidDark: "#5F38B8",
    metal: "#F3C64F",
    metalDark: "#D9A32E",
    glow: "#FFE9A8",
    halo: "rgba(243,198,79,0.4)",
    particles: 0.6,
    scale: 1,
    label: "Coffre du jour",
  },
  rare: {
    base: "#4F6BE8",
    baseDark: "#3A50C4",
    lid: "#4257D6",
    lidDark: "#2F3FA8",
    metal: "#9BB4FF",
    metalDark: "#6E8AF0",
    glow: "#CDD9FF",
    halo: "rgba(88,92,226,0.5)",
    particles: 0.8,
    scale: 1.04,
    label: "Coffre rare",
  },
  epic: {
    base: "#6D45D6",
    baseDark: "#54309F",
    lid: "#5B38B8",
    lidDark: "#432584",
    metal: "#F3C64F",
    metalDark: "#D9A32E",
    glow: "#FFE9A8",
    halo: "rgba(223,169,46,0.55)",
    particles: 1,
    scale: 1.08,
    label: "Coffre épique",
  },
  event: {
    base: "#E85C8A",
    baseDark: "#C24069",
    lid: "#D64A78",
    lidDark: "#A83358",
    metal: "#FFD1E0",
    metalDark: "#F0A0BC",
    glow: "#FFE3ED",
    halo: "rgba(232,92,138,0.5)",
    particles: 1,
    scale: 1.06,
    label: "Coffre d'événement",
  },
  boss: {
    base: "#2E3184",
    baseDark: "#1F2260",
    lid: "#272A72",
    lidDark: "#181A4E",
    metal: "#F3C64F",
    metalDark: "#D9A32E",
    glow: "#FFF2C4",
    halo: "rgba(243,198,79,0.6)",
    particles: 1,
    scale: 1.18,
    label: "Coffre de boss",
  },
};
