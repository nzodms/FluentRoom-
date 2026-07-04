"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Ear, Volume2, X } from "lucide-react";
import type { Drill } from "@/data/drills";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { WordOrder } from "@/components/exercises/WordOrder";
import { speakText } from "@/lib/speech";
import { cn } from "@/lib/utils";

interface DrillSessionProps {
  drills: Drill[];
  onFinish: (scorePercent: number) => void;
  onClose: () => void;
}

/** Session d'entraînement de l'oreille : 5 mini-exercices variés. */
export function DrillSession({ drills, onFinish, onClose }: DrillSessionProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [orderSolved, setOrderSolved] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);

  const drill = drills[index];
  const isLast = index === drills.length - 1;
  const isOrder = drill.type === "order";
  const isCorrect = selected === drill.correctIndex;

  const finishSession = (finalCorrect: number) => {
    setDone(true);
    onFinish(Math.round((finalCorrect / drills.length) * 100));
  };

  const next = (wasCorrect: boolean) => {
    const total = correctCount + (wasCorrect ? 1 : 0);
    if (isLast) {
      setCorrectCount(total);
      finishSession(total);
      return;
    }
    setCorrectCount(total);
    setIndex(index + 1);
    setSelected(null);
    setAnswered(false);
    setOrderSolved(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/40 backdrop-blur-sm md:items-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-t-[2rem] bg-cream p-5 pb-8 shadow-lift md:rounded-[2rem] md:pb-5"
      >
        {!done ? (
          <>
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 font-bold text-ink">
                <Ear className="size-4 text-primary-500" /> Ear training
              </p>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-ink-faint">
                  {index + 1} / {drills.length}
                </span>
                <button
                  onClick={onClose}
                  aria-label="Fermer"
                  className="grid size-8 cursor-pointer place-items-center rounded-full text-ink-soft hover:bg-ink/5"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>
            <ProgressBar value={(index / drills.length) * 100} className="mt-3" />

            <AnimatePresence mode="wait">
              <motion.div
                key={drill.id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.22 }}
              >
                {/* Audio */}
                <button
                  onClick={() =>
                    speakText(drill.audio, {
                      rate: drill.type === "contraction" ? 1.05 : 0.95,
                    })
                  }
                  className="card-soft mt-5 flex w-full cursor-pointer items-center justify-center gap-3 p-4"
                >
                  <span className="grid size-10 place-items-center rounded-full gradient-primary text-white shadow-glow">
                    <Volume2 className="size-4" />
                  </span>
                  <span className="text-sm font-semibold text-ink-soft">
                    Écouter {drill.type === "contraction" ? "(vitesse réelle)" : ""}
                  </span>
                </button>

                <p className="mt-4 font-bold text-ink">{drill.prompt}</p>

                {isOrder ? (
                  <div className="mt-3">
                    <WordOrder
                      words={drill.words ?? []}
                      answer={drill.answer ?? ""}
                      onResult={(ok) => ok && setOrderSolved(true)}
                    />
                    {orderSolved && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-3 rounded-2xl bg-mint-50 p-3 text-sm text-mint-600"
                      >
                        ✓ {drill.explanation}
                      </motion.p>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="mt-3 space-y-2.5">
                      {(drill.options ?? []).map((option, i) => {
                        const isThisCorrect = i === drill.correctIndex;
                        const isThisSelected = selected === i;
                        return (
                          <motion.button
                            key={option}
                            whileTap={!answered ? { scale: 0.98 } : undefined}
                            disabled={answered}
                            onClick={() => !answered && setSelected(i)}
                            className={cn(
                              "card-soft flex w-full items-center gap-3 px-4 py-3 text-left text-[15px] font-medium transition-all",
                              !answered &&
                                "cursor-pointer hover:ring-2 hover:ring-primary-200",
                              !answered &&
                                isThisSelected &&
                                "ring-2 ring-primary-500 bg-primary-50",
                              answered &&
                                isThisCorrect &&
                                "ring-2 ring-mint-500 bg-mint-50",
                              answered &&
                                isThisSelected &&
                                !isThisCorrect &&
                                "ring-2 ring-coral-500 bg-coral-50",
                              answered &&
                                !isThisSelected &&
                                !isThisCorrect &&
                                "opacity-50",
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
                          </motion.button>
                        );
                      })}
                    </div>
                    <AnimatePresence>
                      {answered && (
                        <motion.p
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={cn(
                            "mt-3 rounded-2xl p-3 text-sm",
                            isCorrect
                              ? "bg-mint-50 text-mint-600"
                              : "bg-coral-50 text-coral-600",
                          )}
                        >
                          {isCorrect ? "🎯 " : ""}
                          {drill.explanation}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-5">
              {isOrder ? (
                <Button
                  size="lg"
                  fullWidth
                  disabled={!orderSolved}
                  onClick={() => next(true)}
                >
                  {isLast ? "Terminer" : "Suivant"}
                </Button>
              ) : !answered ? (
                <Button
                  size="lg"
                  fullWidth
                  disabled={selected === null}
                  onClick={() => setAnswered(true)}
                >
                  Valider
                </Button>
              ) : (
                <Button size="lg" fullWidth onClick={() => next(isCorrect)}>
                  {isLast ? "Terminer" : "Suivant"}
                </Button>
              )}
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center py-4 text-center"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 15 }}
              className="grid size-16 place-items-center rounded-3xl gradient-primary text-white shadow-glow"
            >
              <Ear className="size-8" />
            </motion.span>
            <h3 className="mt-4 text-xl font-bold text-ink">
              {correctCount} / {drills.length}
            </h3>
            <p className="mt-1 text-sm text-ink-soft">
              {correctCount === drills.length
                ? "Oreille parfaite aujourd'hui. Ça s'entend que tu bosses."
                : correctCount >= drills.length - 1
                  ? "Très solide. Ton oreille attrape presque tout."
                  : "Chaque écoute compte. Reviens demain, ça monte vite."}
            </p>
            <div className="mt-4 flex gap-2">
              <Chip tone="primary">
                +{10 + Math.round(((correctCount / drills.length) * 100) / 20)}{" "}
                FP
              </Chip>
              <Chip tone="mint">Listening score mis à jour</Chip>
            </div>
            <Button size="lg" fullWidth className="mt-6" onClick={onClose}>
              Continuer
            </Button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
