"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Volume2, Zap } from "lucide-react";
import type { ComprehensionQuestion, Lesson } from "@/types/learning";
import { speakText } from "@/lib/speech";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { LearningScreen } from "@/components/session/LearningScreen";
import { cn } from "@/lib/utils";
import type { StepProps } from "./lesson-steps";

/**
 * Template "reflex" : la leçon est un entraînement de vitesse.
 * Flash d'exemples, puis rounds chronométrés — le but est que le
 * bloc sorte sans réfléchir.
 */

const ROUND_SECONDS = 8;
const TICK_MS = 100;

/* ---------- Hook façon compte à rebours ---------- */

export function StepReflexHook({ lesson, onNext }: StepProps) {
  return (
    <LearningScreen
      centered
      title=""
      action={
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button size="lg" fullWidth onClick={onNext}>
            <Zap className="size-4" /> Lancer l&apos;entraînement
          </Button>
        </motion.div>
      }
    >
      <div className="text-center">
        <Chip tone="coral" className="mb-4">
          ⚡ Leçon réflexe
        </Chip>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 14 }}
          className="relative mx-auto grid size-24 place-items-center"
        >
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full bg-coral-400/25 blur-lg"
            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.3, 0.6] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
          <span className="relative grid size-20 place-items-center rounded-full gradient-coral text-4xl text-white shadow-lift">
            ⚡
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-4 text-4xl font-bold tracking-tight text-ink"
        >
          {lesson.structure}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-3 max-w-xs text-lg text-ink-soft"
        >
          {lesson.objective}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-5 text-sm font-bold text-coral-500"
        >
          Objectif : répondre en moins de {ROUND_SECONDS} secondes, sans
          traduire.
        </motion.p>
      </div>
    </LearningScreen>
  );
}

/* ---------- Flash : imprégnation rapide ---------- */

export function StepReflexFlash({ lesson, onNext }: StepProps) {
  const examples = lesson.examples.slice(0, 4);
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    speakText(examples[index].english);
    if (index >= examples.length - 1) {
      const t = setTimeout(() => setDone(true), 2200);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setIndex((i) => i + 1), 2400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const current = examples[index];

  return (
    <LearningScreen
      label={
        <Chip tone="coral">
          ⚡ Flash · {index + 1}/{examples.length}
        </Chip>
      }
      title=""
      action={
        <Button size="lg" fullWidth disabled={!done} onClick={onNext}>
          {done ? "Prêt pour le chrono" : "Regarde, écoute, absorbe…"}
        </Button>
      }
      centered
    >
      <div className="text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.english}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -20 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
          >
            <p className="text-3xl font-bold tracking-tight text-ink">
              {current.english}
            </p>
            <p className="mt-2 text-base text-ink-soft">{current.french}</p>
          </motion.div>
        </AnimatePresence>
        <button
          onClick={() => speakText(current.english)}
          className="mx-auto mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full bg-coral-50 px-4 py-2 text-sm font-bold text-coral-500"
        >
          <Volume2 className="size-4" /> Réécouter
        </button>
        <div className="mt-6 flex justify-center gap-1.5">
          {examples.map((e, i) => (
            <span
              key={e.english}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-6 bg-coral-500" : "w-1.5 bg-ink/10",
              )}
            />
          ))}
        </div>
      </div>
    </LearningScreen>
  );
}

/* ---------- Rounds chronométrés ---------- */

interface ReflexRoundsProps {
  lesson: Lesson;
  onDone: (score: { correct: number; total: number }) => void;
}

