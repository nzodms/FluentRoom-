"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ListChecks,
  Mic,
  Puzzle,
  Repeat2,
  Sparkles,
  Volume2,
  X,
} from "lucide-react";
import type { Lesson, LessonExample } from "@/types/learning";
import { useProgress } from "@/lib/useProgress";
import { speakText } from "@/lib/speech";
import { useRecognition } from "@/lib/useRecognition";
import { matchScore, scoreFeedback } from "@/lib/scoring";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Confetti } from "@/components/ui/Confetti";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { AnimatedCheck } from "@/components/reward/AnimatedCheck";
import { WordOrder } from "@/components/exercises/WordOrder";
import { MicRecorder } from "@/components/room/MicRecorder";
import { cn } from "@/lib/utils";

const STEP_LABELS = [
  "Hook",
  "Pattern",
  "Examples",
  "Trap",
  "Check",
  "Build",
  "Say it",
];
const TOTAL_STEPS = STEP_LABELS.length + 1; // + Unlock

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
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-dvh flex-col">
        <AmbientBackground />
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
                <div>
                  <div className="flex items-center gap-1">
                    {STEP_LABELS.map((label, i) => (
                      <motion.span
                        key={label}
                        className={cn(
                          "h-1.5 flex-1 rounded-full",
                          i < step
                            ? "gradient-mint"
                            : i === step
                              ? "gradient-primary"
                              : "bg-ink/8",
                        )}
                        animate={i === step ? { opacity: [1, 0.6, 1] } : {}}
                        transition={{ duration: 1.6, repeat: Infinity }}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-ink-faint">
                    {STEP_LABELS[step]} · {step + 1}/{TOTAL_STEPS}
                  </p>
                </div>
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
              {step === 0 && <StepHook lesson={lesson} onNext={next} />}
              {step === 1 && <StepPattern lesson={lesson} onNext={next} />}
              {step === 2 && <StepExamples lesson={lesson} onNext={next} />}
              {step === 3 && <StepTrap lesson={lesson} onNext={next} />}
              {step === 4 && <StepQuiz lesson={lesson} onNext={next} />}
              {step === 5 && <StepBuild lesson={lesson} onNext={next} />}
              {step === 6 && <StepSay lesson={lesson} onNext={complete} />}
              {step === 7 && outcome && (
                <StepUnlock lesson={lesson} outcome={outcome} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </MotionConfig>
  );
}

/* ---------- 1 · Hook ---------- */

function StepHook({ lesson, onNext }: { lesson: Lesson; onNext: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 15 }}
        className="text-5xl"
      >
        {lesson.emoji}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-5 text-4xl font-bold tracking-tight text-ink"
      >
        {lesson.structure}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-3 max-w-xs text-lg text-ink-soft"
      >
        {lesson.objective}
      </motion.p>
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        onClick={() => speakText(lesson.shadowLine)}
        className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary-50 px-5 py-2.5 text-sm font-bold text-primary-600 transition-colors hover:bg-primary-100"
      >
        <Volume2 className="size-4" /> Écoute-le une fois
      </motion.button>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-auto w-full pt-8"
      >
        <Button size="lg" fullWidth onClick={onNext}>
          Voir comment ça marche <ArrowRight className="size-4" />
        </Button>
      </motion.div>
    </div>
  );
}

/* ---------- 2 · Pattern (assemblage animé) ---------- */

function splitExample(structure: string, example: LessonExample) {
  const prefix = structure.replace(/…$/, "").trim();
  const ending = example.english.toLowerCase().startsWith(prefix.toLowerCase())
    ? example.english.slice(prefix.length)
    : example.english;
  return ending.replace(/[.!?]+$/, "").trim();
}

function StepPattern({
  lesson,
  onNext,
}: {
  lesson: Lesson;
  onNext: () => void;
}) {
  const prefix = lesson.structure.replace(/…$/, "").trim();
  const endings = lesson.examples
    .slice(0, 4)
    .map((e) => splitExample(lesson.structure, e));
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setIndex((i) => (i + 1) % endings.length),
      1900,
    );
    return () => clearInterval(t);
  }, [endings.length]);

  return (
    <div className="flex flex-1 flex-col">
      <Chip tone="primary" className="self-start">
        <Puzzle className="size-3" /> Le pattern
      </Chip>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink">
        Un bloc fixe + ce que tu veux
      </h2>
      <p className="mt-1.5 text-ink-soft">{lesson.explanation}</p>

      {/* Assemblage animé */}
      <div className="card-tint-primary mt-6 flex min-h-36 flex-col items-center justify-center gap-3 p-6">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-2xl gradient-primary px-4 py-2.5 text-lg font-bold text-white shadow-glow">
            {prefix}
          </span>
          <span className="text-2xl font-bold text-ink-faint">+</span>
          <span className="relative inline-flex h-12 min-w-36 items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl bg-white px-4 py-2.5 text-lg font-bold text-primary-700 shadow-soft ring-1 ring-primary-200"
              >
                {endings[index]}
              </motion.span>
            </AnimatePresence>
          </span>
        </div>
        <button
          onClick={() => speakText(`${prefix} ${endings[index]}`)}
          className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-bold text-primary-600"
        >
          <Volume2 className="size-3.5" /> Écouter cette combinaison
        </button>
      </div>

      <div className="mt-4 rounded-2xl bg-primary-50 p-4 text-sm text-primary-700">
        🧠 Ton cerveau n&apos;apprend pas une règle — il apprend un{" "}
        <span className="font-bold">bloc prêt à l&apos;emploi</span>. Le début
        ne change jamais, la fin est à toi.
      </div>

      <div className="mt-auto pt-6">
        <Button size="lg" fullWidth onClick={onNext}>
          J&apos;ai compris le bloc
        </Button>
      </div>
    </div>
  );
}

