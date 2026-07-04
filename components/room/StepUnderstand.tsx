"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lightbulb, MessageCircleQuestion } from "lucide-react";
import type { Room } from "@/types/learning";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { LearningScreen } from "@/components/session/LearningScreen";
import { saveJSON } from "@/lib/storage";
import { cn } from "@/lib/utils";

/** "What did you catch?" — choisir l'idée attrapée, en un écran. */
export function StepUnderstand({
  room,
  onNext,
}: {
  room: Room;
  onNext: () => void;
}) {
  const [text, setText] = useState("");
  const [quickChoice, setQuickChoice] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const hasAnswer = text.trim().length > 0 || quickChoice !== null;

  const submit = () => {
    saveJSON(`understanding:${room.id}`, {
      text: text.trim(),
      quickChoice,
      at: new Date().toISOString(),
    });
    setRevealed(true);
  };

  if (revealed) {
    return (
      <LearningScreen
        label={
          <Chip tone="mint">
            <Lightbulb className="size-3" /> Les idées clés
          </Chip>
        }
        title="Voilà ce qui se passait"
        action={
          <Button size="lg" fullWidth onClick={onNext}>
            Continuer
          </Button>
        }
      >
        <div className="space-y-2.5">
          {room.expectedIdeas.map((idea, i) => (
            <motion.div
              key={idea}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.12 }}
              className="card-soft flex items-start gap-2.5 p-3.5 text-[15px] text-ink"
            >
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary-500" />
              {idea}
            </motion.div>
          ))}
        </div>
        <div className="mt-3 rounded-2xl bg-mint-50 p-3.5 text-sm text-mint-600">
          ✅ Une seule idée attrapée ={" "}
          <span className="font-bold">tu as compris l&apos;essentiel.</span>{" "}
          C&apos;est exactement comme ça qu&apos;on progresse.
        </div>
      </LearningScreen>
    );
  }

  return (
    <LearningScreen
      label={
        <Chip tone="primary">
          <MessageCircleQuestion className="size-3" /> What did you catch?
        </Chip>
      }
      title="Qu'est-ce que tu as attrapé ?"
      subtitle="Choisis l'idée la plus proche — ou écris-la, même approximative."
      action={
        <Button size="lg" fullWidth disabled={!hasAnswer} onClick={submit}>
          Vérifier mon idée
        </Button>
      }
    >
      <div className="space-y-2.5">
        {room.quickChoices.map((choice, i) => (
          <motion.button
            key={choice}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.06 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setQuickChoice(quickChoice === i ? null : i)}
            className={cn(
              "card-soft w-full cursor-pointer px-4 py-3.5 text-left text-[15px] font-medium text-ink transition-all",
              quickChoice === i
                ? "ring-2 ring-primary-500 bg-primary-50"
                : "hover:ring-2 hover:ring-primary-200",
            )}
          >
            {choice}
          </motion.button>
        ))}
      </div>

      <div className="mt-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="…ou écris ce que tu as compris"
          className="card-soft w-full px-4 py-3 text-[15px] text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-primary-400"
        />
      </div>
    </LearningScreen>
  );
}
