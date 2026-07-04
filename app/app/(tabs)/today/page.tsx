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
import { computeQuests } from "@/lib/quests";
import { cn, todayKey } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { StreakPulse } from "@/components/reward/StreakPulse";
import { DailyPath } from "@/components/today/DailyPath";
import { NextBestAction } from "@/components/today/NextBestAction";
import { QuestList } from "@/components/today/QuestList";

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
  const { progress, ready, stats, doDailyStep, openChest, takeQuestReward } =
    useProgress();

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
  const quests = computeQuests(progress);

  // Énergie du jour : minutes accomplies vs objectif.
  const stepMinutes = { warmup: 1, room: todayRoom.duration, lesson: 3, review: 1 };
  const minutesDone = doneSteps.reduce((sum, s) => sum + stepMinutes[s], 0);
  const goalMinutes = progress.onboarding?.dailyMinutes ?? 10;
  const energy = Math.min((minutesDone / goalMinutes) * 100, 100);

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
      {/* Salutation + streak vivant */}
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
        <StreakPulse streak={progress.streak} activeToday={activeToday} />
      </div>

      {/* Daily Energy Ring + semaine */}
      <Card animate className="card-tint-primary flex items-center gap-5 p-4">
        <div className="relative">
          {energy >= 100 && (
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full bg-mint-400/30 blur-md"
              animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.3, 0.6] }}
              transition={{ duration: 2.4, repeat: Infinity }}
            />
          )}
          <ProgressRing
            value={energy}
            size={92}
            strokeWidth={9}
            color={
              energy >= 100
                ? "var(--color-mint-500)"
                : "var(--color-coral-500)"
            }
            label={
              <span className="text-center">
                <span className="block text-xl font-bold text-ink">
                  {Math.min(minutesDone, goalMinutes)}
                  <span className="text-xs font-semibold text-ink-faint">
                    /{goalMinutes}
                  </span>
                </span>
                <span className="block text-[9px] font-bold uppercase tracking-wide text-ink-faint">
                  min
                </span>
              </span>
            }
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-ink">
            {energy >= 100
              ? "Énergie du jour : pleine ⚡️"
              : energy > 0
                ? `Encore ${Math.max(goalMinutes - minutesDone, 1)} min pour sécuriser ta série.`
                : "Ton énergie du jour est à zéro. On la remplit ?"}
          </p>
          <div className="mt-2.5 flex items-center justify-between">
            {week.map((day) => {
              const active = (progress.activity[day] ?? 0) > 0;
              const isToday = day === todayKey();
              return (
                <div key={day} className="flex flex-col items-center gap-1">
                  <motion.span
                    initial={false}
                    animate={active ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.4 }}
                    className={cn(
                      "grid size-6 place-items-center rounded-full transition-colors",
                      active
                        ? "gradient-mint text-white"
                        : isToday
                          ? "border-2 border-dashed border-primary-300"
                          : "bg-ink/5",
                    )}
                  >
                    {active && (
                      <Check className="size-3" strokeWidth={3.5} />
                    )}
                  </motion.span>
                  <span
                    className={cn(
                      "text-[9px] font-bold",
                      isToday ? "text-primary-600" : "text-ink-faint",
                    )}
                  >
                    {DAY_INITIALS[(new Date(`${day}T00:00:00`).getDay() + 6) % 7]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Next best action */}
      {!allDone && <NextBestAction progress={progress} />}

      {/* Come back tomorrow OU Room du jour */}
      {allDone ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-[1.75rem] shadow-lift"
        >
          <div className="relative gradient-primary p-6 text-white">
            <span className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-white/10" />
            <span className="pointer-events-none absolute -bottom-14 -left-8 size-36 rounded-full bg-white/5" />
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
              Ton cerveau consolide pendant la nuit — c&apos;est là que ça
              s&apos;ancre. Demain :{" "}
              <span className="font-bold">
                {tomorrowRoom.emoji} {tomorrowRoom.title}
              </span>{" "}
              — {tomorrowRoom.subtitle.toLowerCase()}.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Chip className="bg-white/15 text-white">
                <Flame className="size-3" /> Série de {progress.streak} sécurisée
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
          <div className="relative gradient-primary p-6 text-white">
            {/* Décor de profondeur */}
            <span className="pointer-events-none absolute -right-12 -top-12 size-44 rounded-full bg-white/10" />
            <span className="pointer-events-none absolute -bottom-16 -left-10 size-40 rounded-full bg-white/5" />
            <span className="pointer-events-none absolute right-6 bottom-16 size-3 rounded-full bg-white/30" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-widest opacity-80">
                  Today&apos;s Room
                </p>
                <Chip className="bg-white/15 text-white">
                  {todayRoom.levelLabel} · {todayRoom.accent}
                </Chip>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <motion.span
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 280, damping: 16, delay: 0.2 }}
                  className="grid size-16 shrink-0 place-items-center rounded-3xl bg-white/15 text-4xl backdrop-blur-sm"
                >
                  {todayRoom.emoji}
                </motion.span>
                <div className="min-w-0">
                  <h2 className="text-2xl font-bold tracking-tight">
                    {todayRoom.title}
                  </h2>
                  <p className="mt-0.5 text-sm opacity-90">
                    {todayRoom.subtitle}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm opacity-85">
                {todayRoom.goal} · {todayRoom.duration} min · +
                {todayRoom.phrases.length} phrases réelles
              </p>
              <Link href={`/app/room/${todayRoom.id}`} className="mt-5 block">
                <Button
                  size="lg"
                  fullWidth
                  className="bg-white !text-primary-700 shadow-[0_10px_30px_-6px_rgba(255,255,255,0.4)]"
                  style={{ background: "white" }}
                >
                  <Play className="size-4 fill-current" /> Start Room
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Fluency Path */}
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
          chestClaimed={!canClaimChest(progress)}
          onWarmupDone={() => doDailyStep("warmup")}
          onChestClaim={openChest}
        />
      </motion.div>

      {/* Quêtes du jour */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.2 }}
      >
        <QuestList
          quests={quests}
          scope="daily"
          title="⚔️ Quêtes du jour"
          onClaim={(quest) => takeQuestReward(quest.key, quest.xp)}
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
            Mon profil →
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
            {stats.lessonsMastered} / {lessons.length} blocs
          </span>
        </div>
        <p className="mb-3 text-sm text-ink-soft">
          Les blocs que les natifs utilisent dans chaque conversation.
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
                  <motion.div
                    whileTap={{ scale: 0.97 }}
                    className={cn(
                      "flex h-full flex-col p-4 transition-all hover:shadow-lift",
                      mastered ? "card-tint-mint" : "card-soft",
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
                  </motion.div>
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
                  <motion.div
                    whileTap={{ scale: 0.985 }}
                    className={cn(
                      "flex items-center gap-3.5 p-4 transition-all hover:shadow-lift",
                      done ? "card-tint-mint" : "card-soft",
                    )}
                  >
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
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-mint-500 text-white">
                        <Check className="size-4" strokeWidth={3} />
                      </span>
                    ) : (
                      <ChevronRight className="size-5 shrink-0 text-ink-faint" />
                    )}
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
