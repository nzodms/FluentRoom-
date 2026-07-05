"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import type { Chapter, Exercise } from "@/lib/lessons/types";
import type { SessionState } from "@/lib/lessons/engine";
import { totalSteps } from "@/lib/lessons/engine";
import { CompanionCharacter } from "@/components/companion/CompanionCharacter";
import { cn } from "@/lib/utils";

/**
 * Zone basse intelligente des leçons : jamais de grand blanc.
 * Elle sert l'apprentissage — phrase à retenir, bonus sans indice,
 * étapes restantes — avec le compagnon en présence discrète.
 */
export function LessonBottomCoach({
  chapter,
  session,
  exercise,
  companionId,
  chestProgress = 0,
}: {
  chapter: Chapter;
  session: SessionState;
  exercise: Exercise;
  companionId: string | null;
  /** Progression du prochain coffre (0-100). */
  chestProgress?: number;
}) {
  const keyPhrase = exercise.phraseId
    ? chapter.keyPhrases.find((p) => p.id === exercise.phraseId)
    : undefined;
  const remaining = totalSteps(session) - session.index;
  const noHintBonus = session.totalHintsUsed === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.4 }}
      className="mt-6 border-t border-ink/5 pt-3"
    >
      <div className="flex items-center gap-3">
        <CompanionCharacter
          companionId={companionId}
          size={42}
          expression={session.errorStreak >= 2 ? "encouraging" : "focused"}
        />
        <div className="min-w-0 flex-1">
          {keyPhrase ? (
            <>
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">
                À retenir
              </p>
              <p className="truncate text-sm font-bold text-ink">
                {keyPhrase.english}
                <span className="ml-1.5 font-medium text-ink-faint">
                  · {keyPhrase.french}
                </span>
              </p>
            </>
          ) : (
            <p className="text-sm font-semibold leading-snug text-ink-soft">
              {chapter.objective}
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {noHintBonus && (
            <span className="flex items-center gap-1 rounded-full bg-gold-50 px-2 py-0.5 text-[10px] font-bold text-gold-500">
              <Zap className="size-2.5" fill="currentColor" /> Sans indice +10
            </span>
          )}
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-bold",
              remaining <= 2
                ? "bg-mint-50 text-mint-600"
                : "bg-ink/5 text-ink-faint",
            )}
          >
            {remaining <= 1 ? "Dernière étape" : `Encore ${remaining} étapes`}
          </span>
          {chestProgress >= 50 && (
            <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-bold text-primary-600">
              Coffre à {Math.min(Math.round(chestProgress), 99)} %
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
