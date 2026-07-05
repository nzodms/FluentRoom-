"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import type {
  OnboardingBlocker,
  OnboardingGoal,
  OnboardingLevel,
} from "@/types/learning";
import { getTodayRoom } from "@/data/rooms";
import { DEFAULT_AVATAR } from "@/data/avatar-items";
import { FluentCharacter } from "@/components/avatar/FluentCharacter";
import { useProgress } from "@/lib/useProgress";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";
import { Chip } from "@/components/ui/Chip";
import { OnboardingChoiceCard } from "@/components/onboarding/OnboardingChoiceCard";
import { OnboardingFeedbackCard } from "@/components/onboarding/OnboardingFeedbackCard";
import { OnboardingMiniTest } from "@/components/onboarding/OnboardingMiniTest";
import { OnboardingAudioCard } from "@/components/onboarding/OnboardingAudioCard";
import {
  OnboardingDiagnosticScreen,
  type MiniTestResults,
} from "@/components/onboarding/OnboardingDiagnosticScreen";
import {
  LearningGlyph,
  type LearningIconName,
} from "@/components/icons/learning-icons";
import { cn } from "@/lib/utils";

/* ---------- Étape 1 · Blocage ---------- */

const blockers: Array<{
  id: OnboardingBlocker;
  label: string;
  icon: LearningIconName;
  feedback: string;
}> = [
  {
    id: "fast-speech",
    label: "Je comprends mal quand ça parle vite",
    icon: "fast",
    feedback: "Ok. On va d'abord entraîner ton oreille à attraper les blocs importants.",
  },
  {
    id: "blocked-reply",
    label: "Je bloque quand je dois répondre",
    icon: "reflex",
    feedback: "Compris. Ton plan va te faire répondre avec des phrases simples avant de chercher la perfection.",
  },
  {
    id: "translating",
    label: "Je traduis tout dans ma tête",
    icon: "review",
    feedback: "Noté. On va apprendre à ton cerveau à penser en blocs, pas en traductions.",
  },
  {
    id: "vocab",
    label: "Je manque de phrases naturelles",
    icon: "phrase",
    feedback: "Parfait. Tu vas collectionner les phrases que les natifs utilisent vraiment.",
  },
  {
    id: "shy",
    label: "Je n'ose pas parler",
    icon: "speak",
    feedback: "Compris. Ici tu t'entraînes sans jugement — ta voix va se débloquer.",
  },
];

/* ---------- Étape 2 · Objectif ---------- */

const goals: Array<{ id: OnboardingGoal; label: string; icon: LearningIconName }> = [
  { id: "videos", label: "Comprendre des vidéos sans tout sous-titrer", icon: "video" },
  { id: "conversation", label: "Tenir une conversation simple", icon: "native" },
  { id: "speaking", label: "Répondre sans paniquer", icon: "speak" },
  { id: "travel", label: "Voyager plus facilement", icon: "quest" },
  { id: "accent", label: "Parler avec un meilleur flow", icon: "fluency" },
  { id: "natives", label: "Comprendre l'anglais rapide", icon: "fast" },
];

/* ---------- Étape 6 · Routine ---------- */

const routines: Array<{ minutes: 5 | 10 | 15 | 20; hint: string }> = [
  { minutes: 5, hint: "Garder le rythme" },
  { minutes: 10, hint: "Progression solide" },
  { minutes: 15, hint: "Mode accéléré" },
  { minutes: 20, hint: "Mode intensif" },
];

const STEP_TITLES: Array<{
  title: string;
  subtitle: string;
  label: string;
  /** Mise en contexte affichée avant un mini-test. */
  softIntro?: string;
}> = [
  {
    label: "Ton blocage",
    title: "Qu'est-ce qui te bloque vraiment en anglais ?",
    subtitle: "Choisis le vrai blocage. Ton parcours va se construire autour de ça.",
  },
  {
    label: "Ton objectif",
    title: "Dans 30 jours, tu veux surtout être capable de…",
    subtitle: "On va construire ton parcours autour de situations réelles.",
  },
  {
    label: "Calibrage · écoute",
    title: "Écoute. Quelle idée tu as entendue ?",
    subtitle: "Ce n'est pas une note — c'est juste pour adapter ton plan.",
    softIntro:
      "Tu vas entendre une phrase très courante. Essaie d'attraper l'idée, pas chaque mot.",
  },
  {
    label: "Calibrage · réflexe",
    title: "On te dit « Thank you so much! »",
    subtitle: "Réponds comme tu peux — il n'y a pas de piège.",
    softIntro:
      "Maintenant, on regarde tes réflexes de réponse. Quelle réponse est la plus naturelle ?",
  },
  {
    label: "Calibrage · bloc",
    title: "Comment dirais-tu : « J'essaie de comprendre » ?",
    subtitle: "Répondre naturellement > parler parfaitement.",
    softIntro:
      "Dernier mini-test : est-ce que tu reconnais un bloc naturel ?",
  },
  {
    label: "Ta routine",
    title: "Combien de temps par jour ?",
    subtitle: "10 minutes par jour battent 2 heures le dimanche.",
  },
  {
    label: "Diagnostic",
    title: "",
    subtitle: "",
  },
];

