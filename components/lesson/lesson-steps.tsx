"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ListChecks, Mic, Volume2 } from "lucide-react";
import type { Lesson, LessonExample } from "@/types/learning";
import { speakText } from "@/lib/speech";
import { useRecognition } from "@/lib/useRecognition";
import { matchScore, scoreFeedback } from "@/lib/scoring";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Confetti } from "@/components/ui/Confetti";
import { AnimatedCheck } from "@/components/reward/AnimatedCheck";
import { WordOrder } from "@/components/exercises/WordOrder";
import { MicRecorder } from "@/components/room/MicRecorder";
import { LearningScreen } from "@/components/session/LearningScreen";
import { QuizScreen } from "@/components/session/QuizScreen";
import { LearningGlyph, LearningIcon } from "@/components/icons/learning-icons";
import { cn } from "@/lib/utils";

/**
 * Étapes partagées entre les templates de leçon.
 * Chaque template compose sa propre séquence à partir d'ici + ses mécaniques propres.
 */

export interface StepProps {
  lesson: Lesson;
  onNext: () => void;
}

export interface LessonOutcome {
  xpEarned: number;
  newBadges: string[];
}

/* ---------- Hook ---------- */

export function StepHook({ lesson, onNext }: StepProps) {
  return (
    <LearningScreen
      centered
      title=""
      action={
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button size="lg" fullWidth onClick={onNext}>
            Voir comment ça marche
          </Button>
        </motion.div>
      }
    >
      <div className="text-center">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 15 }}
          className="inline-block text-5xl"
        >
          {lesson.emoji}
        </motion.span>
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
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          onClick={() => speakText(lesson.shadowLine)}
          className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary-50 px-5 py-2.5 text-sm font-bold text-primary-600 transition-colors hover:bg-primary-100"
        >
          <Volume2 className="size-4" /> Écoute-le une fois
        </motion.button>
      </div>
    </LearningScreen>
  );
}

/* ---------- Pattern ---------- */

export function splitExample(structure: string, example: LessonExample) {
  const prefix = structure.replace(/…$/, "").trim();
  const ending = example.english.toLowerCase().startsWith(prefix.toLowerCase())
    ? example.english.slice(prefix.length)
    : example.english;
  return ending.replace(/[.!?]+$/, "").trim();
}

export function StepPattern({ lesson, onNext }: StepProps) {
  const prefix = lesson.structure.replace(/…$/, "").trim();
  const endings = lesson.examples
    .slice(0, 4)
    .map((e) => splitExample(lesson.structure, e));
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % endings.length), 1900);
    return () => clearInterval(t);
  }, [endings.length]);

  return (
    <LearningScreen
      label={
        <Chip tone="primary">
          <LearningGlyph name="lesson" className="size-3" /> Le pattern
        </Chip>
      }
      title="Un bloc fixe + ce que tu veux"
      subtitle="Le début ne change jamais. La fin est à toi."
      action={
        <Button size="lg" fullWidth onClick={onNext}>
          J&apos;ai compris le bloc
        </Button>
      }
      centered
    >
      <div className="card-tint-primary flex min-h-36 flex-col items-center justify-center gap-3 p-6">
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

      <div className="mt-3 rounded-2xl bg-primary-50 p-3.5 text-sm text-primary-700">
        🧠 Ton cerveau n&apos;apprend pas une règle — il apprend un{" "}
        <span className="font-bold">bloc prêt à l&apos;emploi</span>.
      </div>
    </LearningScreen>
  );
}

/* ---------- Examples (flip) ---------- */

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
        className="relative block h-[74px] w-full cursor-pointer"
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
          <span className="min-w-0 flex-1 text-left text-[15px] font-bold text-ink">
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
          <span className="text-[15px] font-semibold">{example.french}</span>
        </div>
      </motion.button>
    </motion.div>
  );
}

