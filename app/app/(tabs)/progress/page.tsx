"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Flame, Target, Trophy, X, Zap } from "lucide-react";
import type { Badge } from "@/types/learning";
import { badges } from "@/data/badges";
import { BadgeMedallion } from "@/components/reward/BadgeMedallion";
import { getLevelForXp, getNextLevel, levels } from "@/data/levels";
import { getRoomById } from "@/data/rooms";
import { useProgress } from "@/lib/useProgress";
import { computeQuests } from "@/lib/quests";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { CountUp } from "@/components/ui/CountUp";
import { NextBestAction } from "@/components/today/NextBestAction";
import { QuestList } from "@/components/today/QuestList";
import { cn, formatDuration, isWithinHours, todayKey } from "@/lib/utils";
import {
  LearningIcon,
  type LearningIconName,
} from "@/components/icons/learning-icons";

const SKILL_ICONS: Record<string, LearningIconName> = {
  listening: "listen",
  speaking: "speak",
  phrases: "phrase",
  reflexes: "reflex",
};

const DAY_LABELS = ["L", "M", "M", "J", "V", "S", "D"];

function lastSevenDays(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(todayKey(d));
  }
  return days;
}

/** État lisible du niveau d'anglais aujourd'hui. */
function englishToday(fluency: number, roomsCompleted: number): string {
  if (roomsCompleted === 0)
    return "Ton profil démarre. Première room = premières fondations.";
  if (fluency < 25)
    return "Tes fondations se posent. Chaque session rend ton anglais plus automatique.";
  if (fluency < 50)
    return "Ton oreille commence à attraper l'anglais réel sans effort.";
  if (fluency < 75)
    return "Tes réflexes se construisent — tu réponds de plus en plus vite.";
  return "Ton anglais devient automatique. Continue de nourrir la machine.";
}

