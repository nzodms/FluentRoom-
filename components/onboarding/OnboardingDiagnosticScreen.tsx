"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Sparkles, Target } from "lucide-react";
import type { OnboardingBlocker, OnboardingGoal } from "@/types/learning";
import { DEFAULT_AVATAR } from "@/data/avatar-items";
import { FluentCharacter } from "@/components/avatar/FluentCharacter";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import {
  LearningGlyph,
  type LearningIconName,
} from "@/components/icons/learning-icons";

export interface MiniTestResults {
  listen: boolean;
  reflex: boolean;
  phrase: boolean;
}

const PROFILES: Record<OnboardingBlocker, string> = {
  "fast-speech": "Fast Listener Starter",
  "blocked-reply": "Natural Responder Starter",
  translating: "Block Thinker Starter",
  vocab: "Phrase Collector Starter",
  shy: "Confident Speaker Starter",
};

const BLOCKER_LINES: Record<OnboardingBlocker, string> = {
  "fast-speech": "Tu comprends des mots, mais tu bloques sur le rythme réel.",
  "blocked-reply": "Tu comprends, mais la réponse reste coincée au moment de parler.",
  translating: "Tu traduis mot à mot — ça ralentit tout.",
  vocab: "Il te manque les blocs que les natifs utilisent vraiment.",
  shy: "Tout est là — il manque un espace sûr pour oser parler.",
};

const GOAL_LINES: Record<OnboardingGoal, string> = {
  videos: "comprendre des vidéos sans tout sous-titrer",
  natives: "parler avec des natifs sans stress",
  travel: "voyager plus facilement",
  speaking: "répondre sans paniquer",
  conversation: "tenir une conversation simple",
  accent: "parler avec un meilleur flow",
  basics: "reconstruire des bases utiles",
};

const PLAN: Array<{ icon: LearningIconName; text: string }> = [
  { icon: "listen", text: "Écouter des phrases réelles, à vitesse réelle" },
  { icon: "lesson", text: "Apprendre des blocs naturels prêts à l'emploi" },
  { icon: "speak", text: "Répondre sans traduire dans ta tête" },
  { icon: "review", text: "Réviser pour rendre tout ça automatique" },
];

interface SkillCard {
  icon: LearningIconName;
  label: string;
  value: number;
}

/**
 * Diagnostic final animé : le personnage analyse, les compétences
 * s'affichent en cascade, le ring se remplit, puis le plan est révélé.
 */
