"use client";

import { motion } from "framer-motion";
import { ChevronDown, Zap } from "lucide-react";
import type { UserProgress } from "@/types/learning";
import type { AdventureProgress } from "@/lib/adventure/types";
import { availableFP } from "@/lib/shop";
import { CountUp } from "@/components/ui/CountUp";

/**
 * Header de l'Aventure, posé sur la scène : titre + wallet FP,
 * puis la pill de zone ("Chapitre 3 · 2/5") avec sa barre violette.
 */
export function AdventureHeader({
  adventure,
  progress,
}: {
  adventure: AdventureProgress;
  progress: UserProgress;
}) {
  const ratio =
    adventure.totalCount > 0 ? adventure.doneCount / adventure.totalCount : 0;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-[1.7rem] font-bold tracking-tight text-ink">
          Aventure
        </h1>
        <span
          data-testid="fp-wallet"
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-primary-100 bg-primary-50/90 px-3 py-1.5 text-sm font-bold text-primary-600 shadow-soft backdrop-blur-sm"
          aria-label={`${availableFP(progress)} FP`}
        >
          <Zap className="size-4" fill="currentColor" />
          <CountUp value={availableFP(progress)} /> FP
        </span>
      </div>

      <div
        data-testid="adventure-zone-pill"
        className="mt-2.5 flex items-center gap-3 rounded-full border border-ink/5 bg-white/95 py-2 pl-4 pr-2.5 shadow-soft backdrop-blur-sm"
      >
        <span className="shrink-0 text-[13px] font-bold text-ink">
          Chapitre {adventure.currentStep}{" "}
          <span className="text-ink-faint">· {adventure.doneCount}/{adventure.totalCount}</span>
        </span>
        <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-ink/8">
          <motion.div
            className="h-full rounded-full gradient-primary"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: Math.max(ratio, 0.02) }}
            style={{ originX: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        </div>
        {/* Sélecteur de zone (map globale) — prêt pour la suite */}
        <ChevronDown className="size-4 shrink-0 text-ink-faint" />
      </div>
    </div>
  );
}