export default function ProgressPage() {
  const { progress, ready, stats, takeQuestReward } = useProgress();
  const [openBadge, setOpenBadge] = useState<Badge | null>(null);

  const level = getLevelForXp(progress.xp);
  const nextLevel = getNextLevel(progress.xp);
  const levelProgress = nextLevel
    ? ((progress.xp - level.minXp) / (nextLevel.minXp - level.minXp)) * 100
    : 100;

  const week = lastSevenDays();
  const weekValues = week.map((day) => progress.activity[day] ?? 0);
  const maxWeek = Math.max(...weekValues, 40);
  const activeDays = weekValues.filter((v) => v > 0).length;
  const quests = computeQuests(progress);

  // Compétences (0–100)
  const reflexes = Math.min(
    100,
    (progress.drillsCompleted ?? 0) * 12 + (progress.reviewSessions ?? 0) * 10,
  );
  const phrasesSkill = Math.min(
    100,
    Math.round((stats.phrasesUnlocked / 40) * 100),
  );
  const skills = [
    {
      id: "listening",
      emoji: "🎧",
      label: "Listening",
      value: progress.listeningScore,
      color: "var(--color-primary-500)",
      hint: "Ton oreille à vitesse réelle",
    },
    {
      id: "speaking",
      emoji: "🎙️",
      label: "Speaking",
      value: progress.speakingScore,
      color: "var(--color-mint-500)",
      hint: "Ta confiance à l'oral",
    },
    {
      id: "phrases",
      emoji: "💎",
      label: "Real phrases",
      value: phrasesSkill,
      color: "var(--color-gold-400)",
      hint: `${stats.phrasesUnlocked} phrases · ${stats.phrasesMastered} maîtrisées`,
    },
    {
      id: "reflexes",
      emoji: "⚡️",
      label: "Reflexes",
      value: reflexes,
      color: "var(--color-coral-500)",
      hint: "Révisions et ear training",
    },
  ];
  const strongest = skills.reduce((a, b) => (b.value > a.value ? b : a));
  const weakest = skills.reduce((a, b) => (b.value < a.value ? b : a));

  // Timeline : dernières victoires.
  const timeline = [
    ...Object.values(progress.completedRooms).map((r) => ({
      at: r.completedAt,
      emoji: getRoomById(r.roomId)?.emoji ?? "🚪",
      text: `Room ${getRoomById(r.roomId)?.title ?? r.roomId} · ${r.comprehension}%`,
      xp: r.xpEarned,
    })),
    ...Object.entries(progress.lessons ?? {})
      .filter(([, s]) => s.completedAt)
      .map(([id, s]) => ({
        at: s.completedAt as string,
        emoji: "🧱",
        text: `Bloc appris : ${id.replace(/-/g, " ")}`,
        xp: 30,
      })),
  ]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 5);


  return (
    <div className={cn("space-y-5 transition-opacity", !ready && "opacity-0")}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          Fluency Profile
        </h1>
        <p className="text-sm text-ink-soft">
          Chaque session rend ton anglais plus automatique.
        </p>
      </div>

      {/* Fluency Aura */}
      <Card animate className="card-tint-primary flex items-center gap-5 p-5">
        <div className="relative">
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full bg-primary-400/30 blur-xl"
            animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3.2, repeat: Infinity }}
          />
          <ProgressRing
            value={stats.fluency}
            size={110}
            strokeWidth={10}
            label={
              <span className="text-center">
                <span className="block text-3xl font-bold text-ink">
                  <CountUp value={stats.fluency} />
                </span>
                <span className="block text-[9px] font-bold uppercase tracking-wide text-ink-faint">
                  Fluency
                </span>
              </span>
            }
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-widest text-primary-600">
            Ton score d&apos;automatisme
          </p>
          <p className="mt-1 text-sm font-semibold leading-snug text-ink">
            {englishToday(stats.fluency, stats.roomsCompleted)}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <Chip tone="mint">💪 {strongest.label}</Chip>
            {strongest.id !== weakest.id && (
              <Chip tone="coral">🎯 {weakest.label}</Chip>
            )}
          </div>
        </div>
      </Card>

      {/* Skill cards */}
      <div className="grid grid-cols-2 gap-3">
        {skills.map((skill, i) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + i * 0.06 }}
            className="card-soft flex items-center gap-3 p-3.5"
          >
            <ProgressRing
              value={skill.value}
              size={54}
              strokeWidth={5}
              color={skill.color}
              label={
                <span className="text-xs font-bold text-ink">
                  {skill.value}
                </span>
              }
            />
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-sm font-bold text-ink">
                <LearningIcon
                  name={SKILL_ICONS[skill.id]}
                  size="sm"
                  className="!size-6 !rounded-lg"
                />
                {skill.label}
              </p>
              <p className="mt-0.5 text-[11px] leading-tight text-ink-faint">
                {skill.hint}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Weak spot CTA */}
      <Link
        href={weakest.id === "speaking" ? "/app/speak" : "/app/listen"}
        className="block"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-soft flex items-center gap-3.5 p-4 ring-1 ring-coral-100 transition-all hover:shadow-lift"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl gradient-coral text-white">
            <Target className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-ink">
              Ton maillon faible : {weakest.label}
            </p>
            <p className="truncate text-sm text-ink-soft">
              {weakest.id === "speaking"
                ? "3 minutes sur Speak et ta confiance monte."
                : "Un ear training et ton score décolle."}
            </p>
          </div>
          <ChevronRight className="size-4 shrink-0 text-ink-faint" />
        </motion.div>
      </Link>

      {/* Next evolution */}
      <Card animate delay={0.22} className="overflow-hidden p-0">
        <div className="relative gradient-primary p-5 text-white">
          <span className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-white/10" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-80">
                Next evolution
              </p>
              <p className="mt-1 text-2xl font-bold tracking-tight">
                {level.name}
              </p>
              <p className="text-sm opacity-85">
                {level.cefr} · {level.tagline}
              </p>
            </div>
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/15 text-3xl">
              🏆
            </span>
          </div>
          {nextLevel && (
            <div className="mt-4">
              <div className="mb-1.5 flex justify-between text-xs font-medium opacity-85">
                <span>
                  → {nextLevel.name} ({nextLevel.cefr})
                </span>
                <span>
                  {progress.xp} / {nextLevel.minXp} FP
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/20">
                <motion.div
                  className="h-full rounded-full bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: `${levelProgress}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex divide-x divide-ink/5">
          {levels.map((l) => (
            <div
              key={l.id}
              className={cn(
                "flex-1 py-2.5 text-center",
                l.id === level.id ? "bg-primary-50" : "",
              )}
            >
              <p
                className={cn(
                  "text-[10px] font-bold",
                  l.id === level.id ? "text-primary-600" : "text-ink-faint",
                )}
              >
                {l.cefr}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Quêtes hebdo */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.26 }}
      >
        <QuestList
          quests={quests}
          scope="weekly"
          title="🏹 Quêtes de la semaine"
          onClaim={(quest) => takeQuestReward(quest.key, quest.xp)}
        />
      </motion.div>

      {/* Activité hebdo */}
      <Card animate delay={0.3} className="p-5">
        <div className="flex items-center justify-between">
          <p className="font-bold text-ink">Ta semaine</p>
          <Chip tone="primary">
            <Zap className="size-3" />
            {weekValues.reduce((a, b) => a + b, 0)} FP
          </Chip>
        </div>
        <div className="mt-5 flex h-28 items-end justify-between gap-2">
          {week.map((day, i) => {
            const value = weekValues[i];
            const isToday = day === todayKey();
            const height = Math.max((value / maxWeek) * 100, 5);
            return (
              <div
                key={day}
                className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
              >
                <motion.div
                  className={cn(
                    "w-full max-w-8 rounded-lg",
                    value > 0 ? "gradient-primary" : "bg-ink/8",
                    isToday && value === 0 && "bg-primary-200",
                  )}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: 0.35 + i * 0.06, duration: 0.5 }}
                />
                <span
                  className={cn(
                    "text-[10px] font-bold",
                    isToday ? "text-primary-600" : "text-ink-faint",
                  )}
                >
                  {DAY_LABELS[(new Date(`${day}T00:00:00`).getDay() + 6) % 7]}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-coral-50 p-3">
          <Flame
            className="size-5 shrink-0 text-coral-500"
            fill="currentColor"
          />
          <p className="flex-1 text-sm font-semibold text-ink">
            {activeDays} / 7 jours actifs · série de {progress.streak}
          </p>
          <span className="text-sm font-bold text-coral-600">
            {activeDays >= 5 ? "Excellent" : activeDays >= 3 ? "Solide" : "À toi"}
          </span>
        </div>
      </Card>

      {/* Stats rapides */}
      <div className="grid grid-cols-3 gap-2.5">
        {[
          {
            emoji: "🚪",
            value: `${stats.roomsCompleted}`,
            label: "rooms",
          },
          {
            emoji: "🧱",
            value: `${stats.lessonsMastered}`,
            label: "blocs appris",
          },
          {
            emoji: "🎧",
            value:
              stats.listeningTimeSec > 0
                ? formatDuration(stats.listeningTimeSec)
                : "—",
            label: "d'entraînement",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + i * 0.05 }}
            className="card-soft p-3 text-center"
          >
            <span className="text-lg">{stat.emoji}</span>
            <p className="text-lg font-bold text-ink">{stat.value}</p>
            <p className="text-[10px] font-semibold text-ink-faint">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Recent wins */}
      {timeline.length > 0 && (
        <Card animate delay={0.4} className="p-5">
          <p className="font-bold text-ink">🏅 Dernières victoires</p>
          <div className="mt-3 space-y-3">
            {timeline.map((item, i) => (
              <motion.div
                key={`${item.at}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + i * 0.06 }}
                className="flex items-center gap-3"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-50 text-lg">
                  {item.emoji}
                </span>
                <p className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">
                  {item.text}
                </p>
                <span className="shrink-0 text-xs font-bold text-primary-600">
                  +{item.xp} FP
                </span>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Next best action */}
      <NextBestAction progress={progress} />

      {/* Badges */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight text-ink">
            <Trophy className="size-5 text-gold-500" /> Badges
          </h2>
          <span className="text-sm font-medium text-ink-faint">
            {
              progress.earnedBadges.filter((id) =>
                badges.some((b) => b.id === id),
              ).length
            }{" "}
            / {badges.length}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {badges.map((badge, i) => {
            const earned = progress.earnedBadges.includes(badge.id);
            const date = progress.badgeDates?.[badge.id];
            const isRecent = earned && date && isWithinHours(date, 48);
            return (
              <motion.button
                key={badge.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + i * 0.04 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setOpenBadge(badge)}
                className={cn(
                  "cursor-pointer p-3 pb-2.5 text-center",
                  earned
                    ? cn("card-tint-gold ring-1 ring-gold-400/30", isRecent && "shimmer")
                    : "card-soft opacity-60",
                )}
              >
                <BadgeMedallion badge={badge} earned={earned} size={56} />
                <p className="mt-1 truncate text-xs font-bold text-ink">
                  {badge.name}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Détail badge : bottom sheet */}
      <AnimatePresence>
        {openBadge && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenBadge(null)}
              className="fixed inset-0 z-[70] bg-ink/45 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-x-0 bottom-0 z-[70] rounded-t-[2rem] bg-white p-6 pb-[max(env(safe-area-inset-bottom),1.5rem)] shadow-lift"
            >
              <button
                onClick={() => setOpenBadge(null)}
                aria-label="Fermer"
                className="absolute right-4 top-4 grid size-8 cursor-pointer place-items-center rounded-full bg-ink/5 text-ink-soft"
              >
                <X className="size-4" />
              </button>
              {(() => {
                const earned = progress.earnedBadges.includes(openBadge.id);
                const date = progress.badgeDates?.[openBadge.id];
                return (
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0.6, rotate: -8 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
                      className="inline-block"
                    >
                      <BadgeMedallion badge={openBadge} earned={earned} size={104} />
                    </motion.div>
                    <p className="mt-2 text-xl font-bold tracking-tight text-ink">
                      {openBadge.name}
                    </p>
                    <p className="mt-1.5 text-sm text-ink-soft">
                      {openBadge.description}
                    </p>
                    <div className="mt-4 rounded-2xl bg-cream p-3.5 text-sm">
                      {earned ? (
                        <p className="font-semibold text-gold-500">
                          🏆 Débloqué
                          {date
                            ? ` le ${new Date(date).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "long",
                              })}`
                            : ""}
                        </p>
                      ) : (
                        <p className="font-semibold text-ink-soft">
                          🔒 À débloquer : {openBadge.requirement}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
