"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Lock } from "lucide-react";
import type {
  AvatarConfig,
  AvatarItem,
  AvatarItemType,
} from "@/types/learning";
import { avatarItems } from "@/data/avatar-items";
import { AvatarCharacter } from "./AvatarCharacter";
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
  const [tab, setTab] = useState<AvatarItemType>("outfit");
  const unlocked = new Set(unlockedItems);
  const items = avatarItems.filter((item) => item.type === tab);

  const equip = (item: AvatarItem) => {
    if (!unlocked.has(item.id)) return;
    onChange({ ...config, [item.type]: item.id });
  };

  return (
    <div className="card-soft overflow-hidden p-0">
      {/* Preview */}
      <div className="flex items-center justify-center bg-gradient-to-b from-primary-50/60 to-transparent py-5">
        <motion.div
          key={JSON.stringify(config)}
          initial={{ scale: 0.92 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
        >
          <AvatarCharacter config={config} size={132} />
        </motion.div>
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
          const equipped = config[item.type] === item.id;
          return (
            <motion.button
              key={item.id}
              whileTap={isUnlocked ? { scale: 0.95 } : undefined}
              onClick={() => equip(item)}
              className={cn(
                "relative rounded-2xl border p-3 text-left transition-all",
                equipped
                  ? "border-primary-500 bg-primary-50 ring-1 ring-primary-500"
                  : isUnlocked
                    ? "cursor-pointer border-ink/8 bg-white hover:border-primary-200"
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
                    ) : (
                      item.unlock.label
                    )}
                  </p>
                </div>
                {equipped ? (
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary-500 text-white">
                    <Check className="size-3" strokeWidth={3.5} />
                  </span>
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