export function StepExamples({ lesson, onNext }: StepProps) {
  const [flippedCount, setFlippedCount] = useState(0);
  const examples = lesson.examples.slice(0, 5);

  return (
    <LearningScreen
      label={
        <Chip tone="primary">
          <LearningGlyph name="phrase" className="size-3" /> En situation
        </Chip>
      }
      title="Retourne les cartes"
      subtitle="Devine le sens avant de retourner. Ton cerveau adore ça."
      action={
        <Button size="lg" fullWidth disabled={flippedCount < 2} onClick={onNext}>
          {flippedCount < 2 ? "Retourne au moins 2 cartes" : "Passons au piège"}
        </Button>
      }
    >
      <div className="space-y-2">
        {examples.map((example, i) => (
          <ExampleFlipCard
            key={example.english}
            example={example}
            delay={0.06 + i * 0.06}
            onFlip={() => setFlippedCount((c) => c + 1)}
          />
        ))}
      </div>
    </LearningScreen>
  );
}

/* ---------- Le piège français ---------- */

export function StepTrap({ lesson, onNext }: StepProps) {
  const [picked, setPicked] = useState<"wrong" | "right" | null>(null);
  const options: Array<{ id: "wrong" | "right"; text: string }> = [
    { id: "wrong", text: lesson.commonMistake.wrong },
    { id: "right", text: lesson.commonMistake.right },
  ];

  return (
    <LearningScreen
      label={
        <Chip tone="coral">
          <LearningGlyph name="trap" className="size-3" /> Le piège français
        </Chip>
      }
      title="Laquelle est correcte ?"
      subtitle="Une des deux est l'erreur typique des francophones."
      action={
        <Button size="lg" fullWidth disabled={picked === null} onClick={onNext}>
          Continuer
        </Button>
      }
    >
      <div className="space-y-2.5">
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
              "mt-3 rounded-2xl p-3.5 text-sm",
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
            <p className="mt-0.5">{lesson.commonMistake.note}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </LearningScreen>
  );
}

/* ---------- Check ---------- */

export function StepQuiz({ lesson, onNext }: StepProps) {
  const [index, setIndex] = useState(0);
  const question = lesson.quiz[index];
  const isLast = index === lesson.quiz.length - 1;

  return (
    <QuizScreen
      key={question.id}
      label={
        <Chip tone="primary">
          <ListChecks className="size-3" /> Check · {index + 1}/
          {lesson.quiz.length}
        </Chip>
      }
      question={question.question}
      choices={question.options}
      correctIndex={question.correctIndex}
      explanation={question.explanation}
      continueLabel={isLast ? "À toi de construire" : "Question suivante"}
      onContinue={() => (isLast ? onNext() : setIndex(index + 1))}
    />
  );
}

/* ---------- Build ---------- */

export function StepBuild({ lesson, onNext }: StepProps) {
  const [solved, setSolved] = useState(false);

  return (
    <LearningScreen
      label={
        <Chip tone="primary">
          <LearningGlyph name="build" className="size-3" /> Build your own
        </Chip>
      }
      title="Construis la phrase"
      subtitle={lesson.build.prompt}
      action={
        <Button size="lg" fullWidth disabled={!solved} onClick={onNext}>
          Dernière ligne droite : dis-la
        </Button>
      }
    >
      <WordOrder
        words={lesson.build.words}
        answer={lesson.build.answer}
        onResult={(correct) => correct && setSolved(true)}
      />

      {solved && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-2xl bg-mint-50 p-3.5 text-sm text-mint-600"
        >
          🧠 <span className="font-bold">Ton cerveau pense en blocs.</span>{" "}
          C&apos;est comme ça que les natifs construisent — pas mot à mot.
        </motion.div>
      )}
    </LearningScreen>
  );
}

/* ---------- Say it ---------- */

