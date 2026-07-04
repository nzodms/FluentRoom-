"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Check, RotateCcw, Volume2, X, Zap } from "lucide-react";
import type { Phrase } from "@/types/learning";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { AnimatedCheck } from "@/components/reward/AnimatedCheck";
import { speakText } from "@/lib/speech";
import { DAILY_STEP_XP } from "@/lib/progress";

interface ReviewSessionProps {
  phrases: Phrase[];
  onFinish: (result: { known: string[]; toReview: string[] }) => void;
  onClose: () => void;
}

const SWIPE_THRESHOLD = 90;

/**
 * Révision express : cartes à swiper — droite « Je l'ai »,
 * gauche « Encore fragile ». 5 phrases, 1 minute, XP à la clé.
 */
export function ReviewSession({ phrases, onFinish, onClose }: ReviewSessionProps) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [known, setKnown] = useState<string[]>([]);
  const [toReview, setToReview] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [exitDirection, setExitDirection] = useState(0);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-160, 160], [-8, 8]);
  const knowOpacity = useTransform(x, [30, SWIPE_THRESHOLD], [0, 1]);
  const againOpacity = useTransform(x, [-SWIPE_THRESHOLD, -30], [1, 0]);

  const phrase = phrases[index];
  const isLast = index === phrases.length - 1;

  const answer = (isKnown: boolean) => {
    setExitDirection(isKnown ? 1 : -1);
    const nextKnown = isKnown ? [...known, phrase.id] : known;
    const nextReview = isKnown ? toReview : [...toReview, phrase.id];
    setKnown(nextKnown);
    setToReview(nextReview);
    if (isLast) {
      setDone(true);
      onFinish({ known: nextKnown, toReview: nextReview });
      return;
    }
    setIndex(index + 1);
    setRevealed(false);
    x.set(0);
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
              <p className="font-bold text-ink">⚡️ Révision express</p>
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
            <p className="mt-2 text-center text-xs font-medium text-ink-faint">
              Swipe → « Je l&apos;ai » · Swipe ← « Encore fragile »
            </p>

            <div className="relative mt-4" style={{ minHeight: 190 }}>
              <AnimatePresence mode="popLayout" custom={exitDirection}>
                <motion.div
                  key={phrase.id}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.8}
                  style={{ x, rotate }}
                  onDragEnd={(_, info) => {
                    if (info.offset.x > SWIPE_THRESHOLD) answer(true);
                    else if (info.offset.x < -SWIPE_THRESHOLD) answer(false);
                  }}
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    x: exitDirection * 260,
                    rotate: exitDirection * 10,
                    transition: { duration: 0.25 },
                  }}
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                  className="relative cursor-grab active:cursor-grabbing"
                >
                  {/* Indicateurs de swipe */}
                  <motion.span
                    style={{ opacity: knowOpacity }}
                    className="pointer-events-none absolute left-3 top-3 z-10 rounded-full gradient-mint px-3 py-1 text-xs font-bold text-white"
                  >
                    Je l&apos;ai ✓
                  </motion.span>
                  <motion.span
                    style={{ opacity: againOpacity }}
                    className="pointer-events-none absolute right-3 top-3 z-10 rounded-full bg-coral-500 px-3 py-1 text-xs font-bold text-white"
                  >
                    Encore fragile
                  </motion.span>

                  <button
                    onClick={() => {
                      speakText(phrase.english);
                      setRevealed(true);
                    }}
                    className="card-tint-primary flex min-h-[190px] w-full cursor-pointer flex-col items-center justify-center gap-2 p-6 text-center"
                  >
                    <span className="grid size-9 place-items-center rounded-full gradient-primary text-white shadow-glow">
                      <Volume2 className="size-4" />
                    </span>
                    <p className="text-xl font-bold text-ink">
                      {phrase.english}
                    </p>
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
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => answer(false)}
              >
                <RotateCcw className="size-4" /> Encore fragile
              </Button>
              <Button variant="mint" size="lg" onClick={() => answer(true)}>
                <Check className="size-4" strokeWidth={3} /> Je l&apos;ai
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
              className="grid size-16 place-items-center rounded-3xl gradient-mint text-white glow-mint"
            >
              <AnimatedCheck size={34} delay={0.25} />
            </motion.span>
            <h3 className="mt-4 text-xl font-bold text-ink">
              Révision terminée
            </h3>
            <p className="mt-1 text-sm text-ink-soft">
              {known.length} / {phrases.length} phrases solides.{" "}
              {known.length === phrases.length
                ? "Impeccable — elles s'ancrent pour de bon."
                : "Les fragiles reviendront — c'est comme ça qu'on retient."}
            </p>
            <div className="mt-4 flex gap-2">
              <Chip tone="primary">
                <Zap className="size-3" /> +
                {6 + known.length * 2 + DAILY_STEP_XP.review} FP
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
