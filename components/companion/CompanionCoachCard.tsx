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
 * Le compagnon accueille sur Today : lui d'abord, sa phrase du jour
 * dans une vraie bulle, puis la mission — et le calibrage en action
 * secondaire discrète. Hiérarchie claire, zéro texte tronqué.
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
        className="pointer-events-none absolute -left-10 -top-12 size-48 rounded-full blur-3xl"
        style={{ background: `${companion.color}26` }}
      />

      {/* A · Le compagnon accueille, sa bulle parle */}
      <div className="relative flex items-end gap-3">
        <motion.div
          initial={{ scale: 0.85, y: 6 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 }}
          className="shrink-0"
        >
          <CompanionCharacter
            companionId={progress.companion}
            size={96}
            expression={expression}
            accessories={look.accessories}
            streakBadge={look.streakBadge}
          />
        </motion.div>
        <div className="relative min-w-0 flex-1 pb-1.5">
          {/* Bulle de dialogue avec sa pointe */}
          <div className="relative rounded-3xl rounded-bl-lg bg-cream px-4 py-3">
            <span
              aria-hidden
              className="absolute -left-1.5 bottom-3 size-3 rotate-45 bg-cream"
            />
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">
              {companion.name}
            </p>
            <p className="mt-0.5 text-[15px] font-semibold leading-snug text-ink">
              {line}
            </p>
          </div>
        </div>
      </div>

      {/* B · Mission du jour, claire */}
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

      {/* C · Action secondaire discrète : calibrage (après la 1re session) */}
      {offerCalibration && (
        <Link
          href="/app/calibrate"
          className="relative mt-2.5 flex items-center gap-2 px-1 py-1"
        >
          <Sparkles className="size-3.5 shrink-0 text-gold-500" />
          <span className="min-w-0 flex-1 text-xs font-semibold text-ink-soft">
            Calibre ton plan · 2 min — j&apos;affine ton parcours.
          </span>
          <ChevronRight className="size-3.5 shrink-0 text-ink-faint" />
        </Link>
      )}
    </motion.div>
  );
}
