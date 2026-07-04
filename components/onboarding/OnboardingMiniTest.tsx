"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { OnboardingFeedbackCard } from "./OnboardingFeedbackCard";
import { cn } from "@/lib/utils";

/**
 * Mini-test interactif d'onboarding : une vraie question, un vrai
 * feedback — pas une auto-évaluation déclarative.
 */
export function OnboardingMiniTest({
  options,
  correctIndex,
  correctFeedback,
  wrongFeedback,
  media,
  continueLabel = "Continuer",
  onDone,
}: {
  options: string[];
  correctIndex: number;
  correctFeedback: string;
  wrongFeedback: string;
  /** Contenu au-dessus des choix (carte audio, phrase…). */
  media?: React.ReactNode;
  continueLabel?: string;
  onDone: (correct: boolean) => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;
  const correct = picked === correctIndex;

  return (
    <div>
      {media && <div className="mb-4">{media}</div>}
      <div className="space-y-2.5">
        {options.map((option, i) => {
          const isCorrect = i === correctIndex;
          const isPicked = picked === i;
          return (
            <motion.button
              key={option}
              type="button"
              initial={{ opacity: 0, y: 14 }}
              animate={
                answered && isPicked && !isCorrect
                  ? { opacity: 1, y: 0, x: [0, -7, 7, -4, 4, 0] }
                  : { opacity: 1, y: 0 }
              }
              transition={
                answered && isPicked && !isCorrect
                  ? { x: { duration: 0.4 } }
                  : { delay: 0.08 + i * 0.06, type: "spring", stiffness: 300, damping: 24 }
              }
              whileTap={!answered ? { scale: 0.97 } : undefined}
              disabled={answered}
              onClick={() => setPicked(i)}
              className={cn(
                "flex w-full items-center gap-3 rounded-3xl border-2 bg-white px-4 py-3.5 text-left text-[15px] font-semibold shadow-soft transition-all",
                !answered && "cursor-pointer border-ink/8 hover:border-primary-300",
                answered && isCorrect &&
                  "border-mint-500 bg-mint-50 shadow-[0_0_22px_-5px_rgba(44,183,131,0.5)]",
                answered && isPicked && !isCorrect && "border-coral-500 bg-coral-50",
                answered && !isPicked && !isCorrect && "border-ink/5 opacity-40",
              )}
            >
              <span className="flex-1 text-ink">{option}</span>
              {answered && isCorrect && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.25, 1] }}
                  transition={{ duration: 0.4 }}
                  className="grid size-6 shrink-0 place-items-center rounded-full bg-mint-500 text-white"
                >
                  <Check className="size-3.5" strokeWidth={3.5} />
                </motion.span>
              )}
              {answered && isPicked && !isCorrect && (
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-coral-500 text-white">
                  <X className="size-3.5" strokeWidth={3.5} />
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {answered && (
          <div className="mt-3 space-y-3">
            <OnboardingFeedbackCard
              message={correct ? correctFeedback : wrongFeedback}
              tone={correct ? "mint" : "coral"}
              expression={correct ? "celebrating" : "encouraging"}
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button size="lg" fullWidth onClick={() => onDone(correct)}>
                {continueLabel}
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
