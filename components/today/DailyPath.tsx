"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Check,
  ChevronRight,
  Flame,
  Headphones,
  RotateCcw,
  Volume2,
} from "lucide-react";
import type { DailyStepId, Lesson, Phrase, Room } from "@/types/learning";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { speakText } from "@/lib/speech";
import { cn } from "@/lib/utils";

interface PathStep {
  id: DailyStepId;
  title: string;
  minutes: number;
  detail: string;
  icon: React.ReactNode;
  href?: string;
  locked?: boolean;
  lockedHint?: string;
}

interface DailyPathProps {
  room: Room;
  lesson: Lesson;
  warmupPhrases: Phrase[];
  doneSteps: DailyStepId[];
  reviewAvailable: boolean;
  onWarmupDone: () => void;
}

/** Le chemin quotidien : 4 étapes, cochées avec animation, XP à la clé. */
export function DailyPath({
  room,
  lesson,
  warmupPhrases,
  doneSteps,
  reviewAvailable,
  onWarmupDone,
}: DailyPathProps) {
  const [warmupOpen, setWarmupOpen] = useState(false);
  const [heard, setHeard] = useState<Set<string>>(new Set());

  const steps: PathStep[] = [
    {
      id: "warmup",
      title: "Warm-up",
      minutes: 1,
      detail: "Réveille ton oreille avec 3 phrases",
      icon: <Flame className="size-4" strokeWidth={2.2} />,
    },
    {
      id: "room",
      title: `Room · ${room.title}`,
      minutes: room.duration,
      detail: "Listen · Decode · Speak — la scène du jour",
      icon: <Headphones className="size-4" strokeWidth={2.2} />,
      href: `/app/room/${room.id}`,
    },
    {
      id: "lesson",
      title: `Leçon · ${lesson.structure}`,
      minutes: 3,
      detail: lesson.title,
      icon: <BookOpen className="size-4" strokeWidth={2.2} />,
      href: `/app/lesson/${lesson.id}`,
    },
    {
      id: "review",
      title: "Review",
      minutes: 1,
      detail: reviewAvailable
        ? "5 phrases à ancrer pour de bon"
        : "Débloque d'abord des phrases dans la room",
      icon: <RotateCcw className="size-4" strokeWidth={2.2} />,
      href: reviewAvailable ? "/app/phrases?review=1" : undefined,
      locked: !reviewAvailable,
    },
  ];

  const markHeard = (phrase: Phrase) => {
    speakText(phrase.english);
    setHeard((prev) => new Set(prev).add(phrase.id));
  };

  return (
    <div className="card-soft overflow-hidden p-0">
      <div className="flex items-center justify-between px-5 pt-4">
        <p className="font-bold text-ink">Today&apos;s path</p>
        <span className="text-xs font-semibold text-ink-faint">
          {doneSteps.length} / {steps.length}
        </span>
      </div>

      <div className="p-3">
        {steps.map((step, i) => {
          const done = doneSteps.includes(step.id);
          const isWarmup = step.id === "warmup";
          const content = (
            <div
              className={cn(
                "flex items-center gap-3.5 rounded-2xl p-3 transition-colors",
                done ? "opacity-70" : "hover:bg-primary-50/60",
                step.locked && "opacity-50",
              )}
            >
              {/* Pastille + ligne verticale */}
              <div className="relative flex flex-col items-center self-stretch">
                <motion.span
                  animate={
                    done
                      ? { scale: [1, 1.25, 1] }
                      : {}
                  }
                  transition={{ duration: 0.45 }}
                  className={cn(
                    "z-10 grid size-9 shrink-0 place-items-center rounded-full",
                    done
                      ? "gradient-mint text-white shadow-[0_4px_12px_-2px_rgba(44,183,131,0.5)]"
                      : "bg-primary-50 text-primary-600",
                  )}
                >
                  {done ? (
                    <Check className="size-4" strokeWidth={3.5} />
                  ) : (
                    step.icon
                  )}
                </motion.span>
                {i < steps.length - 1 && (
                  <span
                    className={cn(
                      "absolute top-9 bottom-[-14px] w-0.5 rounded-full",
                      done ? "bg-mint-400/50" : "bg-ink/8",
                    )}
                  />
                )}
              </div>
              <div className="min-w-0 flex-1 py-0.5">
                <p
                  className={cn(
                    "truncate text-[15px] font-bold",
                    done ? "text-ink-faint line-through decoration-2" : "text-ink",
                  )}
                >
                  {step.title}
                </p>
                <p className="truncate text-xs text-ink-faint">{step.detail}</p>
              </div>
              <Chip tone={done ? "mint" : "neutral"} className="shrink-0">
                {done ? "Fait ✓" : `${step.minutes} min`}
              </Chip>
              {!done && !isWarmup && !step.locked && (
                <ChevronRight className="size-4 shrink-0 text-ink-faint" />
              )}
            </div>
          );

          if (isWarmup) {
            return (
              <div key={step.id}>
                <button
                  className="w-full cursor-pointer text-left"
                  onClick={() => !done && setWarmupOpen((v) => !v)}
                >
                  {content}
                </button>
                <AnimatePresence initial={false}>
                  {warmupOpen && !done && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-[3.4rem] mr-3 mb-2 space-y-2 rounded-2xl bg-cream/70 p-3">
                        <p className="text-xs font-semibold text-ink-soft">
                          Écoute ces 3 phrases. Juste écouter — ton oreille se
                          met en route.
                        </p>
                        {warmupPhrases.map((phrase) => (
                          <button
                            key={phrase.id}
                            onClick={() => markHeard(phrase)}
                            className={cn(
                              "flex w-full cursor-pointer items-center gap-2.5 rounded-xl bg-white p-2.5 text-left shadow-soft transition-all",
                              heard.has(phrase.id) && "ring-1 ring-mint-400",
                            )}
                          >
                            <span
                              className={cn(
                                "grid size-7 shrink-0 place-items-center rounded-full",
                                heard.has(phrase.id)
                                  ? "bg-mint-50 text-mint-600"
                                  : "bg-primary-50 text-primary-600",
                              )}
                            >
                              {heard.has(phrase.id) ? (
                                <Check className="size-3.5" strokeWidth={3} />
                              ) : (
                                <Volume2 className="size-3.5" />
                              )}
                            </span>
                            <span className="text-sm font-semibold text-ink">
                              {phrase.english}
                            </span>
                          </button>
                        ))}
                        <Button
                          size="sm"
                          fullWidth
                          disabled={heard.size < warmupPhrases.length}
                          onClick={() => {
                            onWarmupDone();
                            setWarmupOpen(false);
                          }}
                        >
                          {heard.size < warmupPhrases.length
                            ? `Écoute encore ${warmupPhrases.length - heard.size} phrase${warmupPhrases.length - heard.size > 1 ? "s" : ""}`
                            : "Échauffement terminé · +5 FP"}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          if (step.href && !done) {
            return (
              <Link key={step.id} href={step.href} className="block">
                {content}
              </Link>
            );
          }
          return <div key={step.id}>{content}</div>;
        })}
      </div>
    </div>
  );
}
