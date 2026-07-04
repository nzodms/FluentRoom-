import type {
  OnboardingChoices,
  PhraseState,
  PhraseStatus,
  PracticeResult,
  RoomResult,
  UserProgress,
} from "@/types/learning";
import { computeEarnedBadges } from "@/data/badges";
import { rooms } from "@/data/rooms";
import { clamp, daysBetween, todayKey } from "./utils";
import { loadJSON, saveJSON } from "./storage";

const PROGRESS_KEY = "progress";

export function defaultProgress(): UserProgress {
  return {
    onboarding: null,
    xp: 0,
    streak: 0,
    bestStreak: 0,
    lastActiveDate: null,
    completedRooms: {},
    phrases: {},
    listeningScore: 0,
    speakingScore: 0,
    responseSpeed: null,
    speakingAttempts: 0,
    earnedBadges: [],
    activity: {},
    practiceLog: [],
  };
}

export function loadProgress(): UserProgress {
  return { ...defaultProgress(), ...loadJSON<UserProgress>(PROGRESS_KEY, defaultProgress()) };
}

export function saveProgress(progress: UserProgress): void {
  saveJSON(PROGRESS_KEY, progress);
}

/** Met à jour streak + activité pour aujourd'hui. Idempotent dans la journée. */
export function touchToday(progress: UserProgress): UserProgress {
  const today = todayKey();
  if (progress.lastActiveDate === today) return progress;

  let streak = 1;
  if (progress.lastActiveDate) {
    const gap = daysBetween(progress.lastActiveDate, today);
    streak = gap === 1 ? progress.streak + 1 : 1;
  }

  return {
    ...progress,
    streak,
    bestStreak: Math.max(progress.bestStreak, streak),
    lastActiveDate: today,
  };
}

export function addXp(progress: UserProgress, amount: number): UserProgress {
  const today = todayKey();
  return {
    ...progress,
    xp: progress.xp + amount,
    activity: {
      ...progress.activity,
      [today]: (progress.activity[today] ?? 0) + amount,
    },
  };
}

const STATUS_BY_REVIEWS: PhraseStatus[] = ["new", "seen", "review", "mastered"];

function statusForReviews(reviews: number): PhraseStatus {
  return STATUS_BY_REVIEWS[clamp(reviews, 0, 3)];
}

/** Débloque des phrases (statut "new") sans écraser un état existant. */
export function unlockPhrases(
  progress: UserProgress,
  phraseIds: string[],
): UserProgress {
  const now = new Date().toISOString();
  const phrases = { ...progress.phrases };
  for (const id of phraseIds) {
    if (!phrases[id]) {
      phrases[id] = {
        status: "new",
        unlockedAt: now,
        lastReviewedAt: null,
        reviews: 0,
      };
    }
  }
  return { ...progress, phrases };
}

/** Une révision réussie fait monter la phrase dans l'échelle new → seen → review → mastered. */
export function reviewPhrase(
  progress: UserProgress,
  phraseId: string,
): UserProgress {
  const existing: PhraseState = progress.phrases[phraseId] ?? {
    status: "new",
    unlockedAt: new Date().toISOString(),
    lastReviewedAt: null,
    reviews: 0,
  };
  const reviews = existing.reviews + 1;
  return {
    ...progress,
    phrases: {
      ...progress.phrases,
      [phraseId]: {
        ...existing,
        reviews,
        status: statusForReviews(reviews),
        lastReviewedAt: new Date().toISOString(),
      },
    },
  };
}

export interface CompleteRoomInput {
  roomId: string;
  comprehension: number;
  speaking: number;
  timeSpentSec: number;
}

export interface CompleteRoomOutcome {
  progress: UserProgress;
  xpEarned: number;
  newBadges: string[];
  unlockedPhraseIds: string[];
}

/** Termine une room : XP, phrases débloquées, scores, streak et badges. */
export function completeRoom(
  progress: UserProgress,
  input: CompleteRoomInput,
): CompleteRoomOutcome {
  const room = rooms.find((r) => r.id === input.roomId);
  const alreadyDone = Boolean(progress.completedRooms[input.roomId]);

  const base = alreadyDone ? 20 : 50;
  const bonus = Math.round((input.comprehension / 100) * 30);
  const xpEarned = base + bonus;

  const result: RoomResult = {
    roomId: input.roomId,
    completedAt: new Date().toISOString(),
    comprehension: input.comprehension,
    speaking: input.speaking,
    timeSpentSec: input.timeSpentSec,
    xpEarned,
  };

  let next: UserProgress = {
    ...touchToday(progress),
    completedRooms: { ...progress.completedRooms, [input.roomId]: result },
  };

  next = addXp(next, xpEarned);

  const phraseIds = room?.phrases.map((p) => p.id) ?? [];
  next = unlockPhrases(next, phraseIds);

  // Moyennes glissantes douces : 70 % ancien score, 30 % nouveau.
  const blend = (old: number, incoming: number) =>
    old === 0 ? incoming : Math.round(old * 0.7 + incoming * 0.3);
  next = {
    ...next,
    listeningScore: blend(next.listeningScore, input.comprehension),
    speakingScore: blend(next.speakingScore, input.speaking),
    speakingAttempts: next.speakingAttempts + 1,
  };

  const before = new Set(progress.earnedBadges);
  const earned = computeEarnedBadges(next);
  next = { ...next, earnedBadges: earned };
  const newBadges = earned.filter((id) => !before.has(id));

  return { progress: next, xpEarned, newBadges, unlockedPhraseIds: phraseIds };
}

export function recordPractice(
  progress: UserProgress,
  result: PracticeResult,
): UserProgress {
  let next = touchToday(progress);
  next = reviewPhrase(next, result.phraseId);
  next = addXp(next, result.score >= 60 ? 8 : 4);
  next = {
    ...next,
    speakingAttempts: next.speakingAttempts + 1,
    practiceLog: [...next.practiceLog.slice(-99), result],
  };
  next = { ...next, earnedBadges: computeEarnedBadges(next) };
  return next;
}

export function saveOnboarding(
  progress: UserProgress,
  choices: OnboardingChoices,
): UserProgress {
  return touchToday({ ...progress, onboarding: choices });
}

/** Statistiques dérivées pour les dashboards. */
export function getStats(progress: UserProgress) {
  const phraseStates = Object.values(progress.phrases);
  return {
    roomsCompleted: Object.keys(progress.completedRooms).length,
    phrasesUnlocked: phraseStates.length,
    phrasesMastered: phraseStates.filter((p) => p.status === "mastered").length,
    phrasesToReview: phraseStates.filter(
      (p) => p.status === "review" || p.status === "seen",
    ).length,
    totalRooms: rooms.length,
  };
}
