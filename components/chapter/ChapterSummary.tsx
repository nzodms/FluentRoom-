"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Flame, Zap } from "lucide-react";
import type { Chapter } from "@/lib/lessons/types";
import type { SessionState } from "@/lib/lessons/engine";
import { computeResult, phraseMastery, rewardFor } from "@/lib/lessons/scoring";
import { companionLook } from "@/lib/companion";
import { useProgress } from "@/lib/useProgress";
import { getCompanion } from "@/data/companions";
import { Button } from "@/components/ui/Button";
import { CountUp } from "@/components/ui/CountUp";
import { Chip } from "@/components/ui/Chip";
import { CompanionCharacter } from "@/components/companion/CompanionCharacter";
import { RewardRoom } from "@/components/rewards/RewardRoom";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const MASTERY_LABEL: Record<string, { label: string; tone: "mint" | "primary" | "coral" }> = {
  mastered: { label: "Maîtrisée", tone: "mint" },
  improving: { label: "En progression", tone: "primary" },
  fragile: { label: "Fragile", tone: "coral" },
  seen: { label: "Vue", tone: "primary" },
};

/**
 * Fin de chapitre : FP, série, phrases par état de maîtrise,
 * prochaine révision, commentaire du compagnon basé sur les
 * vraies données de la session.
 */
