export type DrillType =
  | "meaning"
  | "missing"
  | "order"
  | "contraction"
  | "natural";

export interface Drill {
  id: string;
  type: DrillType;
  /** Phrase lue à voix haute (TTS). */
  audio: string;
  prompt: string;
  /** QCM (meaning / missing / contraction). */
  options?: string[];
  correctIndex?: number;
  /** Remise en ordre (order). */
  words?: string[];
  answer?: string;
  explanation: string;
}

/**
 * Mini-exercices d'écoute : sens, mot manquant, ordre des mots,
 * contractions. Sessions de 5, rotation quotidienne.
 */
export const drills: Drill[] = [
  {
    id: "d-meaning-1",
    type: "meaning",
    audio: "I'm running a bit late, sorry!",
    prompt: "Écoute. Qu'est-ce que ça veut dire ?",
    options: [
      "Je vais avoir un peu de retard",
      "Je cours un peu partout",
      "Je suis un peu fatigué",
    ],
    correctIndex: 0,
    explanation: "« Running late » = être en retard. Rien à voir avec courir.",
  },
  {
    id: "d-meaning-2",
    type: "meaning",
    audio: "I'm good, thanks.",
    prompt: "Le serveur propose un dessert. Cette réponse veut dire :",
    options: [
      "Je vais très bien",
      "Non merci, ça ira",
      "Oui, avec plaisir",
    ],
    correctIndex: 1,
    explanation: "« I'm good » en réponse à une offre = refus poli.",
  },
  {
    id: "d-meaning-3",
    type: "meaning",
    audio: "I'm down!",
    prompt: "Un ami propose un ciné. Cette réponse veut dire :",
    options: ["Je suis déprimé", "Je suis en bas", "Je suis partant"],
    correctIndex: 2,
    explanation: "« I'm down » = j'en suis ! Le piège classique.",
  },
  {
    id: "d-meaning-4",
    type: "meaning",
    audio: "That'll be six twenty.",
    prompt: "En caisse, tu entends ça. Combien tu paies ?",
    options: ["6,20 $", "26 $", "6 h 20"],
    correctIndex: 0,
    explanation: "« Six twenty » = 6 dollars 20. Les prix se disent en deux nombres.",
  },
  {
    id: "d-missing-1",
    type: "missing",
    audio: "No worries, take your time.",
    prompt: "No worries, take your ___.",
    options: ["day", "time", "phone"],
    correctIndex: 1,
    explanation: "« Take your time » = prends ton temps. Bloc figé, à retenir entier.",
  },
  {
    id: "d-missing-2",
    type: "missing",
    audio: "What time works for you?",
    prompt: "What time ___ for you?",
    options: ["goes", "works", "does"],
    correctIndex: 1,
    explanation: "« Works for you » = t'arrange. « Monday works for me. »",
  },
  {
    id: "d-missing-3",
    type: "missing",
    audio: "Could you help me? I'm trying to find my gate.",
    prompt: "I'm trying to ___ my gate.",
    options: ["find", "look", "search"],
    correctIndex: 0,
    explanation: "« Find » = trouver. « Look for » = chercher — mais ici c'est bien « find ».",
  },
  {
    id: "d-missing-4",
    type: "missing",
    audio: "I really appreciate it.",
    prompt: "I really ___ it.",
    options: ["applaud", "appreciate", "apologize"],
    correctIndex: 1,
    explanation: "« I really appreciate it » : le merci sincère, au-dessus de « thanks ».",
  },
  {
    id: "d-order-1",
    type: "order",
    audio: "I'll be there in ten.",
    prompt: "Remets la phrase dans l'ordre :",
    words: ["I'll", "be", "there", "in", "ten"],
    answer: "I'll be there in ten",
    explanation: "« I'll be there in ten » — les natifs coupent « minutes ».",
  },
  {
    id: "d-order-2",
    type: "order",
    audio: "What do you mean?",
    prompt: "Remets la question dans l'ordre :",
    words: ["What", "do", "you", "mean?"],
    answer: "What do you mean?",
    explanation: "Ton réflexe anti-blocage quand un mot t'échappe.",
  },
  {
    id: "d-order-3",
    type: "order",
    audio: "Do you want to grab a coffee?",
    prompt: "Remets la proposition dans l'ordre :",
    words: ["Do", "you", "want", "to", "grab", "a", "coffee?"],
    answer: "Do you want to grab a coffee?",
    explanation: "« Grab a coffee » = prendre un café vite fait, sans cérémonie.",
  },
  {
    id: "d-order-4",
    type: "order",
    audio: "I see what you mean.",
    prompt: "Remets la phrase dans l'ordre :",
    words: ["I", "see", "what", "you", "mean"],
    answer: "I see what you mean",
    explanation: "Montre que tu as compris l'argument — avant de nuancer.",
  },
  {
    id: "d-contraction-1",
    type: "contraction",
    audio: "I'm gonna call you tonight.",
    prompt: "« Gonna », c'est la forme rapide de :",
    options: ["going to", "want to", "got to"],
    correctIndex: 0,
    explanation: "« Gonna » = « going to ». La contraction orale n°1.",
  },
  {
    id: "d-contraction-2",
    type: "contraction",
    audio: "Do you wanna come with us?",
    prompt: "« Wanna », c'est la forme rapide de :",
    options: ["will not", "want to", "went to"],
    correctIndex: 1,
    explanation: "« Wanna » = « want to ». Dans chaque série, chaque chanson.",
  },
  {
    id: "d-contraction-3",
    type: "contraction",
    audio: "Sorry, I gotta go!",
    prompt: "« Gotta », c'est la forme rapide de :",
    options: ["got to (have to)", "go to", "get a"],
    correctIndex: 0,
    explanation: "« Gotta » = « got to » = devoir. « I gotta go » = faut que j'y aille.",
  },
  {
    id: "d-contraction-4",
    type: "contraction",
    audio: "Lemme check my calendar.",
    prompt: "« Lemme », c'est la forme rapide de :",
    options: ["let me", "leave me", "lend me"],
    correctIndex: 0,
    explanation: "« Lemme » = « let me ». Cousine de « gimme » (give me).",
  },
  {
    id: "d-contraction-5",
    type: "contraction",
    audio: "The movie was kinda boring.",
    prompt: "« Kinda », c'est la forme rapide de :",
    options: ["kind of", "can do", "keen to"],
    correctIndex: 0,
    explanation: "« Kinda » = « kind of » = un peu, plutôt. Adoucit l'adjectif.",
  },
  {
    id: "d-natural-1",
    type: "natural",
    audio: "I'm running late.",
    prompt: "Real or School English : laquelle dirait un natif ?",
    options: ["I am in retard.", "I'm running late.", "I have lateness."],
    correctIndex: 1,
    explanation:
      "« I'm running late » — « retard » n'existe pas en anglais (enfin si, mais c'est un mot très insultant).",
  },
  {
    id: "d-natural-2",
    type: "natural",
    audio: "I'm good, thanks.",
    prompt: "On te propose un dessert. La réponse naturelle :",
    options: ["No, it will not be necessary.", "I'm good, thanks.", "I deny."],
    correctIndex: 1,
    explanation:
      "« I'm good, thanks » : le refus poli des natifs. Les autres sonnent robotiques.",
  },
  {
    id: "d-natural-3",
    type: "natural",
    audio: "What do you do?",
    prompt: "Demander le métier de quelqu'un, version naturelle :",
    options: [
      "What is your profession?",
      "What do you do?",
      "Which is your work?",
    ],
    correctIndex: 1,
    explanation:
      "« What do you do? » suffit. « What is your profession? » = formulaire administratif.",
  },
  {
    id: "d-natural-4",
    type: "natural",
    audio: "Sounds good!",
    prompt: "Valider un plan comme un natif :",
    options: ["It is a good idea for me.", "Sounds good!", "I am agree."],
    correctIndex: 1,
    explanation:
      "« Sounds good! » — et au passage : « I am agree » n'existe pas, c'est « I agree ».",
  },
  {
    id: "d-meaning-5",
    type: "meaning",
    audio: "Guess what? I got the job!",
    prompt: "Écoute. Que s'est-il passé ?",
    options: [
      "Elle a perdu son travail",
      "Elle a décroché le poste",
      "Elle cherche un travail",
    ],
    correctIndex: 1,
    explanation: "« I got the job » = j'ai eu le poste. « Guess what? » annonce la nouvelle.",
  },
];

/** Session du jour : 5 drills, rotation déterministe selon la date. */
export function getDailyDrills(count = 5): Drill[] {
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  const start = (dayIndex * count) % drills.length;
  const session: Drill[] = [];
  for (let i = 0; i < count; i++) {
    session.push(drills[(start + i) % drills.length]);
  }
  return session;
}
