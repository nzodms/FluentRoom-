"use client";

import { useCallback, useSyncExternalStore } from "react";
import type {
  OnboardingChoices,
  PracticeResult,
  UserProgress,
} from "@/types/learning";
import type { AvatarConfig, DailyStepId, Reward } from "@/types/learning";
import { openRewardChest } from "./chests";
import {
  CompleteLessonOutcome,
  CompleteRoomInput,
  CompleteRoomOutcome,
  ReviewSessionResult,
  claimQuest,
  completeDailyStep,
  completeDrillSession,
  completeLesson,
  completeReviewSession,
  completeRoom,
  defaultProgress,
  getStats,
  loadProgress,
  recordPractice,
  reviewPhrase,
  saveOnboarding,
  saveProgress,
  startLesson,
  touchToday,
} from "./progress";
import { clearAll } from "./storage";

/**
 * Store externe minimal : localStorage → React via useSyncExternalStore.
 * Toutes les mutations passent par `setState`, qui persiste et notifie.
 */
const SERVER_SNAPSHOT: UserProgress = defaultProgress();

let cache: UserProgress | null = null;
const listeners = new Set<() => void>();

function getSnapshot(): UserProgress {
  if (cache === null) cache = loadProgress();
  return cache;
}

function getServerSnapshot(): UserProgress {
  return SERVER_SNAPSHOT;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setState(next: UserProgress): void {
  cache = next;
  saveProgress(next);
  listeners.forEach((listener) => listener());
}

const noopSubscribe = () => () => {};

/** Source de vérité côté client. `ready` = hydratation terminée. */
export function useProgress() {
  const progress = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const ready = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const finishRoom = useCallback(
    (input: CompleteRoomInput): CompleteRoomOutcome => {
      const outcome = completeRoom(getSnapshot(), input);
      setState(outcome.progress);
      return outcome;
    },
    [],
  );

  const practice = useCallback((result: PracticeResult) => {
    setState(recordPractice(getSnapshot(), result));
  }, []);

  const review = useCallback((phraseId: string) => {
    setState(touchToday(reviewPhrase(getSnapshot(), phraseId)));
  }, []);

  const completeOnboarding = useCallback((choices: OnboardingChoices) => {
    setState(saveOnboarding(getSnapshot(), choices));
  }, []);

  const reset = useCallback(() => {
    clearAll();
    setState(defaultProgress());
  }, []);

  const doDailyStep = useCallback((step: DailyStepId) => {
    setState(completeDailyStep(getSnapshot(), step));
  }, []);

  /** Ouvre un coffre disponible et retourne la récompense tirée. */
  const openChest = useCallback((): Reward | null => {
    const outcome = openRewardChest(getSnapshot());
    if (outcome.reward) setState(outcome.progress);
    return outcome.reward;
  }, []);

  const setAvatar = useCallback((config: AvatarConfig) => {
    setState({ ...getSnapshot(), avatar: config });
  }, []);

  const beginLesson = useCallback((lessonId: string) => {
    setState(startLesson(getSnapshot(), lessonId));
  }, []);

  const finishLesson = useCallback(
    (lessonId: string): CompleteLessonOutcome => {
      const outcome = completeLesson(getSnapshot(), lessonId);
      setState(outcome.progress);
      return outcome;
    },
    [],
  );

  const finishDrillSession = useCallback((scorePercent: number) => {
    setState(completeDrillSession(getSnapshot(), scorePercent));
  }, []);

  const finishReviewSession = useCallback((result: ReviewSessionResult) => {
    setState(completeReviewSession(getSnapshot(), result));
  }, []);

  const takeQuestReward = useCallback((questKey: string, xp: number) => {
    setState(claimQuest(getSnapshot(), questKey, xp));
  }, []);

  return {
    progress,
    ready,
    stats: getStats(progress),
    finishRoom,
    practice,
    review,
    completeOnboarding,
    reset,
    doDailyStep,
    openChest,
    setAvatar,
    beginLesson,
    finishLesson,
    finishDrillSession,
    finishReviewSession,
    takeQuestReward,
  };
}
