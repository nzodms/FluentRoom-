"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { useProgress } from "@/lib/useProgress";
import { companionLook } from "@/lib/companion";
import { getCompanion } from "@/data/companions";
import { getLevelForXp } from "@/data/levels";
import { CompanionCharacter } from "@/components/companion/CompanionCharacter";
import { OnboardingMiniTest } from "@/components/onboarding/OnboardingMiniTest";
import { OnboardingAudioCard } from "@/components/onboarding/OnboardingAudioCard";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/utils";

/**
 * Calibrage du plan : les mini-tests, réintégrés naturellement
 * après la première leçon. Optionnel, court, récompensé —
 * une amélioration du plan, pas un test scolaire.
 */

const TESTS = [
  {
    id: "listen",
    label: "Écoute",
    intro: "Tu vas entendre une phrase très courante. Attrape l'idée, pas chaque mot.",
    audio: "I'm running a bit late.",
    options: ["Il est un peu en retard", "Il annule", "Il demande de l'aide"],
    correctIndex: 0,
    correctFeedback: "Exact. Tu as attrapé l'idée principale.",
    wrongFeedback: "Pas grave. Le bloc important : « running late » = être en retard.",
  },
  {
    id: "reflex",
    label: "Réflexe",
    intro: "On te dit « Thank you so much! ». Quelle réponse est la plus naturelle ?",
    audio: null,
    options: ["No worries!", "I am happy.", "Nothing problem."],
    correctIndex: 0,
    correctFeedback: "Oui. « No worries » — la réponse naturelle des natifs.",
    wrongFeedback: "Un natif dirait « No worries » — simple et direct.",
  },
  {
    id: "phrase",
    label: "Bloc",
    intro: "Dernière question : comment dirais-tu « J'essaie de comprendre » ?",
    audio: null,
    options: ["I try understand.", "I'm trying to understand.", "I'm trying understand."],
    correctIndex: 1,
    correctFeedback: "Oui. Ce genre de bloc prêt à l'emploi, c'est exactement ton plan.",
    wrongFeedback: "Le bloc naturel : « I'm trying to… ». Il va s'ancrer vite.",
  },
];

export default function CalibratePage() {
  const router = useRouter();
  const { progress, ready, calibrate } = useProgress();
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState<{ xpEarned: number; total: number } | null>(
    null,
  );

  const companion = getCompanion(progress.companion);
  const look = companionLook(progress);
  const test = TESTS[index];

  const finishTest = (correct: boolean) => {
    const total = correctCount + (correct ? 1 : 0);
    if (index < TESTS.length - 1) {
      setCorrectCount(total);
      setIndex(index + 1);
    } else {
      const outcome = calibrate(total);
      setDone({ xpEarned: outcome.xpEarned, total });
    }
  };

  if (!ready) return <div aria-hidden className="min-h-[60vh]" />;

  if (done) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <motion.div
          initial={{ scale: 0.6 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
        >
          <CompanionCharacter
            companionId={progress.companion}
            size={120}
            expression="celebrating"
            accessories={look.accessories}
          />
        </motion.div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-ink">
          Plan calibré
        </h1>
        <p className="mx-auto mt-2 max-w-xs text-sm text-ink-soft">
          {companion.name} a ajusté ton parcours. Ton niveau estimé :{" "}
          <span className="font-bold text-ink">
            {getLevelForXp(progress.xp).name}
          </span>
          , adapté à tes réponses.
        </p>
        <div className="mt-4 flex gap-2">
          <Chip tone="primary">+{done.xpEarned} FP</Chip>
          <Chip tone="mint">
            <Check className="size-3" strokeWidth={3} /> {done.total}/{TESTS.length}{" "}
            réflexes
          </Chip>
        </div>
        <Button
          size="lg"
          className="mt-6 w-full max-w-xs"
          onClick={() => router.push("/app/today")}
        >
          Retour à mon espace
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link
          href="/app/today"
          aria-label="Retour"
          className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-ink-soft shadow-soft"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold tracking-tight text-ink">
            Calibre ton plan
          </h1>
          <p className="text-xs text-ink-soft">
            Ce n&apos;est pas une note — c&apos;est pour construire ton parcours.
          </p>
        </div>
        <span className="text-sm font-semibold text-ink-faint">
          {index + 1}/{TESTS.length}
        </span>
      </div>

      {/* Progress */}
      <div className="flex gap-1.5">
        {TESTS.map((t, i) => (
          <span
            key={t.id}
            className={cn(
              "h-1.5 flex-1 rounded-full",
              i < index ? "gradient-mint" : i === index ? "gradient-primary" : "bg-ink/8",
            )}
          />
        ))}
      </div>

      {/* Le compagnon introduit chaque question */}
      <div className="flex items-center gap-3 rounded-3xl bg-white p-3.5 shadow-soft">
        <CompanionCharacter
          companionId={progress.companion}
          size={48}
          expression="focused"
          accessories={look.accessories}
        />
        <p className="min-w-0 flex-1 text-sm font-semibold text-ink">
          {test.intro}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={test.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
        >
          <OnboardingMiniTest
            media={test.audio ? <OnboardingAudioCard text={test.audio} /> : undefined}
            options={test.options}
            correctIndex={test.correctIndex}
            correctFeedback={test.correctFeedback}
            wrongFeedback={test.wrongFeedback}
            continueLabel={index < TESTS.length - 1 ? "Question suivante" : "Terminer le calibrage"}
            onDone={finishTest}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
