"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import {
  LearningGlyph,
  type LearningIconName,
} from "@/components/icons/learning-icons";
import { cn } from "@/lib/utils";

/**
 * Choix d'onboarding : icône FluentRoom, entrée en cascade,
 * état sélectionné violet avec glow et check animé.
 */
export function OnboardingChoiceCard({
  icon,
  label,
  hint,
  selected,
  locked,
  onSelect,
  index,
}: {
  icon: LearningIconName;
  label: string;
  /** Sous-texte optionnel (ex: ce que débloque une routine). */
  hint?: string;
  selected: boolean;
  /** Après sélection : plus de tap possible pendant le feedback. */
  locked?: boolean;
  onSelect: () => void;
  index: number;
}) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.08 + index * 0.06,
        type: "spring",
        stiffness: 300,
        damping: 24,
      }}
      whileTap={!locked ? { scale: 0.97 } : undefined}
      onClick={() => !locked && onSelect()}
      disabled={locked && !selected}
      className={cn(
        "flex w-full items-center gap-3 rounded-3xl border-2 bg-white px-4 py-3.5 text-left shadow-soft transition-all",
        selected
          ? "border-primary-500 bg-primary-50 shadow-[0_0_20px_-6px_rgba(88,92,226,0.5)]"
          : locked
            ? "border-ink/5 opacity-45"
            : "cursor-pointer border-ink/8 hover:border-primary-300",
      )}
    >
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-2xl transition-colors",
          selected
            ? "gradient-primary text-white shadow-glow"
            : "bg-primary-50 text-primary-600",
        )}
      >
        <LearningGlyph name={icon} className="size-4.5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-ink">{label}</span>
        {hint && (
          <span
            className={cn(
              "block text-xs font-medium",
              selected ? "text-primary-600" : "text-ink-faint",
            )}
          >
            {hint}
          </span>
        )}
      </span>
      {selected && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 420, damping: 20 }}
          className="grid size-6 shrink-0 place-items-center rounded-full bg-primary-500 text-white"
        >
          <Check className="size-3.5" strokeWidth={3.5} />
        </motion.span>
      )}
    </motion.button>
  );
}
