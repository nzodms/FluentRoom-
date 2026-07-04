"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ListChecks, X } from "lucide-react";
import type { Room } from "@/types/learning";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";

export function StepQuickCheck({
  room,
  onNext,
}: {
  room: Room;
  onNext: (scorePercent: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const question = room.questions[index];
  const isLast = index === room.questions.length - 1;
  const isCorrect = selected === question.correctIndex;

  const validate = () => {
    if (selected === null) return;
    setAnswered(true);
    if (selected === question.correctIndex) {
      setCorrectCount((c) => c + 1);
    }
  };

  const next = () => {
    if (isLast) {
      const finalCorrect = correctCount;
      onNext(Math.round((finalCorrect / room.questions.length) * 100));
      return;
    }
    setIndex(index + 1);
    setSelected(null);
    setAnswered(false);
  };

  return (
    <div className="flex flex-1 flex-col">
      <Chip tone="primary" className="self-start">
        <ListChecks className="size-3" /> Étape 3 · Quick Check
      </Chip>
      <div className="mt-3 flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-ink">
          Vérifions ça
        </h2>
        <span className="text-sm font-semibold text-ink-faint">
          {index + 1} / {room.questions.length}
        </span>
      </div>
      <ProgressBar
        value={((index + (answered ? 1 : 0)) / room.questions.length) * 100}
        className="mt-3"
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="flex flex-1 flex-col"
        >
          <p className="mt-6 text-lg font-bold text-ink">{question.question}</p>

          <div className="mt-4 space-y-2.5">
            {question.options.map((option, i) => {
              const isThisCorrect = i === question.correctIndex;
              const isThisSelected = selected === i;
              return (
                <motion.button
                  key={option}
                  whileTap={!answered ? { scale: 0.98 } : undefined}
                  onClick={() => !answered && setSelected(i)}
                  disabled={answered}
                  className={cn(
                    "card-soft flex w-full items-center gap-3 px-4 py-3.5 text-left text-[15px] font-medium transition-all",
                    !answered && "cursor-pointer hover:ring-2 hover:ring-primary-200",
                    !answered && isThisSelected && "ring-2 ring-primary-500 bg-primary-50",
                    answered && isThisCorrect && "ring-2 ring-mint-500 bg-mint-50",
                    answered &&
                      isThisSelected &&
                      !isThisCorrect &&
                      "ring-2 ring-coral-500 bg-coral-50",
                    answered && !isThisSelected && !isThisCorrect && "opacity-50",
                  )}
                >
                  <span className="flex-1 text-ink">{option}</span>
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
                  "mt-4 rounded-2xl p-4 text-sm",
                  isCorrect
                    ? "bg-mint-50 text-mint-600"
                    : "bg-coral-50 text-coral-600",
                )}
              >
                <p className="font-bold">
                  {isCorrect ? "Bien joué ! 🎯" : "Pas tout à fait."}
                </p>
                <p className="mt-1">{question.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-auto pt-6">
            {!answered ? (
              <Button
                size="lg"
                fullWidth
                disabled={selected === null}
                onClick={validate}
              >
                Valider
              </Button>
            ) : (
              <Button size="lg" fullWidth onClick={next}>
                {isLast ? "Voir le décodage" : "Question suivante"}
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
