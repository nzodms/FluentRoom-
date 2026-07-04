"use client";

import { motion } from "framer-motion";
import { Shield, Zap } from "lucide-react";
import type { Reward } from "@/types/learning";
import { getAvatarItem } from "@/data/avatar-items";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/utils";

const RARITY_STYLE: Record<
  Reward["rarity"],
  {
    label: string;
    chip: "neutral" | "primary" | "gold" | "coral";
    frame: string;
    shimmer: boolean;
  }
> = {
  common: {
    label: "Common",
    chip: "neutral",
    frame: "bg-white ring-1 ring-ink/8",
    shimmer: false,
  },
  rare: {
    label: "Rare",
    chip: "primary",
    frame:
      "card-tint-primary ring-2 ring-primary-300 shadow-[0_16px_44px_-10px_rgba(88,92,226,0.55)]",
    shimmer: true,
  },
  epic: {
    label: "Epic",
    chip: "gold",
    frame:
      "card-tint-gold ring-2 ring-gold-400 shadow-[0_16px_44px_-10px_rgba(223,169,46,0.6)]",
    shimmer: true,
  },
  special: {
    label: "Special",
    chip: "coral",
    frame:
      "card-tint-gold ring-2 ring-coral-400 shadow-[0_20px_50px_-10px_rgba(249,113,74,0.6)]",
    shimmer: true,
  },
};

/** Pièce FP illustrée (pas d'emoji). */
function FPCoin({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="28" fill="#DFA92E" />
      <circle cx="32" cy="32" r="28" fill="none" stroke="#C08F1C" strokeWidth="3" />
      <circle cx="32" cy="32" r="21" fill="none" stroke="#F3D27A" strokeWidth="2.5" />
      <path d="M20 16 Q26 10 36 10" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="4" strokeLinecap="round" />
      <text
        x="32"
        y="40"
        textAnchor="middle"
        fontSize="19"
        fontWeight="800"
        fill="#8A6410"
        fontFamily="inherit"
      >
        FP
      </text>
    </svg>
  );
}

/** Miniature d'un item avatar : pastille de couleur sertie. */
function ItemMedallion({ color }: { color: string }) {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="28" fill="#FFFFFF" />
      <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(23,26,38,0.1)" strokeWidth="2" />
      <circle cx="32" cy="32" r="18" fill={color} />
      <path d="M22 22 Q26 16 34 15" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

/** Carte de récompense illustrée, avec cadre et glow selon la rareté. */
export function IllustratedRewardCard({
  reward,
  size = "md",
}: {
  reward: Reward;
  size?: "md" | "lg";
}) {
  const rarity = RARITY_STYLE[reward.rarity];
  const item = reward.itemId ? getAvatarItem(reward.itemId) : null;
  const big = size === "lg" || reward.rarity === "special";

  return (
    <motion.div
      initial={{ opacity: 0, y: 34, scale: 0.85, rotate: -3 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className={cn(
        "relative overflow-hidden rounded-[1.75rem] p-5 text-center",
        rarity.frame,
        rarity.shimmer && "shimmer",
        big ? "w-72" : "w-60",
      )}
    >
      <Chip tone={rarity.chip} className="mx-auto">
        {rarity.label}
      </Chip>

      <motion.div
        initial={{ scale: 0, rotate: -12 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 14 }}
        className="mx-auto mt-4 grid place-items-center"
      >
        {reward.type === "fp" ? (
          <FPCoin size={big ? 76 : 64} />
        ) : reward.type === "energy" ? (
          <span className="grid size-16 place-items-center rounded-3xl gradient-primary text-white glow-primary">
            <Zap className="size-8" fill="currentColor" />
          </span>
        ) : reward.type === "shield" ? (
          <span className="grid size-16 place-items-center rounded-3xl gradient-mint text-white glow-mint">
            <Shield className="size-8" strokeWidth={2} />
          </span>
        ) : (
          <ItemMedallion color={item?.color ?? "#585CE2"} />
        )}
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className={cn("mt-3 font-bold text-ink", big ? "text-xl" : "text-lg")}
      >
        {reward.type === "item" && item ? item.name : reward.label}
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-0.5 text-sm text-ink-soft"
      >
        {reward.type === "item"
          ? "Item avatar — équipe-le depuis ton profil"
          : reward.type === "shield"
            ? "Protège automatiquement un jour manqué"
            : reward.type === "energy"
              ? "Focus Energy bonus pour aujourd'hui"
              : "Ajoutés à ta progression"}
      </motion.p>
    </motion.div>
  );
}
