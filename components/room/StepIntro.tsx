"use client";

import { motion } from "framer-motion";
import { Clock, Play } from "lucide-react";
import type { Room } from "@/types/learning";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { LearningScreen } from "@/components/session/LearningScreen";
import { LearningIcon } from "@/components/icons/learning-icons";

/** Mission intro : ce que tu vas savoir faire dans 8 minutes. */
export function StepIntro({ room, onNext }: { room: Room; onNext: () => void }) {
  return (
    <LearningScreen
      centered
      title=""
      action={
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button size="lg" fullWidth onClick={onNext}>
            <Play className="size-4 fill-current" /> Lancer la mission
          </Button>
        </motion.div>
      }
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="relative overflow-hidden rounded-[1.75rem] gradient-primary p-6 text-white shadow-lift"
      >
        <span className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-white/10" />
        <div className="flex items-center justify-between">
          <Chip className="bg-white/15 text-white">
            {room.levelLabel} · {room.accent}
          </Chip>
          <span className="inline-flex items-center gap-1 text-xs font-semibold opacity-85">
            <Clock className="size-3.5" /> {room.duration} min
          </span>
        </div>
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 15 }}
          className="mt-3 block text-4xl"
        >
          {room.emoji}
        </motion.span>
        <h2 className="mt-2 text-2xl font-bold tracking-tight">{room.title}</h2>
        <p className="mt-1 text-sm opacity-90">{room.subtitle}</p>
        <p className="mt-3 text-xs font-semibold uppercase tracking-widest opacity-75">
          Ta mission
        </p>
        <p className="mt-0.5 text-sm opacity-90">{room.goal}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="card-soft mt-3 flex items-center gap-3 p-4"
      >
        <LearningIcon name="phrase" variant="reward" size="md" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-ink">
            Butin : {room.phrases.length} phrases réelles
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {room.phrases.slice(0, 3).map((phrase, i) => (
              <motion.span
                key={phrase.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.09, type: "spring", stiffness: 350, damping: 20 }}
                className="rounded-lg bg-primary-50 px-2 py-0.5 text-xs font-bold text-primary-700"
              >
                {phrase.english}
              </motion.span>
            ))}
            {room.phrases.length > 3 && (
              <span className="rounded-lg bg-ink/5 px-2 py-0.5 text-xs font-bold text-ink-faint">
                +{room.phrases.length - 3}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </LearningScreen>
  );
}
