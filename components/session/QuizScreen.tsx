"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LearningScreen } from "./LearningScreen";
import { cn } from "@/lib/utils";

export interface QuizScreenProps {
  label?: React.ReactNode;
  question: string;
  subtitle?: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  /** Contenu optionnel au-dessus des choix (audio, phrase…). */
  media?: React.ReactNode;
  submitLabel?: string;
  continueLabel: string;
  onContinue: (wasCorrect: boolean) => void;
}

/**
 * QCM plein écran : question, 2-4 choix, feedback immédiat, CTA visible.
 * Aucun scroll requis pour comprendre ou répondre.
 */
export function QuizScreen({
  label,
  question,
  subtitle,
  choices,
  correctIndex,
  explanation,
  media,
  submitLabel = "Valider",
  continueLabel,
  onContinue,
}: QuizScreenProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const isCorrect = selected === correctIndex;

  return (
    <LearningScreen
      label={label}
      title={question}
      subtitle={subtitle}
      action={
        !answered ? (
          <Button
            size="lg"
            fullWidth
            disabled={selected === null}
            onClick={() => setAnswered(true)}
          >
            {submitLabel}
          </Button>
        ) : (
          <Button size="lg" fullWidth onClick={() => onContinue(isCorrect)}>
            {continueLabel}
          </Button>
        )
      }
    >
      {media && <div className="mb-3">{media}</div>}
      <div className="space-y-2.5">
        {choices.map((choice, i) => {
          const isThisCorrect = i === correctIndex;
          const isThisSelected = selected === i;
          return (
            <motion.button
              key={choice}
              whileTap={!answered ? { scale: 0.98 } : undefined}
              onClick={() => !answered && setSelected(i)}
              disabled={answered}
              className={cn(
                "card-soft flex w-full items-center gap-3 px-4 py-3.5 text-left text-[15px] font-medium transition-all",
                !answered &&
                  "cursor-pointer hover:ring-2 hover:ring-primary-200",
                !answered &&
                  isThisSelected &&
                  "ring-2 ring-primary-500 bg-primary-50",
                answered && isThisCorrect && "ring-2 ring-mint-500 bg-mint-50",
                answered &&
                  isThisSelected &&
                  !isThisCorrect &&
                  "ring-2 ring-coral-500 bg-coral-50",
                answered && !isThisSelected && !isThisCorrect && "opacity-45",
              )}
            >
              <span className="flex-1 text-ink">{choice}</span>
              {answered && isThisCorrect && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="grid size-6 shrink-0 place-items-center rounded-full bg-mint-500 text-white"
                >
                  <Check className="size-3.5" strokeWidth={3.5} />
                </motion.span>
              )}
              {answered && isThisSelected && !isThisCorrect && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="grid size-6 shrink-0 place-items-center rounded-full bg-coral-500 text-white"
                >
                  <X className="size-3.5" strokeWidth={3.5} />
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "mt-3 rounded-2xl p-3.5 text-sm",
              isCorrect
                ? "bg-mint-50 text-mint-600"
                : "bg-coral-50 text-coral-600",
            )}
          >
            <p className="font-bold">
              {isCorrect ? "Bien vu ! 🎯" : "Pas tout à fait."}
            </p>
            <p className="mt-0.5">{explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </LearningScreen>
  );
}
