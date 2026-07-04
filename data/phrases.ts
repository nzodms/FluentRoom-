import type { Phrase, PhraseCategory } from "@/types/learning";
import { rooms } from "./rooms";

/** Toutes les phrases du catalogue, agrégées depuis les rooms. */
export const allPhrases: Phrase[] = rooms.flatMap((room) => room.phrases);

export function getPhraseById(id: string): Phrase | undefined {
  return allPhrases.find((phrase) => phrase.id === id);
}

export const phraseCategories: Array<{
  id: PhraseCategory;
  label: string;
  emoji: string;
}> = [
  { id: "everyday", label: "Quotidien", emoji: "🏙️" },
  { id: "travel", label: "Voyage", emoji: "✈️" },
  { id: "social", label: "Social", emoji: "🎉" },
  { id: "fast-english", label: "Fast English", emoji: "⚡️" },
  { id: "opinions", label: "Opinions", emoji: "💡" },
  { id: "problems", label: "Problèmes", emoji: "🛟" },
];

export function categoryLabel(id: PhraseCategory): string {
  return phraseCategories.find((c) => c.id === id)?.label ?? id;
}
