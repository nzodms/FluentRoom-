"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Headphones,
  Mic,
  Repeat2,
  SearchCheck,
  Sparkles,
} from "lucide-react";
import type {
  OnboardingBlocker,
  OnboardingGoal,
  OnboardingLevel,
} from "@/types/learning";
import { getTodayRoom } from "@/data/rooms";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Chip } from "@/components/ui/Chip";
import { useProgress } from "@/lib/useProgress";
import { cn } from "@/lib/utils";

/* ---------- Options ---------- */

const blockers: Array<{ id: OnboardingBlocker; label: string; emoji: string }> = [
  { id: "fast-speech", label: "Je comprends mal quand ça parle vite", emoji: "💨" },
  { id: "blocked-reply", label: "Je bloque quand je dois répondre", emoji: "😶" },
  { id: "translating", label: "Je traduis tout dans ma tête", emoji: "🔄" },
  { id: "vocab", label: "Je manque de vocabulaire naturel", emoji: "🧩" },
  { id: "shy", label: "Je n'ose pas parler", emoji: "🙈" },
];

const goals: Array<{ id: OnboardingGoal; label: string; emoji: string }> = [
  { id: "videos", label: "Comprendre des vidéos et séries", emoji: "🎬" },
  { id: "natives", label: "Parler avec des natifs", emoji: "🗣️" },
  { id: "travel", label: "Voyager sans stress", emoji: "✈️" },
  { id: "conversation", label: "Tenir une conversation simple", emoji: "💬" },
  { id: "accent", label: "Améliorer mon accent et mon flow", emoji: "🎵" },
  { id: "basics", label: "Reprendre les bases proprement", emoji: "🧱" },
];

const levelsOptions: Array<{ id: OnboardingLevel; label: string; emoji: string }> = [
  { id: "beginner", label: "Je débute vraiment", emoji: "🌱" },
  { id: "some", label: "Je comprends quelques phrases", emoji: "👂" },
  { id: "blocked", label: "Je comprends mais je bloque à l'oral", emoji: "😶" },
  { id: "semi", label: "Je parle un peu, mais pas naturellement", emoji: "🌤️" },
  { id: "fluent", label: "Je veux devenir fluide", emoji: "⚡️" },
];

const minutesOptions = [5, 10, 15, 20] as const;

/* ---------- Diagnostic ---------- */

function diagnose(
  level: OnboardingLevel,
  goal: OnboardingGoal,
  blocker: OnboardingBlocker,
) {
  const profiles: Record<OnboardingLevel, string> = {
    beginner: "Silent Starter",
    some: "Fast Listener Starter",
    blocked: "Natural Responder Starter",
    semi: "Natural Responder Starter",
    natural: "Fluent Builder Starter",
    fluent: "Fluent Builder Starter",
  };
  const strengths: Record<OnboardingBlocker, string> = {
    "fast-speech":
      "Tu as déjà une base — c'est ton oreille qu'il faut muscler à vitesse réelle.",
    "blocked-reply":
      "Tu comprends déjà bien. Les mots sont là — il faut débloquer la sortie.",
    translating:
      "Ton vocabulaire est bon. On va apprendre à ton cerveau à penser en blocs.",
    vocab:
      "Tes réflexes sont là. Il te manque juste les phrases que les natifs utilisent vraiment.",
    shy: "Tu as tout ce qu'il faut. Il manque un espace sûr pour oser — c'est exactement ici.",
  };
  const blockerLabels: Record<OnboardingBlocker, string> = {
    "fast-speech": "l'anglais rapide et les contractions",
    "blocked-reply": "le blocage au moment de répondre",
    translating: "la traduction mentale mot à mot",
    vocab: "le manque de blocs naturels",
    shy: "la peur de parler",
  };
  const goalLines: Record<OnboardingGoal, string> = {
    videos: "comprendre les vidéos sans sous-titres",
    natives: "tenir une vraie conversation avec des natifs",
    travel: "te débrouiller partout en voyage",
    speaking: "répondre plus vite, sans traduire",
    conversation: "tenir une conversation simple, sans stress",
    accent: "attraper le rythme et le flow des natifs",
    basics: "reconstruire des bases solides et utiles",
  };
  return {
    profile: profiles[level],
    strength: strengths[blocker],
    blockerLabel: blockerLabels[blocker],
    goalLine: goalLines[goal],
  };
}

