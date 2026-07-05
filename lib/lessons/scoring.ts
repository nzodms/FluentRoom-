import type {
  Chapter,
  ChapterResult,
  ExerciseOutcome,
  MasteryState,
} from "./types";
import type { SessionState } from "./engine";

/**
 * Score de maîtrise réel : la précision compte, mais les indices
 * et les réponses au hasard pèsent. Aider, jamais punir — le score
 * reflète simplement ce qui est ancré.
 */

/** Points par exercice selon la façon dont il a été réussi. */
function outcomePoints(o: ExerciseOutcome): number {
  if (o.correctFirstTry) {
    if (o.hintsUsed === 0) return 1;
    if (o.hintsUsed === 1) return 0.8;
    return 0.6; // beaucoup d'aide : vu, pas ancré
  }
  if (o.recoveredOnRetry) return 0.5; // rattrapé au rappel
  return 0.15;
}

export function computeResult(state: SessionState): ChapterResult {
  const { outcomes, chapter } = state;
  const total = outcomes.length || 1;
  const points = outcomes.reduce((sum, o) => sum + outcomePoints(o), 0);
  const masteryScore = Math.round((points / total) * 100);

  // Une phrase est fragile si un exercice lié a raté au 1er essai
  // sans être proprement rattrapé, ou a demandé trop d'aide.
  const fragile = new Set<string>();
  for (const o of outcomes) {
    if (!o.phraseId) continue;
    const weak =
      (!o.correctFirstTry && !o.recoveredOnRetry) ||
      o.hintsUsed >= 2 ||
      o.tooFast;
    if (weak) fragile.add(o.phraseId);
  }

  return {
    chapterId: chapter.id,
    outcomes,
    masteryScore,
    fragilePhraseIds: Array.from(fragile),
    noHints: state.totalHintsUsed === 0,
    totalHintsUsed: state.totalHintsUsed,
  };
}

/** État lisible d'une phrase du chapitre après la session. */
export function phraseMastery(
  result: ChapterResult,
  phraseId: string,
): MasteryState {
  const linked = result.outcomes.filter((o) => o.phraseId === phraseId);
  if (linked.length === 0) return "seen";
  if (result.fragilePhraseIds.includes(phraseId)) return "fragile";
  const clean = linked.every((o) => o.correctFirstTry && o.hintsUsed === 0);
  return clean ? "mastered" : "improving";
}

/** FP gagnés : base du chapitre, bonus sans indice, malus doux si hasard. */
export function rewardFor(chapter: Chapter, result: ChapterResult): number {
  let fp = chapter.rewardFP;
  if (result.noHints) fp += 10;
  const random = result.outcomes.filter((o) => o.tooFast).length;
  if (random >= 3) fp = Math.round(fp * 0.7);
  return fp;
}
