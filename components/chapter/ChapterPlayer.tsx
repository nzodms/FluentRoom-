"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { Lightbulb, Volume2, X } from "lucide-react";
import type { Chapter, Exercise } from "@/lib/lessons/types";
import {
  createSession,
  currentExercise,
  isSessionDone,
  submitAnswer,
  totalSteps,
  type SessionState,
} from "@/lib/lessons/engine";
import { hintAt, hintsLeftToday, maxHintLevel } from "@/lib/lessons/hints";
import { companionLine, recordQuizAnswer, resetQuizSession } from "@/lib/companion";
import { useProgress } from "@/lib/useProgress";
import { speakText } from "@/lib/speech";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { CompanionCharacter } from "@/components/companion/CompanionCharacter";
import {
  BuildExerciseScreen,
  ChatExerciseScreen,
  ChoiceExerciseScreen,
  GapExerciseScreen,
} from "./exercise-screens";
import { ChapterSummary } from "./ChapterSummary";
import { LessonBottomCoach } from "./LessonBottomCoach";
import { cn } from "@/lib/utils";

type Stage = "intro" | "phrases" | "exercises" | "summary";

/**
 * Le lecteur de chapitre : mise en situation, phrases essentielles,
 * exercices variés avec rappel intelligent, indices progressifs
 * limités, compagnon au bon moment, résumé final gratifiant.
 */
