"use client";

import { useEffect, useRef, useState } from "react";
import type { Room } from "@/types/learning";
import { useProgress } from "@/lib/useProgress";
import { clamp } from "@/lib/utils";
import { SessionShell } from "@/components/session/SessionShell";
import { StepIntro } from "./StepIntro";
import { StepFirstListen } from "./StepFirstListen";
import { StepUnderstand } from "./StepUnderstand";
import { StepQuickCheck } from "./StepQuickCheck";
import { StepDecode } from "./StepDecode";
import { StepShadowing } from "./StepShadowing";
import { StepSpeakBack } from "./StepSpeakBack";
import { StepRecap } from "./StepRecap";
import { StepPhraseUnlock } from "./StepPhraseUnlock";
import { StepCompleted } from "./StepCompleted";

const STEP_LABELS = [
  "Mission",
  "Listen",
  "Catch",
  "Check",
  "Decode",
  "Repeat",
  "Speak",
  "Recap",
  "Unlock",
];
const TOTAL_INTERACTIVE_STEPS = STEP_LABELS.length;

export function RoomFlow({ room }: { room: Room }) {
  const { finishRoom, progress } = useProgress();
  const [step, setStep] = useState(0);
  const [comprehension, setComprehension] = useState(0);
  const [speaking, setSpeaking] = useState(0);
  const [outcome, setOutcome] = useState<{
    xpEarned: number;
    xpBefore: number;
    newBadges: string[];
    timeSpentSec: number;
    streak: number;
  } | null>(null);
  const startRef = useRef<number | null>(null);
  const transcriptOpenedRef = useRef(false);
  const answeredSpeakBackRef = useRef(false);

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
    if (answered) {
      answeredSpeakBackRef.current = true;
      setSpeaking((s) => clamp(s + 5, 0, 100));
    }
    next();
  };

  // Le recap réussi consolide légèrement la compréhension.
  const handleRecap = (correct: boolean) => {
    if (correct) setComprehension((c) => clamp(c + 5, 0, 100));
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
      noSubtitles: !transcriptOpenedRef.current,
      answeredSpeakBack: answeredSpeakBackRef.current,
    });
    setOutcome({
      xpEarned: result.xpEarned,
      xpBefore: result.xpBefore,
      newBadges: result.newBadges,
      timeSpentSec,
      streak: result.progress.streak,
    });
    next();
  };

  return (
    <SessionShell
      title={`${room.emoji} ${room.title}`}
      closeHref="/app/today"
      stepLabels={STEP_LABELS}
      currentStep={step}
      stepKey={step}
    >
      {step === 0 && <StepIntro room={room} onNext={next} />}
      {step === 1 && (
        <StepFirstListen
          room={room}
          onNext={next}
          onTranscriptShown={() => {
            transcriptOpenedRef.current = true;
          }}
        />
      )}
      {step === 2 && <StepUnderstand room={room} onNext={next} />}
      {step === 3 && <StepQuickCheck room={room} onNext={handleQuickCheck} />}
      {step === 4 && <StepDecode room={room} onNext={next} />}
      {step === 5 && <StepShadowing room={room} onNext={handleShadowing} />}
      {step === 6 && <StepSpeakBack room={room} onNext={handleSpeakBack} />}
      {step === 7 && <StepRecap room={room} onNext={handleRecap} />}
      {step === 8 && <StepPhraseUnlock room={room} onNext={handleUnlockDone} />}
      {step >= TOTAL_INTERACTIVE_STEPS && outcome && (
        <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar">
          <StepCompleted
            room={room}
            comprehension={comprehension}
            speaking={speaking}
            timeSpentSec={outcome.timeSpentSec}
            xpEarned={outcome.xpEarned}
            xpBefore={outcome.xpBefore}
            streak={outcome.streak ?? progress.streak}
            newBadges={outcome.newBadges}
          />
        </div>
      )}
    </SessionShell>
  );
}
