import type { Badge, UserProgress } from "@/types/learning";

export const badges: Badge[] = [
  {
    id: "first-room",
    name: "First Room",
    description: "Tu as terminé ta première room. La machine est lancée.",
    emoji: "🚪",
    requirement: "Terminer 1 room",
  },
  {
    id: "streak-5",
    name: "5-Day Streak",
    description: "Cinq jours d'affilée. C'est comme ça qu'on progresse.",
    emoji: "🔥",
    requirement: "5 jours de suite",
  },
  {
    id: "fast-listener",
    name: "Fast Listener",
    description: "Score de compréhension ≥ 80 % sur 3 rooms.",
    emoji: "🎧",
    requirement: "80 %+ de compréhension sur 3 rooms",
  },
  {
    id: "first-speak-back",
    name: "First Speak Back",
    description: "Tu as répondu à voix haute pour la première fois.",
    emoji: "🎙️",
    requirement: "1 exercice Speak Back",
  },
  {
    id: "phrases-25",
    name: "25 Phrases",
    description: "25 phrases réelles dans ta banque. Un vrai capital.",
    emoji: "💎",
    requirement: "Débloquer 25 phrases",
  },
  {
    id: "rooms-5",
    name: "Room Regular",
    description: "5 rooms terminées. Tu prends tes habitudes.",
    emoji: "🏠",
    requirement: "Terminer 5 rooms",
  },
  {
    id: "first-mastered",
    name: "First Mastered",
    description: "Première phrase maîtrisée. Elle est à toi maintenant.",
    emoji: "⭐️",
    requirement: "Maîtriser 1 phrase",
  },
];

export function getBadgeById(id: string): Badge | undefined {
  return badges.find((badge) => badge.id === id);
}

/** Calcule les badges mérités selon l'état de progression. */
export function computeEarnedBadges(progress: UserProgress): string[] {
  const earned = new Set(progress.earnedBadges);
  const completedCount = Object.keys(progress.completedRooms).length;
  const unlockedCount = Object.keys(progress.phrases).length;
  const masteredCount = Object.values(progress.phrases).filter(
    (p) => p.status === "mastered",
  ).length;
  const highComprehension = Object.values(progress.completedRooms).filter(
    (r) => r.comprehension >= 80,
  ).length;

  if (completedCount >= 1) earned.add("first-room");
  if (completedCount >= 5) earned.add("rooms-5");
  if (progress.streak >= 5 || progress.bestStreak >= 5) earned.add("streak-5");
  if (highComprehension >= 3) earned.add("fast-listener");
  if (progress.speakingAttempts >= 1) earned.add("first-speak-back");
  if (unlockedCount >= 25) earned.add("phrases-25");
  if (masteredCount >= 1) earned.add("first-mastered");

  return Array.from(earned);
}
