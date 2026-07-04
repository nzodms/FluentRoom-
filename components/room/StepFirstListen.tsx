"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Room } from "@/types/learning";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { LearningScreen } from "@/components/session/LearningScreen";
import { LearningGlyph } from "@/components/icons/learning-icons";
import { DialoguePlayer } from "./DialoguePlayer";

export function StepFirstListen({
  room,
  onNext,
  onTranscriptShown,
}: {
  room: Room;
  onNext: () => void;
  onTranscriptShown?: () => void;
}) {
  const [listened, setListened] = useState(false);

  return (
    <LearningScreen
      label={
        <Chip tone="primary">
          <LearningGlyph name="listen" className="size-3" /> First Listen
        </Chip>
      }
      title="Écoute la scène"
      subtitle={
        <>
          Attrape l&apos;idée, pas chaque mot.{" "}
          <span className="font-semibold text-ink">
            Sans transcript si tu peux.
          </span>
        </>
      }
      action={
        <Button size="lg" fullWidth onClick={onNext}>
          {listened ? "I listened ✓" : "I listened"}
        </Button>
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <DialoguePlayer
          dialogue={room.dialogue}
          onListened={() => setListened(true)}
          onTranscriptShown={onTranscriptShown}
        />
      </motion.div>

      <div className="mt-3 rounded-2xl bg-primary-50 p-3.5 text-sm text-primary-700">
        💡 Réécoute autant que tu veux — les natifs, eux, ne ralentiront pas.
      </div>
    </LearningScreen>
  );
}
