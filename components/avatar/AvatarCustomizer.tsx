"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Lock, ShoppingBag } from "lucide-react";
import type {
  AvatarConfig,
  AvatarItem,
  AvatarItemType,
} from "@/types/learning";
import { avatarItems } from "@/data/avatar-items";
import {
  FluentCharacter,
  type CharacterExpression,
} from "./FluentCharacter";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/utils";

const TABS: Array<{ type: AvatarItemType; label: string }> = [
  { type: "skin", label: "Teinte" },
  { type: "hair", label: "Cheveux" },
  { type: "outfit", label: "Tenue" },
  { type: "accessory", label: "Accessoire" },
  { type: "aura", label: "Aura" },
  { type: "background", label: "Fond" },
];

const RARITY_CHIP: Record<
  AvatarItem["rarity"],
  "neutral" | "primary" | "gold" | "coral"
> = {
  common: "neutral",
  rare: "primary",
  epic: "gold",
  special: "coral",
};

interface AvatarCustomizerProps {
  config: AvatarConfig;
  unlockedItems: string[];
  onChange: (config: AvatarConfig) => void;
}

/** Personnalisation du personnage + inventaire, items verrouillés en teaser. */
export function AvatarCustomizer({
  config,
  unlockedItems,
  onChange,
}: AvatarCustomizerProps) {
  const router = useRouter();
  const [tab, setTab] = useState<AvatarItemType>("outfit");
  const [expression, setExpression] = useState<CharacterExpression>("neutral");
  const unlocked = new Set(unlockedItems);
  const items = avatarItems.filter((item) => item.type === tab);

  const equip = (item: AvatarItem) => {
    if (!unlocked.has(item.id)) {
      // Un item boutique verrouillé emmène directement à la boutique.
      if (item.unlock.kind === "shop") router.push("/app/shop");
      return;
    }
    if (item.type === "effect") return;
    onChange({ ...config, [item.type]: item.id });
    // Le personnage réagit au nouvel item.
    setExpression("happy");
    setTimeout(() => setExpression("neutral"), 1400);
  };

  return (
    <div className="card-soft overflow-hidden p-0">
      {/* Preview sur scène */}
      <div
        className="relative flex items-center justify-center py-6"
        style={{
          background:
            "linear-gradient(180deg, #EEEEFD 0%, #F7F6F1 78%)",
        }}
      >
        {/* Halo de scène */}
        <span
          aria-hidden
          className="absolute top-8 size-40 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(88,92,226,0.18), transparent 65%)",
          }}
        />
        {/* Plateforme */}
        <span
          aria-hidden
          className="absolute bottom-5 h-6 w-44 rounded-[50%] bg-ink/8"
        />
        {/* Pas de remount à l'équipement : le personnage reste monté,
            seule l'expression réagit — aucun flash. */}
        <div className="relative">
          <FluentCharacter
            config={config}
            expression={expression}
            size={160}
            showBackground={false}
          />
        </div>
      </div>

      {/* Onglets */}
      <div className="flex gap-1.5 overflow-x-auto px-4 pb-1 no-scrollbar">
        {TABS.map((t) => (
          <button
            key={t.type}
            onClick={() => setTab(t.type)}
            className={cn(
              "shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-bold transition-all",
              tab === t.type
                ? "gradient-primary text-white shadow-glow"
                : "bg-ink/5 text-ink-soft",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="grid grid-cols-2 gap-2.5 p-4">
        {items.map((item) => {
          const isUnlocked = unlocked.has(item.id);
          const fromShop = !isUnlocked && item.unlock.kind === "shop";
          const equipped =
            item.type !== "effect" &&
            config[item.type as keyof AvatarConfig] === item.id;
          return (
            <motion.button
              key={item.id}
              whileTap={isUnlocked || fromShop ? { scale: 0.95 } : undefined}
              onClick={() => equip(item)}
              className={cn(
                "relative rounded-2xl border p-3 text-left transition-all",
                equipped
                  ? "border-primary-500 bg-primary-50 ring-1 ring-primary-500"
                  : isUnlocked
                    ? "cursor-pointer border-ink/8 bg-white hover:border-primary-200"
                    : fromShop
                      ? "cursor-pointer border-gold-400/40 bg-gold-50/60 hover:border-gold-400"
                      : "border-ink/5 bg-ink/[0.03] opacity-70",
              )}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-xl",
                    !isUnlocked && "grayscale",
                  )}
                  style={{
                    background: item.color ? `${item.color}33` : "rgba(23,26,38,0.05)",
                  }}
                >
                  {item.color ? (
                    <span
                      className="size-4.5 rounded-full"
                      style={{ background: item.color }}
                    />
                  ) : (
                    <span className="text-xs font-bold text-ink-faint">—</span>
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-ink">
                    {item.name}
                  </p>
                  <p className="truncate text-[10px] text-ink-faint">
                    {isUnlocked ? (
                      <Chip tone={RARITY_CHIP[item.rarity]} className="!px-1.5 !py-0 !text-[9px]">
                        {item.rarity}
                      </Chip>
                    ) : fromShop ? (
                      <span className="font-bold text-gold-500">
                        Voir dans la boutique →
                      </span>
                    ) : (
                      item.unlock.label
                    )}
                  </p>
                </div>
                {equipped ? (
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary-500 text-white">
                    <Check className="size-3" strokeWidth={3.5} />
                  </span>
                ) : fromShop ? (
                  <ShoppingBag className="size-3.5 shrink-0 text-gold-500" />
                ) : !isUnlocked ? (
                  <Lock className="size-3.5 shrink-0 text-ink-faint" />
                ) : null}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
