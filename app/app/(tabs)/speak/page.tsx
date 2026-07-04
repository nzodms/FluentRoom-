"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  MessageSquareQuote,
  Mic,
  Repeat2,
  Timer,
  Volume2,
} from "lucide-react";
import { rooms } from "@/data/rooms";
import { useProgress } from "@/lib/useProgress";
import { useRecognition } from "@/lib/useRecognition";
import { speakText } from "@/lib/speech";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { MicRecorder } from "@/components/room/MicRecorder";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { cn } from "@/lib/utils";

const CHALLENGE_TOPICS = [
  "Décris ta journée d'hier, en anglais.",
  "Explique ce que tu aimes faire le week-end.",
  "Décris ton plat préféré et pourquoi tu l'adores.",
  "Raconte ton dernier voyage ou une sortie récente.",
  "Présente-toi comme si tu rencontrais quelqu'un.",
];

const PRONUNCIATION_TIPS = [
  {
    sound: "TH",
    example: "think / that",
    tip: "Langue entre les dents, souffle doucement. Pas un « z », pas un « s ».",
  },
  {
    sound: "H",
    example: "happy / house",
    tip: "Souffle vraiment le H. « appy » et « happy » sont deux mots différents.",
  },
  {
    sound: "R",
    example: "really / water",
    tip: "Langue recourbée vers l'arrière, sans toucher le palais. Pas de R roulé.",
  },
  {
    sound: "-ED",
    example: "worked / played / wanted",
    tip: "« Worked » = workt, « played » = playd. Seul « wanted » ajoute une syllabe.",
  },
];