export function ChapterSummary({
  chapter,
  session,
}: {
  chapter: Chapter;
  session: SessionState;
}) {
  const { progress, finishChapter, openChest } = useProgress();
  const [chestOpen, setChestOpen] = useState(false);
  const [outcome, setOutcome] = useState<{ xpEarned: number } | null>(null);
  const committed = useRef(false);

  const result = computeResult(session);
  const fp = rewardFor(chapter, result);
  const look = companionLook(progress);
  const companion = getCompanion(progress.companion);

  useEffect(() => {
    if (committed.current) return;
    committed.current = true;
    // Différé d'un tick : pas de setState synchrone dans l'effet.
    const t = setTimeout(() => {
      const o = finishChapter({
        chapterId: chapter.id,
        masteryScore: result.masteryScore,
        fragilePhraseIds: result.fragilePhraseIds,
        noHints: result.noHints,
        fpEarned: fp,
        unlockedPhrases: [],
      });
      setOutcome({ xpEarned: o.xpEarned });
    }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fragileCount = result.fragilePhraseIds.length;
  const masteredCount = chapter.keyPhrases.filter(
    (p) => phraseMastery(result, p.id) === "mastered",
  ).length;

  const companionComment =
    result.masteryScore >= 80
      ? `Solide. ${masteredCount} phrase${masteredCount > 1 ? "s" : ""} bien ancrée${masteredCount > 1 ? "s" : ""} — ${fragileCount > 0 ? "on reverra le reste demain, tranquillement." : "ce chapitre est à toi."}`
      : fragileCount > 0
        ? `Bon travail. ${fragileCount} phrase${fragileCount > 1 ? "s" : ""} reste${fragileCount > 1 ? "nt" : ""} fragile${fragileCount > 1 ? "s" : ""} — je te les reproposerai demain, c'est comme ça qu'elles s'ancrent.`
        : "C'est fait. Une session courte demain, et tout ça devient automatique.";

  return (
    <div className="pb-4" data-testid="chapter-summary">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.6 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
          className="inline-block"
        >
          <CompanionCharacter
            companionId={progress.companion}
            size={110}
            expression={result.masteryScore >= 80 ? "celebrating" : "proud"}
            accessories={look.accessories}
            streakBadge={progress.streak >= 3 ? progress.streak : null}
          />
        </motion.div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink">
          Chapitre terminé
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          {chapter.title} · maîtrise {result.masteryScore} %
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <Chip tone="primary">
            <Zap className="size-3" fill="currentColor" /> +
            <CountUp value={outcome?.xpEarned ?? fp} /> FP
          </Chip>
          <Chip tone="coral">
            <Flame className="size-3" fill="currentColor" /> Série {progress.streak}
          </Chip>
          {result.noHints && <Chip tone="gold">Sans indice · bonus inclus</Chip>}
        </div>
      </div>

      {/* Décomposition des gains */}
      <div className="mx-auto mt-4 max-w-xs space-y-1.5">
        {[
          { label: "Chapitre terminé", value: chapter.rewardFP },
          ...(result.noHints ? [{ label: "Sans indice", value: 10 }] : []),
          ...(result.outcomes.some((o) => o.recoveredOnRetry)
            ? [{ label: "Rappels réussis", value: 0 }]
            : []),
        ].map((line, i) => (
          <motion.div
            key={line.label}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.25 }}
            className="flex items-center justify-between rounded-2xl bg-white px-3.5 py-2 text-sm shadow-soft"
          >
            <span className="font-semibold text-ink-soft">{line.label}</span>
            <span className="font-bold text-gold-500">
              {line.value > 0 ? `+${line.value} FP` : "inclus"}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Commentaire du compagnon */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mt-4 rounded-3xl bg-white p-3.5 shadow-soft"
      >
        <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">
          {companion.name}
        </p>
        <p className="mt-0.5 text-sm font-semibold leading-snug text-ink">
          {companionComment}
        </p>
      </motion.div>

      {/* Phrases par état de maîtrise */}
      <p className="mt-4 text-sm font-bold text-ink">Tes phrases du chapitre</p>
      <div className="mt-2 space-y-2">
        {chapter.keyPhrases.map((phrase, i) => {
          const state = phraseMastery(result, phrase.id);
          const meta = MASTERY_LABEL[state] ?? MASTERY_LABEL.seen;
          return (
            <motion.div
              key={phrase.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.06 }}
              className={cn(
                "flex items-center gap-3 rounded-2xl border px-3.5 py-2.5",
                state === "fragile"
                  ? "border-coral-100 bg-coral-50/50"
                  : "border-ink/6 bg-white shadow-soft",
              )}
            >
              <span
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-full",
                  state === "mastered"
                    ? "bg-mint-500 text-white"
                    : state === "fragile"
                      ? "bg-coral-100 text-coral-600"
                      : "bg-primary-100 text-primary-600",
                )}
              >
                <Check className="size-3.5" strokeWidth={3} />
              </span>
              <p className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">
                {phrase.english}
              </p>
              <motion.span
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.45 + i * 0.06, type: "spring", stiffness: 380, damping: 18 }}
                className="shrink-0"
              >
                <Chip tone={meta.tone}>{meta.label}</Chip>
              </motion.span>
            </motion.div>
          );
        })}
      </div>

      {/* Prochaine révision */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-3 rounded-2xl bg-primary-50 px-3.5 py-2.5 text-sm font-semibold text-primary-700"
      >
        Prochaine révision : demain —{" "}
        {fragileCount > 0
          ? `tes ${fragileCount} phrase${fragileCount > 1 ? "s" : ""} fragile${fragileCount > 1 ? "s" : ""} reviennent en premier.`
          : "une minute suffit pour tout entretenir."}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-5 space-y-2.5"
      >
        {(progress.availableChests ?? 0) > 0 ? (
          <Button
            size="lg"
            fullWidth
            data-testid="open-chest-cta"
            onClick={() => setChestOpen(true)}
          >
            Ouvrir mon coffre
          </Button>
        ) : (
          <div className="rounded-2xl bg-white p-3.5 shadow-soft">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-ink">Prochain coffre</span>
              <span className="text-primary-600">
                {Math.round(progress.chestProgress ?? 0)} %
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink/8">
              <motion.div
                className="h-full rounded-full gradient-gold"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress.chestProgress ?? 0, 100)}%` }}
                transition={{ duration: 0.9, delay: 0.4 }}
              />
            </div>
          </div>
        )}
        <Link href="/app/today" className="block">
          <Button
            size="lg"
            fullWidth
            variant={(progress.availableChests ?? 0) > 0 ? "secondary" : "primary"}
          >
            Continuer
          </Button>
        </Link>
        {fragileCount > 0 && (
          <Link href="/app/phrases" className="block">
            <Button variant="secondary" fullWidth>
              Revoir mes phrases fragiles
            </Button>
          </Link>
        )}
      </motion.div>

      {/* Le moment coffre : plein écran, ouverture progressive */}
      <AnimatePresence>
        {chestOpen && (
          <RewardRoom
            chestType="daily"
            avatar={progress.avatar}
            onOpen={openChest}
            onCollect={() => setChestOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
