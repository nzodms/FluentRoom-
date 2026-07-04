"use client";

import { motion } from "framer-motion";
import { DEFAULT_AVATAR } from "@/data/avatar-items";
import {
  FluentCharacter,
  type CharacterExpression,
} from "@/components/avatar/FluentCharacter";
import { cn } from "@/lib/utils";

/**
 * Feedback court après une réponse d'onboarding : le personnage
 * réagit et commente — l'app montre qu'elle a compris.
 */
export function OnboardingFeedbackCard({
  message,
  tone = "primary",
  expression = "encouraging",
}: {
  message: string;
  tone?: "primary" | "mint" | "coral";
  expression?: CharacterExpression;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className={cn(
        "flex items-center gap-3 rounded-3xl p-3.5",
        tone === "mint" && "bg-mint-50",
        tone === "coral" && "bg-coral-50",
        tone === "primary" && "bg-primary-50",
      )}
    >
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.06 }}
        className="shrink-0"
      >
        <FluentCharacter
          config={DEFAULT_AVATAR}
          size={48}
          expression={expression}
          showBackground={false}
        />
      </motion.div>
      <p
        className={cn(
          "min-w-0 flex-1 text-sm font-semibold",
          tone === "mint" && "text-mint-600",
          tone === "coral" && "text-coral-600",
          tone === "primary" && "text-primary-700",
        )}
      >
        {message}
      </p>
    </motion.div>
  );
}