/* ---------- Phase d'intro : expliquer avant de questionner ---------- */

const INTRO_SCREENS = [
  {
    id: "welcome",
    title: "Bienvenue dans FluentRoom",
    text: "Tu ne vas pas apprendre l'anglais comme à l'école. Ici, tu vas entraîner ton oreille, ta bouche et tes réflexes.",
    expression: "happy" as const,
    cta: "Montre-moi",
  },
  {
    id: "how",
    title: "Trois muscles, un seul but",
    text: "Chaque jour, une mission courte entraîne ton oreille, tes réflexes et tes phrases naturelles.",
    expression: "encouraging" as const,
    cta: "Et ensuite ?",
  },
  {
    id: "loop",
    title: "Pas besoin d'être parfait",
    text: "Tu dois devenir plus automatique. En apprenant, tu gagnes des FP — et tu personnalises ton personnage.",
    expression: "relaxed" as const,
    cta: "Créer mon plan",
  },
];

const INTRO_PILLARS: Array<{ icon: LearningIconName; label: string }> = [
  { icon: "listen", label: "Ton oreille" },
  { icon: "reflex", label: "Tes réflexes" },
  { icon: "phrase", label: "Tes phrases" },
];

const TOTAL_STEPS = STEP_TITLES.length;

const stepVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

/** Niveau estimé à partir des mini-tests (plus crédible qu'une auto-évaluation). */
function levelFromScore(score: number): OnboardingLevel {
  if (score >= 3) return "blocked";
  if (score >= 1) return "some";
  return "beginner";
}

