"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  Ear,
  EarOff,
  Gauge,
  Headphones,
  MessagesSquare,
  Play,
  Target,
  Volume2,
  Zap,
} from "lucide-react";
import { rooms } from "@/data/rooms";
import { videoRooms } from "@/data/videoRooms";
import { getRoomById } from "@/data/rooms";
import { getDailyDrills } from "@/data/drills";
import { useProgress } from "@/lib/useProgress";
import { speakText } from "@/lib/speech";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { DrillSession } from "@/components/exercises/DrillSession";

const fastEnglishRoom = getRoomById("fast-english");

const accents = [
  {
    id: "US",
    label: "Accent américain",
    emoji: "🇺🇸",
    text: "Rythme rapide, voyelles étirées, contractions partout.",
  },
  {
    id: "UK",
    label: "Accent britannique",
    emoji: "🇬🇧",
    text: "Plus articulé, mais des mots avalés différemment.",
  },
  {
    id: "Mixed",
    label: "Accents mélangés",
    emoji: "🌍",
    text: "Le vrai monde : un mélange d'accents dans chaque scène.",
  },
] as const;

export default function ListenPage() {
  const { progress, ready, finishDrillSession } = useProgress();
  const [drillsOpen, setDrillsOpen] = useState(false);
  const completedIds = Object.keys(progress.completedRooms);
  const dailyDrills = getDailyDrills();

  const nativeSpeedRoom =
    rooms.find((r) => r.level === "B1" && !completedIds.includes(r.id)) ??
    rooms[5];
  const noSubtitlesRoom =
    rooms.find((r) => !completedIds.includes(r.id)) ?? rooms[0];

  // Weak spot : la room terminée avec le score de compréhension le plus bas.
  const weakest = Object.values(progress.completedRooms)
    .filter((r) => r.comprehension < 80)
    .sort((a, b) => a.comprehension - b.comprehension)[0];
  const weakestRoom = weakest ? getRoomById(weakest.roomId) : undefined;

  // Anti-flicker : on ne monte le contenu qu'une fois hydraté,
  // pour que les animations d'entrée jouent une seule fois, visibles.
  if (!ready) return <div aria-hidden className="min-h-[60vh]" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            Listen
          </h1>
          <p className="text-sm text-ink-soft">
            Entraîne ton oreille à l&apos;anglais qui va vite.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <ProgressRing
            value={progress.listeningScore}
            size={52}
            strokeWidth={5}
            label={
              <span className="text-xs font-bold text-ink">
                {progress.listeningScore}
              </span>
            }
          />
          <span className="mt-0.5 text-[10px] font-semibold text-ink-faint">
            Listening
          </span>
        </div>
      </div>

      {/* Challenge d'écoute du jour */}
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setDrillsOpen(true)}
        className="w-full cursor-pointer overflow-hidden rounded-3xl gradient-primary p-5 text-left text-white shadow-lift"
      >
        <div className="flex items-center justify-between">
          <Chip className="bg-white/15 text-white">
            <Ear className="size-3" /> Today&apos;s listening challenge
          </Chip>
          <span className="text-xs font-semibold opacity-85">2 min</span>
        </div>
        <p className="mt-3 text-xl font-bold">
          5 exercices pour ton oreille
        </p>
        <p className="mt-1 text-sm opacity-85">
          Sens caché, mots manquants, contractions à vitesse réelle. Nouveau
          chaque jour.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-primary-700">
          <Play className="size-3.5 fill-current" /> Lancer
        </div>
      </motion.button>

      {/* Weak spot */}
      {weakestRoom && (
        <Link href={`/app/room/${weakestRoom.id}`} className="block">
          <Card className="flex items-center gap-4 p-4 ring-1 ring-coral-100 transition-all hover:shadow-lift">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-coral-50 text-coral-500">
              <Target className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-ink">Ton point faible du moment</p>
              <p className="truncate text-sm text-ink-soft">
                {weakestRoom.emoji} {weakestRoom.title} — compris à{" "}
                {weakest.comprehension} %. Une réécoute et ça monte.
              </p>
            </div>
            <ChevronRight className="size-5 shrink-0 text-ink-faint" />
          </Card>
        </Link>
      )}

      {/* Fast English cards */}
      <section>
        <SectionTitle
          icon={<Zap className="size-4 text-coral-500" />}
          title="Fast English"
          subtitle="Les contractions qui rendent l'anglais « trop rapide »"
        />
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {(fastEnglishRoom?.phrases ?? []).map((phrase, i) => (
            <motion.button
              key={phrase.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => speakText(phrase.example, { rate: 1.05 })}
              className="card-soft cursor-pointer p-4 text-left transition-all hover:shadow-lift"
            >
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-ink">{phrase.english}</p>
                <Volume2 className="size-4 text-primary-500" />
              </div>
              <p className="mt-0.5 text-xs text-ink-soft">{phrase.french}</p>
            </motion.button>
          ))}
        </div>
        <Link href="/app/room/fast-english" className="mt-3 block">
          <div className="card-soft flex items-center gap-3 p-4 transition-all hover:shadow-lift">
            <span className="text-2xl">⚡️</span>
            <div className="flex-1">
              <p className="font-bold text-ink">
                Room complète : Understanding Fast English
              </p>
              <p className="text-sm text-ink-soft">
                gonna, wanna, gotta… décodés une bonne fois pour toutes
              </p>
            </div>
            <ChevronRight className="size-5 text-ink-faint" />
          </div>
        </Link>
      </section>

      {/* Challenges */}
      <section>
        <SectionTitle
          icon={<Gauge className="size-4 text-primary-500" />}
          title="Challenges d'écoute"
          subtitle="Pousse ton oreille un cran plus loin"
        />
        <div className="mt-3 space-y-3">
          <Link href={`/app/room/${nativeSpeedRoom.id}`} className="block">
            <Card className="flex items-center gap-4 p-4 transition-all hover:shadow-lift">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl gradient-primary text-white">
                <Gauge className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-ink">Native Speed Challenge</p>
                <p className="truncate text-sm text-ink-soft">
                  {nativeSpeedRoom.emoji} {nativeSpeedRoom.title} — à vitesse
                  réelle, sans ralenti
                </p>
              </div>
              <Chip tone="primary">{nativeSpeedRoom.levelLabel}</Chip>
            </Card>
          </Link>
          <Link href={`/app/room/${noSubtitlesRoom.id}`} className="block">
            <Card className="flex items-center gap-4 p-4 transition-all hover:shadow-lift">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-ink text-white">
                <EarOff className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-ink">No Subtitles Challenge</p>
                <p className="truncate text-sm text-ink-soft">
                  Écoute {noSubtitlesRoom.title} sans jamais ouvrir le
                  transcript
                </p>
              </div>
              <Chip tone="coral">Hard</Chip>
            </Card>
          </Link>
        </div>
      </section>

      {/* Mini-dialogues */}
      <section>
        <SectionTitle
          icon={<MessagesSquare className="size-4 text-mint-500" />}
          title="Mini-dialogues"
          subtitle="Des scènes courtes pour t'entraîner tous les jours"
        />
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {rooms.slice(0, 6).map((room, i) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="w-44 shrink-0"
            >
              <Link href={`/app/room/${room.id}`}>
                <div className="card-soft p-4 transition-all hover:shadow-lift">
                  <span className="text-3xl">{room.emoji}</span>
                  <p className="mt-2 font-bold leading-tight text-ink">
                    {room.title}
                  </p>
                  <p className="mt-1 text-xs text-ink-faint">
                    {room.duration} min · {room.accent}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Accents */}
      <section>
        <SectionTitle
          icon={<Headphones className="size-4 text-primary-500" />}
          title="Accents"
          subtitle="Chaque room a son accent — habitue ton oreille aux deux"
        />
        <div className="mt-3 space-y-3">
          {accents.map((accent) => {
            const accentRooms = rooms.filter((r) => r.accent === accent.id);
            const target = accentRooms[0];
            return (
              <Link
                key={accent.id}
                href={target ? `/app/room/${target.id}` : "/app/today"}
                className="block"
              >
                <Card className="flex items-center gap-4 p-4 transition-all hover:shadow-lift">
                  <span className="text-3xl">{accent.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-ink">{accent.label}</p>
                    <p className="truncate text-sm text-ink-soft">
                      {accent.text}
                    </p>
                  </div>
                  <Chip tone="neutral">
                    {accentRooms.length} room{accentRooms.length > 1 ? "s" : ""}
                  </Chip>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Video Rooms teaser */}
      <section>
        <SectionTitle
          icon={<Play className="size-4 text-coral-500" />}
          title="Video Rooms"
          subtitle="De vraies vidéos transformées en leçons — bientôt"
        />
        <div className="mt-3 space-y-3">
          {videoRooms.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="card-soft overflow-hidden p-0"
            >
              <div className="flex items-center gap-4 p-4">
                <span className="relative grid size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50">
                  <Play className="size-5 text-primary-600 fill-current" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-bold text-ink">{video.title}</p>
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-sm text-ink-soft">
                    {video.description}
                  </p>
                  <div className="mt-1.5 flex gap-1.5">
                    <Chip tone="neutral">{video.accent}</Chip>
                    <Chip tone="neutral">{video.difficulty}</Chip>
                    <Chip tone="gold">Bientôt</Chip>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Session d'exercices */}
      <AnimatePresence>
        {drillsOpen && (
          <DrillSession
            drills={dailyDrills}
            onFinish={finishDrillSession}
            onClose={() => setDrillsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function SectionTitle({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight text-ink">
        {icon} {title}
      </h2>
      <p className="text-sm text-ink-soft">{subtitle}</p>
    </div>
  );
}
