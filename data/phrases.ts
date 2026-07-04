import type { Phrase, PhraseCategory } from "@/types/learning";
import { rooms } from "./rooms";
import { lessonOnlyPhrases } from "./lessons";

/** Toutes les phrases du catalogue : rooms + structures des leçons. */
export const allPhrases: Phrase[] = [
  ...rooms.flatMap((room) => room.phrases),
  ...lessonOnlyPhrases,
];

export function getPhraseById(id: string): Phrase | undefined {
  return allPhrases.find((phrase) => phrase.id === id);
}

/** Phrase du jour : rotation quotidienne parmi les phrases débloquées. */
export function getDailyPhrase(unlockedIds: Set<string>): Phrase | null {
  const pool = allPhrases.filter((p) => unlockedIds.has(p.id));
  if (pool.length === 0) return null;
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  return pool[dayIndex % pool.length];
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
