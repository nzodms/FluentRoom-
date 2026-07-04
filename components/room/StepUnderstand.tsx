"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lightbulb, MessageCircleQuestion } from "lucide-react";
import type { Room } from "@/types/learning";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { saveJSON } from "@/lib/storage";
import { cn } from "@/lib/utils";

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

  return (
    <div className="flex flex-1 flex-col">
      <Chip tone="primary" className="self-start">
        <MessageCircleQuestion className="size-3" /> Étape 2 · Compréhension
      </Chip>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink">
        Qu&apos;est-ce que tu as compris ?
      </h2>
      <p className="mt-1.5 text-ink-soft">
        Écris en français ou en anglais. Même approximatif — c&apos;est
        l&apos;idée qui compte.
      </p>

      {!revealed ? (
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ex : quelqu'un est en retard et son ami…"
            rows={3}
            className="card-soft mt-5 w-full resize-none p-4 text-[15px] text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-primary-400"
          />

          <p className="mt-5 text-sm font-semibold text-ink-soft">
            Ou choisis l&apos;idée la plus proche :
          </p>
          <div className="mt-2.5 space-y-2.5">
            {room.quickChoices.map((choice, i) => (
              <motion.button
                key={choice}
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

          <div className="mt-auto pt-6">
            <Button size="lg" fullWidth disabled={!hasAnswer} onClick={submit}>
              Vérifier mon idée
            </Button>
          </div>
        </>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-1 flex-col"
          >
            <div className="card-soft mt-5 p-5">
              <p className="flex items-center gap-2 text-sm font-bold text-ink">
                <Lightbulb className="size-4 text-gold-500" />
                Les idées clés de la scène
              </p>
              <ul className="mt-3 space-y-2.5">
                {room.expectedIdeas.map((idea, i) => (
                  <motion.li
                    key={idea}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.12 }}
                    className="flex items-start gap-2.5 text-[15px] text-ink-soft"
                  >
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary-500" />
                    {idea}
                  </motion.li>
                ))}
              </ul>
            </div>
            <div className="mt-4 rounded-2xl bg-mint-50 p-4 text-sm text-mint-600">
              ✅ Si tu avais attrapé au moins une de ces idées :{" "}
              <span className="font-bold">you understood the main idea.</span>{" "}
              C&apos;est exactement comme ça qu&apos;on progresse.
            </div>
            <div className="mt-auto pt-6">
              <Button size="lg" fullWidth onClick={onNext}>
                Continuer
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
