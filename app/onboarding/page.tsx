"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Headphones, Zap } from "lucide-react";
import type {
  OnboardingGoal,
  OnboardingLevel,
} from "@/types/learning";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Chip } from "@/components/ui/Chip";
import { useProgress } from "@/lib/useProgress";
import { cn } from "@/lib/utils";

const goals: Array<{ id: OnboardingGoal; label: string; emoji: string }> = [
  { id: "videos", label: "Comprendre les vidéos", emoji: "🎬" },
  { id: "travel", label: "Voyager", emoji: "✈️" },
  { id: "natives", label: "Parler avec des natifs", emoji: "🗣️" },
  { id: "speaking", label: "Améliorer mon oral", emoji: "🎙️" },
  { id: "basics", label: "Reprendre les bases", emoji: "🧱" },
];

const levelsOptions: Array<{
  id: OnboardingLevel;
  label: string;
  emoji: string;
}> = [
  { id: "beginner", label: "Je débute", emoji: "🌱" },
  { id: "some", label: "Je comprends un peu", emoji: "👂" },
  { id: "blocked", label: "Je comprends mais je bloque à l'oral", emoji: "😶" },
  { id: "natural", label: "Je veux devenir plus naturel", emoji: "✨" },
];

const minutesOptions = [5, 10, 15, 20] as const;

/** Profil simulé mais crédible selon les réponses. */
function diagnose(level: OnboardingLevel, goal: OnboardingGoal) {
  const profiles: Record<OnboardingLevel, { name: string; detail: string }> = {
    beginner: {
      name: "Silent Starter",
      detail: "On construit ton oreille depuis zéro, avec des scènes simples.",
    },
    some: {
      name: "Fast Listener Starter",
      detail: "Ton oreille capte déjà des mots. On va la muscler à vitesse réelle.",
    },
    blocked: {
      name: "Blocked Speaker",
      detail: "Tu comprends, mais les mots ne sortent pas. On débloque tes réflexes.",
    },
    natural: {
      name: "Natural Builder",
      detail: "Tu as les bases. On travaille le rythme et les blocs des natifs.",
    },
  };
  const goalLine: Record<OnboardingGoal, string> = {
    videos: "comprendre les vidéos en anglais sans sous-titres",
    travel: "te débrouiller partout en voyage",
    natives: "tenir une vraie conversation avec des natifs",
    speaking: "répondre plus vite, sans traduire",
    basics: "reconstruire des bases solides et utiles",
  };
  return {
    ...profiles[level],
    objective: `Objectif : ${goalLine[goal]} — et répondre plus vite.`,
  };
}

const stepVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

