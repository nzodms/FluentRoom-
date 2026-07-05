"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import type {
  BuildExercise,
  ChatExercise,
  ChoiceExercise,
  GapExercise,
} from "@/lib/lessons/types";
import { speakText } from "@/lib/speech";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { AnswerChoiceCard } from "@/components/exercises/AnswerChoiceCard";
import { PhraseBuilder } from "./PhraseBuilder";
import { CompanionCharacter } from "@/components/companion/CompanionCharacter";
import { LearningGlyph, type LearningIconName } from "@/components/icons/learning-icons";
import { cn } from "@/lib/utils";

/**
 * Écrans d'exercice du moteur de chapitres. Chaque écran remonte un
 * résultat unique { correct } au premier essai — le moteur gère les
 * rappels. La correction pédagogique est toujours montrée après coup.
 */

export interface ExerciseResult {
  correct: boolean;
}

interface ScreenProps<T> {
  exercise: T;
  companionId: string | null;
  /** Ligne contextuelle du compagnon pour le feedback. */
  feedbackLine: (correct: boolean) => string;
  onDone: (result: ExerciseResult) => void;
  /** Numéro du rappel (2e passage) pour adapter la microcopie. */
  isRetry: boolean;
}

const VARIANT_META: Record<
  ChoiceExercise["variant"],
  { label: string; icon: LearningIconName; tone: "primary" | "coral" | "mint" | "gold" }
> = {
  quick: { label: "Choix rapide", icon: "lesson", tone: "primary" },
  meaning: { label: "Sens, pas mot à mot", icon: "native", tone: "primary" },
  natural: { label: "Réponse naturelle", icon: "speak", tone: "mint" },
  listening: { label: "Écoute active", icon: "listen", tone: "primary" },
  nuance: { label: "Nuances", icon: "fluency", tone: "primary" },
  "error-spot": { label: "Chasse à l'erreur", icon: "trap", tone: "coral" },
  reflex: { label: "Réflexe chrono", icon: "reflex", tone: "gold" },
};

/* ---------- Feedback partagé ---------- */

function FeedbackCard({
  correct,
  line,
  explanation,
  companionId,
  onContinue,
  continueLabel = "Continuer",
}: {
  correct: boolean;
  line: string;
  explanation: string;
  companionId: string | null;
  onContinue: () => void;
  continueLabel?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className="mt-3 space-y-3"
    >
      <div
        className={cn(
          "flex items-start gap-3 rounded-3xl p-3.5",
          correct ? "bg-mint-50" : "bg-coral-50",
        )}
      >
        <CompanionCharacter
          companionId={companionId}
          size={46}
          expression={correct ? "celebrating" : "encouraging"}
        />
        <div className="min-w-0 flex-1 text-sm">
          <p className={cn("font-bold", correct ? "text-mint-600" : "text-coral-600")}>
            {line}
          </p>
          <p className={cn("mt-0.5", correct ? "text-mint-600" : "text-coral-600")}>
            {explanation}
          </p>
        </div>
      </div>
      <Button size="lg" fullWidth onClick={onContinue}>
        {continueLabel}
      </Button>
    </motion.div>
  );
}

/* ---------- Choix (rapide, sens, naturel, écoute, nuance, erreur, réflexe) ---------- */

