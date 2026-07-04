"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Gift, Lock, Zap } from "lucide-react";
import { CHEST_XP } from "@/lib/progress";
import { cn } from "@/lib/utils";

interface DailyChestProps {
  /** Le coffre se débloque quand la room du jour est faite. */
  unlocked: boolean;
  claimed: boolean;
  onClaim: () => void;
}

/** Récompense quotidienne — sobre, satisfaisante, pas enfantine. */
export function DailyChest({ unlocked, claimed, onClaim }: DailyChestProps) {
  const [justOpened, setJustOpened] = useState(false);

  const claim = () => {
    setJustOpened(true);
    onClaim();
  };

  return (
    <motion.button
      whileTap={unlocked && !claimed ? { scale: 0.97 } : undefined}
      onClick={unlocked && !claimed ? claim : undefined}
      disabled={!unlocked || claimed}
      className={cn(
        "relative w-full overflow-hidden rounded-3xl p-4 text-left transition-all",
        claimed
          ? "bg-mint-50 ring-1 ring-mint-400/40"
          : unlocked
            ? "gradient-primary cursor-pointer text-white shadow-lift"
            : "card-soft opacity-70",
      )}
    >
      <div className="flex items-center gap-3.5">
        <motion.span
          animate={
            unlocked && !claimed
              ? { rotate: [0, -6, 6, -3, 0], scale: [1, 1.06, 1] }
              : {}
          }
          transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.4 }}
          className={cn(
            "grid size-12 shrink-0 place-items-center rounded-2xl",
            claimed
              ? "bg-white text-mint-600"
              : unlocked
                ? "bg-white/15 text-white"
                : "bg-ink/5 text-ink-faint",
          )}
        >
          {claimed ? (
            <Zap className="size-5" fill="currentColor" />
          ) : unlocked ? (
            <Gift className="size-5" strokeWidth={2.2} />
          ) : (
            <Lock className="size-5" strokeWidth={2.2} />
          )}
        </motion.span>
        <div className="flex-1">
          <p
            className={cn(
              "font-bold",
              claimed ? "text-mint-600" : unlocked ? "text-white" : "text-ink",
            )}
          >
            {claimed
              ? `Récompense du jour récupérée · +${CHEST_XP} FP`
              : "Récompense du jour"}
          </p>
          <p
            className={cn(
              "text-sm",
              claimed
                ? "text-mint-600/80"
                : unlocked
                  ? "text-white/85"
                  : "text-ink-faint",
            )}
          >
            {claimed
              ? "Reviens demain pour la suivante."
              : unlocked
                ? `Appuie pour récupérer +${CHEST_XP} Fluency Points`
                : "Termine ta room du jour pour la débloquer"}
          </p>
        </div>
      </div>

      {/* Burst d'ouverture */}
      <AnimatePresence>
        {justOpened && (
          <motion.div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute size-2 rounded-full bg-white"
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{
                  x: Math.cos((i / 8) * Math.PI * 2) * 70,
                  y: Math.sin((i / 8) * Math.PI * 2) * 44,
                  opacity: 0,
                  scale: [1, 0.5],
                }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