export default function OnboardingPage() {
  const router = useRouter();
  const { completeOnboarding } = useProgress();
  const [phase, setPhase] = useState<"intro" | "questions">("intro");
  const [introIndex, setIntroIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [blocker, setBlocker] = useState<OnboardingBlocker | null>(null);
  const [goal, setGoal] = useState<OnboardingGoal | null>(null);
  const [minutes, setMinutes] = useState<5 | 10 | 15 | 20 | null>(null);
  const [results, setResults] = useState<MiniTestResults>({
    listen: false,
    reflex: false,
    phrase: false,
  });

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));

  // Étapes 1-2 : feedback court après sélection, puis auto-avance.
  const pickBlocker = (id: OnboardingBlocker) => {
    if (blocker) return;
    setBlocker(id);
    setTimeout(next, 1900);
  };
  const pickGoal = (id: OnboardingGoal) => {
    if (goal) return;
    setGoal(id);
    setTimeout(next, 1700);
  };
  const pickMinutes = (m: 5 | 10 | 15 | 20) => {
    if (minutes) return;
    setMinutes(m);
    setTimeout(next, 700);
  };

  const start = () => {
    const score =
      Number(results.listen) + Number(results.reflex) + Number(results.phrase);
    if (blocker && goal && minutes) {
      completeOnboarding({
        blocker,
        goal,
        level: levelFromScore(score),
        dailyMinutes: minutes,
        profileName: "Explorer",
        completedAt: new Date().toISOString(),
      });
    }
    const room = getTodayRoom([]);
    router.push(`/app/room/${room.id}`);
  };

  const meta = STEP_TITLES[step];
  const pickedBlocker = blockers.find((b) => b.id === blocker);

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-dvh flex-col">
        <AmbientBackground />
        <header className="mx-auto flex w-full max-w-lg items-center justify-between px-4 pt-5">
          <Logo />
          {phase === "questions" && (
            <span className="text-sm font-semibold text-ink-faint">
              {step + 1} / {TOTAL_STEPS}
            </span>
          )}
        </header>

        {/* Progress segmentée (questions uniquement) */}
        {phase === "questions" && (
          <div className="mx-auto mt-4 flex w-full max-w-lg gap-1.5 px-4">
            {STEP_TITLES.map((s, i) => (
              <motion.span
                key={s.label}
                className={cn(
                  "h-1.5 flex-1 rounded-full",
                  i < step
                    ? "gradient-mint"
                    : i === step
                      ? "gradient-primary"
                      : "bg-ink/8",
                )}
                animate={i === step ? { scaleY: [1, 1.6, 1] } : {}}
                transition={{ duration: 0.35 }}
              />
            ))}
          </div>
        )}

        {/* Phase 1 : intro guidée — expliquer avant de questionner */}
        {phase === "intro" && (
          <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 pb-8 pt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={INTRO_SCREENS[introIndex].id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.3 }}
                className="flex flex-1 flex-col items-center justify-center text-center"
              >
                <motion.div
                  initial={{ scale: 0.72, y: 8 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 240, damping: 18 }}
                  className="relative"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 -z-10 scale-125 rounded-full bg-primary-400/15 blur-2xl"
                  />
                  <FluentCharacter
                    config={DEFAULT_AVATAR}
                    size={128}
                    expression={INTRO_SCREENS[introIndex].expression}
                    showBackground={false}
                  />
                </motion.div>
                <h1 className="mt-5 text-3xl font-bold tracking-tight text-ink">
                  {INTRO_SCREENS[introIndex].title}
                </h1>
                <p className="mx-auto mt-3 max-w-xs text-base leading-relaxed text-ink-soft">
                  {INTRO_SCREENS[introIndex].text}
                </p>

                {/* Écran 2 : les trois piliers */}
                {introIndex === 1 && (
                  <div className="mt-6 flex gap-2.5">
                    {INTRO_PILLARS.map((pillar, i) => (
                      <motion.div
                        key={pillar.label}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 + i * 0.14, type: "spring", stiffness: 300, damping: 22 }}
                        className="card-tint-primary flex w-24 flex-col items-center gap-2 py-4"
                      >
                        <span className="grid size-10 place-items-center rounded-2xl gradient-primary text-white shadow-glow">
                          <LearningGlyph name={pillar.icon} className="size-4.5" />
                        </span>
                        <p className="text-xs font-bold text-ink">{pillar.label}</p>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Écran 3 : la boucle apprendre → FP → personnaliser */}
                {introIndex === 2 && (
                  <div className="mt-6 flex items-center gap-2">
                    {["Apprendre", "+FP", "Ton style"].map((label, i) => (
                      <div key={label} className="flex items-center gap-2">
                        {i > 0 && (
                          <motion.span
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.35 + i * 0.25 }}
                            className="text-ink-faint"
                          >
                            →
                          </motion.span>
                        )}
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 + i * 0.25, type: "spring", stiffness: 300, damping: 20 }}
                          className={cn(
                            "rounded-full px-4 py-2 text-sm font-bold",
                            i === 1
                              ? "gradient-gold text-white shadow-soft"
                              : "bg-white text-ink shadow-soft ring-1 ring-ink/8",
                          )}
                        >
                          {label}
                        </motion.span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-auto pt-6">
              <div className="mb-4 flex justify-center gap-1.5">
                {INTRO_SCREENS.map((s, i) => (
                  <span
                    key={s.id}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      i === introIndex ? "w-6 bg-primary-500" : "w-1.5 bg-ink/12",
                    )}
                  />
                ))}
              </div>
              <Button
                size="lg"
                fullWidth
                onClick={() =>
                  introIndex < INTRO_SCREENS.length - 1
                    ? setIntroIndex((i) => i + 1)
                    : setPhase("questions")
                }
              >
                {INTRO_SCREENS[introIndex].cta}
              </Button>
              <p className="mt-2.5 text-center text-xs text-ink-faint">
                {introIndex === INTRO_SCREENS.length - 1
                  ? "Pas de stress. On commence doucement."
                  : "Une étape à la fois."}
              </p>
            </div>
          </main>
        )}

        {phase === "questions" && (
        <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 pb-8 pt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="flex flex-1 flex-col"
            >
              {step < TOTAL_STEPS - 1 && (
                <>
                  <Chip tone="primary" className="self-start">
                    <LearningGlyph
                      name={step === 2 ? "listen" : step === 3 ? "reflex" : step === 4 ? "lesson" : step === 5 ? "streak" : "warmup"}
                      className="size-3"
                    />{" "}
                    {meta.label}
                  </Chip>
                  <h1 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-ink">
                    {meta.title}
                  </h1>
                  <p className="mt-1.5 text-sm text-ink-soft">{meta.subtitle}</p>
                  {meta.softIntro && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.12 }}
                      className="mt-3 rounded-2xl bg-primary-50 px-3.5 py-2.5 text-sm font-semibold text-primary-700"
                    >
                      {meta.softIntro}
                    </motion.div>
                  )}
                </>
              )}

              {/* 1 · Blocage */}
              {step === 0 && (
                <div className="mt-5 space-y-2.5">
                  {blockers.map((option, i) => (
                    <OnboardingChoiceCard
                      key={option.id}
                      icon={option.icon}
                      label={option.label}
                      selected={blocker === option.id}
                      locked={blocker !== null}
                      onSelect={() => pickBlocker(option.id)}
                      index={i}
                    />
                  ))}
                  <AnimatePresence>
                    {pickedBlocker && (
                      <OnboardingFeedbackCard
                        message={pickedBlocker.feedback}
                        expression="encouraging"
                      />
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* 2 · Objectif */}
              {step === 1 && (
                <div className="mt-5 space-y-2.5">
                  {goals.map((option, i) => (
                    <OnboardingChoiceCard
                      key={option.id}
                      icon={option.icon}
                      label={option.label}
                      selected={goal === option.id}
                      locked={goal !== null}
                      onSelect={() => pickGoal(option.id)}
                      index={i}
                    />
                  ))}
                  <AnimatePresence>
                    {goal && (
                      <OnboardingFeedbackCard
                        message="Parfait. On va construire ton parcours autour de situations réelles."
                        expression="happy"
                        tone="mint"
                      />
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* 3 · Mini-test écoute */}
              {step === 2 && (
                <div className="mt-5">
                  <OnboardingMiniTest
                    media={<OnboardingAudioCard text="I'm running a bit late." />}
                    options={[
                      "Il est un peu en retard",
                      "Il annule",
                      "Il demande de l'aide",
                    ]}
                    correctIndex={0}
                    correctFeedback="Exact. Tu as attrapé l'idée principale — c'est tout ce qui compte."
                    wrongFeedback="Pas grave. Le bloc important est « running late » = être en retard."
                    continueLabel="Test suivant"
                    onDone={(correct) => {
                      setResults((r) => ({ ...r, listen: correct }));
                      next();
                    }}
                  />
                </div>
              )}

              {/* 4 · Mini-test réflexe */}
              {step === 3 && (
                <div className="mt-5">
                  <OnboardingMiniTest
                    options={["No worries!", "I am happy.", "Nothing problem."]}
                    correctIndex={0}
                    correctFeedback="Oui. « No worries » est une réponse naturelle que les natifs utilisent tout le temps."
                    wrongFeedback="Un natif dirait « No worries » — simple, naturel, sans réfléchir."
                    continueLabel="Dernier test"
                    onDone={(correct) => {
                      setResults((r) => ({ ...r, reflex: correct }));
                      next();
                    }}
                  />
                </div>
              )}

              {/* 5 · Mini-test phrase naturelle */}
              {step === 4 && (
                <div className="mt-5">
                  <OnboardingMiniTest
                    options={[
                      "I try understand.",
                      "I'm trying to understand.",
                      "I'm trying understand.",
                    ]}
                    correctIndex={1}
                    correctFeedback="Oui. Ton cerveau va apprendre ce genre de bloc prêt à l'emploi."
                    wrongFeedback="Le bloc naturel : « I'm trying to… ». Tu vas l'ancrer très vite."
                    continueLabel="Voir ma routine"
                    onDone={(correct) => {
                      setResults((r) => ({ ...r, phrase: correct }));
                      next();
                    }}
                  />
                </div>
              )}

              {/* 6 · Routine */}
              {step === 5 && (
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {routines.map((option, i) => (
                    <motion.button
                      key={option.minutes}
                      type="button"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + i * 0.06 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => pickMinutes(option.minutes)}
                      className={cn(
                        "flex cursor-pointer flex-col items-center gap-1 rounded-3xl border-2 bg-white py-6 shadow-soft transition-all",
                        minutes === option.minutes
                          ? "border-primary-500 bg-primary-50 shadow-[0_0_20px_-6px_rgba(88,92,226,0.5)]"
                          : "border-ink/8 hover:border-primary-300",
                      )}
                    >
                      <span className="text-3xl font-bold text-ink">
                        {option.minutes}
                        <span className="text-sm font-semibold text-ink-faint">
                          {" "}
                          min
                        </span>
                      </span>
                      <span
                        className={cn(
                          "text-xs font-bold",
                          minutes === option.minutes
                            ? "text-primary-600"
                            : "text-ink-faint",
                        )}
                      >
                        {option.hint}
                      </span>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* 7 · Diagnostic final */}
              {step === 6 && blocker && goal && minutes && (
                <OnboardingDiagnosticScreen
                  blocker={blocker}
                  goal={goal}
                  minutes={minutes}
                  results={results}
                  onStart={start}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
        )}
      </div>
    </MotionConfig>
  );
}