/* ---------- 3 · Examples (cartes flip) ---------- */

function ExampleFlipCard({
  example,
  delay,
  onFlip,
}: {
  example: LessonExample;
  delay: number;
  onFlip: () => void;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      style={{ perspective: 900 }}
    >
      <motion.button
        onClick={() => {
          setFlipped((v) => !v);
          if (!flipped) onFlip();
        }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.45, ease: [0.35, 0, 0.25, 1] }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative block h-20 w-full cursor-pointer"
      >
        <div
          style={{ backfaceVisibility: "hidden" }}
          className="card-soft absolute inset-0 flex items-center gap-3 px-4"
        >
          <span
            onClick={(e) => {
              e.stopPropagation();
              speakText(example.english);
            }}
            role="button"
            aria-label={`Écouter : ${example.english}`}
            className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-50 text-primary-600"
          >
            <Volume2 className="size-3.5" strokeWidth={2.2} />
          </span>
          <span className="min-w-0 flex-1 text-left font-bold text-ink">
            {example.english}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wide text-ink-faint">
            Sens ↻
          </span>
        </div>
        <div
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          className="absolute inset-0 flex items-center rounded-3xl gradient-primary px-4 text-left text-white shadow-soft"
        >
          <span className="font-semibold">{example.french}</span>
        </div>
      </motion.button>
    </motion.div>
  );
}

function StepExamples({
  lesson,
  onNext,
}: {
  lesson: Lesson;
  onNext: () => void;
}) {
  const [flippedCount, setFlippedCount] = useState(0);
  const examples = lesson.examples.slice(0, 5);

  return (
    <div className="flex flex-1 flex-col">
      <Chip tone="primary" className="self-start">
        <Sparkles className="size-3" /> En situation
      </Chip>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink">
        Retourne les cartes
      </h2>
      <p className="mt-1.5 text-ink-soft">
        Écoute chaque phrase, puis retourne la carte pour vérifier le sens.
        Devine avant de retourner.
      </p>

      <div className="mt-5 space-y-2.5">
        {examples.map((example, i) => (
          <ExampleFlipCard
            key={example.english}
            example={example}
            delay={0.08 + i * 0.07}
            onFlip={() => setFlippedCount((c) => c + 1)}
          />
        ))}
      </div>

      <div className="mt-auto pt-6">
        <Button size="lg" fullWidth disabled={flippedCount < 2} onClick={onNext}>
          {flippedCount < 2
            ? "Retourne au moins 2 cartes"
            : "Passons au piège"}
        </Button>
      </div>
    </div>
  );
}

