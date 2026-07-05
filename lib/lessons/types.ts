/**
 * Moteur de chapitres FluentRoom : types du modèle pédagogique.
 * Rien n'est codé en dur dans les composants — un chapitre est
 * entièrement décrit par ces données.
 */

export type SkillId =
  | "listening"
  | "speaking"
  | "phrases"
  | "reflexes"
  | "politeness"
  | "comprehension";

export type ChapterDifficulty = 1 | 2 | 3;

/** État de maîtrise d'une phrase ou d'une notion. */
export type MasteryState =
  | "new"
  | "seen"
  | "fragile"
  | "improving"
  | "mastered"
  | "review-due";

/* ---------- Phrases clés d'un chapitre ---------- */

export interface KeyPhrase {
  id: string;
  english: string;
  french: string;
  /** Quand l'utiliser (contexte réel, en français). */
  context: string;
  /** Variante naturelle, ex: version plus polie ou plus directe. */
  variant?: { english: string; note: string };
}

export interface CommonMistake {
  wrong: string;
  right: string;
  note: string;
}

/* ---------- Exercices ---------- */

/**
 * Indices progressifs : jamais la réponse complète.
 * [0] rappel de contexte · [1] logique · [2] élimination/début.
 */
export type HintLadder = string[];

interface ExerciseBase {
  id: string;
  /** Compétence ciblée. */
  skill: SkillId;
  /** Phrase clé liée (la maîtrise se met à jour dessus). */
  phraseId?: string;
  prompt: string;
  /** Sous-texte optionnel (mise en contexte courte). */
  subtitle?: string;
  explanation: string;
  hints: HintLadder;
  difficulty?: ChapterDifficulty;
}

/**
 * Choix : couvre choix rapide, compréhension de sens, réponse
 * naturelle, écoute active (audio), nuances, correction d'erreur
 * et réflexe chronométré (timerSec).
 */
export interface ChoiceExercise extends ExerciseBase {
  type: "choice";
  variant:
    | "quick"
    | "meaning"
    | "natural"
    | "listening"
    | "nuance"
    | "error-spot"
    | "reflex";
  options: string[];
  correctIndex: number;
  /** Notes pédagogiques par option, révélées après la réponse. */
  optionNotes?: string[];
  /** Phrase jouée en audio (écoute active). */
  audio?: string;
  /** Réflexe : temps limité en secondes. */
  timerSec?: number;
}

/** Phrase à trou : compléter le mot ou l'expression manquante. */
export interface GapExercise extends ExerciseBase {
  type: "gap";
  /** Phrase avec ___ à la place du trou. */
  sentence: string;
  options: string[];
  correctIndex: number;
}

/** Reconstruction / traduction guidée : blocs à remettre en ordre. */
export interface BuildExercise extends ExerciseBase {
  type: "build";
  /** Intention en français ("Demande poliment de l'aide"). */
  intent: string;
  words: string[];
  answer: string;
}

/** Conversation simulée : répondre étape par étape. */
export interface ChatTurn {
  speaker: string;
  text: string;
  /** Si présent : c'est à l'utilisateur de répondre. */
  options?: string[];
  correctIndex?: number;
  note?: string;
}

export interface ChatExercise extends ExerciseBase {
  type: "chat";
  turns: ChatTurn[];
}

/** Shadowing : répéter une phrase courte (architecture prête). */
export interface ShadowExercise extends ExerciseBase {
  type: "shadow";
  line: string;
}

export type Exercise =
  | ChoiceExercise
  | GapExercise
  | BuildExercise
  | ChatExercise
  | ShadowExercise;

export type ExerciseType = Exercise["type"];

/* ---------- Chapitre ---------- */

export interface Chapter {
  id: string;
  title: string;
  theme: string;
  /** Objectif concret, lisible ("Demander de l'aide sans paniquer"). */
  objective: string;
  mainSkill: SkillId;
  secondarySkills: SkillId[];
  difficulty: ChapterDifficulty;
  /** Durée estimée en minutes. */
  duration: number;
  /** Chapitres à terminer avant (ids). */
  prerequisites: string[];
  /** Mise en situation racontée par le compagnon. */
  situation: string;
  keyPhrases: KeyPhrase[];
  commonMistakes: CommonMistake[];
  /** Mini-dialogue de référence, montré à l'étape phrases. */
  dialogue: ChatTurn[];
  /** Exercices dans l'ordre pédagogique (le moteur gère les rappels). */
  exercises: Exercise[];
  /** Défi final : micro-conversation qui applique le chapitre. */
  finale: ChatExercise;
  /** FP de base à la fin (bonus sans indice par-dessus). */
  rewardFP: number;
}

/* ---------- Résultats & maîtrise ---------- */

export interface ExerciseOutcome {
  exerciseId: string;
  phraseId?: string;
  correctFirstTry: boolean;
  /** Réussi après rappel (2e passage). */
  recoveredOnRetry: boolean;
  hintsUsed: number;
  /** Réponse suspecte : trop rapide pour être lue (anti-hasard). */
  tooFast: boolean;
}

export interface ChapterResult {
  chapterId: string;
  outcomes: ExerciseOutcome[];
  /** Score de maîtrise 0–100 (précision pondérée par les indices). */
  masteryScore: number;
  /** Ids de phrases restées fragiles (à re-proposer). */
  fragilePhraseIds: string[];
  /** Terminé sans aucun indice (bonus FP). */
  noHints: boolean;
  totalHintsUsed: number;
}

export interface ChapterMastery {
  score: number;
  completedAt: string;
  fragilePhraseIds: string[];
}
