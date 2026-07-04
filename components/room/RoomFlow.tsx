"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { Room } from "@/types/learning";
import { useProgress } from "@/lib/useProgress";
import { clamp } from "@/lib/utils";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StepFirstListen } from "./StepFirstListen";
import { StepUnderstand } from "./StepUnderstand";
import { StepQuickCheck } from "./StepQuickCheck";
import { StepDecode } from "./StepDecode";
import { StepShadowing } from "./StepShadowing";
import { StepSpeakBack } from "./StepSpeakBack";
import { StepPhraseUnlock } from "./StepPhraseUnlock";
import { StepCompleted } from "./StepCompleted";

const TOTAL_INTERACTIVE_STEPS = 7;

export function RoomFlow({ room }: { room: Room }) {
  const { finishRoom, progress } = useProgress();
  const [step, setStep] = useState(0);
  const [comprehension, setComprehension] = useState(0);
  const [speaking, setSpeaking] = useState(0);
  const [outcome, setOutcome] = useState<{
    xpEarned: number;
    newBadges: string[];
    timeSpentSec: number;
    streak: number;
  } | null>(null);
  const startRef = useRef<number | null>(null);

  // Chronomètre démarré au montage (hors rendu pour rester pur).
  useEffect(() => {
    if (startRef.current === null) startRef.current = Date.now();
  }, []);

  const next = () => setStep((s) => s + 1);

  const handleQuickCheck = (score: number) => {
    setComprehension(score);
    next();
  };

  const handleShadowing = (score: number) => {
    setSpeaking(score);
    next();
  };

  const handleSpeakBack = (answered: boolean) => {
    if (answered) setSpeaking((s) => clamp(s + 5, 0, 100));
    next();
  };

  const handleUnlockDone = () => {
    const startedAt = startRef.current ?? Date.now();
    const timeSpentSec = Math.round((Date.now() - startedAt) / 1000);
    const result = finishRoom({
      roomId: room.id,
      comprehension,
      speaking,
      timeSpentSec,
    });
    setOutcome({
      xpEarned: result.xpEarned,
      newBadges: result.newBadges,
      timeSpentSec,
      streak: result.progress.streak,
    });
    next();
  };

  const isCompleted = step >= TOTAL_INTERACTIVE_STEPS;

  return (
    <div className="gradient-hero flex min-h-dvh flex-col">
      {/* Header room */}
      <header className="sticky top-0 z-40 glass border-b border-ink/5">
        <div className="mx-auto flex h-14 max-w-lg items-center gap-3 px-4">
          <Link
            href="/app/today"
            aria-label="Quitter la room"
            className="grid size-9 shrink-0 place-items-center rounded-full text-ink-soft transition-colors hover:bg-ink/5"
          >
            <X className="size-5" strokeWidth={2.2} />
          </Link>
          <div className="min-w-0 flex-1">
            {!isCompleted && (
              <ProgressBar
                value={((step + 1) / (TOTAL_INTERACTIVE_STEPS + 1)) * 100}
              />
            )}
          </div>
          <span className="shrink-0 text-sm font-semibold text-ink-faint">
            {room.emoji} {room.title}
          </span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 pb-10 pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.21, 0.6, 0.35, 1] }}
            className="flex flex-1 flex-col"
          >
            {step === 0 && <StepFirstListen room={room} onNext={next} />}
            {step === 1 && <StepUnderstand room={room} onNext={next} />}
            {step === 2 && (
              <StepQuickCheck room={room} onNext={handleQuickCheck} />
            )}
            {step === 3 && <StepDecode room={room} onNext={next} />}
            {step === 4 && (
              <StepShadowing room={room} onNext={handleShadowing} />
            )}
            {step === 5 && (
              <StepSpeakBack room={room} onNext={handleSpeakBack} />
            )}
            {step === 6 && (
              <StepPhraseUnlock room={room} onNext={handleUnlockDone} />
            )}
            {isCompleted && outcome && (
              <StepCompleted
                room={room}
                comprehension={comprehension}
                speaking={speaking}
                timeSpentSec={outcome.timeSpentSec}
                xpEarned={outcome.xpEarned}
                streak={outcome.streak ?? progress.streak}
                newBadges={outcome.newBadges}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
