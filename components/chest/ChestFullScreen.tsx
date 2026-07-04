"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Gift, Shield, Zap } from "lucide-react";
import type { Reward } from "@/types/learning";
import { getAvatarItem } from "@/data/avatar-items";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Confetti } from "@/components/ui/Confetti";
import { cn } from "@/lib/utils";

const RARITY_STYLE: Record<
  Reward["rarity"],
  { label: string; chip: "neutral" | "primary" | "gold" | "coral" }
> = {
  common: { label: "Common", chip: "neutral" },
  rare: { label: "Rare", chip: "primary" },
  epic: { label: "Epic", chip: "gold" },
  special: { label: "Special", chip: "coral" },
};

interface ChestFullScreenProps {
  /** Tire la récompense (appelé au 3e tap). */
  onOpen: () => Reward | null;
  onClose: () => void;
}

/**
 * L'ouverture de coffre : expérience plein écran, 3 taps, révélation.
 * Premium et satisfaisant — pas casino.
 */
export function ChestFullScreen({ onOpen, onClose }: ChestFullScreenProps) {
  const [taps, setTaps] = useState(0);
  const [reward, setReward] = useState<Reward | null>(null);

  const tap = () => {
    if (reward) return;
    const next = taps + 1;
    setTaps(next);
    if (next >= 3) {
      setReward(onOpen());
    }
  };

  const item = reward?.itemId ? getAvatarItem(reward.itemId) : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center overflow-hidden bg-ink/60 backdrop-blur-md"
    >
      {/* Halo doré */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute size-[420px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(223,169,46,0.35), transparent 65%)",
        }}
        animate={{ scale: reward ? [1, 1.4] : [1, 1.1, 1], opacity: reward ? [0.8, 0.4] : 0.8 }}
        transition={
          reward
            ? { duration: 0.8 }
            : { duration: 2.4, repeat: Infinity }
        }
      />
      {reward && <Confetti count={22} />}

      <AnimatePresence mode="wait">
        {!reward ? (
          <motion.div
            key="chest"
            exit={{ scale: 1.3, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative flex flex-col items-center px-6 text-center"
          >
            <p className="text-sm font-bold uppercase tracking-widest text-gold-400">
              Ton coffre est prêt
            </p>
            <motion.button
              onClick={tap}
              whileTap={{ scale: 0.9 }}
              animate={
                taps === 0
                  ? { rotate: [0, -3, 3, 0], y: [0, -4, 0] }
                  : taps === 1
                    ? { rotate: [0, -6, 6, 0], scale: [1, 1.06, 1] }
                    : { rotate: [0, -9, 9, -5, 0], scale: [1, 1.12, 1] }
              }
              transition={{ duration: 0.9, repeat: Infinity, repeatDelay: 0.4 }}
              className="relative mt-8 grid size-36 cursor-pointer place-items-center rounded-[2.5rem] gradient-gold shadow-[0_24px_60px_-12px_rgba(223,169,46,0.7)]"
              aria-label="Taper pour ouvrir le coffre"
            >
              {taps >= 2 && (
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-[2.5rem] bg-white/50"
                  animate={{ opacity: [0, 0.7, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
              )}
              <Gift className="relative size-16 text-white" strokeWidth={1.8} />
            </motion.button>
            <p className="mt-6 text-sm font-semibold text-white/85">
              {taps === 0
                ? "Tape sur le coffre pour l'ouvrir"
                : taps === 1
                  ? "Encore… il bouge !"
                  : "Un dernier tap !"}
            </p>
            <div className="mt-3 flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={cn(
                    "size-2 rounded-full transition-colors",
                    i < taps ? "bg-gold-400" : "bg-white/25",
                  )}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="reward"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 280, damping: 20 }}
            className="relative w-full max-w-xs px-6"
          >
            <div className="card-tint-gold p-6 text-center shadow-lift">
              <Chip tone={RARITY_STYLE[reward.rarity].chip} className="mx-auto">
                {RARITY_STYLE[reward.rarity].label}
              </Chip>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 15 }}
                className="mx-auto mt-4 grid size-20 place-items-center rounded-3xl gradient-gold text-white glow-gold"
              >
                {reward.type === "energy" ? (
                  <Zap className="size-9" fill="currentColor" />
                ) : reward.type === "shield" ? (
                  <Shield className="size-9" strokeWidth={2} />
                ) : reward.type === "item" ? (
                  <span className="text-3xl">🎽</span>
                ) : (
                  <span className="text-2xl font-bold">FP</span>
                )}
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-4 text-lg font-bold text-ink"
              >
                {reward.label}
              </motion.p>
              {item && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55 }}
                  className="mt-1 text-sm text-ink-soft"
                >
                  Équipe-le depuis ton profil ✨
                </motion.p>
              )}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-5"
              >
                <Button size="lg" fullWidth onClick={onClose}>
                  Collecter
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
