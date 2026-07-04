"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Gift } from "lucide-react";
import type { Quest } from "@/lib/quests";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { XPBubble } from "@/components/reward/XPBubble";
import {
  LearningIcon,
  type LearningIconName,
} from "@/components/icons/learning-icons";
import { cn } from "@/lib/utils";

/** Icône stable par quête (remplace les emojis). */
const QUEST_ICONS: Record<string, LearningIconName> = {
  room: "listen",
  "phrases-3": "phrase",
  "speak-1": "speak",
  "review-5": "review",
  "rooms-3": "listen",
  "practice-10": "speak",
  "days-5": "streak",
};

interface QuestListProps {
  quests: Quest[];
  onClaim: (quest: Quest) => void;
  /** "daily" ou "weekly" — filtre d'affichage. */
  scope: "daily" | "weekly";
  title: string;
}

/** Mini-quêtes : progression visible, récompense à réclamer. */
export function QuestList({ quests, onClaim, scope, title }: QuestListProps) {
  const [bubbleFor, setBubbleFor] = useState<string | null>(null);
  const list = quests.filter((q) => q.scope === scope);
  const doneCount = list.filter((q) => q.done).length;

  const claim = (quest: Quest) => {
    onClaim(quest);
    setBubbleFor(quest.key);
    setTimeout(() => setBubbleFor(null), 1100);
  };

  return (
    <div>
      <div className="mb-2.5 flex items-center justify-between">
        <h3 className="text-[15px] font-bold tracking-tight text-ink">
          {title}
        </h3>
        <span className="text-xs font-semibold text-ink-faint">
          {doneCount} / {list.length}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {list.map((quest, i) => (
          <motion.div
            key={quest.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn(
              "relative rounded-2xl p-3 transition-all",
              quest.claimed
                ? "bg-mint-50/70 ring-1 ring-mint-400/30"
                : quest.done
                  ? "card-tint-gold ring-1 ring-gold-400/40"
                  : "card-soft",
            )}
          >
            <XPBubble amount={bubbleFor === quest.key ? quest.xp : null} />
            <div className="flex items-start justify-between">
              <LearningIcon
                name={QUEST_ICONS[quest.id] ?? "quest"}
                variant={quest.claimed ? "completed" : quest.done ? "reward" : "default"}
                size="sm"
              />
              {quest.claimed ? (
                <span className="grid size-6 place-items-center rounded-full bg-mint-500 text-white">
                  <Check className="size-3.5" strokeWidth={3.5} />
                </span>
              ) : quest.done ? (
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1 }}
                  onClick={() => claim(quest)}
                  aria-label={`Réclamer +${quest.xp} FP`}
                  className="grid size-7 cursor-pointer place-items-center rounded-full gradient-gold text-white glow-gold"
                >
                  <Gift className="size-3.5" strokeWidth={2.5} />
                </motion.button>
              ) : (
                <span className="text-[10px] font-bold text-ink-faint">
                  +{quest.xp}
                </span>
              )}
            </div>
            <p className="mt-1.5 text-xs font-bold leading-tight text-ink">
              {quest.label}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <ProgressBar
                value={(quest.current / quest.target) * 100}
                className="h-1.5"
                color={quest.done ? "gradient-mint" : "gradient-primary"}
              />
              <span className="shrink-0 text-[10px] font-bold text-ink-faint">
                {quest.current}/{quest.target}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
