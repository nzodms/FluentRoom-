import type {
  DailyStepId,
  OnboardingChoices,
  PhraseState,
  PhraseStatus,
  PracticeResult,
  RoomResult,
  UserProgress,
} from "@/types/learning";
import { computeEarnedBadges } from "@/data/badges";
import { rooms } from "@/data/rooms";
import { getLessonById } from "@/data/lessons";
import { DEFAULT_AVATAR, DEFAULT_UNLOCKED, avatarItems } from "@/data/avatar-items";
import { applyEnergyReset, currentEnergy, spendEnergy } from "./energy";
import { CHEST_FILL, addChestProgress } from "./chests";
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
    badgeDates: {},
    activity: {},
    practiceLog: [],
    lessons: {},
    dailyPath: {},
    chestClaimedOn: null,
    shadowingAttempts: 0,
    speakBackAnswers: 0,
    drillsCompleted: 0,
    reviewSessions: 0,
    comebackCount: 0,
    claimedQuests: [],
    avatar: { ...DEFAULT_AVATAR },
    unlockedItems: [...DEFAULT_UNLOCKED],
    energy: 5,
    energyResetOn: null,
    chestProgress: 0,
    availableChests: 0,
    openedChests: 0,
    rewardHistory: [],
    streakShields: 0,
    spentFP: 0,
    purchasedItems: [],
    purchaseHistory: [],
  };
}

export function loadProgress(): UserProgress {
  return {
    ...defaultProgress(),
    ...loadJSON<UserProgress>(PROGRESS_KEY, defaultProgress()),
  };
}

export function saveProgress(progress: UserProgress): void {
  saveJSON(PROGRESS_KEY, progress);
}

/** Met à jour streak + comeback pour aujourd'hui. Idempotent dans la journée. */
export function touchToday(progress: UserProgress): UserProgress {
  const today = todayKey();
  if (progress.lastActiveDate === today) return progress;

  let streak = 1;
  let comebackCount = progress.comebackCount ?? 0;
  let streakShields = progress.streakShields ?? 0;
  if (progress.lastActiveDate) {
    const gap = daysBetween(progress.lastActiveDate, today);
    if (gap === 1) {
      streak = progress.streak + 1;
    } else if (gap === 2 && streakShields > 0) {
      // Un Streak Shield absorbe le jour manqué.
      streakShields -= 1;
      streak = progress.streak + 1;
    } else {
      streak = 1;
    }
    // Revenu après avoir raté au moins 2 jours : badge Comeback.
    if (gap >= 3) comebackCount += 1;
  }

  return applyEnergyReset({
    ...progress,
    streak,
    comebackCount,
    streakShields,
    bestStreak: Math.max(progress.bestStreak, streak),
    lastActiveDate: today,
  });
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

/** Débloque les items d'avatar dont le jalon est atteint. */
function syncMilestoneItems(progress: UserProgress): UserProgress {
  const unlocked = new Set(progress.unlockedItems ?? []);
  const roomsDone = Object.keys(progress.completedRooms).length;
  const phrasesDone = Object.keys(progress.phrases).length;
  const streakMax = Math.max(progress.streak, progress.bestStreak);
  for (const item of avatarItems) {
    if (unlocked.has(item.id)) continue;
    const { kind, value = 0 } = item.unlock;
    const ok =
      (kind === "rooms" && roomsDone >= value) ||
      (kind === "streak" && streakMax >= value) ||
      (kind === "speak" && progress.speakingAttempts >= value) ||
      (kind === "phrases" && phrasesDone >= value) ||
      (kind === "xp" && progress.xp >= value);
    if (ok) unlocked.add(item.id);
  }
  return { ...progress, unlockedItems: Array.from(unlocked) };
}

/** Recalcule badges + items à jalons, horodate les nouveaux badges. */
function refreshBadges(progress: UserProgress): UserProgress {
  const earned = computeEarnedBadges(progress);
  const badgeDates = { ...(progress.badgeDates ?? {}) };
  const now = new Date().toISOString();
  for (const id of earned) {
    if (!badgeDates[id]) badgeDates[id] = now;
  }
  return syncMilestoneItems({ ...progress, earnedBadges: earned, badgeDates });
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

/** Une révision réussie fait monter la phrase : new → seen → review → mastered. */
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
  /** Room terminée sans ouvrir le transcript. */
  noSubtitles?: boolean;
  /** L'utilisateur a donné SA réponse au Speak Back (pas juste regardé). */
  answeredSpeakBack?: boolean;
}

export interface CompleteRoomOutcome {
  progress: UserProgress;
  xpEarned: number;
  newBadges: string[];
  unlockedPhraseIds: string[];
  /** XP total avant cette room (pour animer la barre de niveau). */
  xpBefore: number;
}

/** Moyenne glissante douce : 70 % ancien score, 30 % nouveau. */
const blend = (old: number, incoming: number) =>
  old === 0 ? incoming : Math.round(old * 0.7 + incoming * 0.3);

/** Termine une room : XP, phrases débloquées, scores, streak et badges. */
export function completeRoom(
  progress: UserProgress,
  input: CompleteRoomInput,
): CompleteRoomOutcome {
  const room = rooms.find((r) => r.id === input.roomId);
  const alreadyDone = Boolean(progress.completedRooms[input.roomId]);
  const xpBefore = progress.xp;

  const base = alreadyDone ? 20 : 50;
  const bonus = Math.round((input.comprehension / 100) * 30);
  const noSubBonus = input.noSubtitles ? 10 : 0;
  // Sans Focus Energy : mode practice, FP réduits de moitié.
  const practiceMode = currentEnergy(progress) === 0;
  const xpEarned = Math.round(
    (base + bonus + noSubBonus) * (practiceMode ? 0.5 : 1),
  );

  const result: RoomResult = {
    roomId: input.roomId,
    completedAt: new Date().toISOString(),
    comprehension: input.comprehension,
    speaking: input.speaking,
    timeSpentSec: input.timeSpentSec,
    xpEarned,
    noSubtitles: input.noSubtitles ?? false,
  };

  let next: UserProgress = {
    ...touchToday(progress),
    completedRooms: { ...progress.completedRooms, [input.roomId]: result },
  };

  next = addXp(next, xpEarned);

  const phraseIds = room?.phrases.map((p) => p.id) ?? [];
  next = unlockPhrases(next, phraseIds);

  next = {
    ...next,
    listeningScore: blend(next.listeningScore, input.comprehension),
    speakingScore: blend(next.speakingScore, input.speaking),
    speakingAttempts: next.speakingAttempts + 1,
    shadowingAttempts: (next.shadowingAttempts ?? 0) + 1,
    speakBackAnswers:
      (next.speakBackAnswers ?? 0) + (input.answeredSpeakBack ? 1 : 0),
  };

  // La room complète l'étape "room" du Daily Path, consomme 1 énergie
  // et remplit le coffre.
  next = markDailyStep(next, "room");
  next = spendEnergy(next, 1);
  next = addChestProgress(next, practiceMode ? CHEST_FILL.room / 2 : CHEST_FILL.room);

  const before = new Set(progress.earnedBadges);
  next = refreshBadges(next);
  const newBadges = next.earnedBadges.filter((id) => !before.has(id));

  return {
    progress: next,
    xpEarned,
    newBadges,
    unlockedPhraseIds: phraseIds,
    xpBefore,
  };
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
    shadowingAttempts: (next.shadowingAttempts ?? 0) + 1,
    practiceLog: [...next.practiceLog.slice(-99), result],
  };
  return refreshBadges(next);
}

