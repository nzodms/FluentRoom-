"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  BookOpen,
  Check,
  ListChecks,
  Mic,
  Puzzle,
  Repeat2,
  Volume2,
  X,
} from "lucide-react";
import type { Lesson } from "@/types/learning";
import { useProgress } from "@/lib/useProgress";
import { speakText } from "@/lib/speech";
import { useRecognition } from "@/lib/useRecognition";
import { matchScore, scoreFeedback } from "@/lib/scoring";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Confetti } from "@/components/ui/Confetti";
import { WordOrder } from "@/components/exercises/WordOrder";
import { MicRecorder } from "@/components/room/MicRecorder";
import { cn } from "@/lib/utils";

const TOTAL_STEPS = 6;

export function LessonFlow({ lesson }: { lesson: Lesson }) {
  const { beginLesson, finishLesson } = useProgress();
  const [step, setStep] = useState(0);
  const [outcome, setOutcome] = useState<{
    xpEarned: number;
    newBadges: string[];
  } | null>(null);

  useEffect(() => {
    beginLesson(lesson.id);
  }, [beginLesson, lesson.id]);

  const next = () => setStep((s) => s + 1);

  const complete = () => {
    const result = finishLesson(lesson.id);
    setOutcome({ xpEarned: result.xpEarned, newBadges: result.newBadges });
    next();
  };

  return (
    <div className="gradient-hero flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 glass border-b border-ink/5">
        <div className="mx-auto flex h-14 max-w-lg items-center gap-3 px-4">
          <Link
            href="/app/today"
            aria-label="Quitter la leçon"
            className="grid size-9 shrink-0 place-items-center rounded-full text-ink-soft transition-colors hover:bg-ink/5"
          >
            <X className="size-5" strokeWidth={2.2} />
          </Link>
          <div className="min-w-0 flex-1">
            {step < TOTAL_STEPS - 1 && (
              <ProgressBar value={((step + 1) / TOTAL_STEPS) * 100} />
            )}
          </div>
          <span className="shrink-0 text-sm font-semibold text-ink-faint">
            {lesson.emoji} {lesson.structure}
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
            {step === 0 && <StepLearn lesson={lesson} onNext={next} />}
            {step === 1 && <StepMistake lesson={lesson} onNext={next} />}
            {step === 2 && <StepQuiz lesson={lesson} onNext={next} />}
            {step === 3 && <StepBuild lesson={lesson} onNext={next} />}
            {step === 4 && <StepShadow lesson={lesson} onNext={complete} />}
            {step === 5 && outcome && (
              <StepDone lesson={lesson} outcome={outcome} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

/* ---------- Étape 1 : apprendre ---------- */

function StepLearn({ lesson, onNext }: { lesson: Lesson; onNext: () => void }) {
  return (
    <div className="flex flex-1 flex-col">
      <Chip tone="primary" className="self-start">
        <BookOpen className="size-3" /> Leçon · {lesson.title}
      </Chip>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink">
        {lesson.structure}
      </h2>
      <p className="mt-1.5 text-ink-soft">{lesson.objective}</p>

      <div className="card-soft mt-5 p-5">
        <p className="text-[15px] leading-relaxed text-ink-soft">
          {lesson.explanation}
        </p>
      </div>

      <p className="mt-5 text-sm font-bold text-ink">
        Écoute et lis — attrape le rythme :
      </p>
      <div className="mt-2.5 space-y-2">
        {lesson.examples.map((example, i) => (
          <motion.button
            key={example.english}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.07 }}
            onClick={() => speakText(example.english)}
            className="card-soft flex w-full cursor-pointer items-center gap-3 p-3.5 text-left transition-all hover:ring-2 hover:ring-primary-200"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-50 text-primary-600">
              <Volume2 className="size-3.5" strokeWidth={2.2} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-bold text-ink">
                {example.english}
              </span>
              <span className="block truncate text-sm text-ink-soft">
                {example.french}
              </span>
            </span>
          </motion.button>
        ))}
      </div>

      <div className="mt-auto pt-6">
        <Button size="lg" fullWidth onClick={onNext}>
          J&apos;ai attrapé l&apos;idée
        </Button>
      </div>
    </div>
  );
}

/* ---------- Étape 2 : l'erreur des francophones ---------- */

function StepMistake({
  lesson,
  onNext,
}: {
  lesson: Lesson;
  onNext: () => void;
}) {
  const [picked, setPicked] = useState<"wrong" | "right" | null>(null);
  const options: Array<{ id: "wrong" | "right"; text: string }> = [
    { id: "wrong", text: lesson.commonMistake.wrong },
    { id: "right", text: lesson.commonMistake.right },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <Chip tone="coral" className="self-start">
        <AlertTriangle className="size-3" /> Le piège des francophones
      </Chip>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink">
        Laquelle est correcte ?
      </h2>
      <p className="mt-1.5 text-ink-soft">
        Une des deux est l&apos;erreur typique. Trouve la bonne version.
      </p>

      <div className="mt-6 space-y-3">
        {options.map((option) => {
          const isRight = option.id === "right";
          const revealed = picked !== null;
          return (
            <motion.button
              key={option.id}
              whileTap={!revealed ? { scale: 0.98 } : undefined}
              disabled={revealed}
              onClick={() => setPicked(option.id)}
              className={cn(
                "card-soft flex w-full items-center gap-3 px-4 py-4 text-left text-[15px] font-semibold transition-all",
                !revealed && "cursor-pointer hover:ring-2 hover:ring-primary-200",
                revealed && isRight && "ring-2 ring-mint-500 bg-mint-50",
                revealed &&
                  !isRight &&
                  picked === option.id &&
                  "ring-2 ring-coral-500 bg-coral-50",
                revealed && !isRight && picked !== option.id && "opacity-50",
              )}
            >
              <span className="flex-1 text-ink">“{option.text}”</span>
              {revealed && isRight && (
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
        {picked !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "mt-4 rounded-2xl p-4 text-sm",
              picked === "right"
                ? "bg-mint-50 text-mint-600"
                : "bg-coral-50 text-coral-600",
            )}
          >
            <p className="font-bold">
              {picked === "right"
                ? "Exact ! 🎯"
                : "C'est le piège — la voilà, l'erreur typique."}
            </p>
            <p className="mt-1">{lesson.commonMistake.note}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-auto pt-6">
        <Button size="lg" fullWidth disabled={picked === null} onClick={onNext}>
          Continuer
        </Button>
      </div>
    </div>
  );
}

/* ---------- Étape 3 : mini quiz ---------- */

function StepQuiz({ lesson, onNext }: { lesson: Lesson; onNext: () => void }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const question = lesson.quiz[index];
  const isLast = index === lesson.quiz.length - 1;
  const isCorrect = selected === question.correctIndex;

  const nextQuestion = () => {
    if (isLast) {
      onNext();
      return;
    }
    setIndex(index + 1);
    setSelected(null);
    setAnswered(false);
  };

  return (
    <div className="flex flex-1 flex-col">
      <Chip tone="primary" className="self-start">
        <ListChecks className="size-3" /> Mini quiz · {index + 1} /{" "}
        {lesson.quiz.length}
      </Chip>
      <h2 className="mt-3 text-xl font-bold tracking-tight text-ink">
        {question.question}
      </h2>

      <div className="mt-5 space-y-2.5">
        {question.options.map((option, i) => {
          const isThisCorrect = i === question.correctIndex;
          const isThisSelected = selected === i;
          return (
            <motion.button
              key={option}
              whileTap={!answered ? { scale: 0.98 } : undefined}
              onClick={() => !answered && setSelected(i)}
              disabled={answered}
              className={cn(
                "card-soft flex w-full items-center gap-3 px-4 py-3.5 text-left text-[15px] font-medium transition-all",
                !answered && "cursor-pointer hover:ring-2 hover:ring-primary-200",
                !answered &&
                  isThisSelected &&
                  "ring-2 ring-primary-500 bg-primary-50",
                answered && isThisCorrect && "ring-2 ring-mint-500 bg-mint-50",
                answered &&
                  isThisSelected &&
                  !isThisCorrect &&
                  "ring-2 ring-coral-500 bg-coral-50",
                answered && !isThisSelected && !isThisCorrect && "opacity-50",
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
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "mt-4 rounded-2xl p-4 text-sm",
              isCorrect
                ? "bg-mint-50 text-mint-600"
                : "bg-coral-50 text-coral-600",
            )}
          >
            <p className="font-bold">
              {isCorrect ? "Bien vu ! 🎯" : "Pas tout à fait."}
            </p>
            <p className="mt-1">{question.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-auto pt-6">
        {!answered ? (
          <Button
            size="lg"
            fullWidth
            disabled={selected === null}
            onClick={() => setAnswered(true)}
          >
            Valider
          </Button>
        ) : (
          <Button size="lg" fullWidth onClick={nextQuestion}>
            {isLast ? "À toi de construire" : "Question suivante"}
          </Button>
        )}
      </div>
    </div>
  );
}

/* ---------- Étape 4 : build your own sentence ---------- */

function StepBuild({ lesson, onNext }: { lesson: Lesson; onNext: () => void }) {
  const [solved, setSolved] = useState(false);

  return (
    <div className="flex flex-1 flex-col">
      <Chip tone="primary" className="self-start">
        <Puzzle className="size-3" /> Build your own sentence
      </Chip>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink">
        Construis la phrase
      </h2>
      <p className="mt-1.5 text-ink-soft">{lesson.build.prompt}</p>

      <div className="mt-6">
        <WordOrder
          words={lesson.build.words}
          answer={lesson.build.answer}
          onResult={(correct) => correct && setSolved(true)}
        />
      </div>

      {solved && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 rounded-2xl bg-mint-50 p-4 text-sm text-mint-600"
        >
          🧠 <span className="font-bold">Ton cerveau pense en blocs.</span>{" "}
          C&apos;est exactement comme ça que les natifs construisent leurs
          phrases — pas mot à mot.
        </motion.div>
      )}

      <div className="mt-auto pt-6">
        <Button size="lg" fullWidth disabled={!solved} onClick={onNext}>
          Dernière étape : dis-la à voix haute
        </Button>
      </div>
    </div>
  );
}

/* ---------- Étape 5 : shadowing ---------- */

function StepShadow({
  lesson,
  onNext,
}: {
  lesson: Lesson;
  onNext: () => void;
}) {
  const [score, setScore] = useState<number | null>(null);
  const recognition = useRecognition({
    onFinish: (transcript) =>
      setScore(matchScore(lesson.shadowLine, transcript)),
  });

  return (
    <div className="flex flex-1 flex-col">
      <Chip tone="mint" className="self-start">
        <Repeat2 className="size-3" /> Dis-la pour de vrai
      </Chip>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink">
        Répète avec le rythme
      </h2>
      <p className="mt-1.5 text-ink-soft">
        Une structure ne devient tienne que quand ta bouche l&apos;a dite.
        Répète le rythme, pas seulement la phrase.
      </p>

      <div className="card-soft mt-6 p-6 text-center">
        <p className="text-xl font-bold text-ink">
          &ldquo;{lesson.shadowLine}&rdquo;
        </p>
        <button
          onClick={() => speakText(lesson.shadowLine, { rate: 0.9 })}
          className="mx-auto mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-600 transition-colors hover:bg-primary-100"
        >
          <Volume2 className="size-4" /> Écouter
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
          </>
        ) : (
          <div className="rounded-2xl bg-primary-50 p-4 text-center text-sm text-primary-700">
            🎙️ Micro non supporté ici — répète la phrase à voix haute, puis
            valide.
          </div>
        )}
      </div>

      <AnimatePresence>
        {score !== null && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "mt-5 rounded-2xl p-4 text-center",
              score >= 65 ? "bg-mint-50" : "bg-gold-50",
            )}
          >
            <p className="text-2xl font-bold text-ink">{score}%</p>
            <p
              className={cn(
                "mt-0.5 text-sm font-semibold",
                score >= 65 ? "text-mint-600" : "text-gold-500",
              )}
            >
              {scoreFeedback(score)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-auto pt-6">
        <Button size="lg" fullWidth onClick={onNext}>
          <Mic className="size-4" /> Mark as learned
        </Button>
      </div>
    </div>
  );
}

/* ---------- Étape 6 : terminé ---------- */

function StepDone({
  lesson,
  outcome,
}: {
  lesson: Lesson;
  outcome: { xpEarned: number; newBadges: string[] };
}) {
  return (
    <div className="relative flex flex-1 flex-col">
      <Confetti count={18} />
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
          className="grid size-20 place-items-center rounded-[1.75rem] gradient-mint text-white shadow-[0_16px_40px_-10px_rgba(44,183,131,0.5)]"
        >
          <Check className="size-10" strokeWidth={3} />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-5 text-2xl font-bold tracking-tight text-ink"
        >
          Structure apprise
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-1.5 max-w-xs text-ink-soft"
        >
          <span className="font-bold text-ink">
            &ldquo;{lesson.structure}&rdquo;
          </span>{" "}
          rejoint ta Phrase Bank. Tu viens d&apos;apprendre un bloc que les
          natifs utilisent vraiment.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.55, type: "spring", stiffness: 300, damping: 20 }}
          className="mt-5 flex gap-2"
        >
          <Chip tone="primary">+{outcome.xpEarned} FP</Chip>
          <Chip tone="mint">Phrase Bank +1</Chip>
          {outcome.newBadges.includes("first-lesson") && (
            <Chip tone="gold">🧱 Badge First Lesson</Chip>
          )}
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="space-y-2.5"
      >
        <Link href="/app/today" className="block">
          <Button size="lg" fullWidth>
            Continuer ma journée
          </Button>
        </Link>
        <Link href="/app/phrases" className="block">
          <Button variant="secondary" fullWidth>
            Voir ma Phrase Bank
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
