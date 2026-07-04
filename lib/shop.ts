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
