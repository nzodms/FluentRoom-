"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Zap } from "lucide-react";

interface XPBubbleProps {
  /** Montant à afficher ; null = rien. */
  amount: number | null;
  /** Position : au-dessus de l'élément parent (relative requis). */
  className?: string;
}

/**
 * Bulle "+X FP" qui monte et disparaît — feedback immédiat de gain.
 * Monter : poser un state `xp` puis le remettre à null après ~1.2 s.
 */
export function XPBubble({ amount, className }: XPBubbleProps) {
  return (
    <AnimatePresence>
      {amount !== null && (
        <motion.span
          key={amount}
          initial={{ opacity: 0, y: 6, scale: 0.7 }}
          animate={{ opacity: 1, y: -26, scale: 1 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.9, ease: [0.2, 0.7, 0.3, 1] }}
          className={`pointer-events-none absolute left-1/2 top-0 z-20 -translate-x-1/2 inline-flex items-center gap-1 rounded-full gradient-gold px-2.5 py-1 text-xs font-bold text-white shadow-[0_4px_14px_-2px_rgba(223,169,46,0.6)] ${className ?? ""}`}
        >
          <Zap className="size-3" fill="currentColor" /> +{amount} FP
        </motion.span>
      )}
    </AnimatePresence>
  );
}