export function saveOnboarding(
  progress: UserProgress,
  choices: OnboardingChoices,
): UserProgress {
  return touchToday({ ...progress, onboarding: choices });
}

/* ---------- Daily Path ---------- */

export const DAILY_STEP_XP: Record<DailyStepId, number> = {
  warmup: 5,
  room: 0, // l'XP de la room est déjà compté
  lesson: 0, // idem leçon
  review: 10,
};

function markDailyStep(
  progress: UserProgress,
  step: DailyStepId,
): UserProgress {
  const today = todayKey();
  const done = progress.dailyPath?.[today] ?? [];
  if (done.includes(step)) return progress;
  return {
    ...progress,
    dailyPath: { ...(progress.dailyPath ?? {}), [today]: [...done, step] },
  };
}

/** Complète une étape du Daily Path avec son XP. Idempotent. */
export function completeDailyStep(
  progress: UserProgress,
  step: DailyStepId,
): UserProgress {
  const today = todayKey();
  const done = progress.dailyPath?.[today] ?? [];
  if (done.includes(step)) return progress;
  let next = markDailyStep(touchToday(progress), step);
  const xp = DAILY_STEP_XP[step];
  if (xp > 0) next = addXp(next, xp);
  return refreshBadges(next);
}

export function getDailySteps(progress: UserProgress): DailyStepId[] {
  return progress.dailyPath?.[todayKey()] ?? [];
}

/* ---------- Leçons ---------- */

export function startLesson(
  progress: UserProgress,
  lessonId: string,
): UserProgress {
  if (progress.lessons?.[lessonId]) return progress;
  return {
    ...progress,
    lessons: {
      ...(progress.lessons ?? {}),
      [lessonId]: {
        status: "learning",
        startedAt: new Date().toISOString(),
        completedAt: null,
      },
    },
  };
}

export const LESSON_XP = 30;

export interface CompleteLessonOutcome {
  progress: UserProgress;
  xpEarned: number;
  newBadges: string[];
}

