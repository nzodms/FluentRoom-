"use client";

import { useEffect, useState } from "react";
import type { Lesson } from "@/types/learning";
import { useProgress } from "@/lib/useProgress";
import { Chip } from "@/components/ui/Chip";
import { SessionShell } from "@/components/session/SessionShell";
import {
  LessonOutcome,
  StepBuild,
  StepExamples,
  StepHook,
  StepPattern,
  StepQuiz,
  StepSay,
  StepTrap,
  StepUnlock,
  StepUse,
} from "./lesson-steps";
import {
  StepTimelineHook,
  StepTimelineJourney,
  StepTimelineRecap,
} from "./TimelineLessonTemplate";
import {
  StepChatExamples,
  StepChatFinal,
  StepChatIntro,
  StepChatQuiz,
  StepChatTrap,
} from "./ChatLessonTemplate";
import {
  StepReflexFlash,
  StepReflexHook,
  StepReflexRounds,
} from "./ReflexLessonTemplate";

/**
 * Chaque leçon a son template : la mécanique, le rythme et le défi
 * final changent — deux leçons consécutives ne se ressemblent pas.
 *
 * - pattern  : bloc + variations, cartes à retourner, situation finale.
 * - timeline : un voyage d'arrêt en arrêt, défi final à l'oral.
 * - chat     : toute la leçon en conversation avec Alex.
 * - reflex   : flash d'exemples puis rounds chronométrés.
 */

const STEP_LABELS: Record<Lesson["template"], string[]> = {
  pattern: ["Hook", "Pattern", "Examples", "Trap", "Check", "Build", "Say", "Use"],
  timeline: ["Hook", "Voyage", "Piège", "Check", "Recap", "Build", "Say"],
  chat: ["Intro", "Messages", "Piège", "Quiz", "Réponds"],
  reflex: ["Hook", "Flash", "Chrono", "Build", "Say"],
};

export function LessonFlow({ lesson }: { lesson: Lesson }) {
  const { beginLesson, finishLesson } = useProgress();
  const [step, setStep] = useState(0);
  const [outcome, setOutcome] = useState<LessonOutcome | null>(null);
  const [reflexScore, setReflexScore] = useState<{
    correct: number;
    total: number;
  } | null>(null);

  useEffect(() => {
    beginLesson(lesson.id);
  }, [beginLesson, lesson.id]);

  const labels = STEP_LABELS[lesson.template] ?? STEP_LABELS.pattern;
  const totalSteps = labels.length + 1; // + Unlock

  const next = () => setStep((s) => s + 1);

  const complete = () => {
    const result = finishLesson(lesson.id);
    setOutcome({ xpEarned: result.xpEarned, newBadges: result.newBadges });
    next();
  };

  const finished = step >= totalSteps - 1 && outcome !== null;

  return (
    <SessionShell
      title={`${lesson.emoji} ${lesson.structure}`}
      closeHref="/app/today"
      stepLabels={labels}
      currentStep={step}
      stepKey={step}
    >
      {finished ? (
        <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar">
          <StepUnlock
            lesson={lesson}
            outcome={outcome}
            extra={
              reflexScore ? (
                <Chip tone="coral">
                  ⚡ {reflexScore.correct}/{reflexScore.total} réflexes
                </Chip>
              ) : undefined
            }
          />
        </div>
      ) : lesson.template === "timeline" ? (
        <>
          {step === 0 && <StepTimelineHook lesson={lesson} onNext={next} />}
          {step === 1 && <StepTimelineJourney lesson={lesson} onNext={next} />}
          {step === 2 && <StepTrap lesson={lesson} onNext={next} />}
          {step === 3 && <StepQuiz lesson={lesson} onNext={next} />}
          {step === 4 && <StepTimelineRecap lesson={lesson} onNext={next} />}
          {step === 5 && <StepBuild lesson={lesson} onNext={next} />}
          {step === 6 && (
            <StepSay
              lesson={lesson}
              onNext={complete}
              continueLabel="Mark as learned"
            />
          )}
        </>
      ) : lesson.template === "chat" ? (
        <>
          {step === 0 && <StepChatIntro lesson={lesson} onNext={next} />}
          {step === 1 && <StepChatExamples lesson={lesson} onNext={next} />}
          {step === 2 && <StepChatTrap lesson={lesson} onNext={next} />}
          {step === 3 && <StepChatQuiz lesson={lesson} onNext={next} />}
          {step === 4 && <StepChatFinal lesson={lesson} onNext={complete} />}
        </>
      ) : lesson.template === "reflex" ? (
        <>
          {step === 0 && <StepReflexHook lesson={lesson} onNext={next} />}
          {step === 1 && <StepReflexFlash lesson={lesson} onNext={next} />}
          {step === 2 && (
            <StepReflexRounds
              lesson={lesson}
              onDone={(score) => {
                setReflexScore(score);
                next();
              }}
            />
          )}
          {step === 3 && <StepBuild lesson={lesson} onNext={next} />}
          {step === 4 && (
            <StepSay
              lesson={lesson}
              onNext={complete}
              continueLabel="Mark as learned"
            />
          )}
        </>
      ) : (
        <>
          {step === 0 && <StepHook lesson={lesson} onNext={next} />}
          {step === 1 && <StepPattern lesson={lesson} onNext={next} />}
          {step === 2 && <StepExamples lesson={lesson} onNext={next} />}
          {step === 3 && <StepTrap lesson={lesson} onNext={next} />}
          {step === 4 && <StepQuiz lesson={lesson} onNext={next} />}
          {step === 5 && <StepBuild lesson={lesson} onNext={next} />}
          {step === 6 && <StepSay lesson={lesson} onNext={next} />}
          {step === 7 && <StepUse lesson={lesson} onNext={complete} />}
        </>
      )}
    </SessionShell>
  );
}
