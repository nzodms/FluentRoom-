"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Flame,
  Play,
  Clock,
  Target,
  Gift,
  Check,
  Lock,
  ChevronRight,
} from "lucide-react";
import { getTodayRoom, rooms } from "@/data/rooms";
import { getLevelForXp, getNextLevel } from "@/data/levels";
import { useProgress } from "@/lib/useProgress";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";

export default function TodayPage() {
  const { progress, ready, stats } = useProgress();

  const completedIds = Object.keys(progress.completedRooms);
  const todayRoom = getTodayRoom(completedIds);
  const level = getLevelForXp(progress.xp);
  const nextLevel = getNextLevel(progress.xp);
  const levelProgress = nextLevel
    ? ((progress.xp - level.minXp) / (nextLevel.minXp - level.minXp)) * 100
    : 100;
  const firstName = progress.onboarding?.profileName ?? null;

  return (
    <div className={cn("space-y-5 transition-opacity", !ready && "opacity-0")}>
      {/* Salutation + streak */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            {completedIds.length > 0 ? "Content de te revoir 👋" : "Bienvenue 👋"}
          </h1>
          <p className="text-sm text-ink-soft">
            {firstName
              ? `Profil ${firstName} · ${level.name}`
              : "Ta session du jour t'attend."}
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-2xl bg-coral-50 px-3 py-2">
          <Flame
            className={cn(
              "size-5",
              progress.streak > 0 ? "text-coral-500" : "text-ink-faint",
            )}
            fill={progress.streak > 0 ? "currentColor" : "none"}
          />
          <span className="text-lg font-bold text-ink">{progress.streak}</span>
        </div>
      </div>

      {/* Niveau + scores */}
      <Card animate className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint">
              Niveau
            </p>
            <p className="mt-0.5 text-lg font-bold text-ink">{level.name}</p>
            <p className="text-xs text-ink-faint">
              Équivalent {level.cefr} · {progress.xp} FP
            </p>
          </div>
          <div className="flex gap-4">
            <ScoreRing
              label="Écoute"
              value={progress.listeningScore}
              color="var(--color-primary-500)"
            />
            <ScoreRing
              label="Oral"
              value={progress.speakingScore}
              color="var(--color-mint-500)"
            />
          </div>
        </div>
        {nextLevel && (
          <div className="mt-4">
            <div className="mb-1.5 flex justify-between text-xs font-medium text-ink-faint">
              <span>Vers {nextLevel.name}</span>
              <span>
                {progress.xp} / {nextLevel.minXp} FP
              </span>
            </div>
            <ProgressBar value={levelProgress} />
          </div>
        )}
      </Card>

      {/* Today's Room */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
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
          <h2 className="mt-4 text-3xl font-bold tracking-tight">
            {todayRoom.emoji} {todayRoom.title}
          </h2>
          <p className="mt-1.5 text-[15px] opacity-90">{todayRoom.subtitle}</p>

          <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-2xl bg-white/10 p-3">
              <Clock className="size-4 opacity-80" />
              <p className="mt-1.5 font-bold">{todayRoom.duration} min</p>
              <p className="text-xs opacity-75">Durée</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3">
              <Target className="size-4 opacity-80" />
              <p className="mt-1.5 font-bold">{todayRoom.focus}</p>
              <p className="text-xs opacity-75">Focus</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3">
              <Gift className="size-4 opacity-80" />
              <p className="mt-1.5 font-bold">
                +{todayRoom.phrases.length} phrases
              </p>
              <p className="text-xs opacity-75">Récompense</p>
            </div>
          </div>

          <p className="mt-4 text-sm opacity-85">
            <span className="font-semibold">Objectif :</span> {todayRoom.goal}
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

      {/* Objectif du jour */}
      <Card animate delay={0.15} className="flex items-center gap-4 p-4">
        <ProgressRing
          value={
            completedIds.length > 0 &&
            progress.lastActiveDate === new Date().toISOString().slice(0, 10) &&
            Object.values(progress.completedRooms).some(
              (r) =>
                r.completedAt.slice(0, 10) ===
                new Date().toISOString().slice(0, 10),
            )
              ? 100
              : 0
          }
          size={56}
          strokeWidth={6}
          color="var(--color-coral-500)"
          label={<span className="text-base">🎯</span>}
        />
        <div className="flex-1">
          <p className="font-bold text-ink">Objectif du jour</p>
          <p className="text-sm text-ink-soft">
            1 room complète ·{" "}
            {progress.onboarding?.dailyMinutes ?? 10} min d&apos;entraînement
          </p>
        </div>
      </Card>

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
                transition={{ delay: 0.2 + i * 0.04, duration: 0.4 }}
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
                        {room.levelLabel} · {room.duration} min ·{" "}
                        {room.accent}
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

function ScoreRing({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <ProgressRing
        value={value}
        size={52}
        strokeWidth={5}
        color={color}
        label={
          <span className="text-xs font-bold text-ink">{value}</span>
        }
      />
      <span className="text-[11px] font-semibold text-ink-faint">{label}</span>
    </div>
  );
}