export default function OnboardingPage() {
  const router = useRouter();
  const { completeOnboarding } = useProgress();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<OnboardingGoal | null>(null);
  const [level, setLevel] = useState<OnboardingLevel | null>(null);
  const [minutes, setMinutes] = useState<5 | 10 | 15 | 20 | null>(null);

  const canContinue =
    (step === 0 && goal !== null) ||
    (step === 1 && level !== null) ||
    (step === 2 && minutes !== null) ||
    step === 3;

  const next = () => {
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    if (goal && level && minutes) {
      completeOnboarding({
        goal,
        level,
        dailyMinutes: minutes,
        profileName: diagnose(level, goal).name,
        completedAt: new Date().toISOString(),
      });
    }
    router.push("/app/today");
  };

  const diagnosis = level && goal ? diagnose(level, goal) : null;

  return (
    <div className="gradient-hero flex min-h-dvh flex-col">
      <header className="mx-auto flex w-full max-w-lg items-center justify-between px-4 pt-5">
        <Logo />
        <span className="text-sm font-semibold text-ink-faint">
          {step + 1} / 4
        </span>
      </header>

      <div className="mx-auto mt-5 w-full max-w-lg px-4">
        <ProgressBar value={((step + 1) / 4) * 100} />
      </div>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 pb-10 pt-8">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="goal"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">
                Pourquoi tu veux progresser en anglais ?
              </h1>
              <p className="mt-2 text-ink-soft">
                On adapte tes rooms à ton objectif.
              </p>
              <div className="mt-6 space-y-3">
                {goals.map((option) => (
                  <ChoiceRow
                    key={option.id}
                    emoji={option.emoji}
                    label={option.label}
                    selected={goal === option.id}
                    onClick={() => setGoal(option.id)}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="level"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">
                Ton niveau ressenti, honnêtement ?
              </h1>
              <p className="mt-2 text-ink-soft">
                Pas de test scolaire. Juste ton ressenti.
              </p>
              <div className="mt-6 space-y-3">
                {levelsOptions.map((option) => (
                  <ChoiceRow
                    key={option.id}
                    emoji={option.emoji}
                    label={option.label}
                    selected={level === option.id}
                    onClick={() => setLevel(option.id)}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="minutes"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">
                Combien de temps par jour ?
              </h1>
              <p className="mt-2 text-ink-soft">
                La régularité bat l&apos;intensité. Chaque jour compte.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {minutesOptions.map((option) => (
                  <motion.button
                    key={option}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setMinutes(option)}
                    className={cn(
                      "card-soft flex flex-col items-center gap-1 py-6 transition-all cursor-pointer",
                      minutes === option
                        ? "ring-2 ring-primary-500 bg-primary-50"
                        : "hover:ring-2 hover:ring-primary-200",
                    )}
                  >
                    <span className="text-3xl font-bold text-ink">
                      {option}
                    </span>
                    <span className="text-sm font-medium text-ink-faint">
                      min / jour
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && diagnosis && (
            <motion.div
              key="diagnosis"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="flex flex-1 flex-col"
            >
              <div className="text-center">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.15 }}
                  className="mx-auto grid size-20 place-items-center rounded-3xl gradient-primary text-white shadow-glow"
                >
                  <Headphones className="size-9" strokeWidth={2} />
                </motion.span>
                <Chip tone="primary" className="mt-6">
                  <Zap className="size-3" /> Diagnostic rapide
                </Chip>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink">
                  Ton profil :{" "}
                  <span className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
                    {diagnosis.name}
                  </span>
                </h1>
                <p className="mx-auto mt-3 max-w-sm text-ink-soft">
                  {diagnosis.detail}
                </p>
                <p className="mx-auto mt-2 max-w-sm font-semibold text-ink">
                  {diagnosis.objective}
                </p>
              </div>
              <div className="card-soft mt-8 space-y-3 p-5">
                {[
                  `${minutes} minutes par jour, une room complète`,
                  "Des phrases réelles débloquées à chaque session",
                  "Révision espacée pour tout retenir",
                ].map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.12 }}
                    className="flex items-center gap-2.5 text-sm text-ink-soft"
                  >
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-mint-50 text-mint-600">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                    {item}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-auto flex items-center gap-3 pt-8">
          {step > 0 && (
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setStep(step - 1)}
              aria-label="Retour"
              className="!px-4"
            >
              <ArrowLeft className="size-5" />
            </Button>
          )}
          <Button
            size="lg"
            fullWidth
            disabled={!canContinue}
            onClick={next}
          >
            {step === 3 ? "Découvrir ma première room" : "Continuer"}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </main>
    </div>
  );
}

function ChoiceRow({
  emoji,
  label,
  selected,
  onClick,
}: {
  emoji: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "card-soft flex w-full items-center gap-3 px-4 py-4 text-left transition-all cursor-pointer",
        selected
          ? "ring-2 ring-primary-500 bg-primary-50"
          : "hover:ring-2 hover:ring-primary-200",
      )}
    >
      <span className="text-xl">{emoji}</span>
      <span className="flex-1 font-semibold text-ink">{label}</span>
      <span
        className={cn(
          "grid size-6 place-items-center rounded-full border-2 transition-colors",
          selected
            ? "border-primary-500 bg-primary-500 text-white"
            : "border-ink/15 text-transparent",
        )}
      >
        <Check className="size-3.5" strokeWidth={3.5} />
      </span>
    </motion.button>
  );
}
