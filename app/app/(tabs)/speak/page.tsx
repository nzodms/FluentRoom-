"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronRight,
  History,
  MessageSquareQuote,
  Mic,
  Repeat2,
  ShieldCheck,
  Timer,
  Volume2,
} from "lucide-react";
import type { Phrase } from "@/types/learning";
import { rooms } from "@/data/rooms";
import { getPhraseById } from "@/data/phrases";
import { useProgress } from "@/lib/useProgress";
import { companionLine } from "@/lib/companion";
import { CompanionHint } from "@/components/companion/CompanionHint";
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
  const { progress, ready, practice } = useProgress();
  const completedIds = Object.keys(progress.completedRooms);
  const shadowingRoom =
    rooms.find((r) => !completedIds.includes(r.id)) ?? rooms[0];

  // Confidence builder : 3 phrases déjà débloquées, faciles à dire.
  const confidencePhrases = rooms
    .flatMap((r) => r.phrases)
    .filter((p) => progress.phrases[p.id])
    .slice(0, 3);

  const attempts = [...progress.practiceLog].reverse().slice(0, 5);

  // Anti-flicker : on ne monte le contenu qu'une fois hydraté,
  // pour que les animations d'entrée jouent une seule fois, visibles.
  if (!ready) return <div aria-hidden className="min-h-[60vh]" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Oral</h1>
          <p className="text-sm text-ink-soft">
            Entraîne-toi à répondre naturellement, sans chercher tes mots.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <ProgressRing
            value={progress.speakingScore}
            size={52}
            strokeWidth={5}
            color="var(--color-mint-500)"
            label={
              <span className="text-xs font-bold text-ink">
                {progress.speakingScore}
              </span>
            }
          />
          <span className="mt-0.5 text-[10px] font-semibold text-ink-faint">
            Confiance
          </span>
        </div>
      </div>

      {/* Le compagnon dédramatise */}
      <CompanionHint
        progress={progress}
        line={companionLine("speak-hint", progress)}
        expression="encouraging"
      />

      {/* 30-second challenge */}
      <ThirtySecondChallenge />

      {/* Confidence builder */}
      {confidencePhrases.length === 3 && (
        <ConfidenceBuilder
          phrases={confidencePhrases}
          onSaid={(phraseId) =>
            practice({
              phraseId,
              score: 70,
              transcript: "",
              markedManually: true,
              at: new Date().toISOString(),
            })
          }
        />
      )}

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

      {/* Historique des essais */}
      {attempts.length > 0 && (
        <section>
          <SectionTitle
            icon={<History className="size-4 text-ink-faint" />}
            title="Tes derniers essais"
            subtitle="Chaque tentative compte — regarde la courbe monter"
          />
          <div className="mt-3 space-y-2">
            {attempts.map((attempt, i) => {
              const phrase = getPhraseById(attempt.phraseId);
              return (
                <motion.div
                  key={`${attempt.at}-${i}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card-soft flex items-center gap-3 px-4 py-3"
                >
                  <span
                    className={cn(
                      "grid size-9 shrink-0 place-items-center rounded-full text-xs font-bold",
                      attempt.score >= 65
                        ? "bg-mint-50 text-mint-600"
                        : "bg-gold-50 text-gold-500",
                    )}
                  >
                    {attempt.score}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-ink">
                      {phrase?.english ?? attempt.phraseId}
                    </p>
                    <p className="text-xs text-ink-faint">
                      {attempt.markedManually
                        ? "Pratiquée à voix haute"
                        : `Micro : “${attempt.transcript.slice(0, 40)}”`}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

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

/** 3 phrases faciles à dire à voix haute — pour se lancer sans pression. */
function ConfidenceBuilder({
  phrases,
  onSaid,
}: {
  phrases: Phrase[];
  onSaid: (phraseId: string) => void;
}) {
  const [said, setSaid] = useState<Set<string>>(new Set());
  const allDone = said.size === phrases.length;

  const markSaid = (phrase: Phrase) => {
    if (said.has(phrase.id)) return;
    setSaid((prev) => new Set(prev).add(phrase.id));
    onSaid(phrase.id);
  };

  return (
    <section className="card-soft p-5">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 font-bold text-ink">
          <ShieldCheck className="size-4 text-mint-500" /> Confidence builder
        </p>
        {allDone && <Chip tone="mint">3/3 ✓</Chip>}
      </div>
      <p className="mt-1 text-sm text-ink-soft">
        Dis ces 3 phrases à voix haute, là, maintenant. Personne n&apos;écoute
        — c&apos;est le but.
      </p>
      <div className="mt-3.5 space-y-2">
        {phrases.map((phrase) => {
          const done = said.has(phrase.id);
          return (
            <div
              key={phrase.id}
              className={cn(
                "flex items-center gap-3 rounded-2xl border border-ink/5 p-3 transition-all",
                done && "bg-mint-50 border-mint-400/30",
              )}
            >
              <button
                onClick={() => speakText(phrase.english)}
                aria-label="Écouter"
                className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full bg-primary-50 text-primary-600"
              >
                <Volume2 className="size-3.5" />
              </button>
              <p className="min-w-0 flex-1 truncate text-sm font-bold text-ink">
                {phrase.english}
              </p>
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => markSaid(phrase)}
                disabled={done}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition-all",
                  done
                    ? "bg-mint-500 text-white"
                    : "cursor-pointer bg-ink/5 text-ink-soft hover:bg-primary-50 hover:text-primary-600",
                )}
              >
                {done ? (
                  <span className="inline-flex items-center gap-1">
                    <Check className="size-3" strokeWidth={3.5} /> Dite
                  </span>
                ) : (
                  "Je l'ai dite"
                )}
              </motion.button>
            </div>
          );
        })}
      </div>
      {allDone && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 rounded-2xl bg-mint-50 p-3 text-sm font-semibold text-mint-600"
        >
          Trois phrases dites. C&apos;est exactement comme ça qu&apos;on
          arrête de bloquer.
        </motion.p>
      )}
    </section>
  );
}
