import type { UserProgress } from "@/types/learning";
import { getShopItem, shopItems } from "@/data/shop-items";
import { getAvatarItem } from "@/data/avatar-items";
import { touchToday } from "./progress";

/**
 * Économie FP :
 * - lifetimeFP = progress.xp (le total historique, utilisé pour le niveau)
 * - spentFP = dépensé en boutique
 * - availableFP = lifetimeFP - spentFP (le solde dépensable)
 * Acheter ne fait jamais reculer le niveau.
 */
export function lifetimeFP(progress: UserProgress): number {
  return progress.xp;
}

export function availableFP(progress: UserProgress): number {
  return Math.max(0, progress.xp - (progress.spentFP ?? 0));
}

export function ownsItem(progress: UserProgress, itemId: string): boolean {
  return (progress.unlockedItems ?? []).includes(itemId);
}

export interface PurchaseOutcome {
  progress: UserProgress;
  ok: boolean;
  reason?: "owned" | "not-enough" | "unknown";
}

/** Achète un item : débite les FP, ajoute à l'inventaire, trace l'achat. */
export function purchaseItem(
  progress: UserProgress,
  itemId: string,
): PurchaseOutcome {
  const entry = getShopItem(itemId);
  if (!entry || !getAvatarItem(itemId)) {
    return { progress, ok: false, reason: "unknown" };
  }
  if (ownsItem(progress, itemId)) {
    return { progress, ok: false, reason: "owned" };
  }
  if (availableFP(progress) < entry.price) {
    return { progress, ok: false, reason: "not-enough" };
  }
  const next: UserProgress = touchToday({
    ...progress,
    spentFP: (progress.spentFP ?? 0) + entry.price,
    unlockedItems: [...(progress.unlockedItems ?? []), itemId],
    purchasedItems: [...(progress.purchasedItems ?? []), itemId],
    purchaseHistory: [
      ...(progress.purchaseHistory ?? []).slice(-19),
      { itemId, price: entry.price, at: new Date().toISOString() },
    ],
  });
  return { progress: next, ok: true };
}

/** Le prochain item atteignable : pour les hints « plus que X FP ». */
export function nextAffordableHint(progress: UserProgress): {
  itemId: string;
  name: string;
  price: number;
  missing: number;
} | null {
  const balance = availableFP(progress);
  const candidates = shopItems
    .filter((entry) => !ownsItem(progress, entry.itemId))
    .sort((a, b) => a.price - b.price);
  if (candidates.length === 0) return null;
  const target = candidates[0];
  const item = getAvatarItem(target.itemId);
  if (!item) return null;
  return {
    itemId: target.itemId,
    name: item.name,
    price: target.price,
    missing: Math.max(0, target.price - balance),
  };
}

/* ---------- Énergie contre FP : équilibré, jamais du pay-to-win ---------- */

import { MAX_ENERGY, applyEnergyReset, currentEnergy } from "./energy";
import { todayKey } from "./utils";

export interface EnergyPack {
  id: string;
  label: string;
  description: string;
  price: number;
  /** Énergies créditées ("full" = recharge complète). */
  energy: number | "full";
}

export const ENERGY_PACKS: EnergyPack[] = [
  {
    id: "energy-1",
    label: "+1 énergie",
    description: "Pour continuer une session aujourd'hui.",
    price: 120,
    energy: 1,
  },
  {
    id: "energy-3",
    label: "+3 énergies",
    description: "Une vraie session de plus, sans compter.",
    price: 300,
    energy: 3,
  },
  {
    id: "energy-full",
    label: "Recharge complète",
    description: "Énergie au maximum — une fois par jour.",
    price: 650,
    energy: "full",
  },
];

/** Achats d'énergie maximum par jour (recharge complète : 1). */
export const DAILY_ENERGY_BUYS = 3;

export function energyBuysLeftToday(progress: UserProgress): number {
  const used =
    progress.energyBuyDay === todayKey() ? (progress.energyBuysToday ?? 0) : 0;
  return Math.max(0, DAILY_ENERGY_BUYS - used);
}

export function fullRechargeUsedToday(progress: UserProgress): boolean {
  return progress.fullRechargeOn === todayKey();
}

export interface EnergyPurchaseOutcome {
  progress: UserProgress;
  ok: boolean;
  reason?: "not-enough" | "daily-limit" | "recharge-used" | "energy-full" | "unknown";
}

/**
 * Achète de l'énergie : vérifie solde + limites quotidiennes,
 * débite les FP, crédite l'énergie, journalise. La maîtrise et la
 * progression pédagogique ne sont JAMAIS achetables.
 */
export function purchaseEnergy(
  progress: UserProgress,
  packId: string,
): EnergyPurchaseOutcome {
  const pack = ENERGY_PACKS.find((p) => p.id === packId);
  if (!pack) return { progress, ok: false, reason: "unknown" };

  const fresh = applyEnergyReset(progress);
  if (availableFP(fresh) < pack.price)
    return { progress, ok: false, reason: "not-enough" };
  if (energyBuysLeftToday(fresh) <= 0)
    return { progress, ok: false, reason: "daily-limit" };
  if (pack.energy === "full" && fullRechargeUsedToday(fresh))
    return { progress, ok: false, reason: "recharge-used" };

  const current = currentEnergy(fresh);
  if (current >= MAX_ENERGY)
    return { progress, ok: false, reason: "energy-full" };

  const today = todayKey();
  const credited =
    pack.energy === "full"
      ? MAX_ENERGY
      : Math.min(MAX_ENERGY, current + pack.energy);

  const next: UserProgress = {
    ...fresh,
    energy: credited,
    spentFP: (fresh.spentFP ?? 0) + pack.price,
    energyBuyDay: today,
    energyBuysToday:
      (fresh.energyBuyDay === today ? (fresh.energyBuysToday ?? 0) : 0) + 1,
    fullRechargeOn:
      pack.energy === "full" ? today : (fresh.fullRechargeOn ?? null),
    fpLog: [
      ...(fresh.fpLog ?? []).slice(-29),
      { at: new Date().toISOString(), amount: -pack.price, reason: pack.label },
    ],
  };
  return { progress: next, ok: true };
}
