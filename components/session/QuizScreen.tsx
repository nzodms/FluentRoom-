"use client";

import { useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import {
  AnswerChoiceCard,
  type ChoiceVisualState,
} from "@/components/exercises/AnswerChoiceCard";
import { QuizFeedbackPanel } from "@/components/exercises/QuizFeedbackPanel";
import {
  EXERCISE_THEMES,
  type ExerciseTheme,
} from "@/components/exercises/exercise-themes";
import { LearningGlyph } from "@/components/icons/learning-icons";
import { useProgress } from "@/lib/useProgress";
import { LearningScreen } from "./LearningScreen";

export interface QuizScreenProps {
  label?: React.ReactNode;
  question: string;
  subtitle?: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  /** Sous-textes pédagogiques révélés par choix après la réponse. */
  choiceNotes?: string[];
  /** Thème visuel de l'exercice (accent, icône, halo). */
  theme?: ExerciseTheme;
  /** Contenu optionnel au-dessus des choix (audio, phrase…). */
  media?: React.ReactNode;
  submitLabel?: string;
  continueLabel: string;
  onContinue: (wasCorrect: boolean) => void;
}

/** Machine d'état du QCM : aucun double-submit, aucun état mélangé. */
type QuizPhase = "idle" | "selected" | "submitted" | "continuing";

/**
 * QCM plein écran premium : choix en cascade, états visuels forts,
 * feedback pédagogique avec le personnage, CTA toujours visible.
 */
export function QuizScreen({
  label,
  question,
  subtitle,
  choices,
  correctIndex,
  explanation,
  choiceNotes,
  theme = "pattern",
  media,
  submitLabel = "Valider",
  continueLabel,
  onContinue,
}: QuizScreenProps) {
  const { progress } = useProgress();
  const [phase, setPhase] = useState<QuizPhase>("idle");
  const [selected, setSelected] = useState<number | null>(null);
  const continued = useRef(false);

  const themeConfig = EXERCISE_THEMES[theme];
  const answered = phase === "submitted" || phase === "continuing";
  const isCorrect = selected === correctIndex;

  const select = (i: number) => {
    if (answered) return;
    setSelected(i);
    setPhase("selected");
  };

  const submit = () => {
    if (phase !== "selected" || selected === null) return;
    setPhase("submitted");
  };

  const handleContinue = () => {
    if (phase !== "submitted" || continued.current) return;
    continued.current = true;
    setPhase("continuing");
    onContinue(isCorrect);
  };

  const choiceState = (i: number): ChoiceVisualState => {
    if (!answered) return selected === i ? "selected" : "default";
    if (i === correctIndex) return selected === i ? "correct" : "revealedCorrect";
    if (selected === i) return "wrong";
    return "dimmed";
  };

  return (
    <LearningScreen
      label={
        label ?? (
          <Chip tone={themeConfig.chipTone}>
            <LearningGlyph name={themeConfig.icon} className="size-3" /> Check
          </Chip>
        )
      }
      title={question}
      subtitle={subtitle}
      action={
        !answered ? (
          <Button
            size="lg"
            fullWidth
            disabled={phase !== "selected"}
            onClick={submit}
            className={phase === "selected" ? "shadow-glow" : undefined}
          >
            {submitLabel}
          </Button>
        ) : (
          <Button
            size="lg"
            fullWidth
            variant={isCorrect ? "mint" : "primary"}
            disabled={phase === "continuing"}
            onClick={handleContinue}
          >
            {isCorrect ? continueLabel : "J'ai compris"}
          </Button>
        )
      }
    >
      <div className="relative">
        {/* Halo thématique très subtil */}
        <span
          aria-hidden
          className="pointer-events-none absolute -right-6 -top-8 size-44 rounded-full blur-3xl"
          style={{ background: themeConfig.halo }}
        />
        {media && <div className="relative mb-3">{media}</div>}
        <div className="relative space-y-2.5">
          {choices.map((choice, i) => (
            <AnswerChoiceCard
              key={choice}
              text={choice}
              subLabel={answered ? choiceNotes?.[i] : undefined}
              state={choiceState(i)}
              locked={answered}
              onSelect={() => select(i)}
              index={i}
            />
          ))}
        </div>

        <AnimatePresence>
          {answered && (
            <QuizFeedbackPanel
              correct={isCorrect}
              explanation={explanation}
              correctAnswer={!isCorrect ? choices[correctIndex] : undefined}
              avatar={progress.avatar}
            />
          )}
        </AnimatePresence>
      </div>
    </LearningScreen>
  );
}
