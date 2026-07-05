/**
 * Aventure : la map illustrée des chapitres.
 * Tout est piloté par les données — une zone décrit son décor,
 * ses nodes (position en % de la scène), le chemin qui les relie
 * et les liens vers les chapitres du moteur de leçons.
 */

export type AdventureNodeType = "chapter" | "chest" | "challenge" | "checkpoint";

export type AdventureNodeState =
  | "done"
  | "current"
  | "available"
  | "reward"
  | "locked";

/** Décors de zone disponibles (un backdrop illustré par thème). */
export type AdventureThemeId = "station" | "cafe" | "park";

export interface AdventureTheme {
  id: AdventureThemeId;
  /** Ambiance courte, affichée dans la fiche ("Gare de Londres"). */
  nameFr: string;
}

export interface AdventureChapterLink {
  chapterId: string;
}

export interface AdventureReward {
  fp?: number;
  /** Le node donne un coffre à ouvrir sur place. */
  chest?: boolean;
}

/** Côté où flotte la bulle-label par rapport au node. */
export type AdventureLabelSide = "left" | "right" | "top" | "bottom";

export interface AdventureNodeDef {
  id: string;
  type: AdventureNodeType;
  /** Titre de la bulle sur la map et de la fiche détail. */
  title: string;
  /** Résumé court pour la bottom sheet. */
  description: string;
  /** Position dans la scène, en % (x vers la droite, y vers le bas). */
  x: number;
  y: number;
  labelSide: AdventureLabelSide;
  /** Chapitre du moteur de leçons lancé par "Commencer". */
  chapter?: AdventureChapterLink;
  reward?: AdventureReward;
  /** Défis : durée affichée et destination. */
  durationMin?: number;
  href?: string;
  /** Coffres : chapitres de la zone à terminer pour déverrouiller. */
  requiresChaptersDone?: number;
}

export interface AdventureZone {
  id: string;
  title: string;
  theme: AdventureTheme;
  /** Chemin principal : ids de nodes chapitre, dans l'ordre. */
  path: string[];
  /** Embranchements courts [depuis → vers] (coffre, défi). */
  spurs: Array<[string, string]>;
  nodes: AdventureNodeDef[];
}

export interface AdventureWorld {
  id: string;
  title: string;
  zones: AdventureZone[];
}

/* ---------- Vue calculée (données + progression réelle) ---------- */

export interface AdventureNodeView extends AdventureNodeDef {
  state: AdventureNodeState;
  /** Numéro d'étape sur le chemin principal (1..n), null hors chemin. */
  step: number | null;
  /** Métadonnées du chapitre lié, résolues pour l'affichage. */
  meta: {
    durationMin: number | null;
    difficultyFr: string | null;
    rewardFP: number | null;
  };
  /** Condition de déblocage lisible quand le node est verrouillé. */
  lockedReason: string | null;
}

export interface AdventureProgress {
  zone: AdventureZone;
  nodes: AdventureNodeView[];
  /** Node "en cours" (le compagnon s'y trouve). */
  currentNodeId: string | null;
  /** Chapitres de la zone terminés / total. */
  doneCount: number;
  totalCount: number;
  /** Numéro du chapitre en cours (1-based) pour la pill de zone. */
  currentStep: number;
}