export function ChapterPlayer({ chapter }: { chapter: Chapter }) {
  const { progress, spendHint } = useProgress();
  const [stage, setStage] = useState<Stage>("intro");
  const [session, setSession] = useState<SessionState>(() =>
    createSession({
      ...chapter,
      exercises: [...chapter.exercises, chapter.finale],
    }),
  );
  const [hintLevel, setHintLevel] = useState(0);
  const startedAt = useRef(0);

  useEffect(() => {
    resetQuizSession();
  }, [chapter.id]);

  const queued = currentExercise(session);
  const total = totalSteps(session);
  const hintsLeft = hintsLeftToday(progress);

  // Chronomètre de réponse (anti-hasard) : démarre à chaque exercice.
  useEffect(() => {
    startedAt.current = Date.now();
  }, [session.index, stage]);

  const feedbackLine = (correct: boolean) =>
    companionLine(recordQuizAnswer(correct), progress);

  const handleDone = (correct: boolean) => {
    const next = submitAnswer(session, {
      correct,
      hintsUsed: hintLevel,
      elapsedMs: Date.now() - startedAt.current,
    });
    setSession(next);
    setHintLevel(0);
    if (isSessionDone(next)) setStage("summary");
  };

  const revealNextHint = () => {
    if (!queued) return;
    if (hintLevel >= maxHintLevel(queued.exercise.hints)) return;
    if (hintsLeft <= 0) return;
    spendHint();
    setHintLevel((l) => l + 1);
  };

  const remainingSteps = total - session.index;

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-dvh">
        <AmbientBackground />

        {/* Header de session : progression + indice */}
        <header className="sticky top-0 z-40 glass border-b border-ink/5">
          <div className="mx-auto flex h-13 max-w-lg items-center gap-3 px-4 py-2">
            <Link
              href="/app/today"
              aria-label="Quitter le chapitre"
              className="grid size-9 shrink-0 place-items-center rounded-full text-ink-soft transition-colors hover:bg-ink/5"
            >
              <X className="size-5" strokeWidth={2.2} />
            </Link>
            <div className="min-w-0 flex-1">
              <div className="h-1.5 overflow-hidden rounded-full bg-ink/8">
                <motion.div
                  className="h-full rounded-full gradient-primary"
                  animate={{
                    width:
                      stage === "intro"
                        ? "4%"
                        : stage === "phrases"
                          ? "10%"
                          : stage === "summary"
                            ? "100%"
                            : `${10 + (session.index / Math.max(total, 1)) * 88}%`,
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 28 }}
                />
              </div>
              <p className="mt-1 truncate text-[10px] font-bold uppercase tracking-widest text-ink-faint">
                {chapter.title}
                {stage === "exercises" && ` · étape ${Math.min(session.index + 1, total)}/${total}`}
              </p>
            </div>
            {/* Indice : progressif, limité, jamais la réponse */}
            {stage === "exercises" && queued && (
              <button
                onClick={revealNextHint}
                disabled={hintsLeft <= 0}
                aria-label="Demander un indice"
                data-testid="hint-button"
                className={cn(
                  "relative grid size-9 shrink-0 cursor-pointer place-items-center rounded-full transition-colors",
                  hintsLeft > 0
                    ? "bg-gold-50 text-gold-500 hover:bg-gold-400/20"
                    : "bg-ink/5 text-ink-faint",
                )}
              >
                <Lightbulb className="size-4.5" strokeWidth={2.2} />
                <motion.span
                  key={hintsLeft}
                  initial={{ scale: 1.6 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 16 }}
                  className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-white text-[9px] font-bold text-ink shadow-soft"
                >
                  {hintsLeft}
                </motion.span>
              </button>
            )}
          </div>
        </header>

        <main className="relative mx-auto flex min-h-[calc(100dvh-3.4rem)] w-full max-w-lg flex-col px-4 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-5">
          {/* Lumière douce derrière la carte principale */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-24 -z-10 size-72 -translate-x-1/2 rounded-full bg-primary-400/8 blur-3xl"
          />
          <AnimatePresence mode="wait">
            {/* A · Mise en situation */}
            {stage === "intro" && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="flex min-h-[70vh] flex-col"
              >
                <div className="flex flex-1 flex-col items-center justify-center text-center">
                  <CompanionCharacter
                    companionId={progress.companion}
                    size={104}
                    expression="focused"
                  />
                  <Chip tone="primary" className="mt-3">
                    {chapter.theme} · {chapter.duration} min
                  </Chip>
                  <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink">
                    {chapter.title}
                  </h1>
                  <p className="mt-1.5 text-sm font-semibold text-primary-600">
                    {chapter.objective}
                  </p>
                  <div className="card-soft mt-5 max-w-sm p-4 text-left">
                    <p className="text-sm leading-relaxed text-ink-soft">
                      {chapter.situation}
                    </p>
                  </div>
                </div>
                <Button size="lg" fullWidth onClick={() => setStage("phrases")}>
                  Voir les phrases essentielles
                </Button>
              </motion.div>
            )}

            {/* B · Phrases essentielles + mini-dialogue */}
            {stage === "phrases" && (
              <motion.div
                key="phrases"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
              >
                <Chip tone="primary">Tes {chapter.keyPhrases.length} phrases clés</Chip>
                <h2 className="mt-2 text-xl font-bold tracking-tight text-ink">
                  Pas de théorie — des blocs prêts à l&apos;emploi
                </h2>
                <div className="mt-4 space-y-2.5">
                  {chapter.keyPhrases.map((phrase, i) => (
                    <motion.div
                      key={phrase.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.06 + i * 0.06 }}
                      className="card-soft p-3.5"
                    >
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => speakText(phrase.english)}
                          aria-label={`Écouter : ${phrase.english}`}
                          className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full bg-primary-50 text-primary-600"
                        >
                          <Volume2 className="size-3.5" />
                        </button>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-ink">{phrase.english}</p>
                          <p className="text-xs text-ink-soft">
                            {phrase.french} · {phrase.context}
                          </p>
                        </div>
                      </div>
                      {phrase.variant && (
                        <p className="mt-2 rounded-xl bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700">
                          Variante : « {phrase.variant.english} » — {phrase.variant.note}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Mini-dialogue de référence */}
                <div className="mt-4 rounded-3xl bg-cream/70 p-3">
                  <p className="px-1 pb-2 text-[10px] font-bold uppercase tracking-widest text-ink-faint">
                    En situation
                  </p>
                  <div className="space-y-1.5">
                    {chapter.dialogue.map((turn, i) => (
                      <div
                        key={i}
                        className={cn("flex", turn.speaker === "Toi" ? "justify-end" : "justify-start")}
                      >
                        <span
                          className={cn(
                            "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm font-semibold",
                            turn.speaker === "Toi"
                              ? "rounded-br-md gradient-primary text-white"
                              : "rounded-bl-md bg-white text-ink shadow-soft",
                          )}
                        >
                          {turn.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button size="lg" fullWidth className="mt-5" onClick={() => setStage("exercises")}>
                  À toi de jouer
                </Button>
              </motion.div>
            )}

            {/* C→H · Exercices variés + rappels */}
            {stage === "exercises" && queued && (
              <motion.div
                key={`ex-${session.index}`}
                initial={{ opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -22 }}
                transition={{ duration: 0.25 }}
                className="flex flex-1 flex-col"
              >
                {/* Indices révélés */}
                <AnimatePresence>
                  {hintLevel > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-3 space-y-1.5"
                      data-testid="hint-panel"
                    >
                      {Array.from({ length: hintLevel }, (_, level) => (
                        <p
                          key={level}
                          className="rounded-2xl bg-gold-50 px-3.5 py-2 text-sm font-semibold text-gold-500"
                        >
                          Indice {level + 1} · {hintAt(queued.exercise.hints, level)}
                        </p>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <ExerciseRenderer
                  exercise={queued.exercise}
                  isRetry={queued.isRetry}
                  companionId={progress.companion}
                  feedbackLine={feedbackLine}
                  onDone={(r) => handleDone(r.correct)}
                />

                {/* Boucle « encore une étape » */}
                {session.streak >= 2 && remainingSteps > 1 && (
                  <p className="mt-3 text-center text-xs font-semibold text-ink-faint">
                    Belle série — plus que {remainingSteps - 1} étape
                    {remainingSteps - 1 > 1 ? "s" : ""} pour boucler le chapitre.
                  </p>
                )}

                {/* Zone basse intelligente : jamais de grand blanc */}
                <div className="mt-auto">
                  <LessonBottomCoach
                    chapter={chapter}
                    session={session}
                    exercise={queued.exercise}
                    companionId={progress.companion}
                  />
                </div>
              </motion.div>
            )}

            {/* I · Résumé final */}
            {stage === "summary" && (
              <motion.div key="summary" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <ChapterSummary chapter={chapter} session={session} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </MotionConfig>
  );
}

function ExerciseRenderer({
  exercise,
  isRetry,
  companionId,
  feedbackLine,
  onDone,
}: {
  exercise: Exercise;
  isRetry: boolean;
  companionId: string | null;
  feedbackLine: (correct: boolean) => string;
  onDone: (r: { correct: boolean }) => void;
}) {
  switch (exercise.type) {
    case "choice":
      return (
        <ChoiceExerciseScreen
          exercise={exercise}
          isRetry={isRetry}
          companionId={companionId}
          feedbackLine={feedbackLine}
          onDone={onDone}
        />
      );
    case "gap":
      return (
        <GapExerciseScreen
          exercise={exercise}
          isRetry={isRetry}
          companionId={companionId}
          feedbackLine={feedbackLine}
          onDone={onDone}
        />
      );
    case "build":
      return (
        <BuildExerciseScreen
          exercise={exercise}
          isRetry={isRetry}
          companionId={companionId}
          feedbackLine={feedbackLine}
          onDone={onDone}
        />
      );
    case "chat":
      return (
        <ChatExerciseScreen
          exercise={exercise}
          isRetry={isRetry}
          companionId={companionId}
          feedbackLine={feedbackLine}
          onDone={onDone}
        />
      );
    case "shadow":
      // Architecture prête — pas encore de contenu shadow dans les chapitres.
      return null;
  }
}