export function StepSay({
  lesson,
  onNext,
  continueLabel = "Une dernière situation",
}: StepProps & { continueLabel?: string }) {
  const [score, setScore] = useState<number | null>(null);
  const recognition = useRecognition({
    onFinish: (transcript) =>
      setScore(matchScore(lesson.shadowLine, transcript)),
  });

  return (
    <LearningScreen
      label={
        <Chip tone="mint">
          <LearningGlyph name="shadowing" className="size-3" /> Dis-la pour de
          vrai
        </Chip>
      }
      title="Répète avec le rythme"
      subtitle="Un bloc ne devient tien que quand ta bouche l'a dit."
      action={
        <Button size="lg" fullWidth onClick={onNext}>
          <Mic className="size-4" /> {continueLabel}
        </Button>
      }
    >
      <div className="card-tint-mint p-5 text-center">
        <p className="text-xl font-bold text-ink">
          &ldquo;{lesson.shadowLine}&rdquo;
        </p>
        <button
          onClick={() => speakText(lesson.shadowLine, { rate: 0.9 })}
          className="mx-auto mt-3 inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-mint-600 shadow-soft transition-colors hover:bg-mint-50"
        >
          <Volume2 className="size-4" /> Écouter
        </button>
      </div>

      <div className="mt-5 flex flex-col items-center">
        {recognition.supported ? (
          <>
            <MicRecorder
              listening={recognition.listening}
              supported={recognition.supported}
              onStart={recognition.start}
              onStop={recognition.stop}
            />
            <p className="mt-2.5 text-sm font-medium text-ink-faint">
              {recognition.listening
                ? "Je t'écoute… parle normalement"
                : "Appuie et répète la phrase"}
            </p>
          </>
        ) : (
          <div className="rounded-2xl bg-mint-50 p-3.5 text-center text-sm text-mint-600">
            🎙️ Micro non supporté ici — répète à voix haute, puis continue.
          </div>
        )}
      </div>

      <AnimatePresence>
        {score !== null && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "mt-4 rounded-2xl p-3.5 text-center",
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
    </LearningScreen>
  );
}

/* ---------- Use it ---------- */

export function StepUse({ lesson, onNext }: StepProps) {
  return (
    <QuizScreen
      label={
        <Chip tone="mint">
          <LearningGlyph name="speak" className="size-3" /> En situation réelle
        </Chip>
      }
      question={lesson.use.situation}
      subtitle="Choisis la réponse qu'un natif dirait vraiment."
      choices={lesson.use.options}
      correctIndex={lesson.use.correctIndex}
      explanation={`Le bloc « ${lesson.structure} » sort tout seul — c'est exactement le réflexe qu'on construit.`}
      continueLabel="Mark as learned"
      onContinue={() => onNext()}
    />
  );
}

/* ---------- Unlock ---------- */

export function StepUnlock({
  lesson,
  outcome,
  extra,
}: {
  lesson: Lesson;
  outcome: LessonOutcome;
  /** Ligne bonus propre au template (ex: score réflexe). */
  extra?: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-full flex-col pb-[max(env(safe-area-inset-bottom),1rem)] pt-4">
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
          className="mt-4 text-2xl font-bold tracking-tight text-ink"
        >
          Bloc débloqué
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.45, type: "spring", stiffness: 280, damping: 20 }}
          className="card-tint-primary mt-4 w-full max-w-xs p-4"
        >
          <div className="flex items-center gap-3">
            <LearningIcon name="lesson" variant="active" size="md" />
            <div className="min-w-0 text-left">
              <p className="text-lg font-bold text-ink">{lesson.structure}</p>
              <p className="text-sm text-ink-soft">{lesson.phrase.french}</p>
            </div>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-2 text-left text-xs font-bold text-primary-600"
          >
            → Ajouté à ta collection
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, type: "spring", stiffness: 300, damping: 20 }}
          className="mt-4 flex flex-col items-center gap-2"
        >
          <div className="flex gap-2">
            <Chip tone="primary">+{outcome.xpEarned} FP</Chip>
            {outcome.newBadges.includes("first-lesson") && (
              <Chip tone="gold">🧱 Badge First Lesson</Chip>
            )}
          </div>
          {extra}
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85 }}
        className="space-y-2.5"
      >
        <Link href="/app/today" className="block">
          <Button size="lg" fullWidth>
            Continuer le path
          </Button>
        </Link>
        <Link href="/app/phrases" className="block">
          <Button variant="secondary" fullWidth>
            Voir ma collection
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
