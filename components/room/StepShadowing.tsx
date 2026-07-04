"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Repeat2, Volume2 } from "lucide-react";
import type { Room } from "@/types/learning";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { speakText } from "@/lib/speech";
import { useRecognition } from "@/lib/useRecognition";
import { matchScore, scoreFeedback } from "@/lib/scoring";
import { MicRecorder } from "./MicRecorder";
import { cn } from "@/lib/utils";

const MANUAL_PRACTICE_SCORE = 70;

export function StepShadowing({
  room,
  onNext,
}: {
  room: Room;
  onNext: (averageScore: number) => void;
}) {
  const lines = room.shadowingLineIds
    .map((id) => room.dialogue.find((l) => l.id === id))
    .filter((l): l is NonNullable<typeof l> => Boolean(l));

  const [index, setIndex] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const line = lines[index];
  const isLast = index === lines.length - 1;

  // Quand l'écoute micro se termine, on score la tentative.
  const recognition = useRecognition({
    onFinish: (transcript) => setLastScore(matchScore(line.text, transcript)),
  });

  const acceptAndContinue = (score: number) => {
    const nextScores = [...scores, score];
    if (isLast) {
      const avg = Math.round(
        nextScores.reduce((a, b) => a + b, 0) / nextScores.length,
      );
      onNext(avg);
      return;
    }
    setScores(nextScores);
    setIndex(index + 1);
    setLastScore(null);
    recognition.setTranscript("");
  };

  const retry = () => {
    setLastScore(null);
    recognition.setTranscript("");
  };

  return (
    <div className="flex flex-1 flex-col">
      <Chip tone="primary" className="self-start">
        <Repeat2 className="size-3" /> Étape 5 · Shadowing
      </Chip>
      <div className="mt-3 flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-ink">
          Répète avec le rythme
        </h2>
        <span className="text-sm font-semibold text-ink-faint">
          {index + 1} / {lines.length}
        </span>
      </div>
      <p className="mt-1.5 text-ink-soft">
        <span className="font-semibold text-ink">
          Copy the rhythm, not just the words.
        </span>{" "}
        Écoute, puis répète à voix haute.
      </p>
      <ProgressBar value={(index / lines.length) * 100} className="mt-3" />

      <AnimatePresence mode="wait">
        <motion.div
          key={line.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="flex flex-1 flex-col"
        >
          <div className="card-soft mt-6 p-6 text-center">
            <p className="text-xs font-bold uppercase tracking-wide text-primary-600">
              {line.speaker}
            </p>
            <p className="mt-2 text-xl font-bold text-ink">
              &ldquo;{line.text}&rdquo;
            </p>
            <p className="mt-1.5 text-sm text-ink-faint">{line.translation}</p>
            <button
              onClick={() => speakText(line.text, { rate: 0.9 })}
              className="mx-auto mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-600 transition-colors hover:bg-primary-100"
            >
              <Volume2 className="size-4" /> Réécouter
            </button>
          </div>

          <div className="mt-6 flex flex-col items-center">
            {recognition.supported ? (
              <>
                <MicRecorder
                  listening={recognition.listening}
                  supported={recognition.supported}
                  onStart={recognition.start}
                  onStop={recognition.stop}
                />
                <p className="mt-3 text-sm font-medium text-ink-faint">
                  {recognition.listening
                    ? "Je t'écoute… parle normalement"
                    : "Appuie et répète la phrase"}
                </p>
                {recognition.transcript && (
                  <p className="mt-2 rounded-xl bg-ink/5 px-3 py-1.5 text-sm italic text-ink-soft">
                    “{recognition.transcript}”
                  </p>
                )}
              </>
            ) : (
              <div className="rounded-2xl bg-primary-50 p-4 text-center text-sm text-primary-700">
                🎙️ La reconnaissance vocale n&apos;est pas disponible sur ce
                navigateur. Répète la phrase à voix haute, puis marque-la comme
                pratiquée.
              </div>
            )}
          </div>

          <AnimatePresence>
            {lastScore !== null && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "mt-5 rounded-2xl p-4 text-center",
                  lastScore >= 65 ? "bg-mint-50" : "bg-gold-50",
                )}
              >
                <p className="text-2xl font-bold text-ink">{lastScore}%</p>
                <p
                  className={cn(
                    "mt-0.5 text-sm font-semibold",
                    lastScore >= 65 ? "text-mint-600" : "text-gold-500",
                  )}
                >
                  {scoreFeedback(lastScore)}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-auto space-y-2.5 pt-6">
            {lastScore !== null ? (
              <>
                <Button
                  size="lg"
                  fullWidth
                  onClick={() => acceptAndContinue(lastScore)}
                >
                  {isLast ? "Terminer le shadowing" : "Phrase suivante"}
                  <Check className="size-4" strokeWidth={3} />
                </Button>
                <Button variant="ghost" fullWidth onClick={retry}>
                  Réessayer
                </Button>
              </>
            ) : (
              <Button
                variant={recognition.supported ? "secondary" : "primary"}
                size="lg"
                fullWidth
                onClick={() => acceptAndContinue(MANUAL_PRACTICE_SCORE)}
              >
                Mark as practiced
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
