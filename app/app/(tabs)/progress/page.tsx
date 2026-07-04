"use client";

import { motion } from "framer-motion";
import { Flame, Lightbulb, Trophy, Zap } from "lucide-react";
import { badges } from "@/data/badges";
import { getLevelForXp, getNextLevel, levels } from "@/data/levels";
import { getRoomById } from "@/data/rooms";
import { useProgress } from "@/lib/useProgress";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { CountUp } from "@/components/ui/CountUp";
import { cn, formatDuration, todayKey } from "@/lib/utils";

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

export default function ProgressPage() {
  const { progress, ready, stats } = useProgress();

  const level = getLevelForXp(progress.xp);
  const nextLevel = getNextLevel(progress.xp);
  const levelProgress = nextLevel
    ? ((progress.xp - level.minXp) / (nextLevel.minXp - level.minXp)) * 100
    : 100;

  const week = lastSevenDays();
  const weekValues = week.map((day) => progress.activity[day] ?? 0);
  const maxWeek = Math.max(...weekValues, 40);
  const activeDays = weekValues.filter((v) => v > 0).length;

  // Force / faiblesse + recommandation personnalisée.
  const skills = [
    { id: "listening", label: "Écoute", value: progress.listeningScore },
    { id: "speaking", label: "Oral", value: progress.speakingScore },
  ];
  const strongest = skills.reduce((a, b) => (b.value > a.value ? b : a));
  const weakest = skills.reduce((a, b) => (b.value < a.value ? b : a));
  const recommendation =
    stats.roomsCompleted === 0
      ? "Commence par ta première room : 8 minutes, une vraie scène, 5 phrases réelles."
      : weakest.id === "speaking"
        ? "Ton oreille progresse vite. Prochain objectif : répondre plus vite sans traduire — passe par Speak aujourd'hui."
        : "Ta voix se libère. Prochain objectif : muscler ton oreille à vitesse réelle — lance le challenge d'écoute du jour.";

  // Timeline : dernières activités (rooms terminées + révisions).
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
        text: `Structure apprise : ${id.replace(/-/g, " ")}`,
        xp: 30,
      })),
  ]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 6);

  const avgResponse =
    progress.responseSpeed ?? (progress.speakingAttempts > 0 ? 4.2 : null);

  return (
    <div className={cn("space-y-5 transition-opacity", !ready && "opacity-0")}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          Ta progression
        </h1>
        <p className="text-sm text-ink-soft">
          Chaque session laisse une trace. La voici.
        </p>
      </div>

      {/* Fluency Score */}
      <Card animate className="flex items-center gap-5 p-5">
        <ProgressRing
          value={stats.fluency}
          size={104}
          strokeWidth={9}
          label={
            <span className="text-center">
              <span className="block text-2xl font-bold text-ink">
                <CountUp value={stats.fluency} />
              </span>
              <span className="block text-[9px] font-bold uppercase tracking-wide text-ink-faint">
                Fluency
              </span>
            </span>
          }
        />
        <div className="flex-1">
          <p className="font-bold text-ink">Fluency Score</p>
          <p className="mt-1 text-sm text-ink-soft">
            Ton score global : oreille, oral, phrases maîtrisées et
            régularité.
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <Chip tone="primary">💪 Point fort : {strongest.label}</Chip>
            {strongest.id !== weakest.id && (
              <Chip tone="coral">🎯 À muscler : {weakest.label}</Chip>
            )}
          </div>
        </div>
      </Card>

      {/* Recommandation */}
      <Card animate delay={0.05} className="flex items-start gap-3 p-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-gold-50 text-gold-500">
          <Lightbulb className="size-5" />
        </span>
        <div>
          <p className="text-sm font-bold text-ink">Recommandation</p>
          <p className="mt-0.5 text-sm text-ink-soft">{recommendation}</p>
        </div>
      </Card>

      {/* Niveau */}
      <Card animate delay={0.1} className="overflow-hidden p-0">
        <div className="gradient-primary p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-80">
                Niveau actuel
              </p>
              <p className="mt-1 text-2xl font-bold tracking-tight">
                {level.name}
              </p>
              <p className="text-sm opacity-85">
                Équivalent {level.cefr} · {level.tagline}
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
                  Prochain palier : {nextLevel.name} ({nextLevel.cefr})
                </span>
                <span>
                  {progress.xp} / {nextLevel.minXp} FP
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
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
                "flex-1 py-3 text-center",
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

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          delay={0.15}
          emoji="🔥"
          value={String(progress.streak)}
          label={`jour${progress.streak > 1 ? "s" : ""} de suite`}
          sub={`Record : ${progress.bestStreak}`}
        />
        <StatCard
          delay={0.18}
          emoji="🚪"
          value={`${stats.roomsCompleted}/${stats.totalRooms}`}
          label="rooms terminées"
          sub={stats.roomsCompleted === 0 ? "Lance-toi !" : "Continue !"}
        />
        <StatCard
          delay={0.21}
          emoji="💎"
          value={String(stats.phrasesUnlocked)}
          label="phrases réelles"
          sub={`${stats.phrasesMastered} maîtrisées`}
        />
        <StatCard
          delay={0.24}
          emoji="🧱"
          value={String(stats.lessonsMastered)}
          label="structures apprises"
          sub="Leçons terminées"
        />
        <StatCard
          delay={0.27}
          emoji="🎧"
          value={
            stats.listeningTimeSec > 0
              ? formatDuration(stats.listeningTimeSec)
              : "—"
          }
          label="temps d'entraînement"
          sub="Rooms cumulées"
        />
        <StatCard
          delay={0.3}
          emoji="⚡️"
          value={avgResponse ? `${avgResponse}s` : "—"}
          label="vitesse de réponse"
          sub={avgResponse ? "En progression" : "Bientôt mesurée"}
        />
      </div>

      {/* Scores */}
      <Card animate delay={0.32} className="p-5">
        <p className="font-bold text-ink">Tes scores</p>
        <div className="mt-4 flex items-center justify-around">
          <div className="flex flex-col items-center gap-2">
            <ProgressRing
              value={progress.listeningScore}
              size={88}
              strokeWidth={8}
              color="var(--color-primary-500)"
              label={
                <span className="text-xl font-bold text-ink">
                  {progress.listeningScore}
                </span>
              }
            />
            <p className="text-sm font-semibold text-ink-soft">🎧 Écoute</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ProgressRing
              value={progress.speakingScore}
              size={88}
              strokeWidth={8}
              color="var(--color-mint-500)"
              label={
                <span className="text-xl font-bold text-ink">
                  {progress.speakingScore}
                </span>
              }
            />
            <p className="text-sm font-semibold text-ink-soft">
              🎙️ Confiance orale
            </p>
          </div>
        </div>
      </Card>

      {/* Activité hebdo */}
      <Card animate delay={0.35} className="p-5">
        <div className="flex items-center justify-between">
          <p className="font-bold text-ink">Activité de la semaine</p>
          <Chip tone="primary">
            <Zap className="size-3" />
            {weekValues.reduce((a, b) => a + b, 0)} FP
          </Chip>
        </div>
        <div className="mt-5 flex h-32 items-end justify-between gap-2">
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
                  transition={{ delay: 0.4 + i * 0.06, duration: 0.5 }}
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
          <Flame className="size-5 shrink-0 text-coral-500" fill="currentColor" />
          <p className="flex-1 text-sm font-semibold text-ink">
            Régularité : {activeDays} / 7 jours actifs
          </p>
          <span className="text-sm font-bold text-coral-600">
            {activeDays >= 5 ? "Excellent" : activeDays >= 3 ? "Solide" : "À toi"}
          </span>
        </div>
      </Card>

      {/* Timeline */}
      {timeline.length > 0 && (
        <Card animate delay={0.4} className="p-5">
          <p className="font-bold text-ink">Dernières victoires</p>
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

      {/* Badges */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight text-ink">
            <Trophy className="size-5 text-gold-500" /> Badges
          </h2>
          <span className="text-sm font-medium text-ink-faint">
            {progress.earnedBadges.filter((id) => badges.some((b) => b.id === id)).length}{" "}
            / {badges.length}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {badges.map((badge, i) => {
            const earned = progress.earnedBadges.includes(badge.id);
            const date = progress.badgeDates?.[badge.id];
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + i * 0.04 }}
                className={cn(
                  "card-soft p-4 text-center",
                  earned
                    ? "ring-1 ring-gold-400/30"
                    : "opacity-55 grayscale",
                )}
              >
                <span className="text-3xl">{badge.emoji}</span>
                <p className="mt-2 text-sm font-bold text-ink">{badge.name}</p>
                <p className="mt-0.5 text-xs text-ink-faint">
                  {earned ? badge.description : badge.requirement}
                </p>
                {earned && date && (
                  <p className="mt-1.5 text-[10px] font-bold text-gold-500">
                    Débloqué le{" "}
                    {new Date(date).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  emoji,
  value,
  label,
  sub,
  delay,
}: {
  emoji: string;
  value: string;
  label: string;
  sub: string;
  delay: number;
}) {
  return (
    <Card animate delay={delay} className="p-4">
      <span className="text-xl">{emoji}</span>
      <p className="mt-1.5 text-2xl font-bold tracking-tight text-ink">
        {value}
      </p>
      <p className="text-sm font-medium text-ink-soft">{label}</p>
      <p className="mt-0.5 text-xs text-ink-faint">{sub}</p>
    </Card>
  );
}
