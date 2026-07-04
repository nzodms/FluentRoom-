"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Flame, Sparkles } from "lucide-react";
import type { Room } from "@/types/learning";
import { getBadgeById } from "@/data/badges";
import { Button } from "@/components/ui/Button";
import { Confetti } from "@/components/ui/Confetti";
import { formatDuration } from "@/lib/utils";

interface StepCompletedProps {
  room: Room;
  comprehension: number;
  speaking: number;
  timeSpentSec: number;
  xpEarned: number;
  streak: number;
  newBadges: string[];
}

export function StepCompleted({
  room,
  comprehension,
  speaking,
  timeSpentSec,
  xpEarned,
  streak,
  newBadges,
}: StepCompletedProps) {
  return (
    <div className="relative flex flex-1 flex-col">
      <Confetti />

      <div className="flex flex-1 flex-col items-center justify-center pt-4 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
          className="grid size-24 place-items-center rounded-[2rem] gradient-mint text-white shadow-[0_16px_40px_-10px_rgba(44,183,131,0.5)]"
        >
          <Check className="size-12" strokeWidth={3} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-6 text-3xl font-bold tracking-tight text-ink"
        >
          Room Completed
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-1.5 text-ink-soft"
        >
          {room.emoji} {room.title} — terminée.{" "}
          <span className="font-semibold text-ink">You&apos;re building reflexes.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-7 grid w-full grid-cols-2 gap-3"
        >
          <StatBox
            value={`${comprehension}%`}
            label="Compréhension"
            emoji="🎧"
          />
          <StatBox value={`${speaking}%`} label="Oral" emoji="🎙️" />
          <StatBox
            value={`+${room.phrases.length}`}
            label="Phrases débloquées"
            emoji="💎"
          />
          <StatBox
            value={formatDuration(timeSpentSec)}
            label="Temps passé"
            emoji="⏱️"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-4 flex w-full items-center justify-between rounded-3xl gradient-primary p-4 text-white shadow-lift"
        >
          <div className="flex items-center gap-2.5">
            <Flame className="size-6" fill="currentColor" />
            <div className="text-left">
              <p className="text-lg font-bold leading-tight">
                {streak} jour{streak > 1 ? "s" : ""} de suite
              </p>
              <p className="text-xs opacity-85">Streak mis à jour</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold leading-tight">+{xpEarned} FP</p>
            <p className="text-xs opacity-85">Fluency Points</p>
          </div>
        </motion.div>

        {newBadges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.85, type: "spring", stiffness: 260, damping: 20 }}
            className="mt-4 w-full space-y-2"
          >
            {newBadges.map((id) => {
              const badge = getBadgeById(id);
              if (!badge) return null;
              return (
                <div
                  key={id}
                  className="flex items-center gap-3 rounded-2xl bg-gold-50 p-3.5 ring-1 ring-gold-400/30"
                >
                  <span className="text-2xl">{badge.emoji}</span>
                  <div className="text-left">
                    <p className="text-sm font-bold text-ink">
                      Badge débloqué : {badge.name}
                    </p>
                    <p className="text-xs text-ink-soft">{badge.description}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.95 }}
          className="mt-4 flex items-center gap-1.5 text-sm text-ink-faint"
        >
          <Sparkles className="size-3.5" />
          Prochaine révision de ces phrases : demain
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-8 space-y-2.5"
      >
        <Link href="/app/today" className="block">
          <Button size="lg" fullWidth>
            Continue
          </Button>
        </Link>
        <Link href="/app/phrases" className="block">
          <Button variant="secondary" size="lg" fullWidth>
            Review phrases
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}

function StatBox({
  value,
  label,
  emoji,
}: {
  value: string;
  label: string;
  emoji: string;
}) {
  return (
    <div className="card-soft p-4">
      <span className="text-xl">{emoji}</span>
      <p className="mt-1.5 text-2xl font-bold tracking-tight text-ink">
        {value}
      </p>
      <p className="text-xs font-medium text-ink-faint">{label}</p>
    </div>
  );
}
