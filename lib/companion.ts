import type { UserProgress } from "@/types/learning";
import { getLevelForXp } from "@/data/levels";
import { getDailySteps } from "./progress";
import { availableFP, nextAffordableHint } from "./shop";
import { daysBetween, todayKey } from "./utils";

/**
 * Moteur du compagnon : dialogues contextuels, mémoire légère,
 * évolution visuelle. Aucune phrase codée dans les composants —
 * tout passe par ici, pour ajouter facilement compagnons et variantes.
 */

/* ---------- Événements de dialogue ---------- */

export type CompanionEvent =
  | "first-visit"
  | "back-next-day"
  | "back-after-absence"
  | "no-lesson-yet"
  | "daily-done"
  | "streak-kept"
  | "new-level"
  | "chest-ready"
  | "shop-affordable"
  | "lesson-done"
  | "correct"
  | "correct-streak"
  | "error"
  | "error-streak"
  | "mission"
  | "calibrate-invite"
  | "memory";

/**
 * Variantes par événement. Placeholders : {streak}, {fp}, {item},
 * {missing}, {level}, {lessons}. Ton : court, adulte, jamais cringe.
 */
const VARIANTS: Record<CompanionEvent, string[]> = {
  "first-visit": [
    "Bienvenue. On commence doucement — une mission courte, et ton anglais démarre.",
    "Content de te voir. Ton espace est prêt, ta première mission aussi.",
  ],
  "back-next-day": [
    "De retour — c'est ça, le vrai secret. On enchaîne ?",
    "Jour après jour, ton oreille se règle. On continue.",
    "Te revoilà. Une session courte suffit pour entretenir le réflexe.",
  ],
  "back-after-absence": [
    "Content de te revoir. On reprend en douceur, sans pression.",
    "Une pause, ça arrive. Ce qui compte, c'est de revenir — et tu es là.",
  ],
  "no-lesson-yet": [
    "Quand tu es prêt, ta première mission t'attend juste en dessous.",
    "Pas besoin d'être parfait pour commencer. Juste de commencer.",
  ],
  "daily-done": [
    "Objectif du jour bouclé. Ton anglais a bougé aujourd'hui — vraiment.",
    "Journée pleine. Reviens demain, ton énergie sera rechargée.",
  ],
  "streak-kept": [
    "{streak} jours de suite — c'est exactement comme ça qu'on progresse.",
    "Série de {streak} jours. Ton cerveau adore cette régularité.",
  ],
  "new-level": [
    "Niveau {level} atteint. Ce n'est pas un chiffre — c'est ton oreille qui change.",
    "{level} — chaque session t'a amené ici.",
  ],
  "chest-ready": [
    "Ton coffre est prêt. Tu l'as gagné — va l'ouvrir.",
    "Un coffre t'attend. Petit moment pour toi avant la suite.",
  ],
  "shop-affordable": [
    "Tu as {fp} FP — « {item} » est à ta portée dans la boutique.",
    "Tes efforts ont payé : tu peux t'offrir « {item} ».",
  ],
  "lesson-done": [
    "Bloc ancré. Il sortira tout seul au bon moment.",
    "Encore un réflexe de construit. C'est ça qui rend fluide.",
  ],
  correct: [
    "Exact.",
    "Bien vu.",
    "C'est ça.",
  ],
  "correct-streak": [
    "Trois d'affilée — tu ne traduis plus, tu réponds.",
    "Belle série. Ton réflexe se met en place.",
  ],
  error: [
    "Pas grave. Regarde la bonne réponse — c'est comme ça qu'on ancre.",
    "Presque. L'erreur fait partie de l'entraînement.",
  ],
  "error-streak": [
    "On ralentit une seconde. Relis la bonne réponse, puis on repart.",
    "Respire. Ce bloc est nouveau — il va rentrer, promis.",
  ],
  mission: [
    "Ta mission du jour : {mission}. Courte et utile.",
    "Aujourd'hui, on vise : {mission}.",
  ],
  "calibrate-invite": [
    "Maintenant que tu as découvert l'app, je peux affiner ton plan en 2 minutes.",
    "Deux minutes de calibrage, et ton plan devient vraiment le tien.",
  ],
  memory: [],
};

/** Sélection déterministe : stable dans la journée, varie d'un jour à l'autre. */
function pick(variants: string[], seedExtra = 0): string {
  if (variants.length === 0) return "";
  const key = todayKey();
  let hash = seedExtra;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) | 0;
  return variants[Math.abs(hash) % variants.length];
}

