import type { UserProgress } from "@/types/learning";
import { addXp } from "@/lib/progress";

/**
 * RewardEngine : FP gagnés EN DIRECT pendant les leçons.
 * Petits gains fréquents qui récompensent l'apprentissage réel
 * (jamais le hasard) — la récompense de fin de chapitre s'ajoute.
 */

export interface LiveRewardInput {
  correct: boolean;
  /** Série de bonnes réponses APRÈS cette réponse. */
  streakAfter: number;
  /** Réussite d'un rappel (2e passage d'un raté). */
  isRetry: boolean;
  hintsUsed: number;
  /** Réponse trop rapide pour être lue (suspecte). */
  tooFast: boolean;
}

export interface LiveReward {
  amount: number;
  /** Libellé court affiché dans le toast ("Combo x3"). */
  label: string;
}

/** Gain immédiat pour une réponse — null si rien à célébrer. */
export function liveReward(input: LiveRewardInput): LiveReward | null {
  if (!input.correct || input.tooFast) return null;

  // Rappel réussi : la phrase s'ancre — c'est le gain le plus utile.
  if (input.isRetry) return { amount: 5, label: "Phrase rattrapée" };

  if (input.streakAfter === 5)
    return { amount: 20, label: "Combo x5 · série parfaite" };
  if (input.streakAfter === 3) return { amount: 10, label: "Combo x3" };
  if (input.hintsUsed === 0) return { amount: 2, label: "Réflexe propre" };
  return { amount: 2, label: "Bien joué" };
}

/** Crédite un gain en direct + journalise la transaction. */
export function grantSessionFP(
  progress: UserProgress,
  amount: number,
  reason: string,
): UserProgress {
  const next = addXp(progress, amount);
  return {
    ...next,
    fpLog: [
      ...(progress.fpLog ?? []).slice(-29),
      { at: new Date().toISOString(), amount, reason },
    ],
  };
}
