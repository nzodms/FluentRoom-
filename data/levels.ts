import type { Level } from "@/types/learning";

/** Niveaux de fluidité — nomenclature motivante, équivalent CECRL en secondaire. */
export const levels: Level[] = [
  {
    id: "silent-starter",
    name: "Premiers pas",
    cefr: "A1",
    minXp: 0,
    tagline: "Tu écoutes, tu observes. Tout commence ici.",
  },
  {
    id: "survival-speaker",
    name: "Débrouille orale",
    cefr: "A2",
    minXp: 150,
    tagline: "Tu te débrouilles dans les situations simples.",
  },
  {
    id: "fast-listener",
    name: "Écoute rapide",
    cefr: "B1",
    minXp: 400,
    tagline: "Ton oreille suit le rythme des natifs.",
  },
  {
    id: "natural-responder",
    name: "Réponse naturelle",
    cefr: "B2",
    minXp: 800,
    tagline: "Tu réponds sans traduire dans ta tête.",
  },
  {
    id: "fluent-builder",
    name: "Aisance solide",
    cefr: "B2+",
    minXp: 1400,
    tagline: "Tu construis des conversations entières, naturellement.",
  },
];

export function getLevelForXp(xp: number): Level {
  let current = levels[0];
  for (const level of levels) {
    if (xp >= level.minXp) current = level;
  }
  return current;
}

export function getNextLevel(xp: number): Level | null {
  return levels.find((level) => level.minXp > xp) ?? null;
}
