"use client";

import { useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import type { AvatarConfig, Reward } from "@/types/learning";
import type { ChestVariant } from "@/data/chest-variants";
import { CHEST_STYLES } from "@/data/chest-variants";
import { Button } from "@/components/ui/Button";
import {
  IllustratedChest,
  type ChestState,
} from "@/components/chest/IllustratedChest";
import { RewardRoomBackground } from "@/components/chest/RewardRoomBackground";
import { IllustratedRewardCard } from "./IllustratedRewardCard";
import {
  FluentCharacter,
  type CharacterExpression,
} from "@/components/avatar/FluentCharacter";
import { cn } from "@/lib/utils";

interface RewardRoomProps {
  chestType?: ChestVariant;
  avatar: AvatarConfig;
  /** Tire la récompense (appelé à l'ouverture). */
  onOpen: () => Reward | null;
  onCollect: () => void;
}

const EXPRESSION_BY_STATE: Record<ChestState, CharacterExpression> = {
  idle: "excited",
  tap1: "excited",
  tap2: "surprised",
  opening: "surprised",
  opened: "celebrating",
};

/**
 * La Reward Room : scène plein écran — décor nocturne, coffre illustré,
 * personnage qui réagit, révélation de récompense. Le moment fort de l'app.
 */
export function RewardRoom({
  chestType = "daily",
  avatar,
  onOpen,
  onCollect,
}: RewardRoomProps) {
  const [state, setState] = useState<ChestState>("idle");
  const [reward, setReward] = useState<Reward | null>(null);
  const style = CHEST_STYLES[chestType];

  const tap = () => {
    if (state === "idle") {
      setState("tap1");
      setTimeout(() => setState((s) => (s === "tap1" ? "tap2" : s)), 650);
      return;
    }
    if (state === "tap2") {
      setState("opening");
      const rolled = onOpen();
      setTimeout(() => {
        setState("opened");
        setReward(rolled);
      }, 650);
    }
  };

  const taps = state === "idle" ? 0 : state === "tap1" ? 1 : state === "tap2" ? 2 : 3;
  const showRewards = state === "opened" && reward;

  // Rareté forte : le personnage exulte, le halo monte d'un cran.
  const expression: CharacterExpression = showRewards
    ? reward.rarity === "common"
      ? "happy"
      : "celebrating"
    : EXPRESSION_BY_STATE[state];

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] flex flex-col items-center justify-center overflow-hidden"
      >
        <RewardRoomBackground variant={chestType} />

        {/* Titre */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 px-6 text-center"
        >
          <p
            className="text-sm font-bold uppercase tracking-[0.2em]"
            style={{ color: style.glow }}
          >
            {showRewards ? "Récompense" : style.label}
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
            {showRewards
              ? reward.rarity === "common"
                ? "Bien joué."
                : "Belle prise ! ✨"
              : "Ton coffre est prêt"}
          </h2>
          {!showRewards && (
            <p className="mt-1 text-sm text-white/70">
              {taps === 0
                ? "Tape sur le coffre pour libérer ta récompense"
                : taps === 1
                  ? "Encore… il bouge !"
                  : "Un dernier tap !"}
            </p>
          )}
        </motion.div>

        {/* Scène : personnage + coffre */}
        <div className="relative z-10 mt-2 flex items-end justify-center gap-0">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            className="-mr-6 mb-4"
          >
            <FluentCharacter
              config={avatar}
              expression={expression}
              size={130}
              showBackground={false}
            />
          </motion.div>

          <AnimatePresence mode="popLayout">
            {!showRewards ? (
              <motion.button
                key="chest"
                exit={{ scale: 0.85, opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                onClick={tap}
                whileTap={{ scale: 0.95 }}
                aria-label="Taper pour ouvrir le coffre"
                className="cursor-pointer"
              >
                <IllustratedChest state={state} variant={chestType} size={230} />
              </motion.button>
            ) : (
              <motion.div key="reward" className="mb-6">
                <IllustratedRewardCard reward={reward} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Points de progression des taps */}
        {!showRewards && (
          <div className="relative z-10 mt-4 flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={cn(
                  "size-2 rounded-full transition-all",
                  i < taps ? "scale-110" : "bg-white/25",
                )}
                style={i < taps ? { background: style.glow } : undefined}
              />
            ))}
          </div>
        )}

        {/* Collecter */}
        <AnimatePresence>
          {showRewards && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="relative z-10 mt-6 w-full max-w-xs px-6 pb-[max(env(safe-area-inset-bottom),0.5rem)]"
            >
              <Button size="lg" fullWidth onClick={onCollect}>
                Collecter
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </MotionConfig>
  );
}
