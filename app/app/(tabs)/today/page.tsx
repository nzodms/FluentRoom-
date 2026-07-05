"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Check, ChevronRight, Lock } from "lucide-react";
import { getTodayRoom, rooms } from "@/data/rooms";
import { getTodayLesson, lessons } from "@/data/lessons";
import { allPhrases } from "@/data/phrases";
import { getLevelForXp, getNextLevel } from "@/data/levels";
import { useProgress } from "@/lib/useProgress";
import { getDailySteps } from "@/lib/progress";
import { computeQuests } from "@/lib/quests";
import { cn, todayKey } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { StreakPulse } from "@/components/reward/StreakPulse";
import { EnergyPill } from "@/components/energy/EnergyPill";
import { FluentCharacter } from "@/components/avatar/FluentCharacter";
import { expressionForToday } from "@/lib/avatar-reactions";
import { RewardRoom } from "@/components/rewards/RewardRoom";
import { ShopTeaser } from "@/components/shop/ShopTeaser";
import { CompanionCoachCard } from "@/components/companion/CompanionCoachCard";
import { WelcomeOverlay } from "@/components/companion/WelcomeOverlay";
import {
  GuidedTour,
  useGuidedTour,
  type TourStep,
} from "@/components/tour/GuidedTour";
import { DailyPath } from "@/components/today/DailyPath";
import { NextActionHero } from "@/components/today/NextActionHero";
import { QuestList } from "@/components/today/QuestList";

const DAY_INITIALS = ["L", "M", "M", "J", "V", "S", "D"];

/** Visite guidée par le compagnon à la première arrivée sur Today. */
const TODAY_TOUR: TourStep[] = [
  {
    id: "next-action",
    target: "next-action",
    title: "Ici, c'est ton objectif du jour",
    message:
      "Une seule mission à la fois : tu écoutes, tu comprends, tu réponds — puis tu gagnes ta récompense.",
    expression: "focused",
    accent: "primary",
  },
  {
    id: "daily-path",
    target: "daily-path",
    title: "Ton chemin quotidien",
    message:
      "Tu avances étape par étape : écoute, bloc utile, oral, révision. Pas besoin d'aller vite.",
    expression: "relaxed",
    accent: "primary",
  },
  {
    id: "energy",
    target: "energy",
    title: "Ton énergie structure ton rythme",
    message:
      "Chaque vraie session en utilise un peu. Elle revient chaque jour — c'est un rythme, pas une limite.",
    expression: "focused",
    accent: "mint",
    shape: "pill",
  },
  {
    id: "level",
    target: "level",
    title: "Là, tu vois ton niveau",
    message:
      "Chaque session le fait grimper. Tes FP s'accumulent ici aussi — ils ne redescendent jamais.",
    expression: "proud",
    accent: "primary",
  },
  {
    id: "fp-shop",
    target: "fp-shop",
    title: "Ici, tu gagnes des crédits",
    message:
      "Dans la boutique, tu pourras acheter des habits, accessoires, fonds et effets pour ton personnage.",
    expression: "excited",
    accent: "gold",
  },
  {
    id: "first-lesson",
    target: "next-action",
    title: "Quand tu es prêt…",
    message:
      "…tu peux lancer ta première leçon ici. Prends ton temps, je reste avec toi.",
    expression: "encouraging",
    accent: "mint",
  },
];

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
  const [chestOpen, setChestOpen] = useState(false);
  const tour = useGuidedTour("today", ready && progress.onboarding !== null);
  // Accueil du compagnon avant la visite : « Bienvenue dans ton espace ».
  const [welcomeDone, setWelcomeDone] = useState(false);

  const completedIds = Object.keys(progress.completedRooms);
  const todayRoom = getTodayRoom(completedIds);
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

  // Anti-flicker : on ne monte le contenu qu'une fois hydraté,
  // pour que les animations d'entrée jouent une seule fois, visibles.
  if (!ready) return <div aria-hidden className="min-h-[60vh]" />;

  return (
    <div className="space-y-5">
      {/* Salutation + avatar + streak vivant */}
      <div className="flex items-center justify-between gap-3">
        <Link href="/app/settings" className="flex min-w-0 items-center gap-3">
          <FluentCharacter
            config={progress.avatar}
            size={56}
            expression={expressionForToday(progress)}
          />
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold tracking-tight text-ink">
              {allDone
                ? "Journée bouclée 🙌"
                : completedIds.length > 0
                  ? "Content de te revoir 👋"
                  : "Bienvenue 👋"}
            </h1>
            <p className="truncate text-xs text-ink-soft">
              {progress.onboarding
                ? `${progress.onboarding.profileName} · ${level.name}`
                : "Ta session du jour t'attend."}
            </p>
          </div>
        </Link>
        <StreakPulse streak={progress.streak} activeToday={activeToday} />
      </div>

      {/* Le compagnon : contexte, mission du jour, calibrage */}
      <CompanionCoachCard progress={progress} quests={quests} />

      {/* Focus Energy */}
      <div className="flex items-center justify-between">
        <span data-tour="energy" className="inline-block">
          <EnergyPill progress={progress} />
        </span>
        <p className="text-xs font-medium text-ink-faint">
          Chaque session utilise de l&apos;énergie. Elle revient demain.
        </p>
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
              ? "Objectif du jour atteint ⚡️"
              : energy > 0
                ? `Encore ${Math.max(goalMinutes - minutesDone, 1)} min pour sécuriser ta série.`
                : "Ta session du jour t'attend. On s'y met ?"}
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

      {/* LA prochaine action — une mission, un bouton */}
      <div data-tour="next-action">
        <NextActionHero progress={progress} onChestClaim={() => setChestOpen(true)} />
      </div>

      {/* Fluency Path */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.14 }}
        data-tour="daily-path"
      >
        <DailyPath
          room={todayRoom}
          lesson={todayLesson}
          warmupPhrases={warmupPhrases}
          doneSteps={doneSteps}
          reviewAvailable={unlockedPhrases.length > 0}
          chestProgress={progress.chestProgress ?? 0}
          availableChests={progress.availableChests ?? 0}
          onWarmupDone={() => doDailyStep("warmup")}
          onOpenChest={() => setChestOpen(true)}
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
          title="Quêtes du jour"
          onClaim={(quest) => takeQuestReward(quest.key, quest.xp)}
        />
      </motion.div>

      {/* Boutique : rappel qu'il y a une raison de gagner des FP */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.22 }}
        data-tour="fp-shop"
      >
        <ShopTeaser progress={progress} />
      </motion.div>

      {/* Niveau compact */}
      <Card animate delay={0.25} className="p-4" data-tour="level">
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
      {/* Première arrivée : accueil du compagnon, puis visite guidée */}
      <AnimatePresence>
        {tour.open && !welcomeDone && (
          <WelcomeOverlay
            companionId={progress.companion}
            onDiscover={() => setWelcomeDone(true)}
            onLater={() => tour.close(true)}
          />
        )}
        {tour.open && welcomeDone && (
          <GuidedTour
            steps={TODAY_TOUR}
            companionId={progress.companion}
            onClose={tour.close}
          />
        )}
      </AnimatePresence>

      {/* Reward Room plein écran */}
      <AnimatePresence>
        {chestOpen && (
          <RewardRoom
            chestType="daily"
            avatar={progress.avatar}
            onOpen={openChest}
            onCollect={() => setChestOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
