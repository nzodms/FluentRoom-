"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Moon, Play } from "lucide-react";
import type { UserProgress } from "@/types/learning";
import { getDailySteps } from "@/lib/progress";
import { getTodayRoom } from "@/data/rooms";
import { getTodayLesson } from "@/data/lessons";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { type LearningIconName } from "@/components/icons/learning-icons";

interface HeroAction {
  kind: "room" | "lesson" | "review" | "chest" | "done";
  icon: LearningIconName;
  kicker: string;
  title: string;
  detail: string;
  cta: string;
  href?: string;
  emoji?: string;
}

/** LA prochaine action — une seule, calculée depuis l'état du jour. */
function computeHero(progress: UserProgress): HeroAction {
  const steps = getDailySteps(progress);
  const completedIds = Object.keys(progress.completedRooms);
  const room = getTodayRoom(completedIds);
  const masteredLessons = Object.entries(progress.lessons ?? {})
    .filter(([, s]) => s.status === "mastered")
    .map(([id]) => id);
  const lesson = getTodayLesson(masteredLessons);
  const hasPhrases = Object.keys(progress.phrases).length > 0;
  const chestAvailable = (progress.availableChests ?? 0) > 0;

  if (!steps.includes("room")) {
    return {
      kind: "room",
      icon: "listen",
      kicker: "Today's Fluency Mission",
      title: room.title,
      detail: `${room.subtitle} · ${room.duration} min · +${room.phrases.length} phrases réelles`,
      cta: "Commencer la room",
      href: `/app/room/${room.id}`,
      emoji: room.emoji,
    };
  }
  if (!steps.includes("lesson")) {
    return {
      kind: "lesson",
      icon: "lesson",
      kicker: "Bloc du jour",
      title: lesson.structure,
      detail: `${lesson.title} — 3 min pour un réflexe de plus`,
      cta: "Apprendre le bloc",
      href: `/app/lesson/${lesson.id}`,
      emoji: lesson.emoji,
    };
  }
  if (!steps.includes("review") && hasPhrases) {
    return {
      kind: "review",
      icon: "review",
      kicker: "Ne les perds pas",
      title: "Révision express",
      detail: "5 phrases à swiper en 1 minute — c'est là que ça s'ancre",
      cta: "Réviser 5 phrases",
      href: "/app/phrases?review=1",
      emoji: "🔁",
    };
  }
  if (chestAvailable) {
    return {
      kind: "chest",
      icon: "chest",
      kicker: "Récompense du jour",
      title: "Ton coffre est prêt",
      detail: "FP, énergie, item avatar ou bouclier — ouvre pour découvrir",
      cta: "Ouvrir mon coffre",
      emoji: "🎁",
    };
  }
  const tomorrow = getTodayRoom([...completedIds], 1);
  return {
    kind: "done",
    icon: "fluency",
    kicker: "À demain",
    title: "Tout est fait pour aujourd'hui",
    detail: `Ton cerveau consolide cette nuit. Demain : ${tomorrow.emoji} ${tomorrow.title}.`,
    cta: "Réviser encore quelques phrases",
    href: "/app/phrases",
  };
}

/** Hero unique : une mission, un bouton. Pas dix CTA concurrents. */
export function NextActionHero({
  progress,
  onChestClaim,
}: {
  progress: UserProgress;
  onChestClaim: () => void;
}) {
  const action = computeHero(progress);
  const isReward = action.kind === "chest";
  const isDone = action.kind === "done";

  const inner = (
    <div
      className={`relative overflow-hidden rounded-[1.75rem] p-6 text-white shadow-lift ${
        isReward ? "gradient-gold" : isDone ? "gradient-mint" : "gradient-primary"
      }`}
    >
      <span className="pointer-events-none absolute -right-12 -top-12 size-44 rounded-full bg-white/10" />
      <span className="pointer-events-none absolute -bottom-16 -left-10 size-40 rounded-full bg-white/5" />
      <div className="relative">
        <div className="flex items-center gap-2">
          {isDone && <Moon className="size-4 opacity-90" />}
          <p className="text-xs font-bold uppercase tracking-widest opacity-80">
            {action.kicker}
          </p>
        </div>
        <div className="mt-3 flex items-center gap-4">
          <motion.span
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 16, delay: 0.15 }}
            className="grid size-14 shrink-0 place-items-center rounded-3xl bg-white/15 text-3xl backdrop-blur-sm"
          >
            {action.emoji ?? "⚡️"}
          </motion.span>
          <div className="min-w-0">
            <h2 className="text-2xl font-bold tracking-tight">
              {action.title}
            </h2>
            <p className="mt-0.5 text-sm opacity-90">{action.detail}</p>
          </div>
        </div>
        <div className="mt-5">
          <Button
            size="lg"
            fullWidth
            className={`bg-white shadow-[0_10px_30px_-6px_rgba(255,255,255,0.4)] ${
              isReward
                ? "!text-gold-500"
                : isDone
                  ? "!text-mint-600"
                  : "!text-primary-700"
            }`}
            style={{ background: "white" }}
            onClick={isReward ? onChestClaim : undefined}
          >
            {action.kind === "room" ? (
              <Play className="size-4 fill-current" />
            ) : (
              <ArrowRight className="size-4" />
            )}{" "}
            {action.cta}
          </Button>
        </div>
        {isDone && (
          <div className="mt-3 flex justify-center">
            <Chip className="bg-white/15 text-white">
              Série de {progress.streak} sécurisée ✓
            </Chip>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.08 }}
    >
      {action.href && !isReward ? (
        <Link href={action.href} className="block">
          {inner}
        </Link>
      ) : (
        inner
      )}
    </motion.div>
  );
}
