"use client";

import { useMemo } from "react";
import type { Room } from "@/types/learning";
import { Chip } from "@/components/ui/Chip";
import { QuizScreen } from "@/components/session/QuizScreen";
import { LearningGlyph } from "@/components/icons/learning-icons";

/** Mélange déterministe (la 1re proposition seed est la bonne). */
function shuffledChoices(choices: string[]): { list: string[]; correct: number } {
  const indexed = choices.map((text, i) => ({ text, i }));
  indexed.sort(
    (a, b) =>
      ((a.text.length * 13 + a.i * 7) % 5) -
      ((b.text.length * 13 + b.i * 7) % 5),
  );
  return {
    list: indexed.map((c) => c.text),
    correct: indexed.findIndex((c) => c.i === 0),
  };
}

/** Recap challenge : verrouille l'idée principale avant de débloquer. */
export function StepRecap({
  room,
  onNext,
}: {
  room: Room;
  onNext: (correct: boolean) => void;
}) {
  const { list, correct } = useMemo(
    () => shuffledChoices(room.quickChoices),
    [room.quickChoices],
  );

  return (
    <QuizScreen
      label={
        <Chip tone="primary">
          <LearningGlyph name="review" className="size-3" /> Recap challenge
        </Chip>
      }
      question="Alors, cette scène racontait quoi ?"
      subtitle="Résumer, c'est prouver que tu as compris — pas juste entendu."
      choices={list}
      correctIndex={correct}
      explanation={`L'essentiel : ${room.expectedIdeas[0]}`}
      continueLabel="Débloquer mes phrases"
      onContinue={onNext}
    />
  );
}
