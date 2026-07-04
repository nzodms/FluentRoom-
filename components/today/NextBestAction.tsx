"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import type { UserProgress } from "@/types/learning";
import { getDailySteps } from "@/lib/progress";
import { getTodayRoom } from "@/data/rooms";
import { getTodayLesson } from "@/data/lessons";

interface Action {
  label: string;
  detail: string;
  href: string;
  emoji: string;
}

/** Décide la meilleure action suivante selon l'état du jour. */
export function nextBestAction(progress: UserProgress): Action | null {
  const steps = getDailySteps(progress);
  const completedIds = Object.keys(progress.completedRooms);
  const room = getTodayRoom(completedIds);
  const masteredLessons = Object.entries(progress.lessons ?? {})
    .filter(([, s]) => s.status === "mastered")
    .map(([id]) => id);
  const lesson = getTodayLesson(masteredLessons);
  const hasPhrases = Object.keys(progress.phrases).length > 0;

  if (!steps.includes("room")) {
    return {
      label: "Lance ta room du jour",
      detail: `${room.emoji} ${room.title} · ${room.duration} min · +${room.phrases.length} phrases réelles`,
      href: `/app/room/${room.id}`,
      emoji: "🎧",
    };
  }
  if (!steps.includes("lesson")) {
    return {
      label: "Apprends le bloc du jour",
      detail: `${lesson.structure} — 3 min pour un réflexe de plus`,
      href: `/app/lesson/${lesson.id}`,
      emoji: "🧱",
    };
  }
  if (!steps.includes("review") && hasPhrases) {
    return {
      label: "Révision express",
      detail: "5 phrases en 1 minute, pour ne pas les perdre",
      href: "/app/phrases?review=1",
      emoji: "🔁",
    };
  }
  if (steps.length < 4) {
    return {
      label: "Encore une étape",
      detail: "Termine ton path pour sécuriser ta journée",
      href: "/app/today",
      emoji: "⚡️",
    };
  }
  return null;
}

/** Bandeau "quoi faire maintenant" — contextualisé, une seule action. */
export function NextBestAction({ progress }: { progress: UserProgress }) {
  const action = nextBestAction(progress);
  if (!action) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link href={action.href} className="block">
        <div className="card-tint-primary flex items-center gap-3.5 p-4 transition-all hover:shadow-lift">
          <motion.span
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.5 }}
            className="grid size-11 shrink-0 place-items-center rounded-2xl gradient-primary text-xl text-white glow-primary"
          >
            {action.emoji}
          </motion.span>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary-600">
              <Sparkles className="size-3" /> Prochaine action
            </p>
            <p className="truncate font-bold text-ink">{action.label}</p>
            <p className="truncate text-xs text-ink-soft">{action.detail}</p>
          </div>
          <ArrowRight className="size-4 shrink-0 text-primary-500" />
        </div>
      </Link>
    </motion.div>
  );
}
