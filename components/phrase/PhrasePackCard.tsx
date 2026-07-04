"use client";

import { motion } from "framer-motion";
import type { PhraseCategory } from "@/types/learning";
import {
  LearningIcon,
  type LearningIconName,
} from "@/components/icons/learning-icons";
import { cn } from "@/lib/utils";

/** Identité visuelle de chaque pack de la collection. */
export const PACK_META: Record<
  PhraseCategory,
  { label: string; icon: LearningIconName; bar: string }
> = {
  everyday: { label: "Daily life", icon: "phrase", bar: "gradient-primary" },
  "fast-english": { label: "Fast English", icon: "fast", bar: "gradient-coral" },
  social: { label: "Small talk", icon: "speak", bar: "gradient-mint" },
  travel: { label: "Travel", icon: "listen", bar: "gradient-primary" },
  opinions: { label: "Opinions", icon: "lesson", bar: "gradient-gold" },
  problems: { label: "Problems", icon: "trap", bar: "gradient-coral" },
};

interface PhrasePackCardProps {
  category: PhraseCategory;
  unlocked: number;
  total: number;
  selected: boolean;
  onClick: () => void;
  delay?: number;
}

/** Pack de collection : icône, progression, envie de compléter. */
export function PhrasePackCard({
  category,
  unlocked,
  total,
  selected,
  onClick,
  delay = 0,
}: PhrasePackCardProps) {
  const meta = PACK_META[category];
  const pct = total === 0 ? 0 : (unlocked / total) * 100;
  const complete = unlocked === total && total > 0;

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={cn(
        "cursor-pointer p-3 text-left transition-all",
        complete ? "card-tint-mint" : "card-soft",
        selected
          ? "ring-2 ring-primary-500"
          : "hover:ring-2 hover:ring-primary-200",
      )}
    >
      <div className="flex items-center gap-2.5">
        <LearningIcon
          name={meta.icon}
          variant={complete ? "completed" : selected ? "active" : "default"}
          size="sm"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-ink">{meta.label}</p>
          <p className="text-[10px] font-semibold text-ink-faint">
            {unlocked}/{total} phrases
          </p>
        </div>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink/8">
        <motion.div
          className={cn("h-full rounded-full", meta.bar)}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, delay: delay + 0.2 }}
        />
      </div>
    </motion.button>
  );
}
