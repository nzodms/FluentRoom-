import type { UserProgress } from "@/types/learning";
import type { CharacterExpression } from "@/components/avatar/FluentCharacter";
import { getDailySteps } from "./progress";
import { currentEnergy } from "./energy";

/** Réactions du personnage aux événements produit. */
export type CharacterReaction =
  | "chestReady"
  | "chestOpening"
  | "rewardRare"
  | "energyLow"
  | "streakSafe"
  | "lessonCompleted"
  | "wrongAnswer"
  | "comeback"
  | "itemEquipped"
  | "itemPurchased"
  | "notEnoughFP"
  | "reflexRound"
  | "reviewDone";

export const REACTION_EXPRESSION: Record<CharacterReaction, CharacterExpression> = {
  chestReady: "excited",
  chestOpening: "surprised",
  rewardRare: "celebrating",
  energyLow: "tired",
  streakSafe: "relaxed",
  lessonCompleted: "proud",
  wrongAnswer: "encouraging",
  comeback: "happy",
  itemEquipped: "happy",
  itemPurchased: "celebrating",
  notEnoughFP: "worried",
  reflexRound: "determined",
  reviewDone: "relaxed",
};

/** Expression du personnage sur Today, selon l'état du jour. */
export function expressionForToday(progress: UserProgress): CharacterExpression {
  if ((progress.availableChests ?? 0) > 0) return "excited";
  if (currentEnergy(progress) === 0) return "tired";
  const steps = getDailySteps(progress);
  if (steps.length >= 4) return "proud";
  if (steps.length >= 1) return "happy";
  return "focused";
}

/** Petite phrase du personnage à la fin d'une session. */
export function completionLine(comprehension: number): string {
  if (comprehension >= 80) return "Ton anglais devient plus automatique.";
  if (comprehension >= 50) return "Tu as débloqué un vrai réflexe.";
  return "Encore une session utile. L'oreille se construit.";
}
