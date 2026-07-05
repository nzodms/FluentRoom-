"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Lock, Sparkles, X, Zap } from "lucide-react";
import type { AvatarConfig, AvatarItemType } from "@/types/learning";
import { shopCategories, shopItems, type ShopItem } from "@/data/shop-items";
import { getAvatarItem } from "@/data/avatar-items";
import { useProgress } from "@/lib/useProgress";
import { availableFP, ownsItem } from "@/lib/shop";
import { FluentCharacter } from "@/components/avatar/FluentCharacter";
import { CompanionCharacter } from "@/components/companion/CompanionCharacter";
import { EnergySection } from "@/components/shop/EnergySection";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { CountUp } from "@/components/ui/CountUp";
import { cn } from "@/lib/utils";

const RARITY_RING: Record<string, string> = {
  common: "",
  rare: "ring-1 ring-primary-200",
  epic: "ring-1 ring-gold-400/50",
  special: "ring-1 ring-coral-400/50",
};

export default function ShopPage() {
  const { progress, ready, buyItem, buyEnergy, setAvatar } = useProgress();
  const [category, setCategory] = useState<AvatarItemType>("outfit");
  const [selected, setSelected] = useState<ShopItem | null>(null);
  const [justBought, setJustBought] = useState(false);
  const [shake, setShake] = useState(false);

  const balance = availableFP(progress);
  const items = useMemo(
    () => shopItems.filter((entry) => entry.category === category),
    [category],
  );
  const recommended = useMemo(
    () =>
      shopItems.filter(
        (entry) => entry.recommended && !ownsItem(progress, entry.itemId),
      ),
    [progress],
  );

  const selectedItem = selected ? getAvatarItem(selected.itemId) : null;
  const selectedOwned = selected ? ownsItem(progress, selected.itemId) : false;
  const selectedEquipped =
    selectedItem &&
    selectedItem.type !== "effect" &&
    selectedItem.type !== "companion" &&
    progress.avatar[selectedItem.type as keyof AvatarConfig] === selectedItem.id;
  const canAfford = selected ? balance >= selected.price : false;

  const buy = () => {
    if (!selected) return;
    const outcome = buyItem(selected.itemId);
    if (outcome.ok) {
      setJustBought(true);
    } else if (outcome.reason === "not-enough") {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const equipSelected = () => {
    if (!selectedItem) return;
    // Effets et accessoires du compagnon : pas d'emplacement d'avatar.
    if (selectedItem.type === "effect" || selectedItem.type === "companion") return;
    setAvatar({ ...progress.avatar, [selectedItem.type]: selectedItem.id });
  };

  const closeSheet = () => {
    setSelected(null);
    setJustBought(false);
  };

  // Anti-flicker : on ne monte le contenu qu'une fois hydraté,
  // pour que les animations d'entrée jouent une seule fois, visibles.
  if (!ready) return <div aria-hidden className="min-h-[60vh]" />;

  return (
    <div className="space-y-5">
      {/* Header boutique */}
      <div className="flex items-center gap-3">
        <Link
          href="/app/settings"
          aria-label="Retour au profil"
          className="grid size-9 shrink-0 place-items-center rounded-full text-ink-soft transition-colors hover:bg-ink/5"
        >
          <ArrowLeft className="size-5" strokeWidth={2.2} />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            Boutique
          </h1>
          <p className="text-sm text-ink-soft">
            Apprends aujourd&apos;hui, débloque ton style demain.
          </p>
        </div>
      </div>

      {/* Ton style actuel + solde */}
      <div className="card-tint-primary flex items-center gap-4 overflow-hidden p-4">
        <div className="relative shrink-0">
          <span
            aria-hidden
            className="absolute inset-2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(88,92,226,0.2), transparent 65%)",
            }}
          />
          <FluentCharacter
            config={progress.avatar}
            size={84}
            showBackground={false}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-widest text-primary-600">
            Ton style actuel
          </p>
          <p className="mt-0.5 text-sm text-ink-soft">
            Dépense tes FP pour faire évoluer ton personnage.
          </p>
        </div>
        <div className="shrink-0 rounded-2xl gradient-gold px-3.5 py-2 text-white glow-gold">
          <p className="flex items-center gap-1 text-lg font-bold leading-none">
            <Zap className="size-4" fill="currentColor" />
            <CountUp value={balance} duration={0.7} />
          </p>
          <p className="mt-0.5 text-center text-[9px] font-bold uppercase tracking-wide opacity-85">
            FP dispo
          </p>
        </div>
      </div>

      {/* Énergie contre FP */}

      <EnergySection progress={progress} onBuy={buyEnergy} />


      {/* Recommandé */}
      {recommended.length > 0 && (
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-sm font-bold text-ink">
            <Sparkles className="size-4 text-gold-500" /> Recommandé pour toi
          </p>
          <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
            {recommended.map((entry) => {
              const item = getAvatarItem(entry.itemId);
              if (!item) return null;
              return (
                <motion.button
                  key={entry.itemId}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSelected(entry)}
                  className="card-tint-gold flex w-40 shrink-0 cursor-pointer items-center gap-2.5 p-3 text-left"
                >
                  <span
                    className="grid size-9 shrink-0 place-items-center rounded-xl"
                    style={{ background: `${item.color ?? "#585CE2"}33` }}
                  >
                    <span
                      className="size-4.5 rounded-full"
                      style={{ background: item.color ?? "#585CE2" }}
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-bold text-ink">
                      {item.name}
                    </span>
                    <span className="text-[10px] font-bold text-gold-500">
                      {entry.price} FP
                    </span>
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Catégories */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
        {shopCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={cn(
              "shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm font-bold transition-all",
              category === cat.id
                ? "gradient-primary text-white shadow-glow"
                : "bg-white text-ink-soft border border-ink/8",
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grille d'items */}
      <div className="grid grid-cols-2 gap-3">
        {items.map((entry, i) => {
          const item = getAvatarItem(entry.itemId);
          if (!item) return null;
          const owned = ownsItem(progress, entry.itemId);
          const equipped =
            item.type !== "effect" &&
            item.type !== "companion" &&
            progress.avatar[item.type as keyof AvatarConfig] === item.id;
          const affordable = balance >= entry.price;
          return (
            <motion.button
              key={entry.itemId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setSelected(entry)}
              className={cn(
                "card-soft cursor-pointer p-3.5 text-left transition-all hover:shadow-lift",
                RARITY_RING[item.rarity],
                item.rarity === "epic" && !owned && "shimmer",
              )}
            >
              <div
                className="grid h-20 w-full place-items-center rounded-2xl"
                style={{ background: `${item.color ?? "#585CE2"}22` }}
              >
                <span
                  className="size-10 rounded-full shadow-soft"
                  style={{ background: item.color ?? "#585CE2" }}
                />
              </div>
              <p className="mt-2 truncate text-sm font-bold text-ink">
                {item.name}
              </p>
              <div className="mt-1 flex items-center justify-between">
                {owned ? (
                  <Chip tone="mint">{equipped ? "Équipé" : "Possédé"}</Chip>
                ) : (
                  <span
                    className={cn(
                      "flex items-center gap-1 text-sm font-bold",
                      affordable ? "text-gold-500" : "text-ink-faint",
                    )}
                  >
                    <Zap className="size-3.5" fill="currentColor" />
                    {entry.price}
                  </span>
                )}
                {!owned && !affordable && (
                  <Lock className="size-3.5 text-ink-faint" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      <p className="pb-2 text-center text-xs text-ink-faint">
        Les FP se gagnent en apprenant : rooms, blocs, révisions, quêtes.
      </p>

      {/* Détail item — bottom sheet */}
      <AnimatePresence>
        {selected && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/40 backdrop-blur-sm md:items-center"
            onClick={closeSheet}
          >
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={
                shake
                  ? { x: [0, -8, 8, -6, 6, 0], y: 0, opacity: 1 }
                  : { y: 0, opacity: 1 }
              }
              exit={{ y: 80, opacity: 0 }}
              transition={
                shake
                  ? { duration: 0.45 }
                  : { type: "spring", stiffness: 320, damping: 30 }
              }
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-t-[2rem] bg-cream p-5 pb-[max(env(safe-area-inset-bottom),1.5rem)] shadow-lift md:rounded-[2rem]"
            >
              <div className="flex items-start justify-between">
                <Chip
                  tone={
                    selectedItem.rarity === "common"
                      ? "neutral"
                      : selectedItem.rarity === "rare"
                        ? "primary"
                        : selectedItem.rarity === "epic"
                          ? "gold"
                          : "coral"
                  }
                >
                  {selectedItem.rarity}
                </Chip>
                <button
                  onClick={closeSheet}
                  aria-label="Fermer"
                  className="grid size-8 cursor-pointer place-items-center rounded-full text-ink-soft hover:bg-ink/5"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Preview : le personnage porte l'item si équipable */}
              <div className="mt-2 flex items-center justify-center">
                {selectedItem.type === "companion" ? (
                  <CompanionCharacter
                    companionId={progress.companion}
                    expression={justBought ? "celebrating" : "happy"}
                    size={140}
                    accessories={[selectedItem.id]}
                  />
                ) : selectedItem.type !== "effect" ? (
                  <FluentCharacter
                    config={{
                      ...progress.avatar,
                      [selectedItem.type]: selectedItem.id,
                    }}
                    expression={justBought ? "celebrating" : "happy"}
                    size={140}
                    showBackground={false}
                  />
                ) : (
                  <span
                    className="grid size-24 place-items-center rounded-3xl"
                    style={{ background: `${selectedItem.color}33` }}
                  >
                    <Sparkles
                      className="size-10"
                      style={{ color: selectedItem.color }}
                    />
                  </span>
                )}
              </div>

              <h3 className="mt-2 text-center text-xl font-bold text-ink">
                {selectedItem.name}
              </h3>

              <AnimatePresence mode="wait">
                {justBought ? (
                  <motion.div
                    key="bought"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 space-y-3"
                  >
                    <p className="rounded-2xl bg-mint-50 p-3 text-center text-sm font-semibold text-mint-600">
                      <Check className="mr-1 inline size-4" strokeWidth={3} />
                      Acheté ! Ajouté à ton inventaire.
                    </p>
                    {selectedItem.type === "companion" ? (
                      <p className="text-center text-sm font-semibold text-primary-600">
                        Ton compagnon le porte dès maintenant.
                      </p>
                    ) : null}
                    {selectedItem.type !== "effect" &&
                    selectedItem.type !== "companion" &&
                    !selectedEquipped ? (
                      <Button
                        size="lg"
                        fullWidth
                        onClick={() => {
                          equipSelected();
                          closeSheet();
                        }}
                      >
                        Équiper maintenant
                      </Button>
                    ) : (
                      <Button size="lg" fullWidth onClick={closeSheet}>
                        Parfait
                      </Button>
                    )}
                  </motion.div>
                ) : selectedOwned ? (
                  <motion.div key="owned" className="mt-3 space-y-3">
                    <p className="text-center text-sm text-ink-soft">
                      Déjà dans ton inventaire.
                    </p>
                    {selectedItem.type !== "effect" && selectedItem.type !== "companion" && (
                      <Button
                        size="lg"
                        fullWidth
                        variant={selectedEquipped ? "secondary" : "primary"}
                        disabled={Boolean(selectedEquipped)}
                        onClick={() => {
                          equipSelected();
                          closeSheet();
                        }}
                      >
                        {selectedEquipped ? "Équipé ✓" : "Équiper"}
                      </Button>
                    )}
                  </motion.div>
                ) : (
                  <motion.div key="buy" className="mt-3 space-y-3">
                    <p className="text-center text-sm text-ink-soft">
                      {selectedItem.type === "effect"
                        ? "Un effet visuel premium pour tes moments de réussite."
                        : selectedItem.type === "companion"
                          ? "Ton compagnon le portera partout dans l'app."
                          : "Ton personnage le porte en avant-première ci-dessus."}
                    </p>
                    <Button
                      size="lg"
                      fullWidth
                      variant={canAfford ? "primary" : "secondary"}
                      onClick={buy}
                    >
                      <Zap className="size-4" fill="currentColor" />
                      {canAfford
                        ? `Acheter · ${selected.price} FP`
                        : `${selected.price} FP — il t'en manque ${selected.price - balance}`}
                    </Button>
                    {!canAfford && (
                      <p className="text-center text-xs font-semibold text-coral-600">
                        Pas assez de FP — une room peut te rapprocher.
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
