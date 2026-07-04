import type { AvatarConfig, AvatarItem } from "@/types/learning";

/**
 * Catalogue cosmétique du personnage FluentRoom.
 * Les items se débloquent par la progression (rooms, streak, oral, phrases)
 * ou dans les coffres — jamais par frustration.
 */
export const avatarItems: AvatarItem[] = [
  /* --- Teintes (toutes disponibles par défaut) --- */
  { id: "skin-1", type: "skin", name: "Teinte ivoire", rarity: "common", color: "#F5D0B5", unlock: { kind: "default", label: "Inclus" } },
  { id: "skin-2", type: "skin", name: "Teinte dorée", rarity: "common", color: "#E2B08B", unlock: { kind: "default", label: "Inclus" } },
  { id: "skin-3", type: "skin", name: "Teinte ambre", rarity: "common", color: "#B9825E", unlock: { kind: "default", label: "Inclus" } },
  { id: "skin-4", type: "skin", name: "Teinte ébène", rarity: "common", color: "#7C5541", unlock: { kind: "default", label: "Inclus" } },

  /* --- Cheveux --- */
  { id: "hair-short", type: "hair", name: "Court brun", rarity: "common", color: "#4A3728", unlock: { kind: "default", label: "Inclus" } },
  { id: "hair-long", type: "hair", name: "Long châtain", rarity: "common", color: "#6B4F35", unlock: { kind: "default", label: "Inclus" } },
  { id: "hair-short-blond", type: "hair", name: "Court blond", rarity: "rare", color: "#D8B266", unlock: { kind: "streak", value: 3, label: "Série de 3 jours" } },
  { id: "hair-curly", type: "hair", name: "Bouclé noir", rarity: "rare", color: "#241C18", unlock: { kind: "rooms", value: 3, label: "3 rooms terminées" } },
  { id: "hair-bun", type: "hair", name: "Chignon lavande", rarity: "epic", color: "#8E7CC3", unlock: { kind: "chest", label: "Dans un coffre" } },

  /* --- Tenues --- */
  { id: "outfit-tee-blue", type: "outfit", name: "Tee essentiel", rarity: "common", color: "#585CE2", unlock: { kind: "default", label: "Inclus" } },
  { id: "outfit-hoodie-violet", type: "outfit", name: "Hoodie violet", rarity: "rare", color: "#6A5AE0", unlock: { kind: "rooms", value: 3, label: "3 rooms terminées" } },
  { id: "outfit-hoodie-mint", type: "outfit", name: "Hoodie menthe", rarity: "rare", color: "#2CB783", unlock: { kind: "speak", value: 5, label: "5 exercices d'oral" } },
  { id: "outfit-tee-coral", type: "outfit", name: "Tee corail", rarity: "rare", color: "#F9714A", unlock: { kind: "chest", label: "Dans un coffre" } },
  { id: "outfit-shirt-gold", type: "outfit", name: "Chemise dorée", rarity: "epic", color: "#DFA92E", unlock: { kind: "phrases", value: 25, label: "25 phrases débloquées" } },

  /* --- Accessoires --- */
  { id: "acc-none", type: "accessory", name: "Aucun", rarity: "common", unlock: { kind: "default", label: "Inclus" } },
  { id: "acc-glasses", type: "accessory", name: "Lunettes", rarity: "rare", color: "#2B2E3A", unlock: { kind: "streak", value: 7, label: "Série de 7 jours" } },
  { id: "acc-headphones", type: "accessory", name: "Casque studio", rarity: "epic", color: "#585CE2", unlock: { kind: "chest", label: "Dans un coffre" } },
  { id: "acc-cap", type: "accessory", name: "Casquette", rarity: "rare", color: "#F9714A", unlock: { kind: "chest", label: "Dans un coffre" } },

  /* --- Auras --- */
  { id: "aura-none", type: "aura", name: "Aucune", rarity: "common", unlock: { kind: "default", label: "Inclus" } },
  { id: "aura-primary", type: "aura", name: "Aura indigo", rarity: "rare", color: "#585CE2", unlock: { kind: "xp", value: 150, label: "150 FP" } },
  { id: "aura-mint", type: "aura", name: "Aura menthe", rarity: "rare", color: "#2CB783", unlock: { kind: "speak", value: 5, label: "5 exercices d'oral" } },
  { id: "aura-gold", type: "aura", name: "Aura dorée", rarity: "special", color: "#DFA92E", unlock: { kind: "chest", label: "Dans un coffre" } },

  /* --- Fonds --- */
  { id: "bg-cream", type: "background", name: "Ivoire", rarity: "common", color: "#F2F1EA", unlock: { kind: "default", label: "Inclus" } },
  { id: "bg-primary", type: "background", name: "Indigo doux", rarity: "rare", color: "#DFDFFB", unlock: { kind: "rooms", value: 5, label: "5 rooms terminées" } },
  { id: "bg-sunset", type: "background", name: "Morning Focus", rarity: "epic", color: "#FFE4D1", unlock: { kind: "chest", label: "Coffre rare" } },

  /* --- Items boutique (achetables en FP) --- */
  { id: "outfit-tee-white", type: "outfit", name: "Tee minimal", rarity: "common", color: "#E9E9F2", unlock: { kind: "shop", label: "Boutique · 90 FP" } },
  { id: "outfit-hoodie-coral", type: "outfit", name: "Hoodie corail", rarity: "common", color: "#F9714A", unlock: { kind: "shop", label: "Boutique · 120 FP" } },
  { id: "outfit-sweat-mint", type: "outfit", name: "Sweat menthe", rarity: "rare", color: "#43CB95", unlock: { kind: "shop", label: "Boutique · 150 FP" } },
  { id: "outfit-jacket-night", type: "outfit", name: "Veste nuit", rarity: "rare", color: "#2E3184", unlock: { kind: "shop", label: "Boutique · 180 FP" } },
  { id: "outfit-pull-gold", type: "outfit", name: "Pull doré", rarity: "epic", color: "#E0B54B", unlock: { kind: "shop", label: "Boutique · 250 FP" } },
  { id: "acc-cap-fluent", type: "accessory", name: "Casquette Fluent", rarity: "common", color: "#585CE2", unlock: { kind: "shop", label: "Boutique · 140 FP" } },
  { id: "acc-headphones-violet", type: "accessory", name: "Casque violet", rarity: "rare", color: "#6A5AE0", unlock: { kind: "shop", label: "Boutique · 160 FP" } },
  { id: "acc-earbuds", type: "accessory", name: "Écouteurs blancs", rarity: "rare", color: "#FFFFFF", unlock: { kind: "shop", label: "Boutique · 180 FP" } },
  { id: "acc-glasses-focus", type: "accessory", name: "Lunettes focus", rarity: "rare", color: "#585CE2", unlock: { kind: "shop", label: "Boutique · 200 FP" } },
  { id: "acc-badge-notranslate", type: "accessory", name: "Badge « No Translate »", rarity: "epic", color: "#F9714A", unlock: { kind: "shop", label: "Boutique · 220 FP" } },
  { id: "aura-night", type: "aura", name: "Aura nuit", rarity: "rare", color: "#4F6BE8", unlock: { kind: "shop", label: "Boutique · 300 FP" } },
  { id: "aura-calm", type: "aura", name: "Aura calm focus", rarity: "rare", color: "#6FA8DC", unlock: { kind: "shop", label: "Boutique · 350 FP" } },
  { id: "aura-fast", type: "aura", name: "Aura Fast English", rarity: "epic", color: "#F9714A", unlock: { kind: "shop", label: "Boutique · 400 FP" } },
  { id: "bg-minimal-white", type: "background", name: "Minimal White", rarity: "common", color: "#FDFDFD", unlock: { kind: "shop", label: "Boutique · 150 FP" } },
  { id: "bg-night-reward", type: "background", name: "Night Reward Room", rarity: "rare", color: "#241E55", unlock: { kind: "shop", label: "Boutique · 300 FP" } },
  { id: "bg-purple-studio", type: "background", name: "Purple Studio", rarity: "epic", color: "#DCD3F8", unlock: { kind: "shop", label: "Boutique · 350 FP" } },
  { id: "effect-completion-glow", type: "effect", name: "Completion Glow", rarity: "epic", color: "#43CB95", unlock: { kind: "shop", label: "Boutique · 250 FP" } },
  { id: "effect-unlock-shimmer", type: "effect", name: "Phrase Unlock Shimmer", rarity: "rare", color: "#DFA92E", unlock: { kind: "shop", label: "Boutique · 200 FP" } },
];

export const DEFAULT_AVATAR: AvatarConfig = {
  skin: "skin-2",
  hair: "hair-short",
  outfit: "outfit-tee-blue",
  accessory: "acc-none",
  aura: "aura-none",
  background: "bg-cream",
};

export function getAvatarItem(id: string): AvatarItem | undefined {
  return avatarItems.find((item) => item.id === id);
}

/** Items débloqués par défaut. */
export const DEFAULT_UNLOCKED = avatarItems
  .filter((item) => item.unlock.kind === "default")
  .map((item) => item.id);

/** Items encore verrouillés qui ne se débloquent QUE via un coffre. */
export function chestOnlyLockedItems(unlocked: string[]): AvatarItem[] {
  return avatarItems.filter(
    (item) => item.unlock.kind === "chest" && !unlocked.includes(item.id),
  );
}
