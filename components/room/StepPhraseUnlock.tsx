"use client";

import { motion } from "framer-motion";
import { Unlock, Volume2 } from "lucide-react";
import type { Room } from "@/types/learning";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { speakText } from "@/lib/speech";

export function StepPhraseUnlock({
  room,
  onNext,
}: {
  room: Room;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <Chip tone="mint" className="self-start">
        <Unlock className="size-3" /> Étape 7 · Phrase Unlock
      </Chip>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink">
        {room.phrases.length} phrases réelles débloquées
      </h2>
      <p className="mt-1.5 text-ink-soft">
        Elles rejoignent ta Phrase Bank.{" "}
        <span className="font-semibold text-ink">
          These phrases are used all the time.
        </span>
      </p>

      <div className="mt-6 space-y-3">
        {room.phrases.map((phrase, i) => (
          <motion.div
            key={phrase.id}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: 0.15 + i * 0.13,
              type: "spring",
              stiffness: 300,
              damping: 24,
            }}
            className="card-soft flex items-center gap-3 p-4"
          >
            <button
              onClick={() => speakText(phrase.english)}
              aria-label={`Écouter : ${phrase.english}`}
              className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-2xl bg-primary-50 text-primary-600 transition-colors hover:bg-primary-100"
            >
              <Volume2 className="size-4" strokeWidth={2.2} />
            </button>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-ink">{phrase.english}</p>
              <p className="truncate text-sm text-ink-soft">{phrase.french}</p>
            </div>
            <Chip tone="coral" className="shrink-0">
              New
            </Chip>
          </motion.div>
        ))}
      </div>

      <div className="mt-auto pt-6">
        <Button size="lg" fullWidth onClick={onNext}>
          Terminer la room 🎉
        </Button>
      </div>
    </div>
  );
}