export default function SpeakPage() {
  const { progress, ready } = useProgress();
  const completedIds = Object.keys(progress.completedRooms);
  const shadowingRoom =
    rooms.find((r) => !completedIds.includes(r.id)) ?? rooms[0];

  return (
    <div className={cn("space-y-6 transition-opacity", !ready && "opacity-0")}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Speak</h1>
        <p className="text-sm text-ink-soft">
          Fais sortir les mots. Natural, not perfect.
        </p>
      </div>

      {/* 30-second challenge */}
      <ThirtySecondChallenge />

      {/* Shadowing */}
      <section>
        <SectionTitle
          icon={<Repeat2 className="size-4 text-primary-500" />}
          title="Shadowing practice"
          subtitle="Répète des phrases natives en copiant le rythme"
        />
        <Link href={`/app/room/${shadowingRoom.id}`} className="mt-3 block">
          <Card className="flex items-center gap-4 p-4 transition-all hover:shadow-lift">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl gradient-primary text-white">
              <Repeat2 className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-ink">Session recommandée</p>
              <p className="truncate text-sm text-ink-soft">
                {shadowingRoom.emoji} {shadowingRoom.title} · étape shadowing
                incluse
              </p>
            </div>
            <ChevronRight className="size-5 text-ink-faint" />
          </Card>
        </Link>
      </section>

      {/* Speak back situations */}
      <section>
        <SectionTitle
          icon={<MessageSquareQuote className="size-4 text-coral-500" />}
          title="Speak Back situations"
          subtitle="On te parle, tu réponds — comme dans la vraie vie"
        />
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {rooms.map((room, i) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="w-60 shrink-0"
            >
              <Link href={`/app/room/${room.id}`}>
                <div className="card-soft flex h-full flex-col p-4 transition-all hover:shadow-lift">
                  <span className="text-2xl">{room.emoji}</span>
                  <p className="mt-2 text-sm font-bold leading-snug text-ink">
                    “{room.speakBack.heard}”
                  </p>
                  <p className="mt-2 text-xs text-ink-faint">
                    Tu réponds quoi ? · {room.title}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Useful replies */}
      <section>
        <SectionTitle
          icon={<Mic className="size-4 text-mint-500" />}
          title="Useful replies"
          subtitle="Les réponses à avoir en réflexe — écoute et répète"
        />
        <div className="mt-3 grid grid-cols-2 gap-3">
          {[
            "No worries, take your time.",
            "Sounds good!",
            "I'm good, thanks.",
            "What about you?",
            "Let me check.",
            "That makes sense.",
          ].map((reply, i) => (
            <motion.button
              key={reply}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => speakText(reply)}
              className="card-soft flex cursor-pointer items-center gap-2.5 p-3.5 text-left transition-all hover:shadow-lift"
            >
              <Volume2 className="size-4 shrink-0 text-primary-500" />
              <span className="text-sm font-semibold text-ink">{reply}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Pronunciation basics */}
      <section>
        <SectionTitle
          icon={<Volume2 className="size-4 text-primary-500" />}
          title="Pronunciation basics"
          subtitle="Les 4 sons qui trahissent les francophones"
        />
        <div className="mt-3 space-y-3">
          {PRONUNCIATION_TIPS.map((tip, i) => (
            <motion.div
              key={tip.sound}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="card-soft flex items-center gap-4 p-4"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary-50 text-sm font-bold text-primary-700">
                {tip.sound}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-ink-soft">{tip.tip}</p>
                <button
                  onClick={() => speakText(tip.example, { rate: 0.85 })}
                  className="mt-1 inline-flex cursor-pointer items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-700"
                >
                  <Volume2 className="size-3" /> {tip.example}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ThirtySecondChallenge() {
  const recognition = useRecognition();
  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [topicIndex, setTopicIndex] = useState(0);
  const [finishedWords, setFinishedWords] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    recognition.stop();
    setRunning(false);
    const words = recognition.transcript
      .split(/\s+/)
      .filter(Boolean).length;
    setFinishedWords(words);
  };

  const start = () => {
    setFinishedWords(null);
    setSecondsLeft(30);
    setRunning(true);
    if (recognition.supported) recognition.start();
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          stop();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const nextTopic = () =>
    setTopicIndex((i) => (i + 1) % CHALLENGE_TOPICS.length);

  return (
    <div className="overflow-hidden rounded-[1.75rem] shadow-lift">
      <div className="gradient-primary p-5 text-white">
        <div className="flex items-center justify-between">
          <Chip className="bg-white/15 text-white">
            <Timer className="size-3" /> 30-Second Challenge
          </Chip>
          {!running && (
            <button
              onClick={nextTopic}
              className="cursor-pointer text-xs font-semibold opacity-85 hover:opacity-100"
            >
              Autre sujet ↺
            </button>
          )}
        </div>
        <p className="mt-3 text-lg font-bold leading-snug">
          {CHALLENGE_TOPICS[topicIndex]}
        </p>
        <p className="mt-1 text-sm opacity-85">
          Parle 30 secondes sans t&apos;arrêter. Les erreurs sont autorisées —
          le silence, non.
        </p>

        <div className="mt-5 flex items-center justify-center gap-6">
          {running ? (
            <>
              <ProgressRing
                value={(secondsLeft / 30) * 100}
                size={72}
                strokeWidth={6}
                color="white"
                label={
                  <span className="text-xl font-bold text-white">
                    {secondsLeft}
                  </span>
                }
              />
              <MicRecorder
                listening={recognition.listening}
                supported
                onStart={() => {}}
                onStop={stop}
                size="md"
              />
            </>
          ) : (
            <Button
              size="lg"
              className="bg-white !text-primary-700"
              style={{ background: "white" }}
              onClick={start}
            >
              <Mic className="size-4" /> Lancer le challenge
            </Button>
          )}
        </div>

        <AnimatePresence>
          {running && recognition.transcript && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 rounded-2xl bg-white/10 p-3 text-sm italic"
            >
              “{recognition.transcript}”
            </motion.p>
          )}
          {finishedWords !== null && !running && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-2xl bg-white/10 p-4 text-center"
            >
              {recognition.supported ? (
                <>
                  <p className="text-2xl font-bold">{finishedWords} mots</p>
                  <p className="text-sm opacity-85">
                    {finishedWords >= 40
                      ? "Excellent débit ! Tu parles sans bloquer."
                      : finishedWords >= 15
                        ? "Bien joué. Chaque mot sorti est une victoire."
                        : "C'est un début — relance et vise plus de mots."}
                  </p>
                </>
              ) : (
                <p className="text-sm opacity-90">
                  ⏱️ Temps écoulé ! (Micro non supporté ici — l&apos;important
                  est d&apos;avoir parlé à voix haute.)
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
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
