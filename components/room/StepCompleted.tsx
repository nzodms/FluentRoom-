"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Flame, Sparkles } from "lucide-react";
import { AnimatedCheck } from "@/components/reward/AnimatedCheck";
import type { Room } from "@/types/learning";
import { getBadgeById } from "@/data/badges";
import { getLevelForXp, getNextLevel } from "@/data/levels";
import { getTodayRoom } from "@/data/rooms";
import { useProgress } from "@/lib/useProgress";
import { Button } from "@/components/ui/Button";
import { Confetti } from "@/components/ui/Confetti";
import { CountUp } from "@/components/ui/CountUp";
import { formatDuration } from "@/lib/utils";

interface StepCompletedProps {
  room: Room;
  comprehension: number;
  speaking: number;
  timeSpentSec: number;
  xpEarned: number;
  xpBefore: number;
  streak: number;
  newBadges: string[];
}

export function StepCompleted({
  room,
  comprehension,
  speaking,
  timeSpentSec,
  xpEarned,
  xpBefore,
  streak,
  newBadges,
}: StepCompletedProps) {
  const { progress } = useProgress();
  const xpAfter = xpBefore + xpEarned;
  const level = getLevelForXp(xpAfter);
  const nextLevel = getNextLevel(xpAfter);
  const levelUp = getLevelForXp(xpBefore).id !== level.id;

  // Barre de niveau : anime de l'avant vers l'après.
  const pctOf = (xp: number) =>
    nextLevel
      ? Math.min(
          100,
          ((xp - level.minXp) / (nextLevel.minXp - level.minXp)) * 100,
        )
      : 100;
  const [levelPct, setLevelPct] = useState(pctOf(Math.max(xpBefore, level.minXp)));
  useEffect(() => {
    const t = setTimeout(() => setLevelPct(pctOf(xpAfter)), 900);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nextRoom = getTodayRoom(
    [...Object.keys(progress.completedRooms), room.id],
    0,
  );

  return (
    <div className="relative flex min-h-full flex-col pb-[max(env(safe-area-inset-bottom),1rem)] pt-4">
      <Confetti />

      <div className="flex flex-1 flex-col items-center justify-center pt-2 text-center">
        <div className="relative">
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-[2rem] bg-mint-400/40 blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0.4] }}
            transition={{ duration: 1.2, delay: 0.3 }}
          />
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
            className="relative grid place-items-center rounded-[2rem] gradient-mint text-white shadow-[0_16px_40px_-10px_rgba(44,183,131,0.5)]"
            style={{ width: 88, height: 88 }}
          >
            <AnimatedCheck size={46} delay={0.35} />
          </motion.div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-5 text-3xl font-bold tracking-tight text-ink"
        >
          Room Completed
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-1.5 text-ink-soft"
        >
          {room.emoji} {room.title} — terminée.{" "}
          <span className="font-semibold text-ink">
            Tu construis des réflexes.
          </span>
        </motion.p>

        {/* XP + streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 flex w-full items-center justify-between rounded-3xl gradient-primary p-4 text-white shadow-lift"
        >
          <div className="flex items-center gap-2.5">
            <motion.span
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <Flame className="size-6" fill="currentColor" />
            </motion.span>
            <div className="text-left">
              <p className="text-lg font-bold leading-tight">
                {streak} jour{streak > 1 ? "s" : ""} de suite
              </p>
              <p className="text-xs opacity-85">Streak sécurisé ✓</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold leading-tight">
              +<CountUp value={xpEarned} duration={0.9} delay={0.6} /> FP
            </p>
            <p className="text-xs opacity-85">Fluency Points</p>
          </div>
        </motion.div>

        {/* Progression de niveau */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card-soft mt-3 w-full p-4"
        >
          <div className="flex items-center justify-between text-sm">
            <p className="font-bold text-ink">
              {levelUp ? "🎉 Niveau supérieur !" : level.name}
            </p>
            <p className="text-xs font-semibold text-ink-faint">
              {nextLevel
                ? `${xpAfter} / ${nextLevel.minXp} FP → ${nextLevel.name}`
                : "Niveau max"}
            </p>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-ink/8">
            <motion.div
              className="h-full rounded-full gradient-primary"
              animate={{ width: `${levelPct}%` }}
              transition={{ duration: 1, ease: [0.21, 0.6, 0.35, 1] }}
            />
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-3 grid w-full grid-cols-2 gap-3"
        >
          <StatBox
            value={<CountUp value={comprehension} suffix="%" delay={0.8} />}
            label="Compréhension"
            emoji="🎧"
          />
          <StatBox
            value={<CountUp value={speaking} suffix="%" delay={0.9} />}
            label="Oral"
            emoji="🎙️"
          />
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

        {/* Badges */}
        {newBadges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, type: "spring", stiffness: 260, damping: 20 }}
            className="mt-3 w-full space-y-2"
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

        {/* Room suivante suggérée */}
        {nextRoom.id !== room.id && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-3 w-full"
          >
            <Link href={`/app/room/${nextRoom.id}`}>
              <div className="card-soft flex items-center gap-3 p-4 text-left transition-all hover:shadow-lift">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-50 text-xl">
                  {nextRoom.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase tracking-wide text-primary-600">
                    Prochaine room suggérée
                  </p>
                  <p className="truncate font-bold text-ink">
                    {nextRoom.title}
                  </p>
                </div>
                <ArrowRight className="size-4 shrink-0 text-ink-faint" />
              </div>
            </Link>
          </motion.div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.05 }}
          className="mt-3 flex items-center gap-1.5 text-sm text-ink-faint"
        >
          <Sparkles className="size-3.5" />
          Prochaine révision de ces phrases : demain
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="mt-7 space-y-2.5"
      >
        <Link href="/app/today" className="block">
          <Button size="lg" fullWidth>
            Continuer le path
          </Button>
        </Link>
        <Link href="/app/phrases?review=1" className="block">
          <Button variant="secondary" size="lg" fullWidth>
            Réviser mes phrases
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
  value: React.ReactNode;
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
