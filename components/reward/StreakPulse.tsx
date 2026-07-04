"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakPulseProps {
  streak: number;
  /** true si l'utilisateur a déjà été actif aujourd'hui. */
  activeToday: boolean;
}

/** Streak vivant : flamme qui pulse doucement quand la série est sécurisée. */
export function StreakPulse({ streak, activeToday }: StreakPulseProps) {
  const lit = streak > 0 && activeToday;
  const warm = streak > 0;

  return (
    <div className="relative inline-flex">
      {lit && (
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-2xl bg-coral-400/40"
          animate={{ scale: [1, 1.35], opacity: [0.5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <motion.div
        animate={lit ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.4 }}
        className={cn(
          "relative flex items-center gap-1.5 rounded-2xl px-3.5 py-2",
          lit
            ? "gradient-coral text-white shadow-[0_6px_18px_-4px_rgba(249,113,74,0.55)]"
            : "bg-coral-50",
        )}
      >
        <Flame
          className={cn(
            "size-5",
            lit ? "text-white" : warm ? "text-coral-500" : "text-ink-faint",
          )}
          fill={warm ? "currentColor" : "none"}
        />
        <span
          className={cn("text-lg font-bold", lit ? "text-white" : "text-ink")}
        >
          {streak}
        </span>
      </motion.div>
    </div>
  );
}
