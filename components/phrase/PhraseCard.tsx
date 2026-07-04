"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Mic, Volume2 } from "lucide-react";
import type { Phrase, PhraseState, PhraseStatus } from "@/types/learning";
import { getRoomById } from "@/data/rooms";
import { lessons } from "@/data/lessons";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { speakText } from "@/lib/speech";
import { useRecognition } from "@/lib/useRecognition";
import { matchScore, scoreFeedback } from "@/lib/scoring";
import { cn } from "@/lib/utils";

/** Rareté d'une phrase dans la collection. */
const statusConfig: Record<
  PhraseStatus,
  { label: string; tone: "coral" | "primary" | "gold" | "mint" }
> = {
  new: { label: "New", tone: "coral" },
  seen: { label: "Useful", tone: "primary" },
  review: { label: "Natural", tone: "gold" },
  mastered: { label: "Mastered", tone: "mint" },
};

interface PhraseCardProps {
  phrase: Phrase;
  status: PhraseStatus;
  state?: PhraseState;
  onPracticed: (score: number, transcript: string, manual: boolean) => void;
}

/** Provenance : room ou leçon. */
function phraseSource(phrase: Phrase): string {
  const room = getRoomById(phrase.roomId);
  if (room) return `Room · ${room.title}`;
  const lesson = lessons.find((l) => l.phrase.id === phrase.id);
  if (lesson) return `Leçon · ${lesson.structure}`;
  return "Leçon";
}

export function PhraseCard({
  phrase,
  status,
  state,
  onPracticed,
}: PhraseCardProps) {
  const [open, setOpen] = useState(false);
  const [practicing, setPracticing] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const config = statusConfig[status];

  // Score la tentative quand le micro s'arrête.
  const recognition = useRecognition({
    onFinish: (transcript) => {
      const score = matchScore(phrase.english, transcript);
      setResult(score);
      onPracticed(score, transcript, false);
    },
  });

  const markPracticed = () => {
    setResult(70);
    onPracticed(70, "", true);
  };

  return (
    <div className="card-soft overflow-hidden p-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center gap-3 p-4 text-left"
      >
        <span
          onClick={(e) => {
            e.stopPropagation();
            speakText(phrase.english);
          }}
          role="button"
          aria-label={`Écouter : ${phrase.english}`}
          className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary-50 text-primary-600 transition-colors hover:bg-primary-100"
        >
          <Volume2 className="size-4" strokeWidth={2.2} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-ink">{phrase.english}</p>
          <p className="truncate text-sm text-ink-soft">{phrase.french}</p>
        </div>
        <motion.span
          key={status}
          initial={status === "mastered" ? { scale: 0.4, rotate: -8 } : false}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 16 }}
          className="shrink-0"
        >
          <Chip tone={config.tone}>
            {status === "mastered" ? "⭐ Mastered" : config.label}
          </Chip>
        </motion.span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-ink-faint transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-ink/5 bg-cream/50 p-4">
              <p className="text-sm text-ink-soft">
                <span className="font-bold text-ink">Exemple :</span>{" "}
                <em>{phrase.example}</em>
              </p>
              <p className="mt-2 text-sm text-ink-soft">
                <span className="font-bold text-ink">Contexte :</span>{" "}
                {phrase.context}
              </p>
              <p className="mt-2 text-xs text-ink-faint">
                {phraseSource(phrase)} ·{" "}
                {state
                  ? `${state.reviews} révision${state.reviews > 1 ? "s" : ""} · prochaine : ${
                      status === "mastered"
                        ? "quand tu veux"
                        : state.lastReviewedAt?.slice(0, 10) ===
                            new Date().toISOString().slice(0, 10)
                          ? "demain"
                          : "aujourd'hui"
                    }`
                  : "0 révision"}
              </p>

              {!practicing ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    setPracticing(true);
                    setResult(null);
                    recognition.setTranscript("");
                  }}
                >
                  <Mic className="size-3.5" /> Practice
                </Button>
              ) : (
                <div className="mt-4">
                  {result === null ? (
                    recognition.supported ? (
                      <div className="flex items-center gap-3">
                        <Button
                          size="sm"
                          variant={recognition.listening ? "coral" : "primary"}
                          onClick={
                            recognition.listening
                              ? recognition.stop
                              : recognition.start
                          }
                        >
                          <Mic className="size-3.5" />
                          {recognition.listening ? "J'écoute… (stop)" : "Dis la phrase"}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={markPracticed}>
                          Mark as practiced
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-ink-soft">
                          🎙️ Micro non supporté ici — dis la phrase à voix
                          haute, puis :
                        </p>
                        <Button size="sm" className="mt-2" onClick={markPracticed}>
                          Mark as practiced
                        </Button>
                      </div>
                    )
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "rounded-2xl p-3 text-sm font-semibold",
                        result >= 65
                          ? "bg-mint-50 text-mint-600"
                          : "bg-gold-50 text-gold-500",
                      )}
                    >
                      {result}% — {scoreFeedback(result)}
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
