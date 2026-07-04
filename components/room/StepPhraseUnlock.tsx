"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Unlock, Volume2 } from "lucide-react";
import type { Phrase, Room } from "@/types/learning";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { speakText } from "@/lib/speech";

/** Carte de phrase qui se retourne : anglais → sens + contexte. */
function FlipCard({ phrase, delay }: { phrase: Phrase; delay: number }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 300, damping: 22 }}
      style={{ perspective: 1000 }}
    >
      <motion.button
        onClick={() => setFlipped((v) => !v)}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.35, 0, 0.25, 1] }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative block h-[104px] w-full cursor-pointer"
      >
        {/* Face avant : la phrase */}
        <div
          style={{ backfaceVisibility: "hidden" }}
          className="card-tint-primary absolute inset-0 flex items-center gap-3 p-4"
        >
          <span
            onClick={(e) => {
              e.stopPropagation();
              speakText(phrase.english);
            }}
            role="button"
            aria-label={`Écouter : ${phrase.english}`}
            className="grid size-10 shrink-0 place-items-center rounded-2xl gradient-primary text-white shadow-glow"
          >
            <Volume2 className="size-4" strokeWidth={2.2} />
          </span>
          <div className="min-w-0 flex-1 text-left">
            <p className="font-bold text-ink">{phrase.english}</p>
            <p className="text-xs text-ink-faint">
              Touche pour retourner la carte
            </p>
          </div>
          <Chip tone="coral" className="shrink-0">
            New
          </Chip>
        </div>
        {/* Face arrière : le sens */}
        <div
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          className="absolute inset-0 flex flex-col justify-center rounded-3xl gradient-primary p-4 text-left text-white shadow-lift"
        >
          <p className="font-bold">{phrase.french}</p>
          <p className="mt-1 line-clamp-2 text-xs opacity-85">
            {phrase.context}
          </p>
        </div>
      </motion.button>
    </motion.div>
  );
}

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
        Elles rejoignent ta collection.{" "}
        <span className="font-semibold text-ink">
          Les natifs les utilisent tous les jours.
        </span>
      </p>

      <div className="mt-5 space-y-3">
        {room.phrases.map((phrase, i) => (
          <FlipCard key={phrase.id} phrase={phrase} delay={0.15 + i * 0.13} />
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
