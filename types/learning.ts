/**
 * Modèle de données pédagogique de FluentRoom.
 * Tout le contenu V1 est typé ici et servi depuis /data en seed local.
 */

export type CEFRLevel = "A1" | "A2" | "B1" | "B2";
export type Accent = "US" | "UK" | "Mixed";

export type PhraseCategory =
  | "everyday"
  | "travel"
  | "social"
  | "fast-english"
  | "opinions"
  | "problems";

export type PhraseStatus = "new" | "seen" | "review" | "mastered";

export interface DialogueLine {
  /** Index de la réplique dans le dialogue. */
  id: number;
  speaker: string;
  text: string;
  translation: string;
}

export interface ComprehensionQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  /** Feedback court affiché après la réponse. */
  explanation: string;
}

export interface DecodeNote {
  /** Phrase anglaise telle qu'entendue. */
  line: string;
  /** Traduction naturelle, pas mot à mot. */
  translation: string;
  /** Explication courte, ton naturel. */
  explanation: string;
  /** Bloc utile à retenir, surligné dans l'UI. */
  chunk: string;
}

export interface Phrase {
  id: string;
  english: string;
  french: string;
  example: string;
  context: string;
  category: PhraseCategory;
  roomId: string;
}

export interface SpeakBackPrompt {
  /** Situation posée à l'utilisateur (en français). */
  situation: string;
  /** Ce que dit l'interlocuteur (en anglais). */
  heard: string;
  suggestedAnswers: string[];
}

export interface Room {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  level: CEFRLevel;
  /** Ex: "A2/B1" pour l'affichage. */
  levelLabel: string;
  /** Durée estimée en minutes. */
  duration: number;
  accent: Accent;
  goal: string;
  focus: string;
  category: PhraseCategory;
  /** Accessible sans premium. */
  free: boolean;
  dialogue: DialogueLine[];
  /** Idées clés attendues à l'étape "What did you understand?". */
  expectedIdeas: string[];
  /** 3 choix rapides pour ne pas bloquer l'utilisateur. */
  quickChoices: string[];
  questions: ComprehensionQuestion[];
  decodeNotes: DecodeNote[];
  phrases: Phrase[];
  speakBack: SpeakBackPrompt;
  /** Ids des répliques à répéter en shadowing. */
  shadowingLineIds: number[];
}

export interface VideoRoom {
  id: string;
  title: string;
  description: string;
  youtubeVideoId: string | null;
  startTime: number;
  endTime: number;
  transcript: string[];
  keyIdeas: string[];
  phrases: string[];
  questions: string[];
  difficulty: CEFRLevel;
  accent: Accent;
  category: PhraseCategory;
  /** V1 : contenu teaser, pas encore jouable. */
  comingSoon: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  /** Condition lisible affichée à l'utilisateur. */
  requirement: string;
}

export interface Level {
  id: string;
  /** Nom motivant : "Fast Listener", etc. */
  name: string;
  /** Équivalent CECRL affiché en secondaire. */
  cefr: CEFRLevel | "B2+";
  /** XP minimum pour atteindre ce niveau. */
  minXp: number;
  tagline: string;
}

export interface PracticeResult {
  phraseId: string;
  /** Score heuristique 0–100 basé sur les mots reconnus. */
  score: number;
  transcript: string;
  /** true si la reconnaissance vocale était indisponible (fallback). */
  markedManually: boolean;
  at: string;
}

export type OnboardingGoal =
  | "videos"
  | "travel"
  | "natives"
  | "speaking"
  | "conversation"
  | "accent"
  | "basics";

export type OnboardingLevel =
  | "beginner"
  | "some"
  | "blocked"
  | "semi"
  | "natural"
  | "fluent";

export type OnboardingBlocker =
  | "fast-speech"
  | "blocked-reply"
  | "translating"
  | "vocab"
  | "shy";

export interface OnboardingChoices {
  /** Blocage principal ressenti (étape 1 du nouvel onboarding). */
  blocker?: OnboardingBlocker;
  goal: OnboardingGoal;
  level: OnboardingLevel;
  dailyMinutes: 5 | 10 | 15 | 20;
  profileName: string;
  completedAt: string;
}

export interface RoomResult {
  roomId: string;
  completedAt: string;
  /** % de bonnes réponses au Quick Check. */
  comprehension: number;
  /** Score oral moyen (shadowing + speak back). */
  speaking: number;
  timeSpentSec: number;
  xpEarned: number;
  /** Room terminée sans ouvrir le transcript (badge No Subtitles). */
  noSubtitles?: boolean;
}

/* ---------- Leçons écrites (structures de l'oral) ---------- */

export type LessonStatus = "new" | "learning" | "mastered";

export interface LessonExample {
  english: string;
  french: string;
}

export interface Lesson {
  id: string;
  /** Structure enseignée, ex: "I'm trying to…". */
  structure: string;
  title: string;
  emoji: string;
  objective: string;
  /** Explication naturelle en français, pas académique. */
  explanation: string;
  examples: LessonExample[];
  commonMistake: {
    wrong: string;
    right: string;
    note: string;
  };
  quiz: ComprehensionQuestion[];
  /** Exercice "build your own sentence" : remettre les mots dans l'ordre. */
  build: {
    prompt: string;
    words: string[];
    answer: string;
  };
  /** Phrase à répéter en shadowing. */
  shadowLine: string;
  /** La structure rejoint la Phrase Bank une fois la leçon apprise. */
  phrase: Phrase;
}

export interface LessonState {
  status: LessonStatus;
  startedAt: string;
  completedAt: string | null;
}

/* ---------- Daily Path ---------- */

export type DailyStepId = "warmup" | "room" | "lesson" | "review";

export interface PhraseState {
  status: PhraseStatus;
  unlockedAt: string;
  lastReviewedAt: string | null;
  /** Nombre de révisions réussies (3 => mastered). */
  reviews: number;
}

export interface UserProgress {
  onboarding: OnboardingChoices | null;
  xp: number;
  streak: number;
  bestStreak: number;
  lastActiveDate: string | null;
  completedRooms: Record<string, RoomResult>;
  phrases: Record<string, PhraseState>;
  /** Moyennes glissantes 0–100. */
  listeningScore: number;
  speakingScore: number;
  /** Vitesse de réponse moyenne en secondes (speak back). */
  responseSpeed: number | null;
  speakingAttempts: number;
  earnedBadges: string[];
  /** Date de déblocage de chaque badge (clé = badge id). */
  badgeDates: Record<string, string>;
  /** XP gagné par jour (clé = date ISO yyyy-mm-dd). */
  activity: Record<string, number>;
  practiceLog: PracticeResult[];
  /** Leçons écrites : statut par leçon. */
  lessons: Record<string, LessonState>;
  /** Étapes du Daily Path complétées, par jour. */
  dailyPath: Record<string, DailyStepId[]>;
  /** Dernier jour où le Daily Chest a été ouvert. */
  chestClaimedOn: string | null;
  /** Compteurs pédagogiques. */
  shadowingAttempts: number;
  speakBackAnswers: number;
  drillsCompleted: number;
  reviewSessions: number;
  /** Retours après une pause de 2 jours ou plus. */
  comebackCount: number;
  /** Quêtes réclamées (clé = "d:date:id" ou "w:semaine:id"). */
  claimedQuests: string[];
}