export function ChoiceExerciseScreen({
  exercise,
  companionId,
  feedbackLine,
  onDone,
  isRetry,
}: ScreenProps<ChoiceExercise>) {
  const meta = VARIANT_META[exercise.variant];
  const [picked, setPicked] = useState<number | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [tenths, setTenths] = useState((exercise.timerSec ?? 0) * 10);
  const answered = picked !== null || timedOut;
  const correct = picked === exercise.correctIndex;

  // Réflexe chrono : timeout = raté (le rappel reviendra sans chrono serré).
  useEffect(() => {
    if (!exercise.timerSec || answered) return;
    const t = setInterval(() => {
      setTenths((v) => {
        if (v <= 1) {
          setTimedOut(true);
          return 0;
        }
        return v - 1;
      });
    }, 100);
    return () => clearInterval(t);
  }, [exercise.timerSec, answered]);

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Chip tone={meta.tone}>
          <LearningGlyph name={meta.icon} className="size-3" /> {meta.label}
        </Chip>
        {isRetry && <Chip tone="gold">Rappel</Chip>}
      </div>
      {exercise.timerSec && !answered && (
        <div className="mb-3 flex items-center gap-2.5">
          <span
            className={cn(
              "grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold",
              tenths <= 30 ? "bg-coral-500 text-white" : "bg-ink/5 text-ink",
            )}
          >
            {Math.ceil(tenths / 10)}
          </span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/8">
            <motion.div
              className={cn("h-full rounded-full", tenths <= 30 ? "bg-coral-500" : "gradient-primary")}
              animate={{ width: `${(tenths / ((exercise.timerSec ?? 1) * 10)) * 100}%` }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </div>
        </div>
      )}
      <h2 className="text-xl font-bold leading-snug tracking-tight text-ink">
        {exercise.prompt}
      </h2>
      {exercise.subtitle && (
        <p className="mt-1 text-sm text-ink-soft">{exercise.subtitle}</p>
      )}

      {exercise.audio && (
        <button
          onClick={() => speakText(exercise.audio!, { rate: 0.92 })}
          className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary-50 px-4 py-2.5 text-sm font-bold text-primary-600 transition-colors hover:bg-primary-100"
        >
          <Volume2 className="size-4" /> Écouter la phrase
        </button>
      )}

      <div className="mt-4 space-y-2.5">
        {exercise.options.map((option, i) => (
          <AnswerChoiceCard
            key={option}
            text={option}
            subLabel={answered ? exercise.optionNotes?.[i] : undefined}
            state={
              !answered
                ? "default"
                : i === exercise.correctIndex
                  ? picked === i
                    ? "correct"
                    : "revealedCorrect"
                  : picked === i
                    ? "wrong"
                    : "dimmed"
            }
            locked={answered}
            onSelect={() => setPicked(i)}
            index={i}
          />
        ))}
      </div>

      <AnimatePresence>
        {answered && (
          <FeedbackCard
            correct={correct}
            line={
              timedOut
                ? "Trop tard — mais regarde la bonne réponse, elle reviendra."
                : feedbackLine(correct)
            }
            explanation={exercise.explanation}
            companionId={companionId}
            onContinue={() => onDone({ correct })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Phrase à trou ---------- */

export function GapExerciseScreen({
  exercise,
  companionId,
  feedbackLine,
  onDone,
  isRetry,
}: ScreenProps<GapExercise>) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;
  const correct = picked === exercise.correctIndex;
  const [before, after] = exercise.sentence.split("___");

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Chip tone="primary">
          <LearningGlyph name="build" className="size-3" /> Phrase à trou
        </Chip>
        {isRetry && <Chip tone="gold">Rappel</Chip>}
      </div>
      <h2 className="text-xl font-bold leading-snug tracking-tight text-ink">
        {exercise.prompt}
      </h2>

      <div className="card-tint-primary mt-4 p-5 text-center">
        <p className="text-xl font-bold text-ink">
          {before}
          <span
            className={cn(
              "mx-1 inline-block min-w-20 rounded-xl border-b-2 px-2 pb-0.5",
              answered
                ? correct
                  ? "border-mint-500 bg-mint-50 text-mint-600"
                  : "border-coral-500 bg-coral-50 text-coral-600"
                : "border-primary-300 text-primary-600",
            )}
          >
            {answered ? exercise.options[picked] : "…"}
          </span>
          {after}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {exercise.options.map((option, i) => (
          <motion.button
            key={option}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06 }}
            whileTap={!answered ? { scale: 0.95 } : undefined}
            disabled={answered}
            onClick={() => setPicked(i)}
            className={cn(
              "cursor-pointer rounded-2xl border-2 bg-white px-5 py-2.5 text-[15px] font-bold shadow-soft transition-all",
              !answered && "border-ink/8 hover:border-primary-300",
              answered && i === exercise.correctIndex && "border-mint-500 bg-mint-50 text-mint-600",
              answered && picked === i && i !== exercise.correctIndex && "border-coral-500 bg-coral-50 text-coral-600",
              answered && picked !== i && i !== exercise.correctIndex && "opacity-40",
            )}
          >
            {option}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {answered && (
          <FeedbackCard
            correct={correct}
            line={feedbackLine(correct)}
            explanation={exercise.explanation}
            companionId={companionId}
            onContinue={() => onDone({ correct })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Construction / traduction guidée ---------- */

export function BuildExerciseScreen({
  exercise,
  companionId,
  feedbackLine,
  onDone,
  isRetry,
}: ScreenProps<BuildExercise>) {
  const [solved, setSolved] = useState(false);
  // Premier essai : c'est lui qui compte pour la maîtrise.
  const [firstAttempt, setFirstAttempt] = useState<boolean | null>(null);

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Chip tone="primary">
          <LearningGlyph name="build" className="size-3" /> Construction
        </Chip>
        {isRetry && <Chip tone="gold">Rappel</Chip>}
      </div>
      <h2 className="text-xl font-bold leading-snug tracking-tight text-ink">
        {exercise.prompt}
      </h2>
      <p className="mt-1 text-sm text-ink-soft">{exercise.intent}</p>

      <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
        Objectif : construire une phrase naturelle, pas mot à mot.
      </p>

      <div className="mt-4">
        <PhraseBuilder
          words={exercise.words}
          answer={exercise.answer}
          onResult={(correct) => {
            setFirstAttempt((prev) => (prev === null ? correct : prev));
            if (correct) setSolved(true);
          }}
        />
      </div>

      <AnimatePresence>
        {solved && (
          <FeedbackCard
            correct={firstAttempt === true}
            line={feedbackLine(firstAttempt === true)}
            explanation={exercise.explanation}
            companionId={companionId}
            onContinue={() => onDone({ correct: firstAttempt === true })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Conversation simulée ---------- */

export function ChatExerciseScreen({
  exercise,
  companionId,
  feedbackLine,
  onDone,
  isRetry,
}: ScreenProps<ChatExercise>) {
  const [turnIndex, setTurnIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [finished, setFinished] = useState(false);

  const [typing, setTyping] = useState(true);

  const turns = exercise.turns;
  const visible = turns.slice(0, turnIndex + 1);
  const current = turns[turnIndex];
  const isUserTurn = Boolean(current?.options);
  const interlocutor =
    turns.find((t) => t.speaker !== "Toi")?.speaker ?? "Interlocuteur";
  const userTurns = turns.filter((t) => t.options).length;
  const answeredTurns = turns
    .slice(0, turnIndex)
    .filter((t) => t.options).length;

  const advance = () => {
    setPicked(null);
    if (turnIndex >= turns.length - 1) {
      setFinished(true);
    } else {
      setTurnIndex((i) => i + 1);
    }
  };

  // Effet « en train d'écrire » avant chaque réplique de l'interlocuteur.
  useEffect(() => {
    if (isUserTurn || finished) return;
    const on = setTimeout(() => setTyping(true), 0);
    const off = setTimeout(() => setTyping(false), 850);
    return () => {
      clearTimeout(on);
      clearTimeout(off);
    };
  }, [turnIndex, isUserTurn, finished]);

  // Les répliques de l'interlocuteur défilent seules après le typing.
  useEffect(() => {
    if (finished || isUserTurn || typing) return;
    const t = setTimeout(() => {
      if (turnIndex >= turns.length - 1) setFinished(true);
      else setTurnIndex((i) => i + 1);
    }, 1400);
    return () => clearTimeout(t);
  }, [turnIndex, isUserTurn, finished, typing, turns.length]);

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Chip tone="mint">
          <LearningGlyph name="native" className="size-3" /> Conversation
        </Chip>
        {isRetry && <Chip tone="gold">Rappel</Chip>}
      </div>
      <h2 className="text-xl font-bold leading-snug tracking-tight text-ink">
        {exercise.prompt}
      </h2>

      {/* La scène : décor, interlocuteur, progression de la conversation */}
      <div className="relative mt-4 flex min-h-[46vh] flex-col overflow-hidden rounded-3xl border border-ink/6 bg-gradient-to-b from-primary-50/60 via-cream/80 to-cream p-3">
        <span
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-12 size-44 rounded-full bg-primary-400/10 blur-3xl"
        />
        <div className="relative mb-2 flex items-center gap-2.5 border-b border-ink/5 px-1 pb-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-full gradient-primary text-xs font-bold text-white">
            {interlocutor.charAt(0)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-ink">{interlocutor}</p>
            {exercise.scene && (
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">
                {exercise.scene}
              </p>
            )}
          </div>
          {/* Progression conversationnelle */}
          <div className="flex shrink-0 gap-1">
            {Array.from({ length: userTurns }, (_, i) => (
              <span
                key={i}
                className={cn(
                  "size-1.5 rounded-full transition-colors",
                  i < answeredTurns || finished ? "bg-mint-500" : "bg-ink/15",
                )}
              />
            ))}
          </div>
        </div>

        <div className="relative flex flex-1 flex-col justify-end gap-2.5">
          {visible.map((turn, i) => {
            const me = turn.speaker === "Toi";
            const answeredText =
              turn.options && i < turnIndex
                ? turn.options[turn.correctIndex ?? 0]
                : turn.text;
            if (turn.options && i === turnIndex && picked === null) return null;
            if (!turn.options && i === turnIndex && typing && !finished) return null;
            const shown =
              turn.options && i === turnIndex && picked !== null
                ? turn.options[picked]
                : answeredText;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 360, damping: 26 }}
                className={cn("flex", me ? "justify-end" : "justify-start")}
              >
                <span
                  className={cn(
                    "max-w-[80%] rounded-3xl px-4 py-2.5 text-[15px] font-semibold",
                    me
                      ? "rounded-br-lg gradient-primary text-white shadow-glow"
                      : "rounded-bl-lg bg-white text-ink shadow-soft",
                  )}
                >
                  {shown}
                </span>
              </motion.div>
            );
          })}
          {/* En train d'écrire… */}
          {!isUserTurn && typing && !finished && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <span className="flex gap-1 rounded-3xl rounded-bl-lg bg-white px-4 py-3.5 shadow-soft">
                {[0, 1, 2].map((d) => (
                  <motion.span
                    key={d}
                    className="size-1.5 rounded-full bg-ink/30"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }}
                  />
                ))}
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Choix de réponse */}
      {isUserTurn && picked === null && !finished && (
        <div className="mt-3 space-y-2">
          {current.options!.map((option, i) => (
            <AnswerChoiceCard
              key={option}
              text={option}
              state="default"
              locked={false}
              onSelect={() => {
                setPicked(i);
                if (i !== current.correctIndex) setMistakes((m) => m + 1);
              }}
              index={i}
            />
          ))}
        </div>
      )}

      {/* Feedback du tour puis suite */}
      {isUserTurn && picked !== null && !finished && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 space-y-3"
        >
          <div
            className={cn(
              "rounded-2xl p-3 text-sm font-semibold",
              picked === current.correctIndex
                ? "bg-mint-50 text-mint-600"
                : "bg-coral-50 text-coral-600",
            )}
          >
            {picked === current.correctIndex
              ? current.note ?? "Exactement."
              : `Un natif dirait : « ${current.options![current.correctIndex ?? 0]} » — ${current.note ?? ""}`}
          </div>
          <Button size="lg" fullWidth onClick={advance}>
            Suite de la conversation
          </Button>
        </motion.div>
      )}

      <AnimatePresence>
        {finished && (
          <FeedbackCard
            correct={mistakes === 0}
            line={feedbackLine(mistakes === 0)}
            explanation={exercise.explanation}
            companionId={companionId}
            onContinue={() => onDone({ correct: mistakes === 0 })}
            continueLabel="Terminer"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
