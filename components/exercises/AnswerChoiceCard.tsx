"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Carte de choix tactile : tous les états visuels d'un QCM premium.
 * default → selected → correct / wrong / revealedCorrect / dimmed.
 */
export type ChoiceVisualState =
  | "default"
  | "selected"
  | "correct"
  | "wrong"
  | "revealedCorrect"
  | "dimmed";

interface AnswerChoiceCardProps {
  text: string;
  /** Sous-texte pédagogique révélé après la réponse. */
  subLabel?: string;
  state: ChoiceVisualState;
  /** Verrouillé : plus aucun tap possible (après submit). */
  locked: boolean;
  onSelect: () => void;
  /** Index pour l'entrée en cascade. */
  index: number;
}

export function AnswerChoiceCard({
  text,
  subLabel,
  state,
  locked,
  onSelect,
  index,
}: AnswerChoiceCardProps) {
  const interactive = !locked;

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 16 }}
      animate={
        state === "wrong"
          ? { opacity: 1, y: 0, x: [0, -8, 8, -5, 5, 0] }
          : { opacity: 1, y: 0, x: 0 }
      }
      transition={
        state === "wrong"
          ? { x: { duration: 0.45 } }
          : {
              delay: 0.08 + index * 0.07,
              type: "spring",
              stiffness: 300,
              damping: 24,
            }
      }
      whileTap={interactive ? { scale: 0.98 } : undefined}
      onClick={() => interactive && onSelect()}
      disabled={locked}
      aria-pressed={state === "selected"}
      className={cn(
        "relative flex w-full items-center gap-3 rounded-3xl border-2 bg-white px-4 py-3.5 text-left text-[15px] font-semibold shadow-soft transition-all",
        state === "default" &&
          interactive &&
          "cursor-pointer border-ink/8 hover:border-primary-300",
        state === "default" && !interactive && "border-ink/8",
        state === "selected" &&
          "cursor-pointer border-primary-500 bg-primary-50 shadow-[0_0_20px_-6px_rgba(88,92,226,0.5)]",
        state === "correct" &&
          "border-mint-500 bg-mint-50 shadow-[0_0_24px_-4px_rgba(44,183,131,0.55)]",
        state === "wrong" && "border-coral-500 bg-coral-50",
        state === "revealedCorrect" && "border-mint-400 bg-mint-50/70",
        state === "dimmed" && "border-ink/5 opacity-40",
      )}
    >
      <span className="min-w-0 flex-1">
        <span className="block text-ink">{text}</span>
        <AnimatePresence>
          {subLabel && (
            <motion.span
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={cn(
                "block overflow-hidden text-xs font-medium",
                state === "correct" || state === "revealedCorrect"
                  ? "text-mint-600"
                  : state === "wrong"
                    ? "text-coral-600"
                    : "text-ink-faint",
              )}
            >
              {subLabel}
            </motion.span>
          )}
        </AnimatePresence>
      </span>

      {/* Indicateur d'état à droite */}
      {state === "selected" && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="grid size-6 shrink-0 place-items-center rounded-full bg-primary-500 text-white"
        >
          <Check className="size-3.5" strokeWidth={3.5} />
        </motion.span>
      )}
      {(state === "correct" || state === "revealedCorrect") && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.25, 1] }}
          transition={{ duration: 0.4 }}
          className={cn(
            "grid size-6 shrink-0 place-items-center rounded-full text-white",
            state === "correct" ? "bg-mint-500" : "bg-mint-400",
          )}
        >
          <Check className="size-3.5" strokeWidth={3.5} />
        </motion.span>
      )}
      {state === "wrong" && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="grid size-6 shrink-0 place-items-center rounded-full bg-coral-500 text-white"
        >
          <X className="size-3.5" strokeWidth={3.5} />
        </motion.span>
      )}
      {state === "default" && interactive && (
        <span className="size-5 shrink-0 rounded-full border-2 border-ink/12" />
      )}
    </motion.button>
  );
}
