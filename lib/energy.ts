import type { UserProgress } from "@/types/learning";
import { todayKey } from "./utils";

/**
 * Focus Energy : 5 sessions "pleines" par jour, reset quotidien.
 * Jamais bloquant — à 0, on apprend encore mais on gagne moins de FP
 * (mode practice) et les coffres se remplissent moins vite.
 */
export const MAX_ENERGY = 5;

/** Énergie effective, reset quotidien pris en compte (lecture pure). */
export function currentEnergy(progress: UserProgress): number {
  if (progress.energyResetOn !== todayKey()) return MAX_ENERGY;
  return Math.max(0, Math.min(MAX_ENERGY + 3, progress.energy ?? MAX_ENERGY));
}

/** Applique le reset quotidien si nécessaire (mutation). */
export function applyEnergyReset(progress: UserProgress): UserProgress {
  const today = todayKey();
  if (progress.energyResetOn === today) return progress;
  return { ...progress, energy: MAX_ENERGY, energyResetOn: today };
}

/** Consomme de l'énergie (plancher 0). */
export function spendEnergy(progress: UserProgress, amount = 1): UserProgress {
  const next = applyEnergyReset(progress);
  return { ...next, energy: Math.max(0, next.energy - amount) };
}

/** Gagne de l'énergie bonus (plafond MAX+3 pour les coffres). */
export function gainEnergy(progress: UserProgress, amount: number): UserProgress {
  const next = applyEnergyReset(progress);
  return { ...next, energy: Math.min(MAX_ENERGY + 3, next.energy + amount) };
}
