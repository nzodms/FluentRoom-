import type { AvatarItem, AvatarItemType } from "@/types/learning";
import { getAvatarItem } from "./avatar-items";

/**
 * Catalogue de la boutique : chaque entrée pointe vers un item d'avatar
 * et lui donne un prix en FP. Apprends aujourd'hui, débloque ton style.
 */
export interface ShopItem {
  itemId: string;
  price: number;
  category: AvatarItemType;
  /** Mis en avant dans « Recommandé pour toi ». */
  recommended?: boolean;
}

export const shopItems: ShopItem[] = [
  /* Tenues */
  { itemId: "outfit-tee-white", price: 90, category: "outfit" },
  { itemId: "outfit-hoodie-coral", price: 120, category: "outfit", recommended: true },
  { itemId: "outfit-sweat-mint", price: 150, category: "outfit" },
  { itemId: "outfit-jacket-night", price: 180, category: "outfit" },
  { itemId: "outfit-pull-gold", price: 250, category: "outfit" },
  /* Accessoires */
  { itemId: "acc-cap-fluent", price: 140, category: "accessory", recommended: true },
  { itemId: "acc-headphones-violet", price: 160, category: "accessory" },
  { itemId: "acc-earbuds", price: 180, category: "accessory" },
  { itemId: "acc-glasses-focus", price: 200, category: "accessory" },
  { itemId: "acc-badge-notranslate", price: 220, category: "accessory" },
  /* Auras */
  { itemId: "aura-night", price: 300, category: "aura" },
  { itemId: "aura-mint", price: 300, category: "aura" },
  { itemId: "aura-calm", price: 350, category: "aura" },
  { itemId: "aura-fast", price: 400, category: "aura", recommended: true },
  { itemId: "aura-gold", price: 500, category: "aura" },
  /* Fonds */
  { itemId: "bg-minimal-white", price: 150, category: "background" },
  { itemId: "bg-sunset", price: 250, category: "background" },
  { itemId: "bg-night-reward", price: 300, category: "background" },
  { itemId: "bg-purple-studio", price: 350, category: "background" },
  /* Effets */
  { itemId: "effect-unlock-shimmer", price: 200, category: "effect" },
  { itemId: "effect-completion-glow", price: 250, category: "effect" },

  /* --- Compagnon : ses accessoires se portent dès l'achat --- */
  { itemId: "comp-scarf", price: 150, category: "companion", recommended: true },
  { itemId: "comp-glasses", price: 180, category: "companion" },
];

export const shopCategories: Array<{ id: AvatarItemType; label: string }> = [
  { id: "outfit", label: "Tenues" },
  { id: "accessory", label: "Accessoires" },
  { id: "aura", label: "Auras" },
  { id: "background", label: "Fonds" },
  { id: "effect", label: "Effets" },
  { id: "companion", label: "Compagnon" },
];

export function getShopItem(itemId: string): ShopItem | undefined {
  return shopItems.find((entry) => entry.itemId === itemId);
}

export function shopItemDetails(
  entry: ShopItem,
): { item: AvatarItem; price: number } | null {
  const item = getAvatarItem(entry.itemId);
  return item ? { item, price: entry.price } : null;
}
