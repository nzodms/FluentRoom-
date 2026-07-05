"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ChevronRight, Lock } from "lucide-react";
import type { UserProgress } from "@/types/learning";
import { chapters } from "@/lib/lessons/chapters";
import { Chip } from "@/components/ui/Chip";
import { LearningGlyph } from "@/components/icons/learning-icons";
import { cn } from "@/lib/utils";

/**
 * Chapitres sur Aujourd'hui : de vraies mini-expériences pédagogiques,
 * avec prérequis, difficulté et score de maîtrise.
 */
export function ChapterList({ progress }: { progress: UserProgress }) {
  const done = progress.chapters ?? {};

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-lg font-bold tracking-tight text-ink">Chapitres</h3>
        <span className="text-sm font-medium text-ink-faint">
          {Object.keys(done).length} / {chapters.length}
        </span>
      </div>
      <p className="mb-3 text-sm text-ink-soft">
        Des situations complètes : phrases clés, nuances, réflexes, conversation.
      </p>
      <div className="space-y-2.5">
        {chapters.map((chapter, i) => {
          const mastery = done[chapter.id];
          const locked = chapter.prerequisites.some((id) => !done[id]);
          const card = (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              whileTap={!locked ? { scale: 0.985 } : undefined}
              className={cn(
                "flex items-center gap-3.5 rounded-3xl border p-4 transition-all",
                locked
                  ? "border-ink/5 bg-ink/[0.03] opacity-60"
                  : mastery
                    ? "border-mint-100 bg-mint-50/50 hover:shadow-lift"
                    : "border-ink/6 bg-white shadow-soft hover:shadow-lift",
              )}
            >
              <span
                className={cn(
                  "grid size-11 shrink-0 place-items-center rounded-2xl",
                  mastery
                    ? "bg-mint-100 text-mint-600"
                    : "bg-primary-50 text-primary-600",
                )}
              >
                <LearningGlyph
                  name={chapter.mainSkill === "reflexes" ? "reflex" : chapter.mainSkill === "politeness" ? "native" : "phrase"}
                  className="size-5"
                />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-bold text-ink">{chapter.title}</p>
                  {mastery && (
                    <Chip tone="mint" className="shrink-0">
                      <Check className="size-2.5" strokeWidth={3.5} /> {mastery.score} %
                    </Chip>
                  )}
                </div>
                <p className="truncate text-sm text-ink-soft">{chapter.objective}</p>
                <p className="mt-0.5 text-xs text-ink-faint">
                  {chapter.duration} min · difficulté{" "}
                  {"●".repeat(chapter.difficulty)}
                  {"○".repeat(3 - chapter.difficulty)} · +{chapter.rewardFP} FP
                </p>
              </div>
              {locked ? (
                <Lock className="size-4 shrink-0 text-ink-faint" />
              ) : (
                <ChevronRight className="size-5 shrink-0 text-ink-faint" />
              )}
            </motion.div>
          );
          return locked ? (
            <div key={chapter.id}>{card}</div>
          ) : (
            <Link key={chapter.id} href={`/app/chapter/${chapter.id}`} className="block">
              {card}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
