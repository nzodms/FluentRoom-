"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, RotateCcw, Volume2, X } from "lucide-react";
import type { Phrase } from "@/types/learning";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { speakText } from "@/lib/speech";
import { DAILY_STEP_XP } from "@/lib/progress";

interface ReviewSessionProps {
  phrases: Phrase[];
  onFinish: (result: { known: string[]; toReview: string[] }) => void;
  onClose: () => void;
}

/**
 * Session de révision : cartes rapides, "Je la connais / À revoir".
 * 5 phrases, une minute, XP à la clé.
 */
export function ReviewSession({ phrases, onFinish, onClose }: ReviewSessionProps) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [known, setKnown] = useState<string[]>([]);
  const [toReview, setToReview] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const phrase = phrases[index];
  const isLast = index === phrases.length - 1;

  const answer = (isKnown: boolean) => {
    const nextKnown = isKnown ? [...known, phrase.id] : known;
    const nextReview = isKnown ? toReview : [...toReview, phrase.id];
    if (isLast) {
      setKnown(nextKnown);
      setToReview(nextReview);
      setDone(true);
      onFinish({ known: nextKnown, toReview: nextReview });
      return;
    }
    setKnown(nextKnown);
    setToReview(nextReview);
    setIndex(index + 1);
    setRevealed(false);
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
        className="w-full max-w-md rounded-t-[2rem] bg-cream p-5 pb-8 shadow-lift md:rounded-[2rem] md:pb-5"
      >
        {!done ? (
          <>
            <div className="flex items-center justify-between">
              <p className="font-bold text-ink">Review session</p>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-ink-faint">
                  {index + 1} / {phrases.length}
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
            <ProgressBar
              value={(index / phrases.length) * 100}
              className="mt-3"
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={phrase.id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.22 }}
              >
                <button
                  onClick={() => {
                    speakText(phrase.english);
                    setRevealed(true);
                  }}
                  className="card-soft mt-5 flex min-h-40 w-full cursor-pointer flex-col items-center justify-center gap-2 p-6 text-center"
                >
                  <span className="grid size-9 place-items-center rounded-full bg-primary-50 text-primary-600">
                    <Volume2 className="size-4" />
                  </span>
                  <p className="text-xl font-bold text-ink">
                    {phrase.english}
                  </p>
                  <AnimatePresence>
                    {revealed ? (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <p className="text-[15px] text-ink-soft">
                          {phrase.french}
                        </p>
                        <p className="mt-1 text-xs italic text-ink-faint">
                          {phrase.example}
                        </p>
                      </motion.div>
                    ) : (
                      <p className="text-xs font-semibold text-ink-faint">
                        Touche pour révéler le sens
                      </p>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            </AnimatePresence>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => answer(false)}
              >
                <RotateCcw className="size-4" /> À revoir
              </Button>
              <Button variant="mint" size="lg" onClick={() => answer(true)}>
                <Check className="size-4" strokeWidth={3} /> Je la connais
              </Button>
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
              className="grid size-16 place-items-center rounded-3xl gradient-mint text-white shadow-[0_12px_32px_-8px_rgba(44,183,131,0.5)]"
            >
              <Check className="size-8" strokeWidth={3} />
            </motion.span>
            <h3 className="mt-4 text-xl font-bold text-ink">
              Session terminée
            </h3>
            <p className="mt-1 text-sm text-ink-soft">
              {known.length} / {phrases.length} phrases connues.{" "}
              {known.length === phrases.length
                ? "Impeccable — elles s'ancrent pour de bon."
                : "Les autres reviendront — c'est comme ça qu'on retient."}
            </p>
            <div className="mt-4 flex gap-2">
              <Chip tone="primary">
                +{6 + known.length * 2 + DAILY_STEP_XP.review} FP
              </Chip>
              <Chip tone="mint">Review du jour ✓</Chip>
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
