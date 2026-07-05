"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Zap } from "lucide-react";
import { CountUp } from "@/components/ui/CountUp";

/**
 * Le portefeuille FP en leçon : pill premium qui pulse quand le
 * total augmente, particules qui volent vers lui, toast de combo.
 * Tout est centralisé ici — aucun exercice n'anime ses FP lui-même.
 */

export interface FPBurst {
  /** Identifiant unique du gain (index de l'étape suffit). */
  id: number;
  amount: number;
  label: string;
}

export function FPWalletPill({ balance }: { balance: number }) {
  return (
    <motion.span
      key={balance}
      initial={{ scale: 1.12 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 18 }}
      data-testid="fp-wallet"
      className="flex shrink-0 items-center gap-1 rounded-full bg-gold-50 px-2.5 py-1.5 text-xs font-bold text-gold-500 shadow-soft"
      aria-label={`${balance} FP`}
    >
      <Zap className="size-3.5" fill="currentColor" />
      <CountUp value={balance} />
    </motion.span>
  );
}

/**
 * Particules FP : partent du centre de l'écran et filent vers le
 * portefeuille (coin haut droit). Transform/opacity uniquement.
 */
export function FlyingFPCoins({ burst }: { burst: FPBurst | null }) {
  return (
    <AnimatePresence>
      {burst && (
        <div
          key={burst.id}
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[60]"
        >
          {Array.from({ length: Math.min(3 + Math.floor(burst.amount / 4), 7) }, (_, i) => (
            <motion.span
              key={i}
              className="absolute left-1/2 top-[38%] grid size-5 place-items-center rounded-full gradient-gold text-white shadow-soft"
              initial={{ x: (i - 2) * 22, y: 0, scale: 0, opacity: 0 }}
              animate={{
                x: [((i - 2) * 22), (i - 2) * 34, 130],
                y: [0, -40 - i * 8, -290],
                scale: [0, 1, 0.5],
                opacity: [0, 1, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.85, delay: i * 0.05, ease: [0.3, 0, 0.6, 1] }}
            >
              <Zap className="size-2.5" fill="currentColor" />
            </motion.span>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

/** Toast de gain : "+10 FP · Combo x3", sous le header, bref. */
export function RewardToast({ burst }: { burst: FPBurst | null }) {
  return (
    <AnimatePresence>
      {burst && (
        <motion.div
          key={burst.id}
          initial={{ opacity: 0, y: -12, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ type: "spring", stiffness: 380, damping: 22 }}
          data-testid="reward-toast"
          className="pointer-events-none fixed inset-x-0 top-16 z-[60] flex justify-center"
        >
          <span className="flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-xs font-bold text-white shadow-lift">
            <Zap className="size-3 text-gold-400" fill="currentColor" />
            +{burst.amount} FP · {burst.label}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Indicateur de combo près de la progression. */
export function ComboChip({ streak }: { streak: number }) {
  if (streak < 2) return null;
  return (
    <motion.span
      key={streak}
      initial={{ scale: 1.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 16 }}
      data-testid="combo-chip"
      className="shrink-0 rounded-full bg-coral-50 px-2 py-0.5 text-[10px] font-bold normal-case text-coral-500"
    >
      x{streak}
    </motion.span>
  );
}