/* ---------- 4 · Le piège français ---------- */

function StepTrap({ lesson, onNext }: { lesson: Lesson; onNext: () => void }) {
  const [picked, setPicked] = useState<"wrong" | "right" | null>(null);
  const options: Array<{ id: "wrong" | "right"; text: string }> = [
    { id: "wrong", text: lesson.commonMistake.wrong },
    { id: "right", text: lesson.commonMistake.right },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <Chip tone="coral" className="self-start">
        <AlertTriangle className="size-3" /> Le piège français
      </Chip>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink">
        Laquelle est correcte ?
      </h2>
      <p className="mt-1.5 text-ink-soft">
        Une des deux est l&apos;erreur typique des francophones. Trouve la
        bonne version.
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
                !revealed &&
                  "cursor-pointer hover:ring-2 hover:ring-primary-200",
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

/* ---------- 5 · Mini check ---------- */

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
        <ListChecks className="size-3" /> Check · {index + 1} /{" "}
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
                !answered &&
                  "cursor-pointer hover:ring-2 hover:ring-primary-200",
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

/* ---------- 6 · Build ---------- */

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

/* ---------- 7 · Say it ---------- */

function StepSay({ lesson, onNext }: { lesson: Lesson; onNext: () => void }) {
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
        Un bloc ne devient tien que quand ta bouche l&apos;a dit. Répète le
        rythme, pas seulement les mots.
      </p>

      <div className="card-tint-primary mt-6 p-6 text-center">
        <p className="text-xl font-bold text-ink">
          &ldquo;{lesson.shadowLine}&rdquo;
        </p>
        <button
          onClick={() => speakText(lesson.shadowLine, { rate: 0.9 })}
          className="mx-auto mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary-600 shadow-soft transition-colors hover:bg-primary-50"
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

/* ---------- 8 · Unlock ---------- */

function StepUnlock({
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
        <div className="relative">
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-[1.75rem] bg-mint-400/40 blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0.4] }}
            transition={{ duration: 1.2, delay: 0.3 }}
          />
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 16 }}
            className="relative grid size-20 place-items-center rounded-[1.75rem] gradient-mint text-white shadow-[0_16px_40px_-10px_rgba(44,183,131,0.5)]"
          >
            <AnimatedCheck size={40} delay={0.3} />
          </motion.div>
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-5 text-2xl font-bold tracking-tight text-ink"
        >
          Bloc débloqué
        </motion.h2>

        {/* La carte rejoint la banque */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.45, type: "spring", stiffness: 280, damping: 20 }}
          className="card-tint-primary mt-5 w-full max-w-xs p-4"
        >
          <p className="text-lg font-bold text-ink">{lesson.structure}</p>
          <p className="mt-0.5 text-sm text-ink-soft">{lesson.phrase.french}</p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-2 text-xs font-bold text-primary-600"
          >
            → Ajouté à ta Phrase Bank
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, type: "spring", stiffness: 300, damping: 20 }}
          className="mt-4 flex gap-2"
        >
          <Chip tone="primary">+{outcome.xpEarned} FP</Chip>
          {outcome.newBadges.includes("first-lesson") && (
            <Chip tone="gold">🧱 Badge First Lesson</Chip>
          )}
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85 }}
        className="space-y-2.5"
      >
        <Link href="/app/speak" className="block">
          <Button size="lg" fullWidth>
            Use it in a real situation
          </Button>
        </Link>
        <Link href="/app/today" className="block">
          <Button variant="secondary" fullWidth>
            Continuer ma journée
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
