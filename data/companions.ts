/**
 * Compagnons FluentRoom : le guide émotionnel récurrent de l'app.
 * Choisi à l'onboarding, il accueille, explique, félicite et rassure.
 */

export type CompanionSpecies = "fox" | "owl" | "dog" | "dragon";

export interface Companion {
  id: string;
  species: CompanionSpecies;
  name: string;
  personality: string;
  tagline: string;
  /** Couleur principale du pelage/plumage. */
  color: string;
  /** Couleur secondaire (ventre, museau). */
  belly: string;
}

export const companions: Companion[] = [
  {
    id: "nox",
    species: "fox",
    name: "Nox",
    personality: "Le renard stratégique",
    tagline: "Je t'aide à progresser vite.",
    color: "#E8824A",
    belly: "#FBEEDC",
  },
  {
    id: "luma",
    species: "owl",
    name: "Luma",
    personality: "Le hibou calme",
    tagline: "Je t'explique tout clairement.",
    color: "#8E7CC3",
    belly: "#F1EDFB",
  },
  {
    id: "milo",
    species: "dog",
    name: "Milo",
    personality: "Le chien motivant",
    tagline: "On garde le rythme ensemble.",
    color: "#D9A05B",
    belly: "#FBF1DE",
  },
  {
    id: "draco",
    species: "dragon",
    name: "Draco",
    personality: "Le petit dragon",
    tagline: "On va débloquer un max de récompenses.",
    color: "#3BB88F",
    belly: "#E2F7EE",
  },
];

export const DEFAULT_COMPANION_ID = "nox";

export function getCompanion(id: string | null | undefined): Companion {
  return companions.find((c) => c.id === id) ?? companions[0];
}
