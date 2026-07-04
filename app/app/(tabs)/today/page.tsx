"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Check,
  ChevronRight,
  Flame,
  Lock,
  Moon,
  Play,
} from "lucide-react";
import { getTodayRoom, rooms } from "@/data/rooms";
import { getTodayLesson, lessons } from "@/data/lessons";
import { allPhrases } from "@/data/phrases";
import { getLevelForXp, getNextLevel } from "@/data/levels";
import { useProgress } from "@/lib/useProgress";
import { getDailySteps, canClaimChest } from "@/lib/progress";
import { cn, todayKey } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { DailyPath } from "@/components/today/DailyPath";
import { DailyChest } from "@/components/today/DailyChest";

const DAY_INITIALS = ["L", "M", "M", "J", "V", "S", "D"];

function lastSevenDays(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(todayKey(d));
  }
  return days;
}

export default function TodayPage() {
  const { progress, ready, stats, doDailyStep, openChest } = useProgress();

  const completedIds = Object.keys(progress.completedRooms);
  const todayRoom = getTodayRoom(completedIds);
  const tomorrowRoom = getTodayRoom([...completedIds, todayRoom.id], 1);
  const masteredLessons = Object.entries(progress.lessons ?? {})
    .filter(([, s]) => s.status === "mastered")
    .map(([id]) => id);
  const todayLesson = getTodayLesson(masteredLessons);

  const level = getLevelForXp(progress.xp);
  const nextLevel = getNextLevel(progress.xp);
  const levelProgress = nextLevel
    ? ((progress.xp - level.minXp) / (nextLevel.minXp - level.minXp)) * 100
    : 100;

  const doneSteps = getDailySteps(progress);
  const allDone = doneSteps.length >= 4;

  // Minutes estimées accomplies vs objectif quotidien.
  const stepMinutes = { warmup: 1, room: todayRoom.duration, lesson: 3, review: 1 };
  const minutesDone = doneSteps.reduce((sum, s) => sum + stepMinutes[s], 0);
  const goalMinutes = progress.onboarding?.dailyMinutes ?? 10;

  // Warm-up : phrases déjà débloquées à réactiver, sinon aperçu de la room.
  const unlockedPhrases = allPhrases.filter((p) => progress.phrases[p.id]);
  const warmupPhrases =
    unlockedPhrases.length >= 3
      ? unlockedPhrases.slice(-3)
      : todayRoom.phrases.slice(0, 3);

  const week = lastSevenDays();
  const activeToday = progress.lastActiveDate === todayKey();

  return (
    <div className={cn("space-y-5 transition-opacity", !ready && "opacity-0")}>
      {/* Salutation + streak */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            {allDone
              ? "Journée bouclée 🙌"
              : completedIds.length > 0
                ? "Content de te revoir 👋"
                : "Bienvenue 👋"}
          </h1>
          <p className="text-sm text-ink-soft">
            {progress.onboarding
              ? `${progress.onboarding.profileName} · ${level.name}`
              : "Ta session du jour t'attend."}
          </p>
        </div>
        <motion.div
          animate={
            activeToday && progress.streak > 0 ? { scale: [1, 1.06, 1] } : {}
          }
          transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2 }}
          className={cn(
            "flex items-center gap-1.5 rounded-2xl px-3.5 py-2",
            activeToday && progress.streak > 0
              ? "bg-coral-500 text-white shadow-[0_6px_18px_-4px_rgba(249,113,74,0.5)]"
              : "bg-coral-50",
          )}
        >
          <Flame
            className={cn(
              "size-5",
              activeToday && progress.streak > 0
                ? "text-white"
                : progress.streak > 0
                  ? "text-coral-500"
                  : "text-ink-faint",
            )}
            fill={progress.streak > 0 ? "currentColor" : "none"}
          />
          <span
            className={cn(
              "text-lg font-bold",
              activeToday && progress.streak > 0 ? "text-white" : "text-ink",
            )}
          >
            {progress.streak}
          </span>
        </motion.div>
      </div>

      {/* Objectif du jour + semaine */}
      <Card animate className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-ink">🎯 Today&apos;s goal</p>
          <span className="text-xs font-semibold text-ink-faint">
            {Math.min(minutesDone, goalMinutes)} / {goalMinutes} min
          </span>
        </div>
        <ProgressBar
          value={(minutesDone / goalMinutes) * 100}
          className="mt-2.5"
          color="bg-coral-500"
        />
        <div className="mt-4 flex items-center justify-between">
          {week.map((day) => {
            const active = (progress.activity[day] ?? 0) > 0;
            const isToday = day === todayKey();
            return (
              <div key={day} className="flex flex-col items-center gap-1">
                <span
                  className={cn(
                    "grid size-7 place-items-center rounded-full text-[10px] font-bold transition-colors",
                    active
                      ? "gradient-mint text-white"
                      : isToday
                        ? "border-2 border-dashed border-primary-300 text-primary-500"
                        : "bg-ink/5 text-ink-faint",
                  )}
                >
                  {active ? (
                    <Check className="size-3.5" strokeWidth={3.5} />
                  ) : (
                    ""
                  )}
                </span>
                <span
                  className={cn(
                    "text-[10px] font-bold",
                    isToday ? "text-primary-600" : "text-ink-faint",
                  )}
                >
                  {DAY_INITIALS[(new Date(`${day}T00:00:00`).getDay() + 6) % 7]}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Come back tomorrow OU Room du jour */}
      {allDone ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-[1.75rem] shadow-lift"
        >
          <div className="gradient-primary p-6 text-white">
            <div className="flex items-center gap-2">
              <Moon className="size-4 opacity-90" />
              <p className="text-xs font-bold uppercase tracking-widest opacity-80">
                À demain
              </p>
            </div>
            <h2 className="mt-3 text-2xl font-bold tracking-tight">
              Tout est fait pour aujourd&apos;hui.
            </h2>
            <p className="mt-1.5 text-[15px] opacity-90">
              Ton cerveau va consolider pendant la nuit — c&apos;est là que ça
              s&apos;ancre. Demain :{" "}
              <span className="font-bold">
                {tomorrowRoom.emoji} {tomorrowRoom.title}
              </span>{" "}
              — {tomorrowRoom.subtitle.toLowerCase()}.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Chip className="bg-white/15 text-white">
                <Flame className="size-3" /> Streak {progress.streak} sécurisé
              </Chip>
              <Chip className="bg-white/15 text-white">
                +{progress.activity[todayKey()] ?? 0} FP aujourd&apos;hui
              </Chip>
            </div>
            <Link href="/app/phrases" className="mt-5 block">
              <Button
                fullWidth
                className="bg-white !text-primary-700 shadow-none"
                style={{ background: "white" }}
              >
                Réviser encore quelques phrases
              </Button>
            </Link>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="overflow-hidden rounded-[1.75rem] shadow-lift"
        >
          <div className="gradient-primary p-6 text-white">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-widest opacity-80">
                Today&apos;s Room
              </p>
              <Chip className="bg-white/15 text-white">
                {todayRoom.levelLabel} · {todayRoom.accent}
              </Chip>
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              {todayRoom.emoji} {todayRoom.title}
            </h2>
            <p className="mt-1.5 text-[15px] opacity-90">{todayRoom.subtitle}</p>
            <p className="mt-3 text-sm opacity-85">
              <span className="font-semibold">Aujourd&apos;hui :</span>{" "}
              {todayRoom.goal} · {todayRoom.duration} min · +
              {todayRoom.phrases.length} phrases réelles
            </p>
            <Link href={`/app/room/${todayRoom.id}`} className="mt-5 block">
              <Button
                size="lg"
                fullWidth
                className="bg-white !text-primary-700 shadow-none"
                style={{ background: "white" }}
              >
                <Play className="size-4 fill-current" /> Start Room
              </Button>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Daily Path */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.14 }}
      >
        <DailyPath
          room={todayRoom}
          lesson={todayLesson}
          warmupPhrases={warmupPhrases}
          doneSteps={doneSteps}
          reviewAvailable={unlockedPhrases.length > 0}
          onWarmupDone={() => doDailyStep("warmup")}
        />
      </motion.div>

      {/* Daily Chest */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.2 }}
      >
        <DailyChest
          unlocked={doneSteps.includes("room")}
          claimed={!canClaimChest(progress)}
          onClaim={openChest}
        />
      </motion.div>

      {/* Niveau compact */}
      <Card animate delay={0.25} className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint">
              Niveau
            </p>
            <p className="text-[15px] font-bold text-ink">
              {level.name}{" "}
              <span className="font-medium text-ink-faint">
                · {level.cefr} · {progress.xp} FP
              </span>
            </p>
          </div>
          <Link
            href="/app/progress"
            className="text-sm font-bold text-primary-600 hover:text-primary-700"
          >
            Détails →
          </Link>
        </div>
        {nextLevel && (
          <div className="mt-3">
            <ProgressBar value={levelProgress} />
            <p className="mt-1.5 text-xs text-ink-faint">
              {nextLevel.minXp - progress.xp} FP avant {nextLevel.name}
            </p>
          </div>
        )}
      </Card>

      {/* Leçons — structures de l'oral */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-bold tracking-tight text-ink">
            <BookOpen className="size-5 text-primary-500" /> Learn
          </h3>
          <span className="text-sm font-medium text-ink-faint">
            {stats.lessonsMastered} / {lessons.length} structures
          </span>
        </div>
        <p className="mb-3 text-sm text-ink-soft">
          Les structures que les natifs utilisent dans chaque conversation.
        </p>
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {lessons.map((lesson, i) => {
            const state = progress.lessons?.[lesson.id];
            const mastered = state?.status === "mastered";
            const learning = state?.status === "learning";
            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.04 }}
                className="w-44 shrink-0"
              >
                <Link href={`/app/lesson/${lesson.id}`}>
                  <div
                    className={cn(
                      "card-soft flex h-full flex-col p-4 transition-all hover:shadow-lift",
                      mastered && "ring-1 ring-mint-400/40",
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-2xl">{lesson.emoji}</span>
                      {mastered ? (
                        <Chip tone="mint">✓</Chip>
                      ) : learning ? (
                        <Chip tone="gold">En cours</Chip>
                      ) : null}
                    </div>
                    <p className="mt-2 font-bold leading-tight text-ink">
                      {lesson.structure}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-ink-faint">
                      {lesson.title}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Toutes les rooms */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-bold tracking-tight text-ink">
            Toutes les rooms
          </h3>
          <span className="text-sm font-medium text-ink-faint">
            {stats.roomsCompleted} / {stats.totalRooms} terminées
          </span>
        </div>
        <div className="space-y-3">
          {rooms.map((room, i) => {
            const done = completedIds.includes(room.id);
            return (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.03, duration: 0.4 }}
              >
                <Link href={`/app/room/${room.id}`}>
                  <div className="card-soft flex items-center gap-3.5 p-4 transition-all hover:shadow-lift">
                    <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary-50 text-2xl">
                      {room.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-bold text-ink">
                          {room.title}
                        </p>
                        {!room.free && (
                          <Chip tone="gold" className="shrink-0">
                            <Lock className="size-2.5" /> Premium
                          </Chip>
                        )}
                      </div>
                      <p className="truncate text-sm text-ink-soft">
                        {room.subtitle}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-faint">
                        {room.levelLabel} · {room.duration} min · {room.accent}
                      </p>
                    </div>
                    {done ? (
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-mint-50 text-mint-600">
                        <Check className="size-4" strokeWidth={3} />
                      </span>
                    ) : (
                      <ChevronRight className="size-5 shrink-0 text-ink-faint" />
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
