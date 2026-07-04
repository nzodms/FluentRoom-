import type { VideoRoom } from "@/types/learning";

/**
 * Video Rooms — teaser V1.
 * Structure prête pour accueillir de vraies vidéos (embed YouTube public,
 * timestamps + couche pédagogique préparée manuellement).
 * Aucun téléchargement ni scraping : contenu éditorial intégré proprement.
 */
export const videoRooms: VideoRoom[] = [
  {
    id: "vr-street-interviews",
    title: "Street Interviews in NYC",
    description:
      "Des New-Yorkais répondent à des questions dans la rue. Débit réel, accents variés, phrases coupées : le vrai terrain d'entraînement.",
    youtubeVideoId: null,
    startTime: 0,
    endTime: 180,
    transcript: [
      "So we're out here asking people one simple question…",
      "Honestly? I'd say pizza. Hands down.",
      "That's a tough one, lemme think…",
    ],
    keyIdeas: [
      "Comprendre des voix différentes qui parlent vite",
      "Repérer les hésitations naturelles (« lemme think… »)",
      "Attraper l'idée sans comprendre chaque mot",
    ],
    phrases: ["Hands down", "That's a tough one", "I'd say…"],
    questions: ["Quelle est la question posée ?", "Que répond la 2e personne ?"],
    difficulty: "B1",
    accent: "US",
    category: "fast-english",
    comingSoon: true,
  },
  {
    id: "vr-cooking-show",
    title: "Cooking with a British Chef",
    description:
      "Un chef britannique explique une recette simple. Vocabulaire concret, instructions claires, accent UK authentique.",
    youtubeVideoId: null,
    startTime: 45,
    endTime: 210,
    transcript: [
      "Right, first things first — get your pan nice and hot.",
      "We're gonna chuck in a bit of butter…",
      "Give it a good stir, and that's it. Lovely.",
    ],
    keyIdeas: [
      "Suivre des instructions étape par étape",
      "Reconnaître l'accent britannique",
      "Les mots de liaison : right, so, now, then",
    ],
    phrases: ["First things first", "A bit of…", "Give it a good stir"],
    questions: ["Quelle est la première étape ?", "Qu'ajoute-t-il dans la poêle ?"],
    difficulty: "A2",
    accent: "UK",
    category: "everyday",
    comingSoon: true,
  },
  {
    id: "vr-travel-vlog",
    title: "Travel Vlog: 24h in Lisbon",
    description:
      "Une vloggeuse raconte sa journée à Lisbonne. Récit au passé, réactions spontanées, storytelling naturel.",
    youtubeVideoId: null,
    startTime: 12,
    endTime: 240,
    transcript: [
      "Okay so we just landed, and I'm already obsessed with this city.",
      "We ended up walking, like, fifteen kilometers.",
      "Best decision ever, honestly.",
    ],
    keyIdeas: [
      "Suivre un récit parlé en continu",
      "Repérer « ended up », « like », « honestly »",
      "Comprendre les réactions spontanées",
    ],
    phrases: ["We just landed", "I'm obsessed with…", "Best decision ever"],
    questions: ["Où se passe la vidéo ?", "Combien de kilomètres ont-ils marché ?"],
    difficulty: "B1",
    accent: "Mixed",
    category: "travel",
    comingSoon: true,
  },
];
