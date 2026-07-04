"use client";

import { motion } from "framer-motion";
import { SearchCheck, Volume2 } from "lucide-react";
import type { Room } from "@/types/learning";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { speakText } from "@/lib/speech";

export function StepDecode({
  room,
  onNext,
}: {
  room: Room;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <Chip tone="primary" className="self-start">
        <SearchCheck className="size-3" /> Étape 4 · Decode
      </Chip>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink">
        Décodons phrase par phrase
      </h2>
      <p className="mt-1.5 text-ink-soft">
        Les blocs surlignés sont ceux que les natifs utilisent tout le temps.
        Retiens le bloc, pas la règle.
      </p>

      <div className="mt-6 space-y-4">
        {room.decodeNotes.map((note, i) => (
          <motion.div
            key={note.line}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + i * 0.08 }}
            className="card-soft p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-lg font-bold text-ink">
                &ldquo;{note.line}&rdquo;
              </p>
              <button
                onClick={() => speakText(note.line)}
                aria-label={`Écouter : ${note.line}`}
                className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full bg-primary-50 text-primary-600 transition-colors hover:bg-primary-100"
              >
                <Volume2 className="size-4" strokeWidth={2.2} />
              </button>
            </div>
            <p className="mt-1.5 text-[15px] text-ink-soft">
              {note.translation}
            </p>
            <p className="mt-3 text-sm text-ink-soft">{note.explanation}</p>
            <div className="mt-3">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary-50 to-primary-100 px-3 py-1.5 text-sm font-bold text-primary-700 ring-1 ring-primary-200">
                🧩 {note.chunk}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-auto pt-6">
        <Button size="lg" fullWidth onClick={onNext}>
          À toi de répéter
        </Button>
      </div>
    </div>
  );
}