function fill(line: string, progress: UserProgress, extra?: Record<string, string>): string {
  const hint = nextAffordableHint(progress);
  return line
    .replace("{streak}", String(progress.streak))
    .replace("{fp}", String(availableFP(progress)))
    .replace("{level}", getLevelForXp(progress.xp).name)
    .replace("{item}", hint?.name ?? "un item")
    .replace("{missing}", String(hint?.missing ?? 0))
    .replace("{mission}", extra?.mission ?? "une leçon");
}

export function companionLine(
  event: CompanionEvent,
  progress: UserProgress,
  extra?: Record<string, string>,
): string {
  if (event === "memory") return memoryLine(progress);
  return fill(pick(VARIANTS[event], event.length), progress, extra);
}

/* ---------- Mémoire légère : uniquement des données réelles ---------- */

export function memoryLine(progress: UserProgress): string {
  const lessonsMastered = Object.values(progress.lessons ?? {}).filter(
    (l) => l.status === "mastered",
  ).length;
  const lines: string[] = [];
  if (progress.streak >= 3) {
    lines.push(
      `Tu as gardé ton rythme ${progress.streak} jours de suite — on ne casse pas ça.`,
    );
  }
  if (progress.listeningScore >= progress.speakingScore + 15) {
    lines.push(
      "Ta compréhension est solide. Aujourd'hui, on renforce l'expression.",
    );
  } else if (progress.speakingScore >= progress.listeningScore + 15) {
    lines.push(
      "Ton oral avance bien. Aujourd'hui, on muscle l'oreille.",
    );
  }
  if (lessonsMastered >= 1) {
    lines.push(
      `${lessonsMastered} bloc${lessonsMastered > 1 ? "s" : ""} déjà à toi. On continue d'empiler.`,
    );
  }
  lines.push("Une session courte aujourd'hui suffit à entretenir le réflexe.");
  return pick(lines, 7);
}

/* ---------- Quel événement montrer sur Today ---------- */

export function todayEvent(progress: UserProgress): CompanionEvent {
  if ((progress.availableChests ?? 0) > 0) return "chest-ready";
  if (getDailySteps(progress).length >= 4) return "daily-done";

  const startedAnything =
    Object.keys(progress.completedRooms).length > 0 ||
    Object.keys(progress.lessons ?? {}).length > 0;
  if (!startedAnything) return "no-lesson-yet";
  if (!progress.lastActiveDate) return "memory";

  const gap = daysBetween(progress.lastActiveDate, todayKey());
  if (gap >= 3) return "back-after-absence";
  if (progress.streak >= 3) return "streak-kept";
  if (gap >= 1) return "back-next-day";

  const hint = nextAffordableHint(progress);
  if (hint && hint.missing === 0 && availableFP(progress) >= 90)
    return "shop-affordable";
  return "memory";
}

/* ---------- Calibrage : proposé après la première leçon ---------- */

export function shouldOfferCalibration(progress: UserProgress): boolean {
  const lessonsMastered = Object.values(progress.lessons ?? {}).some(
    (l) => l.status === "mastered",
  );
  const roomDone = Object.keys(progress.completedRooms).length > 0;
  return (lessonsMastered || roomDone) && !progress.calibratedAt;
}

/* ---------- Évolution visuelle : accessoires + badge de série ---------- */

export interface CompanionLook {
  /** Ids d'accessoires portés (auto + achats boutique). */
  accessories: string[];
  /** Badge de série affiché à partir de 3 jours. */
  streakBadge: number | null;
}

export function companionLook(progress: UserProgress): CompanionLook {
  const accessories: string[] = [];
  // Gagné par la régularité.
  if (Math.max(progress.streak, progress.bestStreak ?? 0) >= 7)
    accessories.push("comp-bandana");
  // Achetés en boutique : portés dès l'achat.
  for (const id of ["comp-scarf", "comp-glasses"]) {
    if ((progress.unlockedItems ?? []).includes(id)) accessories.push(id);
  }
  return {
    accessories,
    streakBadge: progress.streak >= 3 ? progress.streak : null,
  };
}

/* ---------- Micro-mémoire de session pour les quiz ---------- */

let sessionCorrect = 0;
let sessionWrong = 0;

/** À appeler à chaque validation : retourne l'événement de feedback adapté. */
export function recordQuizAnswer(correct: boolean): CompanionEvent {
  if (correct) {
    sessionCorrect += 1;
    sessionWrong = 0;
    return sessionCorrect >= 3 ? "correct-streak" : "correct";
  }
  sessionWrong += 1;
  sessionCorrect = 0;
  return sessionWrong >= 2 ? "error-streak" : "error";
}

export function resetQuizSession(): void {
  sessionCorrect = 0;
  sessionWrong = 0;
}
