import type { Reward, UserProgress } from "@/types/learning";
import { chestOnlyLockedItems, getAvatarItem } from "@/data/avatar-items";
import { gainEnergy } from "./energy";

/**
 * Coffres : chaque action d'apprentissage remplit la barre.
 * À 100 %, un coffre devient disponible (max 3 en attente).
 * Chaque coffre donne toujours quelque chose d'utile.
 */
export const CHEST_FILL = {
  room: 40,
  lesson: 30,
  review: 20,
  drill: 15,
  quest: 10,
} as const;

const MAX_PENDING_CHESTS = 3;
export const MAX_SHIELDS = 2;

/** Remplit la barre de coffre ; convertit en coffres disponibles. */
export function addChestProgress(
  progress: UserProgress,
  amount: number,
): UserProgress {
  let fill = (progress.chestProgress ?? 0) + amount;
  let available = progress.availableChests ?? 0;
  while (fill >= 100 && available < MAX_PENDING_CHESTS) {
    fill -= 100;
    available += 1;
  }
  if (available >= MAX_PENDING_CHESTS) fill = Math.min(fill, 99);
  return { ...progress, chestProgress: fill, availableChests: available };
}

/** Tire une récompense — toujours utile, jamais vide. */
export function rollReward(progress: UserProgress): Reward {
  const lockedItems = chestOnlyLockedItems(progress.unlockedItems ?? []);
  const shields = progress.streakShields ?? 0;

  const pool: Array<{ weight: number; make: () => Reward }> = [
    {
      weight: 34,
      make: () => ({
        type: "fp",
        amount: 20,
        rarity: "common",
        label: "+20 Fluency Points",
      }),
    },
    {
      weight: 14,
      make: () => ({
        type: "fp",
        amount: 40,
        rarity: "rare",
        label: "+40 Fluency Points",
      }),
    },
    {
      weight: 16,
      make: () => ({
        type: "energy",
        amount: 1,
        rarity: "common",
        label: "+1 Focus Energy",
      }),
    },
    {
      weight: 6,
      make: () => ({
        type: "energy",
        amount: 2,
        rarity: "rare",
        label: "+2 Focus Energy",
      }),
    },
  ];
  if (shields < MAX_SHIELDS) {
    pool.push({
      weight: 10,
      make: () => ({
        type: "shield",
        amount: 1,
        rarity: "epic",
        label: "Streak Shield — protège un jour manqué",
      }),
    });
  }
  if (lockedItems.length > 0) {
    pool.push({
      weight: 20,
      make: () => {
        const item = lockedItems[Math.floor(Math.random() * lockedItems.length)];
        return {
          type: "item",
          itemId: item.id,
          rarity: item.rarity,
          label: `${item.name} — item avatar`,
        };
      },
    });
  }

  const total = pool.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = Math.random() * total;
  for (const entry of pool) {
    roll -= entry.weight;
    if (roll <= 0) return entry.make();
  }
  return pool[0].make();
}

export interface OpenChestOutcome {
  progress: UserProgress;
  reward: Reward | null;
}

/** Ouvre un coffre disponible et applique la récompense. */
export function openRewardChest(progress: UserProgress): OpenChestOutcome {
  if ((progress.availableChests ?? 0) < 1) return { progress, reward: null };

  const reward = rollReward(progress);
  let next: UserProgress = {
    ...progress,
    availableChests: progress.availableChests - 1,
    openedChests: (progress.openedChests ?? 0) + 1,
    rewardHistory: [
      ...(progress.rewardHistory ?? []).slice(-19),
      { at: new Date().toISOString(), label: reward.label, rarity: reward.rarity },
    ],
  };

  switch (reward.type) {
    case "fp":
      next = { ...next, xp: next.xp + (reward.amount ?? 0) };
      break;
    case "energy":
      next = gainEnergy(next, reward.amount ?? 1);
      break;
    case "shield":
      next = {
        ...next,
        streakShields: Math.min(MAX_SHIELDS, (next.streakShields ?? 0) + 1),
      };
      break;
    case "item":
      if (reward.itemId && getAvatarItem(reward.itemId)) {
        next = {
          ...next,
          unlockedItems: [...(next.unlockedItems ?? []), reward.itemId],
        };
      }
      break;
  }

  return { progress: next, reward };
}