export function StepReflexRounds({ lesson, onDone }: ReflexRoundsProps) {
  const rounds: ComprehensionQuestion[] = useMemo(
    () => [
      ...lesson.quiz,
      {
        id: "reflex-trap",
        question: "Laquelle est correcte ? (le piège français)",
        options: [lesson.commonMistake.wrong, lesson.commonMistake.right],
        correctIndex: 1,
        explanation: lesson.commonMistake.note,
      },
      {
        id: "reflex-use",
        question: lesson.use.situation,
        options: lesson.use.options,
        correctIndex: lesson.use.correctIndex,
        explanation: `Le bloc « ${lesson.structure} » doit sortir tout seul.`,
      },
    ],
    [lesson],
  );

  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [tenths, setTenths] = useState(ROUND_SECONDS * 10);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = rounds[index];
  const revealed = picked !== null || timedOut;

  // Chrono du round : décrémente tant que pas répondu.
  useEffect(() => {
    if (revealed || finished) return;
    const t = setInterval(() => {
      setTenths((v) => {
        if (v <= 1) {
          setTimedOut(true);
          return 0;
        }
        return v - 1;
      });
    }, TICK_MS);
    return () => clearInterval(t);
  }, [revealed, finished, index]);

  // Après révélation : enchaîne automatiquement.
  useEffect(() => {
    if (!revealed || finished) return;
    const t = setTimeout(() => {
      if (index >= rounds.length - 1) {
        setFinished(true);
      } else {
        setIndex((i) => i + 1);
        setPicked(null);
        setTimedOut(false);
        setTenths(ROUND_SECONDS * 10);
      }
    }, 1700);
    return () => clearTimeout(t);
  }, [revealed, finished, index, rounds.length]);

  const pick = (i: number) => {
    if (revealed) return;
    setPicked(i);
    if (i === question.correctIndex) setCorrectCount((c) => c + 1);
  };

  if (finished) {
    const perfect = correctCount === rounds.length;
    return (
      <LearningScreen
        label={<Chip tone="coral">⚡ Fin du chrono</Chip>}
        title={perfect ? "Réflexes de natif ⚡" : "Bon rythme !"}
        subtitle={
          perfect
            ? "Aucune hésitation. C'est exactement ça."
            : "La vitesse vient avec la répétition — le bloc s'installe."
        }
        action={
          <Button
            size="lg"
            fullWidth
            onClick={() => onDone({ correct: correctCount, total: rounds.length })}
          >
            Construis-la maintenant
          </Button>
        }
        centered
      >
        <div className="rounded-3xl bg-coral-50 p-6 text-center shadow-soft ring-1 ring-coral-100">
          <motion.p
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 16 }}
            className="text-5xl font-bold text-ink"
          >
            {correctCount}/{rounds.length}
          </motion.p>
          <p className="mt-1.5 text-sm font-semibold text-coral-500">
            réflexes corrects
          </p>
        </div>
      </LearningScreen>
    );
  }

  const secondsLeft = Math.ceil(tenths / 10);
  const urgency = tenths <= 30;

  return (
    <LearningScreen
      label={
        <Chip tone="coral">
          ⚡ Round {index + 1}/{rounds.length}
        </Chip>
      }
      title=""
    >
      {/* Chrono */}
      <div className="mb-4 flex items-center gap-3">
        <span
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-full text-sm font-bold",
            urgency && !revealed
              ? "bg-coral-500 text-white"
              : "bg-ink/5 text-ink",
          )}
        >
          {revealed ? "—" : secondsLeft}
        </span>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink/8">
          <motion.div
            className={cn(
              "h-full rounded-full",
              urgency ? "bg-coral-500" : "gradient-primary",
            )}
            animate={{ width: `${(tenths / (ROUND_SECONDS * 10)) * 100}%` }}
            transition={{ duration: TICK_MS / 1000, ease: "linear" }}
          />
        </div>
      </div>

      <motion.p
        key={question.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-bold leading-snug tracking-tight text-ink"
      >
        {question.question}
      </motion.p>

      <div className="mt-4 space-y-2.5">
        {question.options.map((option, i) => {
          const isCorrect = i === question.correctIndex;
          return (
            <motion.button
              key={option}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.05 }}
              whileTap={!revealed ? { scale: 0.98 } : undefined}
              disabled={revealed}
              onClick={() => pick(i)}
              className={cn(
                "card-soft flex w-full items-center gap-3 px-4 py-3.5 text-left text-[15px] font-semibold transition-all",
                !revealed && "cursor-pointer hover:ring-2 hover:ring-coral-100",
                revealed && isCorrect && "ring-2 ring-mint-500 bg-mint-50",
                revealed && !isCorrect && picked === i && "ring-2 ring-coral-500 bg-coral-50",
                revealed && !isCorrect && picked !== i && "opacity-40",
              )}
            >
              <span className="flex-1 text-ink">{option}</span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {revealed && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "mt-3 rounded-2xl p-3 text-sm font-semibold",
              timedOut
                ? "bg-coral-50 text-coral-600"
                : picked === question.correctIndex
                  ? "bg-mint-50 text-mint-600"
                  : "bg-coral-50 text-coral-600",
            )}
          >
            {timedOut
              ? "⏱ Trop tard ! La bonne réponse est surlignée."
              : picked === question.correctIndex
                ? "⚡ Réflexe !"
                : question.explanation}
          </motion.p>
        )}
      </AnimatePresence>
    </LearningScreen>
  );
}
