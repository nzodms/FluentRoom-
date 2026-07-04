"use client";

import { useState } from "react";
import type { Room } from "@/types/learning";
import { Chip } from "@/components/ui/Chip";
import { QuizScreen } from "@/components/session/QuizScreen";
import { ListChecks } from "lucide-react";

/** Quick Check : une question par écran, feedback immédiat, zéro scroll. */
export function StepQuickCheck({
  room,
  onNext,
}: {
  room: Room;
  onNext: (scorePercent: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const question = room.questions[index];
  const isLast = index === room.questions.length - 1;

  const handleContinue = (wasCorrect: boolean) => {
    const total = correctCount + (wasCorrect ? 1 : 0);
    if (isLast) {
      onNext(Math.round((total / room.questions.length) * 100));
      return;
    }
    setCorrectCount(total);
    setIndex(index + 1);
  };

  return (
    <QuizScreen
      key={question.id}
      label={
        <Chip tone="primary">
          <ListChecks className="size-3" /> Question {index + 1} /{" "}
          {room.questions.length}
        </Chip>
      }
      question={question.question}
      choices={question.options}
      correctIndex={question.correctIndex}
      explanation={question.explanation}
      theme="listening"
      continueLabel={isLast ? "Voir le décodage" : "Question suivante"}
      onContinue={handleContinue}
    />
  );
}
