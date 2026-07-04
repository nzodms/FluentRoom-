"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { AvatarConfig } from "@/types/learning";
import { FluentCharacter } from "@/components/avatar/FluentCharacter";
import { cn } from "@/lib/utils";

/**
 * Panneau de feedback après validation : le personnage réagit,
 * l'explication est pédagogique, l'erreur montre la bonne réponse.
 */
export function QuizFeedbackPanel({
  correct,
  explanation,
  correctAnswer,
  avatar,
}: {
  correct: boolean;
  explanation: string;
  /** Affiché quand l'utilisateur s'est trompé. */
  correctAnswer?: string;
  avatar: AvatarConfig;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className={cn(
        "mt-3 rounded-3xl p-4",
        correct ? "bg-mint-50" : "bg-coral-50",
      )}
    >
      <div className="flex items-start gap-3">
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.08 }}
          className="relative shrink-0"
        >
          <FluentCharacter
            config={avatar}
            size={52}
            expression={correct ? "celebrating" : "encouraging"}
            showBackground={false}
          />
          {correct && (
            <motion.span
              initial={{ opacity: 0, scale: 0, y: 4 }}
              animate={{ opacity: [0, 1, 0], scale: [0.6, 1.15, 1], y: [-2, -14, -20] }}
              transition={{ duration: 1.4, delay: 0.35 }}
              className="absolute -right-1 -top-1 text-mint-500"
              aria-hidden
            >
              <Sparkles className="size-4" />
            </motion.span>
          )}
        </motion.div>
        <div className="min-w-0 flex-1 text-sm">
          <p
            className={cn(
              "font-bold",
              correct ? "text-mint-600" : "text-coral-600",
            )}
          >
            {correct ? "Exact." : "Presque."}
          </p>
          <p
            className={cn(
              "mt-0.5",
              correct ? "text-mint-600" : "text-coral-600",
            )}
          >
            {explanation}
          </p>
          {!correct && correctAnswer && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mt-2 rounded-2xl bg-white/80 px-3 py-2"
            >
              <p className="text-[10px] font-bold uppercase tracking-wide text-mint-600">
                Un natif dirait
              </p>
              <p className="font-bold text-ink">“{correctAnswer}”</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
