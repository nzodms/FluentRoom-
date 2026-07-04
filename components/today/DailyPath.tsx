"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Check,
  Flame,
  Gift,
  Headphones,
  Lock,
  RotateCcw,
  Volume2,
  Zap,
} from "lucide-react";
import type { DailyStepId, Lesson, Phrase, Room } from "@/types/learning";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { XPBubble } from "@/components/reward/XPBubble";
import { CHEST_XP } from "@/lib/progress";
import { speakText } from "@/lib/speech";
import { cn } from "@/lib/utils";

type NodeState = "completed" | "current" | "available" | "locked" | "reward";

interface DailyPathProps {
  room: Room;
  lesson: Lesson;
  warmupPhrases: Phrase[];
  doneSteps: DailyStepId[];
  reviewAvailable: boolean;
  chestClaimed: boolean;
  onWarmupDone: () => void;
  onChestClaim: () => void;
}

/** Microcopy contextuel qui pousse à finir la session. */
function pathHint(doneSteps: DailyStepId[], chestClaimed: boolean): string {
  const n = doneSteps.length;
  if (n === 0) return "Ton oreille t'attend. Première étape : 1 minute.";
  if (n === 1) return "Ton oreille chauffe. Continue.";
  if (n === 2) return "Plus que 2 étapes pour sécuriser ta série.";
  if (n === 3) return "Tu es à une étape d'ouvrir ton coffre.";
  if (!chestClaimed) return "Path terminé — ton coffre t'attend. 🎁";
  return "Journée complète. Ton anglais devient automatique.";
}

/**
 * Today's Fluency Path : chemin vertical à nodes, avec le coffre en
 * récompense finale. Chaque étape cochée = une petite victoire visible.
 */