export function OnboardingDiagnosticScreen({
  blocker,
  goal,
  minutes,
  results,
  onStart,
}: {
  blocker: OnboardingBlocker;
  goal: OnboardingGoal;
  minutes: number;
  results: MiniTestResults;
  onStart: () => void;
}) {
  const [phase, setPhase] = useState<"analyzing" | "result">("analyzing");
  const score = Number(results.listen) + Number(results.reflex) + Number(results.phrase);

  const skills: SkillCard[] = [
    { icon: "listen", label: "Oreille", value: results.listen ? 62 : 38 },
    { icon: "speak", label: "Oral", value: 28 + score * 6 },
    { icon: "reflex", label: "Réflexes", value: results.reflex ? 58 : 34 },
    { icon: "phrase", label: "Vocabulaire naturel", value: results.phrase ? 55 : 32 },
  ];

  useEffect(() => {
    const t = setTimeout(() => setPhase("result"), 3400);
    return () => clearTimeout(t);
  }, []);

  if (phase === "analyzing") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="relative">
          <ProgressRingPulse />
          <FluentCharacter
            config={DEFAULT_AVATAR}
            size={110}
            expression="focused"
            showBackground={false}
          />
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-lg font-bold text-ink"
        >
          Analyse de ton profil…
        </motion.p>
        <div className="mt-1.5 h-1.5 w-44 overflow-hidden rounded-full bg-ink/8">
          <motion.div
            className="h-full rounded-full gradient-primary"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3.1, ease: "easeInOut" }}
          />
        </div>

        <div className="mt-6 grid w-full max-w-xs grid-cols-2 gap-2.5">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.label}
              initial={{ opacity: 0, y: 14, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.55, type: "spring", stiffness: 300, damping: 22 }}
              className="card-soft p-3"
            >
              <div className="flex items-center gap-2">
                <span className="grid size-7 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary-600">
                  <LearningGlyph name={skill.icon} className="size-3.5" />
                </span>
                <p className="truncate text-xs font-bold text-ink">{skill.label}</p>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/8">
                <motion.div
                  className="h-full rounded-full gradient-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: `${skill.value}%` }}
                  transition={{ delay: 0.7 + i * 0.55, duration: 0.7 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-1 flex-col"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.7, y: 10 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="relative mx-auto inline-block"
        >
          <span
            aria-hidden
            className="absolute inset-0 -z-10 rounded-full bg-primary-400/20 blur-2xl"
          />
          <FluentCharacter
            config={DEFAULT_AVATAR}
            size={96}
            expression="proud"
            showBackground={false}
          />
        </motion.div>
        <Chip tone="primary" className="mt-2">
          <Sparkles className="size-3" /> Ton plan est prêt
        </Chip>
        <h1 className="mt-2.5 text-[26px] font-bold leading-tight tracking-tight text-ink">
          Ton profil :{" "}
          <span className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
            {PROFILES[blocker]}
          </span>
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-soft mt-4 space-y-3 p-4"
      >
        <div className="flex items-start gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-coral-50 text-coral-500">
            <Target className="size-4" strokeWidth={2.2} />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wide text-coral-600">
              Ton blocage principal
            </p>
            <p className="mt-0.5 text-sm text-ink-soft">{BLOCKER_LINES[blocker]}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-mint-50 text-mint-600">
            <LearningGlyph name="fluency" className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wide text-mint-600">
              Ton point fort
            </p>
            <p className="mt-0.5 text-sm text-ink-soft">
              {score >= 1
                ? "Tu reconnais déjà des phrases naturelles — une vraie base."
                : "Tu démarres motivé, et c'est le facteur n°1 de progression."}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary-600">
            <LearningGlyph name="quest" className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wide text-primary-600">
              Objectif
            </p>
            <p className="mt-0.5 text-sm text-ink-soft">
              {GOAL_LINES[goal].charAt(0).toUpperCase() + GOAL_LINES[goal].slice(1)},
              en {minutes} min par jour.
            </p>
          </div>
        </div>
      </motion.div>

      <p className="mt-4 text-sm font-bold text-ink">Ton plan :</p>
      <div className="mt-2 space-y-2">
        {PLAN.map((item, i) => (
          <motion.div
            key={item.text}
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 + i * 0.12 }}
            className="card-soft flex items-center gap-3 px-4 py-2.5"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary-600">
              <LearningGlyph name={item.icon} className="size-4" />
            </span>
            <p className="text-sm font-semibold text-ink">{item.text}</p>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.12, type: "spring", stiffness: 400, damping: 18 }}
              className="ml-auto grid size-5 place-items-center rounded-full bg-mint-50 text-mint-600"
            >
              <Check className="size-3" strokeWidth={3.5} />
            </motion.span>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85 }}
        className="mt-3 rounded-2xl bg-gold-50 p-3.5 text-sm"
      >
        <p className="font-bold text-gold-500">Objectif 7 jours</p>
        <p className="mt-0.5 text-ink-soft">
          Comprendre et utiliser <span className="font-bold text-ink">25 phrases réelles</span>.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-auto pt-5"
      >
        <div className="relative">
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full bg-primary-400/35 blur-lg"
            animate={{ opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 2.2, repeat: Infinity }}
          />
          <Button size="lg" fullWidth onClick={onStart} className="relative">
            Commencer ma première mission <ArrowRight className="size-4" />
          </Button>
        </div>
        <p className="mt-2.5 text-center text-xs text-ink-faint">
          Ton anglais va devenir plus automatique, session après session.
        </p>
      </motion.div>
    </motion.div>
  );
}

/** Anneau qui se remplit autour du personnage pendant l'analyse. */
function ProgressRingPulse() {
  const r = 64;
  const circ = 2 * Math.PI * r;
  return (
    <span aria-hidden className="absolute -inset-4 grid place-items-center">
      <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(23,26,38,0.06)" strokeWidth="5" />
        <motion.circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke="var(--color-primary-500)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 3.1, ease: "easeInOut" }}
        />
      </svg>
    </span>
  );
}
