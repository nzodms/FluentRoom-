"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Headphones } from "lucide-react";
import type { Room } from "@/types/learning";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { DialoguePlayer } from "./DialoguePlayer";

export function StepFirstListen({
  room,
  onNext,
}: {
  room: Room;
  onNext: () => void;
}) {
  const [listened, setListened] = useState(false);

  return (
    <div className="flex flex-1 flex-col">
      <Chip tone="primary" className="self-start">
        <Headphones className="size-3" /> Étape 1 · First Listen
      </Chip>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink">
        Écoute la scène
      </h2>
      <p className="mt-1.5 text-ink-soft">
        Ne cherche pas à tout comprendre.{" "}
        <span className="font-semibold text-ink">
          Don&apos;t translate. Catch the idea.
        </span>
      </p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-6"
      >
        <DialoguePlayer
          dialogue={room.dialogue}
          onListened={() => setListened(true)}
        />
      </motion.div>

      <div className="mt-4 rounded-2xl bg-primary-50 p-4 text-sm text-primary-700">
        💡 Écoute au moins une fois en entier. Tu peux réécouter autant que tu
        veux — les natifs ne ralentiront pas pour toi.
      </div>

      <div className="mt-auto pt-6">
        <Button size="lg" fullWidth onClick={onNext}>
          {listened ? "I listened ✓" : "I listened"}
        </Button>
      </div>
    </div>
  );
}