export function DailyPath({
  room,
  lesson,
  warmupPhrases,
  doneSteps,
  reviewAvailable,
  chestClaimed,
  onWarmupDone,
  onChestClaim,
}: DailyPathProps) {
  const [warmupOpen, setWarmupOpen] = useState(false);
  const [heard, setHeard] = useState<Set<string>>(new Set());
  const [warmupBubble, setWarmupBubble] = useState<number | null>(null);
  const [chestBubble, setChestBubble] = useState<number | null>(null);

  const stepOrder: DailyStepId[] = ["warmup", "room", "lesson", "review"];
  const firstPending = stepOrder.find((s) => !doneSteps.includes(s));
  const chestUnlocked = doneSteps.includes("room");

  const nodeState = (id: DailyStepId): NodeState => {
    if (doneSteps.includes(id)) return "completed";
    if (id === "review" && !reviewAvailable) return "locked";
    if (id === firstPending) return "current";
    return "available";
  };

  const steps = [
    {
      id: "warmup" as const,
      title: "Warm-up",
      minutes: 1,
      detail: "Réveille ton oreille avec 3 phrases",
      icon: <Flame className="size-4" strokeWidth={2.2} />,
    },
    {
      id: "room" as const,
      title: `Room · ${room.title}`,
      minutes: room.duration,
      detail: "Listen · Decode · Speak — la scène du jour",
      icon: <Headphones className="size-4" strokeWidth={2.2} />,
      href: `/app/room/${room.id}`,
    },
    {
      id: "lesson" as const,
      title: `Bloc · ${lesson.structure}`,
      minutes: 3,
      detail: lesson.title,
      icon: <BookOpen className="size-4" strokeWidth={2.2} />,
      href: `/app/lesson/${lesson.id}`,
    },
    {
      id: "review" as const,
      title: "Révision express",
      minutes: 1,
      detail: reviewAvailable
        ? "5 phrases à ancrer pour de bon"
        : "Débloque d'abord des phrases dans la room",
      icon: <RotateCcw className="size-4" strokeWidth={2.2} />,
      href: reviewAvailable ? "/app/phrases?review=1" : undefined,
    },
  ];

  const markHeard = (phrase: Phrase) => {
    speakText(phrase.english);
    setHeard((prev) => new Set(prev).add(phrase.id));
  };

  const completeWarmup = () => {
    onWarmupDone();
    setWarmupOpen(false);
    setWarmupBubble(5);
    setTimeout(() => setWarmupBubble(null), 1100);
  };

  const claimChest = () => {
    onChestClaim();
    setChestBubble(CHEST_XP);
    setTimeout(() => setChestBubble(null), 1100);
  };

  return (
    <div className="card-soft relative overflow-hidden p-0">
      <div className="flex items-center justify-between px-5 pt-4">
        <p className="font-bold text-ink">Today&apos;s Fluency Path</p>
        <span className="text-xs font-semibold text-ink-faint">
          {doneSteps.length + (chestClaimed ? 1 : 0)} / 5
        </span>
      </div>
      <p className="px-5 pt-1 text-xs font-medium text-ink-soft">
        {pathHint(doneSteps, chestClaimed)}
      </p>

      <div className="p-3">
        {steps.map((step, i) => {
          const state = nodeState(step.id);
          const done = state === "completed";
          const isWarmup = step.id === "warmup";
          const prevDone =
            i === 0 || doneSteps.includes(steps[i - 1].id);

          const node = (
            <div
              className={cn(
                "relative flex items-center gap-3.5 rounded-2xl p-3 transition-all",
                done && "opacity-75",
                state === "current" &&
                  "bg-primary-50/70 ring-1 ring-primary-200",
                state === "available" && "hover:bg-primary-50/50",
                state === "locked" && "opacity-45",
              )}
            >
              {isWarmup && <XPBubble amount={warmupBubble} />}
              {/* Node + connecteur */}
              <div className="relative flex flex-col items-center self-stretch">
                <motion.span
                  animate={
                    done
                      ? { scale: [1, 1.25, 1] }
                      : state === "current"
                        ? { scale: [1, 1.06, 1] }
                        : {}
                  }
                  transition={
                    done
                      ? { duration: 0.45 }
                      : { duration: 2, repeat: Infinity, repeatDelay: 1 }
                  }
                  className={cn(
                    "z-10 grid size-10 shrink-0 place-items-center rounded-full transition-shadow",
                    done && "gradient-mint text-white glow-mint",
                    state === "current" &&
                      "gradient-primary text-white glow-primary",
                    state === "available" && "bg-primary-50 text-primary-600",
                    state === "locked" && "bg-ink/5 text-ink-faint",
                  )}
                >
                  {done ? (
                    <Check className="size-4.5" strokeWidth={3.5} />
                  ) : state === "locked" ? (
                    <Lock className="size-4" strokeWidth={2.2} />
                  ) : (
                    step.icon
                  )}
                </motion.span>
                <motion.span
                  className={cn(
                    "absolute top-10 bottom-[-14px] w-1 rounded-full",
                    done && prevDone ? "bg-mint-400/60" : "bg-ink/8",
                  )}
                  initial={false}
                  animate={{ opacity: 1 }}
                />
              </div>
              <div className="min-w-0 flex-1 py-0.5">
                <p
                  className={cn(
                    "truncate text-[15px] font-bold",
                    done
                      ? "text-ink-faint line-through decoration-2"
                      : "text-ink",
                  )}
                >
                  {step.title}
                </p>
                <p className="truncate text-xs text-ink-faint">{step.detail}</p>
              </div>
              <Chip
                tone={done ? "mint" : state === "current" ? "primary" : "neutral"}
                className="shrink-0"
              >
                {done ? "Fait ✓" : `${step.minutes} min`}
              </Chip>
            </div>
          );

          if (isWarmup) {
            return (
              <div key={step.id}>
                <motion.button
                  whileTap={!done ? { scale: 0.985 } : undefined}
                  className="w-full cursor-pointer text-left"
                  onClick={() => !done && setWarmupOpen((v) => !v)}
                >
                  {node}
                </motion.button>
                <AnimatePresence initial={false}>
                  {warmupOpen && !done && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="mb-2 ml-[3.6rem] mr-3 space-y-2 rounded-2xl bg-cream/70 p-3">
                        <p className="text-xs font-semibold text-ink-soft">
                          Écoute ces 3 phrases. Juste écouter — ton oreille se
                          met en route.
                        </p>
                        {warmupPhrases.map((phrase) => (
                          <motion.button
                            key={phrase.id}
                            whileTap={{ scale: 0.97 }}
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
                          </motion.button>
                        ))}
                        <Button
                          size="sm"
                          fullWidth
                          disabled={heard.size < warmupPhrases.length}
                          onClick={completeWarmup}
                        >
                          {heard.size < warmupPhrases.length
                            ? `Écoute encore ${warmupPhrases.length - heard.size} phrase${warmupPhrases.length - heard.size > 1 ? "s" : ""}`
                            : "Oreille réveillée · +5 FP"}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          if (step.href && !done && state !== "locked") {
            return (
              <Link key={step.id} href={step.href} className="block">
                <motion.div whileTap={{ scale: 0.985 }}>{node}</motion.div>
              </Link>
            );
          }
          return <div key={step.id}>{node}</div>;
        })}

        {/* Node final : le coffre */}
        <motion.button
          whileTap={chestUnlocked && !chestClaimed ? { scale: 0.98 } : undefined}
          onClick={chestUnlocked && !chestClaimed ? claimChest : undefined}
          disabled={!chestUnlocked || chestClaimed}
          className={cn(
            "relative flex w-full items-center gap-3.5 rounded-2xl p-3 text-left transition-all",
            chestClaimed
              ? "bg-mint-50/70"
              : chestUnlocked
                ? "card-tint-gold cursor-pointer ring-1 ring-gold-400/40"
                : "opacity-45",
          )}
        >
          <XPBubble amount={chestBubble} />
          <div className="relative flex flex-col items-center">
            <motion.span
              animate={
                chestUnlocked && !chestClaimed
                  ? { rotate: [0, -7, 7, -4, 0], scale: [1, 1.08, 1] }
                  : {}
              }
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1.2 }}
              className={cn(
                "z-10 grid size-10 shrink-0 place-items-center rounded-full",
                chestClaimed
                  ? "gradient-mint text-white"
                  : chestUnlocked
                    ? "gradient-gold text-white glow-gold"
                    : "bg-ink/5 text-ink-faint",
              )}
            >
              {chestClaimed ? (
                <Zap className="size-4" fill="currentColor" />
              ) : chestUnlocked ? (
                <Gift className="size-4.5" strokeWidth={2.2} />
              ) : (
                <Lock className="size-4" strokeWidth={2.2} />
              )}
            </motion.span>
          </div>
          <div className="min-w-0 flex-1">
            <p
              className={cn(
                "text-[15px] font-bold",
                chestClaimed ? "text-mint-600" : "text-ink",
              )}
            >
              {chestClaimed
                ? `Coffre ouvert · +${CHEST_XP} FP`
                : "Coffre du jour"}
            </p>
            <p className="truncate text-xs text-ink-faint">
              {chestClaimed
                ? "Reviens demain pour le suivant."
                : chestUnlocked
                  ? `Touche pour récupérer +${CHEST_XP} Fluency Points`
                  : "Termine ta room pour le déverrouiller"}
            </p>
          </div>
          {chestUnlocked && !chestClaimed && (
            <Chip tone="gold" className="shrink-0">
              Ouvrir
            </Chip>
          )}
        </motion.button>
      </div>
    </div>
  );
}
