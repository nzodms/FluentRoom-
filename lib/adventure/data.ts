import type { AdventureWorld, AdventureZone } from "./types";

/**
 * Monde V1 : une zone forte — la Gare de Londres.
 * Les positions (x/y en %) placent les nodes dans la scène illustrée :
 * le chemin part du haut/gauche, serpente vers le centre puis descend
 * vers les nodes encore verrouillés, comme sur la maquette validée.
 */

export const GARE_DE_LONDRES: AdventureZone = {
  id: "gare-de-londres",
  title: "Gare de Londres",
  theme: { id: "station", nameFr: "Gare de Londres" },
  path: ["gare-arrivee", "gare-billet", "gare-politesse", "gare-annonces", "gare-repondre"],
  spurs: [
    ["gare-billet", "gare-defi"],
    ["gare-politesse", "gare-coffre"],
  ],
  nodes: [
    {
      id: "gare-arrivee",
      type: "chapter",
      title: "Gare de Londres",
      description: "Demander de l'aide et se repérer naturellement dans la gare.",
      x: 30,
      y: 27,
      labelSide: "right",
      chapter: { chapterId: "ask-for-help" },
    },
    {
      id: "gare-billet",
      type: "chapter",
      title: "Acheter un billet",
      description: "Commander ton billet au guichet, prix et paiement compris.",
      x: 22,
      y: 36,
      labelSide: "top",
      chapter: { chapterId: "buy-a-ticket" },
    },
    {
      id: "gare-politesse",
      type: "chapter",
      title: "Faire une demande polie",
      description: "Adoucir tes demandes comme un natif — could you, would you mind…",
      x: 40,
      y: 45,
      labelSide: "right",
      chapter: { chapterId: "polite-requests" },
    },
    {
      id: "gare-coffre",
      type: "chest",
      title: "Coffre bonus",
      description: "Un coffre doré t'attend sur le quai. Termine deux chapitres pour l'ouvrir.",
      x: 78,
      y: 42,
      labelSide: "top",
      reward: { chest: true },
      requiresChaptersDone: 2,
    },
    {
      id: "gare-defi",
      type: "challenge",
      title: "Défi express",
      description: "Cinq phrases de la gare, en rythme — parfait entre deux trains.",
      x: 14,
      y: 56,
      labelSide: "right",
      durationMin: 5,
      reward: { fp: 40 },
      href: "/app/phrases",
    },
    {
      id: "gare-annonces",
      type: "chapter",
      title: "Annonces et quais",
      description: "Comprendre les annonces au haut-parleur : quai, retard, arrêts.",
      x: 42,
      y: 53,
      labelSide: "right",
      chapter: { chapterId: "announcements-and-platforms" },
    },
    {
      id: "gare-repondre",
      type: "chapter",
      title: "Répondre sans traduire",
      description: "Réagir du tac au tac, sans passer par le français.",
      x: 63,
      y: 63,
      labelSide: "left",
      chapter: { chapterId: "answer-without-translating" },
    },
  ],
};

export const ADVENTURE_WORLD: AdventureWorld = {
  id: "londres",
  title: "Londres",
  zones: [GARE_DE_LONDRES],
};

export function getZoneById(id: string): AdventureZone | undefined {
  return ADVENTURE_WORLD.zones.find((z) => z.id === id);
}
