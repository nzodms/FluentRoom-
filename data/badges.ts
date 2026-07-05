import type { Badge, UserProgress } from "@/types/learning";

export const badges: Badge[] = [
  {
    id: "first-room",
    name: "Première session",
    description: "Tu as terminé ta première room. La machine est lancée.",
    emoji: "🚪",
    requirement: "Terminer 1 room",
  },
  {
    id: "first-phrase",
    name: "Première phrase",
    description: "Ta première phrase réelle est dans la banque.",
    emoji: "🔑",
    requirement: "Débloquer 1 phrase",
  },
  {
    id: "phrases-5",
    name: "5 phrases",
    description: "Cinq phrases que les natifs utilisent vraiment.",
    emoji: "✋",
    requirement: "Débloquer 5 phrases",
  },
  {
    id: "phrases-25",
    name: "25 phrases",
    description: "25 phrases réelles dans ta banque. Un vrai capital.",
    emoji: "💎",
    requirement: "Débloquer 25 phrases",
  },
  {
    id: "first-speak-back",
    name: "Première réponse orale",
    description: "Tu as répondu pour la première fois. Le plus dur est fait.",
    emoji: "🎙️",
    requirement: "1 exercice Speak Back",
  },
  {
    id: "first-shadowing",
    name: "Premier shadowing",
    description: "Tu as copié le rythme d'un natif. C'est comme ça qu'on parle vite.",
    emoji: "🗣️",
    requirement: "1 session de shadowing",
  },
  {
    id: "streak-3",
    name: "Série de 3 jours",
    description: "Trois jours d'affilée. L'habitude s'installe.",
    emoji: "✨",
    requirement: "3 jours de suite",
  },
  {
    id: "streak-7",
    name: "Série de 7 jours",
    description: "Une semaine complète. Ton oreille change déjà.",
    emoji: "🔥",
    requirement: "7 jours de suite",
  },
  {
    id: "fast-listener",
    name: "Écoute rapide",
    description: "80 %+ de compréhension sur 3 rooms. Ton oreille suit.",
    emoji: "🎧",
    requirement: "80 %+ sur 3 rooms",
  },
  {
    id: "no-subtitles",
    name: "Sans sous-titres",
    description: "Room terminée sans jamais ouvrir le transcript. Respect.",
    emoji: "🙈",
    requirement: "1 room sans transcript",
  },
  {
    id: "natural-reply",
    name: "Réponse naturelle",
    description: "3 réponses à toi en Speak Back. Tu penses en anglais.",
    emoji: "💬",
    requirement: "3 réponses personnelles",
  },
  {
    id: "comeback",
    name: "Retour gagnant",
    description: "Revenu après une pause. C'est ça, la vraie régularité.",
    emoji: "🪃",
    requirement: "Revenir après 2+ jours",
  },
  {
    id: "first-lesson",
    name: "Premier bloc",
    description: "Première structure apprise. Ton cerveau pense en blocs.",
    emoji: "🧱",
    requirement: "Terminer 1 leçon",
  },
  {
    id: "first-mastered",
    name: "Premier maîtrisé",
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
  const noSubtitlesRoom = Object.values(progress.completedRooms).some(
    (r) => r.noSubtitles,
  );
  const lessonsMastered = Object.values(progress.lessons ?? {}).filter(
    (l) => l.status === "mastered",
  ).length;
  const streakMax = Math.max(progress.streak, progress.bestStreak);

  if (completedCount >= 1) earned.add("first-room");
  if (unlockedCount >= 1) earned.add("first-phrase");
  if (unlockedCount >= 5) earned.add("phrases-5");
  if (unlockedCount >= 25) earned.add("phrases-25");
  if (progress.speakingAttempts >= 1) earned.add("first-speak-back");
  if ((progress.shadowingAttempts ?? 0) >= 1) earned.add("first-shadowing");
  if (streakMax >= 3) earned.add("streak-3");
  if (streakMax >= 7) earned.add("streak-7");
  if (highComprehension >= 3) earned.add("fast-listener");
  if (noSubtitlesRoom) earned.add("no-subtitles");
  if ((progress.speakBackAnswers ?? 0) >= 3) earned.add("natural-reply");
  if ((progress.comebackCount ?? 0) >= 1) earned.add("comeback");
  if (lessonsMastered >= 1) earned.add("first-lesson");
  if (masteredCount >= 1) earned.add("first-mastered");

  return Array.from(earned);
}