const plan = [
  { icon: Headphones, text: "Écouter sans sous-titres, à vitesse réelle" },
  { icon: SearchCheck, text: "Décoder les phrases natives, bloc par bloc" },
  { icon: Repeat2, text: "Répéter avec le bon rythme" },
  { icon: Mic, text: "Répondre sans traduire dans ta tête" },
];

const stepVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

const TOTAL_STEPS = 5;

export default function OnboardingPage() {
  const router = useRouter();
  const { completeOnboarding } = useProgress();
  const [step, setStep] = useState(0);
  const [blocker, setBlocker] = useState<OnboardingBlocker | null>(null);
  const [goal, setGoal] = useState<OnboardingGoal | null>(null);
  const [level, setLevel] = useState<OnboardingLevel | null>(null);
  const [minutes, setMinutes] = useState<5 | 10 | 15 | 20 | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Sélection = feedback immédiat + auto-avance courte (satisfaisant, pas pressant).
  const pick = <T,>(setter: (v: T) => void, value: T) => {
    setter(value);
    setTimeout(() => {
      setStep((s) => {
        const next = Math.min(s + 1, TOTAL_STEPS - 1);
        // L'arrivée sur le diagnostic passe par une phase "analyse".
        if (next === TOTAL_STEPS - 1) setAnalyzing(true);
        return next;
      });
    }, 420);
  };

  // Fin de la phase "analyse" avant de révéler le diagnostic.
  useEffect(() => {
    if (!analyzing) return;
    const t = setTimeout(() => setAnalyzing(false), 1400);
    return () => clearTimeout(t);
  }, [analyzing]);

  const diagnosis =
    blocker && goal && level ? diagnose(level, goal, blocker) : null;

  const start = () => {
    if (blocker && goal && level && minutes && diagnosis) {
      completeOnboarding({
        blocker,
        goal,
        level,
        dailyMinutes: minutes,
        profileName: diagnosis.profile,
        completedAt: new Date().toISOString(),
      });
    }
    const room = getTodayRoom([]);
    router.push(`/app/room/${room.id}`);
  };

  return (
    <div className="gradient-hero flex min-h-dvh flex-col">
      <header className="mx-auto flex w-full max-w-lg items-center justify-between px-4 pt-5">
        <Logo />
        <span className="text-sm font-semibold text-ink-faint">
          {step + 1} / {TOTAL_STEPS}
        </span>
      </header>

      <div className="mx-auto mt-5 w-full max-w-lg px-4">
        <ProgressBar value={((step + 1) / TOTAL_STEPS) * 100} />
      </div>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 pb-10 pt-8">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <StepShell
              key="blocker"
              title="Qu'est-ce qui te bloque le plus en anglais ?"
              subtitle="Sois honnête — c'est là qu'on va frapper en premier."
            >
              {blockers.map((option) => (
                <ChoiceRow
                  key={option.id}
                  emoji={option.emoji}
                  label={option.label}
                  selected={blocker === option.id}
                  onClick={() => pick(setBlocker, option.id)}
                />
              ))}
            </StepShell>
          )}

          {step === 1 && (
            <StepShell
              key="goal"
              title="Tu veux surtout être capable de…"
              subtitle="Ton plan sera construit autour de ça."
            >
              {goals.map((option) => (
                <ChoiceRow
                  key={option.id}
                  emoji={option.emoji}
                  label={option.label}
                  selected={goal === option.id}
                  onClick={() => pick(setGoal, option.id)}
                />
              ))}
            </StepShell>
          )}

          {step === 2 && (
            <StepShell
              key="level"
              title="Ton niveau ressenti, honnêtement ?"
              subtitle="Pas de test scolaire. Juste ton ressenti."
            >
              {levelsOptions.map((option) => (
                <ChoiceRow
                  key={option.id}
                  emoji={option.emoji}
                  label={option.label}
                  selected={level === option.id}
                  onClick={() => pick(setLevel, option.id)}
                />
              ))}
            </StepShell>
          )}

          {step === 3 && (
            <StepShell
              key="minutes"
              title="Ta routine quotidienne ?"
              subtitle="10 minutes par jour battent 2 heures le dimanche."
            >
              <div className="grid grid-cols-2 gap-3">
                {minutesOptions.map((option) => (
                  <motion.button
                    key={option}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => pick(setMinutes, option)}
                    className={cn(
                      "card-soft flex cursor-pointer flex-col items-center gap-1 py-6 transition-all",
                      minutes === option
                        ? "ring-2 ring-primary-500 bg-primary-50"
                        : "hover:ring-2 hover:ring-primary-200",
                    )}
                  >
                    <span className="text-3xl font-bold text-ink">{option}</span>
                    <span className="text-sm font-medium text-ink-faint">
                      min / jour
                    </span>
                  </motion.button>
                ))}
              </div>
            </StepShell>
          )}

          {step === 4 && diagnosis && (
            <motion.div
              key="diagnosis"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="flex flex-1 flex-col"
            >
              {analyzing ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-5">
                  <motion.span
                    className="grid size-20 place-items-center rounded-3xl gradient-primary text-white shadow-glow"
                    animate={{ scale: [1, 1.08, 1], rotate: [0, 3, -3, 0] }}
                    transition={{ duration: 1.1, repeat: Infinity }}
                  >
                    <Sparkles className="size-9" />
                  </motion.span>
                  <div className="text-center">
                    <p className="text-lg font-bold text-ink">
                      Création de ton plan…
                    </p>
                    <p className="mt-1 text-sm text-ink-soft">
                      Oreille · réflexes · phrases réelles
                    </p>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-1 flex-col"
                >
                  <div className="text-center">
                    <motion.span
                      initial={{ scale: 0, rotate: -12 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 280, damping: 16 }}
                      className="mx-auto grid size-20 place-items-center rounded-3xl gradient-primary text-white shadow-glow"
                    >
                      <Headphones className="size-9" strokeWidth={2} />
                    </motion.span>
                    <Chip tone="primary" className="mt-5">
                      <Sparkles className="size-3" /> Ton plan est prêt
                    </Chip>
                    <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink">
                      Profil détecté :{" "}
                      <span className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
                        {diagnosis.profile}
                      </span>
                    </h1>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="card-soft mt-6 space-y-3 p-5"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg">💪</span>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-mint-600">
                          Ton point fort
                        </p>
                        <p className="mt-0.5 text-sm text-ink-soft">
                          {diagnosis.strength}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-lg">🎯</span>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-coral-600">
                          Ton blocage principal
                        </p>
                        <p className="mt-0.5 text-sm text-ink-soft">
                          {diagnosis.blockerLabel.charAt(0).toUpperCase() +
                            diagnosis.blockerLabel.slice(1)}
                          . On l&apos;attaque dès la première room.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-lg">🏁</span>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-primary-600">
                          Objectif
                        </p>
                        <p className="mt-0.5 text-sm text-ink-soft">
                          {diagnosis.goalLine.charAt(0).toUpperCase() +
                            diagnosis.goalLine.slice(1)}
                          , en {minutes} min par jour.
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <p className="mt-5 text-sm font-bold text-ink">
                    Ton plan recommandé :
                  </p>
                  <div className="mt-2.5 space-y-2.5">
                    {plan.map((item, i) => (
                      <motion.div
                        key={item.text}
                        initial={{ opacity: 0, x: -14 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.45 + i * 0.13 }}
                        className="card-soft flex items-center gap-3 px-4 py-3"
                      >
                        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary-600">
                          <item.icon className="size-4" strokeWidth={2.2} />
                        </span>
                        <p className="text-sm font-semibold text-ink">
                          {item.text}
                        </p>
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            delay: 0.6 + i * 0.13,
                            type: "spring",
                            stiffness: 400,
                            damping: 18,
                          }}
                          className="ml-auto grid size-5 place-items-center rounded-full bg-mint-50 text-mint-600"
                        >
                          <Check className="size-3" strokeWidth={3.5} />
                        </motion.span>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="mt-auto pt-7"
                  >
                    <Button size="lg" fullWidth onClick={start}>
                      Start my first room <ArrowRight className="size-4" />
                    </Button>
                    <p className="mt-3 text-center text-xs text-ink-faint">
                      8 minutes. Une vraie scène. De vraies phrases.
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {step > 0 && step < 4 && (
          <div className="mt-auto pt-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep(step - 1)}
              className="text-ink-faint"
            >
              <ArrowLeft className="size-4" /> Retour
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

function StepShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">
        {title}
      </h1>
      <p className="mt-2 text-ink-soft">{subtitle}</p>
      <div className="mt-6 space-y-3">{children}</div>
    </motion.div>
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
      whileTap={{ scale: 0.97 }}
      animate={selected ? { scale: [1, 1.03, 1] } : {}}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={cn(
        "card-soft flex w-full cursor-pointer items-center gap-3 px-4 py-4 text-left transition-all",
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
