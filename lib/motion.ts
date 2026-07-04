/**
 * Design tokens de motion : un vocabulaire commun pour toute l'app.
 * Rapide, fluide, jamais gadget.
 */

export const EASE = [0.21, 0.6, 0.35, 1] as const;

export const spring = {
  /** Boutons, chips, petits éléments. */
  snappy: { type: "spring", stiffness: 500, damping: 30 } as const,
  /** Cartes, modals, éléments moyens. */
  card: { type: "spring", stiffness: 320, damping: 26 } as const,
  /** Célébrations : check, badges, unlocks. */
  pop: { type: "spring", stiffness: 300, damping: 16 } as const,
};

/** Entrée standard d'une carte : fade + slide. */
export const cardIn = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: EASE },
});

/** Entrée d'un écran/étape. */
export const stepIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: EASE },
};
