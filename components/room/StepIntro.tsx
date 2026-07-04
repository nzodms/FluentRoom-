"use client";

import { motion } from "framer-motion";
import { Clock, Play, Target } from "lucide-react";
import type { Room } from "@/types/learning";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";

/** Intro animée : ce que tu vas apprendre, avant de plonger dans la scène. */
export function StepIntro({ room, onNext }: { room: Room; onNext: () => void }) {
  return (
    <div className="flex flex-1 flex-col">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="mt-2 overflow-hidden rounded-[1.75rem] gradient-primary p-6 text-white shadow-lift"
      >
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
          className="mt-4 block text-4xl"
        >
          {room.emoji}
        </motion.span>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">{room.title}</h2>
        <p className="mt-1 text-[15px] opacity-90">{room.subtitle}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-soft mt-4 p-5"
      >
        <p className="flex items-center gap-2 text-sm font-bold text-ink">
          <Target className="size-4 text-coral-500" /> What you&apos;ll learn
        </p>
        <p className="mt-2 text-sm text-ink-soft">{room.goal}</p>
        <div className="mt-3.5 flex flex-wrap gap-2">
          {room.phrases.map((phrase, i) => (
            <motion.span
              key={phrase.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.35 + i * 0.09,
                type: "spring",
                stiffness: 350,
                damping: 20,
              }}
              className="rounded-xl bg-primary-50 px-3 py-1.5 text-sm font-bold text-primary-700 ring-1 ring-primary-100"
            >
              {phrase.english}
            </motion.span>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="mt-4 rounded-2xl bg-primary-50 p-4 text-sm text-primary-700"
      >
        🎧 Le cycle : écoute → comprends → décode → répète → réponds. À la fin,
        ces {room.phrases.length} phrases seront à toi.
      </motion.div>

      <div className="mt-auto pt-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <Button size="lg" fullWidth onClick={onNext}>
            <Play className="size-4 fill-current" /> C&apos;est parti
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
