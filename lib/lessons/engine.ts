import type {
  Chapter,
  Exercise,
  ExerciseOutcome,
} from "./types";

/**
 * Moteur de session : file d'exercices avec rappel intelligent.
 * Un exercice raté revient automatiquement plus tard dans la même
 * session (une seule fois) — c'est là que ça s'ancre.
 */

export interface QueuedExercise {
  exercise: Exercise;
  /** 2e passage après un échec. */
  isRetry: boolean;
}

export interface SessionState {
  chapter: Chapter;
  queue: QueuedExercise[];
  /** Position courante dans la file. */
  index: number;
  outcomes: ExerciseOutcome[];
  /** Bonnes réponses consécutives (pour le compagnon). */
  streak: number;
  /** Erreurs consécutives. */
  errorStreak: number;
  totalHintsUsed: number;
}

/** Combien d'exercices plus loin un raté revient. */
const RETRY_GAP = 2;

export function createSession(chapter: Chapter): SessionState {
  return {
    chapter,
    queue: chapter.exercises.map((exercise) => ({ exercise, isRetry: false })),
    index: 0,
    outcomes: [],
    streak: 0,
    errorStreak: 0,
    totalHintsUsed: 0,
  };
}

export function currentExercise(state: SessionState): QueuedExercise | null {
  return state.queue[state.index] ?? null;
}

/** Nombre total d'étapes (grandit si des rappels sont injectés). */
export function totalSteps(state: SessionState): number {
  return state.queue.length;
}

export interface AnswerInput {
  correct: boolean;
  hintsUsed: number;
  /** Temps de réponse en ms (détection du hasard). */
  elapsedMs: number;
}

/** Réponse plus rapide que la lecture de la question = suspecte. */
export const TOO_FAST_MS = 900;

/**
 * Enregistre la réponse à l'exercice courant et avance.
 * Un échec au premier passage ré-injecte l'exercice RETRY_GAP plus
 * loin (rappel intelligent) — jamais deux fois.
 */
export function submitAnswer(
  state: SessionState,
  input: AnswerInput,
): SessionState {
  const current = state.queue[state.index];
  if (!current) return state;
  const tooFast = input.elapsedMs < TOO_FAST_MS && !input.correct;

  const previous = state.outcomes.find(
    (o) => o.exerciseId === current.exercise.id,
  );

  let outcomes = state.outcomes;
  if (current.isRetry && previous) {
    outcomes = outcomes.map((o) =>
      o.exerciseId === current.exercise.id
        ? { ...o, recoveredOnRetry: input.correct }
        : o,
    );
  } else {
    outcomes = [
      ...outcomes,
      {
        exerciseId: current.exercise.id,
        phraseId: current.exercise.phraseId,
        correctFirstTry: input.correct,
        recoveredOnRetry: false,
        hintsUsed: input.hintsUsed,
        tooFast,
      },
    ];
  }

  // Rappel intelligent : le raté revient plus tard (une seule fois).
  let queue = state.queue;
  if (!input.correct && !current.isRetry) {
    const insertAt = Math.min(state.index + 1 + RETRY_GAP, queue.length);
    queue = [
      ...queue.slice(0, insertAt),
      { exercise: current.exercise, isRetry: true },
      ...queue.slice(insertAt),
    ];
  }

  return {
    ...state,
    queue,
    outcomes,
    index: state.index + 1,
    streak: input.correct ? state.streak + 1 : 0,
    errorStreak: input.correct ? 0 : state.errorStreak + 1,
    totalHintsUsed: state.totalHintsUsed + input.hintsUsed,
  };
}

export function isSessionDone(state: SessionState): boolean {
  return state.index >= state.queue.length;
}
