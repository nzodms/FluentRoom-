"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Sparkles } from "lucide-react";
import type { UserProgress } from "@/types/learning";
import type { Quest } from "@/lib/quests";
import {
  companionLine,
  companionLook,
  shouldOfferCalibration,
  todayEvent,
} from "@/lib/companion";
import { getCompanion } from "@/data/companions";
import { LearningGlyph } from "@/components/icons/learning-icons";
import { CompanionCharacter } from "./CompanionCharacter";

/**
 * Le compagnon sur Today : une ligne contextuelle (jamais la même),
 * la mission du jour, et le calibrage du plan quand c'est le moment.
 * Le cœur émotionnel de l'écran — comprendre quoi faire en 3 secondes.
 */
export function CompanionCoachCard({
  progress,
  quests,
}: {
  progress: UserProgress;
  quests: Quest[];
}) {
  const companion = getCompanion(progress.companion);
  const event = todayEvent(progress);
  const line = companionLine(event, progress);
  const look = companionLook(progress);
  const offerCalibration = shouldOfferCalibration(progress);

  // Mission du jour : la première quête quotidienne encore ouverte.
  const mission = quests.find((q) => q.scope === "daily" && !q.done);

  const expression =
    event === "chest-ready"
      ? "excited"
      : event === "daily-done"
        ? "celebrating"
        : event === "back-after-absence"
          ? "encouraging"
          : event === "streak-kept"
            ? "proud"
            : "happy";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.05 }}
      className="relative overflow-hidden rounded-[1.75rem] border border-ink/6 bg-white p-4 shadow-soft"
    >
      {/* Halo du compagnon */}
      <span
        aria-hidden
        className="pointer-events-none absolute -left-8 -top-10 size-40 rounded-full blur-3xl"
        style={{ background: `${companion.color}22` }}
      />
      <div className="relative flex items-start gap-3.5">
        <CompanionCharacter
          companionId={progress.companion}
          size={72}
          expression={expression}
          accessories={look.accessories}
          streakBadge={look.streakBadge}
        />
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">
            {companion.name} · {companion.personality}
          </p>
          <p className="mt-1 text-[15px] font-semibold leading-snug text-ink">
            {line}
          </p>
        </div>
      </div>

      {/* Mission du jour */}
      {mission && (
        <div className="relative mt-3 flex items-center gap-3 rounded-2xl bg-primary-50 px-3.5 py-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-xl gradient-primary text-white shadow-glow">
            <LearningGlyph name="quest" className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-primary-700">
              Mission du jour · +{mission.xp} FP
            </p>
            <p className="truncate text-sm font-semibold text-ink">
              {mission.label}
            </p>
          </div>
          <span className="shrink-0 text-xs font-bold text-primary-600">
            {mission.current}/{mission.target}
          </span>
        </div>
      )}

      {/* Calibrage : après la première leçon, jamais dans l'onboarding */}
      {offerCalibration && (
        <Link href="/app/calibrate" className="relative mt-2.5 block">
          <motion.div
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 rounded-2xl border border-gold-400/40 bg-gold-50 px-3.5 py-2.5"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-xl gradient-gold text-white">
              <Sparkles className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-ink">Calibre ton plan · 2 min</p>
              <p className="truncate text-xs text-ink-soft">
                {companionLine("calibrate-invite", progress)}
              </p>
            </div>
            <ChevronRight className="size-4 shrink-0 text-ink-faint" />
          </motion.div>
        </Link>
      )}
    </motion.div>
  );
}