/** Termine une leçon : structure maîtrisée, phrase en banque, XP, étape du path. */
export function completeLesson(
  progress: UserProgress,
  lessonId: string,
): CompleteLessonOutcome {
  const lesson = getLessonById(lessonId);
  const already = progress.lessons?.[lessonId]?.status === "mastered";
  const practiceMode = currentEnergy(progress) === 0;
  const xpEarned = Math.round((already ? 10 : LESSON_XP) * (practiceMode ? 0.5 : 1));

  let next = touchToday(progress);
  next = {
    ...next,
    lessons: {
      ...(next.lessons ?? {}),
      [lessonId]: {
        status: "mastered",
        startedAt:
          next.lessons?.[lessonId]?.startedAt ?? new Date().toISOString(),
        completedAt: new Date().toISOString(),
      },
    },
  };
  next = addXp(next, xpEarned);
  if (lesson) next = unlockPhrases(next, [lesson.phrase.id]);
  next = markDailyStep(next, "lesson");
  next = spendEnergy(next, 1);
  next = addChestProgress(next, practiceMode ? CHEST_FILL.lesson / 2 : CHEST_FILL.lesson);

  const before = new Set(progress.earnedBadges);
  next = refreshBadges(next);
  const newBadges = next.earnedBadges.filter((id) => !before.has(id));

  return { progress: next, xpEarned, newBadges };
}

/* ---------- Drills (Listen) ---------- */

export function completeDrillSession(
  progress: UserProgress,
  scorePercent: number,
): UserProgress {
  let next = touchToday(progress);
  next = addXp(next, 10 + Math.round(scorePercent / 20));
  next = {
    ...next,
    drillsCompleted: (next.drillsCompleted ?? 0) + 1,
    listeningScore: blend(next.listeningScore, scorePercent),
  };
  next = spendEnergy(next, 1);
  next = addChestProgress(next, CHEST_FILL.drill);
  return refreshBadges(next);
}

/* ---------- Review session (Phrase Bank) ---------- */

export interface ReviewSessionResult {
  known: string[];
  toReview: string[];
}

export function completeReviewSession(
  progress: UserProgress,
  result: ReviewSessionResult,
): UserProgress {
  let next = touchToday(progress);
  for (const id of result.known) {
    next = reviewPhrase(next, id);
  }
  // Les phrases "à revoir" sont juste re-vues, sans monter de statut.
  next = addXp(next, 6 + result.known.length * 2);
  next = {
    ...next,
    reviewSessions: (next.reviewSessions ?? 0) + 1,
  };
  // Première session du jour : complète l'étape Review du Daily Path (+XP).
  const stepDone = getDailySteps(next).includes("review");
  next = markDailyStep(next, "review");
  if (!stepDone) {
    next = addXp(next, DAILY_STEP_XP.review);
    next = spendEnergy(next, 1);
  }
  next = addChestProgress(next, CHEST_FILL.review);
  return refreshBadges(next);
}

/* ---------- Quêtes ---------- */

/** Réclame une quête accomplie : +XP, une seule fois par clé. */
export function claimQuest(
  progress: UserProgress,
  questKey: string,
  xp: number,
): UserProgress {
  if ((progress.claimedQuests ?? []).includes(questKey)) return progress;
  let next = touchToday({
    ...progress,
    claimedQuests: [...(progress.claimedQuests ?? []), questKey],
  });
  next = addXp(next, xp);
  next = addChestProgress(next, CHEST_FILL.quest);
  return refreshBadges(next);
}

/* ---------- Scores dérivés ---------- */

/** Score global 0–100 : oreille, oral, phrases maîtrisées, régularité. */
export function fluencyScore(progress: UserProgress): number {
  const phraseStates = Object.values(progress.phrases);
  const masteredRatio =
    phraseStates.length === 0
      ? 0
      : phraseStates.filter((p) => p.status === "mastered").length /
        Math.max(phraseStates.length, 10);
  return Math.round(
    progress.listeningScore * 0.35 +
      progress.speakingScore * 0.35 +
      Math.min(100, masteredRatio * 100) * 0.15 +
      Math.min(100, progress.streak * 12) * 0.15,
  );
}

/** Statistiques dérivées pour les dashboards. */
export function getStats(progress: UserProgress) {
  const phraseStates = Object.values(progress.phrases);
  const roomResults = Object.values(progress.completedRooms);
  return {
    roomsCompleted: roomResults.length,
    phrasesUnlocked: phraseStates.length,
    phrasesMastered: phraseStates.filter((p) => p.status === "mastered").length,
    phrasesToReview: phraseStates.filter(
      (p) => p.status === "review" || p.status === "seen",
    ).length,
    lessonsMastered: Object.values(progress.lessons ?? {}).filter(
      (l) => l.status === "mastered",
    ).length,
    listeningTimeSec: roomResults.reduce((sum, r) => sum + r.timeSpentSec, 0),
    totalRooms: rooms.length,
    fluency: fluencyScore(progress),
  };
}
