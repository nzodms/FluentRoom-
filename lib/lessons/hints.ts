import type { UserProgress } from "@/types/learning";
import { todayKey } from "@/lib/utils";

/**
 * Système d'indices : progressifs, limités, jamais la réponse.
 * 3 aides gratuites par jour — l'indice aide à apprendre, il ne
 * bloque jamais la progression (la correction reste montrée après
 * une tentative).
 */

export const DAILY_HINTS = 3;

export function hintsLeftToday(progress: UserProgress): number {
  if (progress.hintDay !== todayKey()) return DAILY_HINTS;
  return Math.max(0, DAILY_HINTS - (progress.hintsUsedToday ?? 0));
}

/** Consomme une aide du jour (reset automatique chaque matin). */
export function spendHintCharge(progress: UserProgress): UserProgress {
  const today = todayKey();
  const used = progress.hintDay === today ? (progress.hintsUsedToday ?? 0) : 0;
  return { ...progress, hintDay: today, hintsUsedToday: used + 1 };
}

/** Indices génériques quand un exercice n'en définit pas assez. */
const FALLBACK_HINTS = [
  "Relis la situation : qu'est-ce que la personne cherche à obtenir ?",
  "Pense au bloc naturel, pas à la traduction mot à mot.",
  "Élimine d'abord l'option qui sonne « français traduit ».",
];

/** L'indice de niveau n (0-based) — jamais la réponse complète. */
export function hintAt(hints: string[], level: number): string {
  return hints[level] ?? FALLBACK_HINTS[Math.min(level, FALLBACK_HINTS.length - 1)];
}

export function maxHintLevel(hints: string[]): number {
  return Math.max(hints.length, FALLBACK_HINTS.length);
}
