import type { Chapter } from "./types";

/**
 * Chapitres FluentRoom : de vraies mini-expériences pédagogiques.
 * Chaque chapitre = situation, phrases clés avec variantes et
 * nuances, erreurs fréquentes, exercices variés, défi final.
 */

export const chapters: Chapter[] = [
  /* ================================================================
     1 · Demander de l'aide
     ================================================================ */
  {
    id: "ask-for-help",
    title: "Demander de l'aide",
    theme: "Situations réelles",
    objective: "Demander de l'aide sans paniquer, poliment et sans traduire.",
    mainSkill: "phrases",
    secondarySkills: ["politeness", "reflexes"],
    difficulty: 1,
    duration: 8,
    prerequisites: [],
    situation:
      "Imagine : tu es bloqué dans une gare à Londres, ton train part dans 10 minutes et tu ne trouves pas le quai. Tu dois demander de l'aide — sans paniquer.",
    keyPhrases: [
      {
        id: "kp-could-you-help",
        english: "Could you help me?",
        french: "Pourriez-vous m'aider ?",
        context: "LA demande polie universelle — gare, magasin, rue.",
        variant: {
          english: "Would you mind helping me?",
          note: "Encore plus poli — parfait avec un inconnu.",
        },
      },
      {
        id: "kp-looking-for",
        english: "I'm looking for platform 4.",
        french: "Je cherche le quai 4.",
        context: "Dire ce que tu cherches — jamais « I search ».",
      },
      {
        id: "kp-dont-understand",
        english: "I don't understand what this means.",
        french: "Je ne comprends pas ce que ça veut dire.",
        context: "Devant un panneau, un menu, un formulaire.",
      },
      {
        id: "kp-say-again",
        english: "Could you say that again?",
        french: "Pourriez-vous répéter ?",
        context: "Quand ça va trop vite — les natifs le disent aussi.",
        variant: {
          english: "Sorry, could you slow down a bit?",
          note: "Pour demander de ralentir sans t'excuser dix fois.",
        },
      },
      {
        id: "kp-need-help",
        english: "I need help with this.",
        french: "J'ai besoin d'aide avec ça.",
        context: "Direct et correct — « I have need » n'existe pas.",
      },
      {
        id: "kp-where-find",
        english: "Do you know where I can find the ticket office?",
        french: "Savez-vous où je peux trouver le guichet ?",
        context: "Question indirecte : plus douce qu'un « Where is… ? » sec.",
      },
    ],
    commonMistakes: [
      {
        wrong: "I search the platform 4.",
        right: "I'm looking for platform 4.",
        note: "« Chercher » = look for. « Search » tout seul sonne policier.",
      },
      {
        wrong: "I have need help.",
        right: "I need help.",
        note: "« Avoir besoin » se traduit par le verbe need, directement.",
      },
      {
        wrong: "Can you help?",
        right: "Could you help me?",
        note: "N'oublie pas « me » — et « could » adoucit la demande.",
      },
    ],
    dialogue: [
      { speaker: "Agent", text: "Hi, can I help you?" },
      { speaker: "Toi", text: "Yes, I'm looking for platform 4." },
      { speaker: "Agent", text: "It's upstairs, on your left." },
      { speaker: "Toi", text: "Thanks. Could you say that again?" },
      { speaker: "Agent", text: "Upstairs — then left. You can't miss it." },
    ],
    exercises: [
      {
        id: "afh-1",
        type: "choice",
        variant: "meaning",
        skill: "comprehension",
        phraseId: "kp-looking-for",
        prompt: "« I'm looking for platform 4. » — quelle est l'idée ?",
        options: [
          "Je cherche le quai 4",
          "Je regarde le quai 4",
          "J'attends au quai 4",
        ],
        correctIndex: 0,
        explanation:
          "« Look for » = chercher. « Look at » = regarder. Deux blocs différents.",
        hints: [
          "Tu es perdu dans la gare — qu'est-ce que tu fais ?",
          "« Look for » n'est pas « look at ».",
          "Élimine « j'attends » : il n'y a pas de « wait » dans la phrase.",
        ],
      },
      {
        id: "afh-2",
        type: "gap",
        skill: "phrases",
        phraseId: "kp-could-you-help",
        prompt: "Complète la demande polie :",
        sentence: "___ you help me?",
        options: ["Could", "Do", "Are"],
        correctIndex: 0,
        explanation:
          "« Could you… ? » : LA forme polie par défaut. « Can you » marche, mais sonne plus direct.",
        hints: [
          "Tu veux être poli, donc évite la forme trop directe.",
          "Cherche le mot qui adoucit la demande.",
          "La bonne réponse commence par « C »…",
        ],
      },
      {
        id: "afh-3",
        type: "choice",
        variant: "listening",
        skill: "listening",
        phraseId: "kp-say-again",
        prompt: "Écoute. Qu'est-ce que la personne demande ?",
        audio: "Sorry, could you say that again?",
        options: [
          "De répéter",
          "De parler plus fort",
          "D'écrire la réponse",
        ],
        correctIndex: 0,
        explanation:
          "« Say that again » = répéter. Le bloc à retenir en entier : « Could you say that again? »",
        hints: [
          "La personne n'a pas compris du premier coup.",
          "« Again » = encore, à nouveau.",
        ],
      },
      {
        id: "afh-4",
        type: "build",
        skill: "phrases",
        phraseId: "kp-need-help",
        prompt: "Reconstruis la phrase",
        intent: "Dis que tu as besoin d'aide avec ça.",
        words: ["I", "need", "help", "with", "this"],
        answer: "I need help with this",
        explanation:
          "« J'ai besoin » = « I need », directement. Pas de « have » ici.",
        hints: [
          "En anglais, « avoir besoin » tient en un seul verbe.",
          "Commence par le sujet, puis le verbe need.",
        ],
      },
      {
        id: "afh-5",
        type: "choice",
        variant: "error-spot",
        skill: "phrases",
        phraseId: "kp-looking-for",
        prompt: "« I search the exit. » — qu'est-ce qui ne va pas ?",
        options: [
          "Il faut dire « I'm looking for the exit »",
          "Il manque un « to » après search",
          "Rien, la phrase est correcte",
        ],
        correctIndex: 0,
        explanation:
          "Piège classique du francophone : chercher = look for. « I search » tout seul sonne très bizarre.",
        hints: [
          "C'est l'erreur n°1 des francophones dans une gare.",
          "Le bloc naturel utilise le verbe « look ».",
        ],
      },
      {
        id: "afh-6",
        type: "choice",
        variant: "nuance",
        skill: "politeness",
        phraseId: "kp-could-you-help",
        prompt: "Tu abordes un inconnu dans la rue. Le plus adapté ?",
        options: [
          "Would you mind helping me?",
          "Help me.",
          "You must help me.",
        ],
        correctIndex: 0,
        optionNotes: [
          "Très poli — parfait avec un inconnu.",
          "Compréhensible mais brutal.",
          "Ordre direct : à éviter absolument.",
        ],
        explanation:
          "Trois niveaux : « Can you » (direct) < « Could you » (poli) < « Would you mind » (très poli).",
        hints: [
          "Avec un inconnu, on choisit la forme la plus douce.",
          "Cherche la formule avec « mind ».",
        ],
      },
      {
        id: "afh-7",
        type: "build",
        skill: "phrases",
        phraseId: "kp-where-find",
        prompt: "Traduction guidée",
        intent: "Demande où tu peux trouver le guichet (question indirecte).",
        words: ["Do", "you", "know", "where", "I", "can", "find", "the", "ticket", "office"],
        answer: "Do you know where I can find the ticket office",
        explanation:
          "Question indirecte : « Do you know where I can… » — l'ordre reste sujet + verbe après « where ».",
        hints: [
          "Commence par « Do you know… ».",
          "Après « where », on ne remet pas la question à l'envers : sujet puis verbe.",
        ],
        difficulty: 2,
      },
      {
        id: "afh-8",
        type: "choice",
        variant: "reflex",
        skill: "reflexes",
        phraseId: "kp-dont-understand",
        prompt: "Vite : tu ne comprends pas un panneau. Tu dis…",
        options: [
          "I don't understand what this means.",
          "I not understand this.",
          "This is not understand.",
        ],
        correctIndex: 0,
        timerSec: 8,
        explanation:
          "Le réflexe : « I don't understand what this means. » Sans traduire, sans réfléchir.",
        hints: [
          "La négation anglaise a toujours besoin de « don't ».",
        ],
      },
    ],
    finale: {
      id: "afh-finale",
      type: "chat",
      scene: "Gare de Londres",
      skill: "phrases",
      prompt: "À toi : dans la gare, applique tout.",
      explanation:
        "Tu viens d'utiliser 3 blocs du chapitre dans une vraie situation.",
      hints: [
        "Reprends les phrases clés du chapitre, dans l'ordre naturel.",
      ],
      turns: [
        { speaker: "Agent", text: "Hi there, you look a bit lost. Can I help you?" },
        {
          speaker: "Toi",
          text: "",
          options: [
            "Yes — I'm looking for platform 4.",
            "Yes — I search the platform 4.",
            "Yes — platform 4 where?",
          ],
          correctIndex: 0,
          note: "« I'm looking for… » — le bloc du chapitre.",
        },
        { speaker: "Agent", text: "Platform 4? Upstairs, then left, past the coffee shop." },
        {
          speaker: "Toi",
          text: "",
          options: [
            "Sorry, could you say that again?",
            "Repeat.",
            "What you say?",
          ],
          correctIndex: 0,
          note: "Demander de répéter poliment — sans stress.",
        },
        { speaker: "Agent", text: "Of course — upstairs, then left. You can't miss it." },
        {
          speaker: "Toi",
          text: "",
          options: [
            "Perfect, thanks a lot!",
            "Yes.",
            "I have need nothing more.",
          ],
          correctIndex: 0,
          note: "On termine proprement : merci + départ.",
        },
      ],
    },
    rewardFP: 60,
  },

  /* ================================================================
     2 · Faire une demande polie
     ================================================================ */
  {
    id: "polite-requests",
    title: "Faire une demande polie",
    theme: "Politesse naturelle",
    objective: "Choisir le bon niveau de politesse sans y réfléchir.",
    mainSkill: "politeness",
    secondarySkills: ["phrases", "reflexes"],
    difficulty: 2,
    duration: 8,
    prerequisites: ["ask-for-help"],
    situation:
      "Au travail, au café, chez des amis : la même demande change de forme selon la personne en face. En anglais, la politesse passe par la structure — pas par « please » collé partout.",
    keyPhrases: [
      {
        id: "kp-could-i",
        english: "Could I get a coffee, please?",
        french: "Je pourrais avoir un café, s'il vous plaît ?",
        context: "Commander : « Could I get… » est le réflexe naturel.",
      },
      {
        id: "kp-would-you-mind",
        english: "Would you mind closing the window?",
        french: "Ça vous dérangerait de fermer la fenêtre ?",
        context: "Très poli. Attention : verbe en -ing après « mind ».",
        variant: {
          english: "Would you mind if I opened the window?",
          note: "Pour demander la permission, pas un service.",
        },
      },
      {
        id: "kp-is-it-ok",
        english: "Is it OK if I leave early today?",
        french: "C'est bon si je pars plus tôt aujourd'hui ?",
        context: "Permission simple, ton détendu — collègues, amis.",
      },
      {
        id: "kp-do-you-think",
        english: "Do you think you could send it today?",
        french: "Tu penses que tu pourrais l'envoyer aujourd'hui ?",
        context: "Relance douce au travail — pression zéro, effet maximal.",
      },
      {
        id: "kp-no-worries",
        english: "No worries if not!",
        french: "Pas de souci si ce n'est pas possible !",
        context: "À la fin d'une demande : tu laisses une porte de sortie.",
      },
    ],
    commonMistakes: [
      {
        wrong: "Would you mind to close the window?",
        right: "Would you mind closing the window?",
        note: "Après « mind » : toujours -ing, jamais « to ».",
      },
      {
        wrong: "I want a coffee.",
        right: "Could I get a coffee, please?",
        note: "« I want » sonne enfantin en face à face. « Could I get » est le réflexe adulte.",
      },
    ],
    dialogue: [
      { speaker: "Toi", text: "Hi! Could I get a flat white, please?" },
      { speaker: "Barista", text: "Sure. Anything else?" },
      { speaker: "Toi", text: "Actually — would you mind heating up the croissant?" },
      { speaker: "Barista", text: "No problem at all." },
    ],
    exercises: [
      {
        id: "pr-1",
        type: "choice",
        variant: "nuance",
        skill: "politeness",
        phraseId: "kp-could-i",
        prompt: "Au comptoir d'un café. Le plus naturel ?",
        options: [
          "Could I get a coffee, please?",
          "I want a coffee.",
          "Give me a coffee.",
        ],
        correctIndex: 0,
        optionNotes: [
          "Le réflexe naturel des natifs.",
          "Compréhensible, mais un enfant parle comme ça.",
          "Un ordre — à garder pour les westerns.",
        ],
        explanation:
          "« Could I get… please? » : c'est la formule que tu entendras dans 90 % des cafés.",
        hints: [
          "Pense à ce que tu entends dans les séries au moment de commander.",
          "La formule commence par « Could I… ».",
        ],
      },
      {
        id: "pr-2",
        type: "gap",
        skill: "politeness",
        phraseId: "kp-would-you-mind",
        prompt: "Complète (attention au piège) :",
        sentence: "Would you mind ___ the window?",
        options: ["closing", "to close", "close"],
        correctIndex: 0,
        explanation:
          "Après « mind » : verbe en -ing, toujours. « Mind to close » n'existe pas.",
        hints: [
          "C'est LE piège de cette structure.",
          "La terminaison du verbe change après « mind ».",
        ],
        difficulty: 2,
      },
      {
        id: "pr-3",
        type: "choice",
        variant: "meaning",
        skill: "comprehension",
        phraseId: "kp-would-you-mind",
        prompt: "On te demande « Would you mind waiting? ». Pour accepter, tu dis…",
        options: ["Not at all.", "Yes!", "I mind."],
        correctIndex: 0,
        explanation:
          "Piège de logique : « mind » = ça te dérange. Accepter = « Not at all » (ça ne me dérange pas du tout).",
        hints: [
          "« Mind » veut dire « être dérangé ».",
          "Si ça ne te dérange pas… la réponse est négative.",
        ],
        difficulty: 3,
      },
      {
        id: "pr-4",
        type: "build",
        skill: "politeness",
        phraseId: "kp-do-you-think",
        prompt: "Traduction guidée",
        intent: "Relance un collègue en douceur : demande s'il pense pouvoir l'envoyer aujourd'hui.",
        words: ["Do", "you", "think", "you", "could", "send", "it", "today"],
        answer: "Do you think you could send it today",
        explanation:
          "« Do you think you could… » : la relance douce par excellence au travail.",
        hints: [
          "Deux étages : « Do you think » + « you could… ».",
          "Commence par « Do you think ».",
        ],
      },
      {
        id: "pr-5",
        type: "choice",
        variant: "error-spot",
        skill: "politeness",
        phraseId: "kp-would-you-mind",
        prompt: "« Would you mind to help me? » — le problème ?",
        options: [
          "« to help » devrait être « helping »",
          "Il manque « please »",
          "Rien, c'est correct",
        ],
        correctIndex: 0,
        explanation:
          "Toujours -ing après « mind ». « Would you mind helping me? »",
        hints: [
          "Le même piège que tout à l'heure — regarde le verbe.",
        ],
      },
      {
        id: "pr-6",
        type: "choice",
        variant: "reflex",
        skill: "reflexes",
        phraseId: "kp-is-it-ok",
        prompt: "Vite : tu veux partir plus tôt. Tu demandes…",
        options: [
          "Is it OK if I leave early today?",
          "I leave early, OK?",
          "It is possible I leave?",
        ],
        correctIndex: 0,
        timerSec: 8,
        explanation:
          "« Is it OK if I… » : permission simple, ton détendu — le réflexe.",
        hints: ["La formule commence par « Is it OK… »."],
      },
      {
        id: "pr-7",
        type: "choice",
        variant: "natural",
        skill: "politeness",
        phraseId: "kp-no-worries",
        prompt: "Tu termines ta demande sans mettre la pression. Tu ajoutes…",
        options: ["No worries if not!", "You are obligated.", "Answer me fast."],
        correctIndex: 0,
        explanation:
          "« No worries if not! » : tu laisses une sortie — et tu obtiens plus souvent un oui.",
        hints: [
          "Tu veux enlever la pression, pas en rajouter.",
        ],
      },
    ],
    finale: {
      id: "pr-finale",
      type: "chat",
      scene: "Au travail",
      skill: "politeness",
      prompt: "Au travail : relance ton collègue, poliment.",
      explanation: "Relance douce + porte de sortie : le combo qui marche.",
      hints: ["Commence par « Do you think… »."],
      turns: [
        { speaker: "Sam", text: "Hey! What's up?" },
        {
          speaker: "Toi",
          text: "",
          options: [
            "Quick question — do you think you could send the file today?",
            "Send the file today.",
            "You didn't send the file. Why?",
          ],
          correctIndex: 0,
          note: "La relance douce du chapitre.",
        },
        { speaker: "Sam", text: "Ah sorry, it slipped my mind! I'm quite busy though…" },
        {
          speaker: "Toi",
          text: "",
          options: [
            "No worries if not — tomorrow works too!",
            "This is a problem.",
            "You must do it now.",
          ],
          correctIndex: 0,
          note: "Porte de sortie : zéro pression, relation intacte.",
        },
        { speaker: "Sam", text: "You know what, give me 10 minutes — I'll send it now." },
      ],
    },
    rewardFP: 70,
  },

  /* ================================================================
     3 · Répondre sans traduire
     ================================================================ */
  {
    id: "answer-without-translating",
    title: "Répondre sans traduire",
    theme: "Réflexes de conversation",
    objective: "Répondre en une seconde avec des blocs prêts, sans passer par le français.",
    mainSkill: "reflexes",
    secondarySkills: ["phrases", "comprehension"],
    difficulty: 2,
    duration: 7,
    prerequisites: ["ask-for-help"],
    situation:
      "Quelqu'un te pose une question simple et… blanc total. Le problème n'est pas ton vocabulaire : c'est la traduction mentale. Ce chapitre installe des réponses toutes prêtes.",
    keyPhrases: [
      {
        id: "kp-sounds-good",
        english: "Sounds good!",
        french: "Ça marche !",
        context: "Accepter une proposition — la réponse n°1 des natifs.",
      },
      {
        id: "kp-no-worries-reply",
        english: "No worries!",
        french: "Pas de souci !",
        context: "Répondre à un merci ou à des excuses.",
      },
      {
        id: "kp-guess-so",
        english: "I guess so.",
        french: "J'imagine que oui.",
        context: "Oui, mais sans certitude — la nuance qui te sauve.",
      },
      {
        id: "kp-not-sure",
        english: "I'm not sure yet.",
        french: "Je ne sais pas encore.",
        context: "Gagner du temps sans bloquer la conversation.",
      },
      {
        id: "kp-up-to-you",
        english: "It's up to you.",
        french: "C'est toi qui vois.",
        context: "Laisser le choix à l'autre, naturellement.",
      },
    ],
    commonMistakes: [
      {
        wrong: "I think yes.",
        right: "I guess so. / I think so.",
        note: "« I think yes » = français traduit. Le bloc naturel : « I think so ».",
      },
      {
        wrong: "It's you who see.",
        right: "It's up to you.",
        note: "Impossible à traduire mot à mot — c'est un bloc à prendre entier.",
      },
    ],
    dialogue: [
      { speaker: "Alex", text: "Pizza tonight?" },
      { speaker: "Toi", text: "Sounds good!" },
      { speaker: "Alex", text: "Sorry I'm a bit late by the way." },
      { speaker: "Toi", text: "No worries!" },
    ],
    exercises: [
      {
        id: "awt-1",
        type: "choice",
        variant: "reflex",
        skill: "reflexes",
        phraseId: "kp-sounds-good",
        prompt: "Vite : « Movie tonight? » Tu es partant. Tu réponds…",
        options: ["Sounds good!", "It sounds a goodness.", "I am agree."],
        correctIndex: 0,
        timerSec: 6,
        explanation:
          "« Sounds good! » — deux mots, zéro traduction. C'est un réflexe, pas une phrase.",
        hints: ["Deux mots suffisent."],
      },
      {
        id: "awt-2",
        type: "choice",
        variant: "natural",
        skill: "reflexes",
        phraseId: "kp-no-worries-reply",
        prompt: "On te dit « Thanks so much! ». Le plus naturel ?",
        options: ["No worries!", "It is nothing of all.", "Yes."],
        correctIndex: 0,
        explanation:
          "« No worries » répond au merci ET aux excuses. Un bloc, deux usages.",
        hints: [
          "Tu l'as déjà croisé dans l'app — il revient tout le temps.",
        ],
      },
      {
        id: "awt-3",
        type: "choice",
        variant: "nuance",
        skill: "comprehension",
        phraseId: "kp-guess-so",
        prompt: "« Is he coming? » Tu penses que oui, sans certitude…",
        options: ["I guess so.", "I think yes.", "Guess him coming."],
        correctIndex: 0,
        optionNotes: [
          "Oui, avec la nuance d'incertitude — exactement ça.",
          "Compréhensible, mais c'est du français traduit.",
          "Construction incorrecte.",
        ],
        explanation:
          "« I guess so » = je pense que oui, sans être sûr. La nuance tient dans « so ».",
        hints: [
          "Tu n'es pas sûr : cherche la formule avec une nuance.",
          "Le mot-clé est « guess ».",
        ],
        difficulty: 2,
      },
      {
        id: "awt-4",
        type: "gap",
        skill: "reflexes",
        phraseId: "kp-not-sure",
        prompt: "Complète pour gagner du temps sans bloquer :",
        sentence: "I'm not sure ___.",
        options: ["yet", "still", "already"],
        correctIndex: 0,
        explanation:
          "« Yet » = « pas encore » dans une négation. « I'm not sure yet » laisse la porte ouverte.",
        hints: [
          "Tu ne sais pas… pour l'instant.",
          "Le mot signifie « encore » dans une phrase négative.",
        ],
      },
      {
        id: "awt-5",
        type: "build",
        skill: "reflexes",
        phraseId: "kp-up-to-you",
        prompt: "Reconstruis le bloc",
        intent: "Laisse ton ami choisir le restaurant.",
        words: ["It's", "up", "to", "you"],
        answer: "It's up to you",
        explanation:
          "« It's up to you » : intraduisible mot à mot — on le prend en bloc.",
        hints: ["Quatre mots, et « up » vient tôt."],
      },
      {
        id: "awt-6",
        type: "choice",
        variant: "error-spot",
        skill: "reflexes",
        phraseId: "kp-guess-so",
        prompt: "« I think yes. » — le problème ?",
        options: [
          "Le bloc naturel est « I think so »",
          "Il manque un « do »",
          "Rien, c'est correct",
        ],
        correctIndex: 0,
        explanation:
          "Après « think », on dit « so » — jamais « yes » tout seul. « I think so. »",
        hints: [
          "C'est une traduction mot à mot du français.",
          "Le mot manquant remplace toute l'idée précédente.",
        ],
      },
      {
        id: "awt-7",
        type: "choice",
        variant: "listening",
        skill: "listening",
        phraseId: "kp-up-to-you",
        prompt: "Écoute. Qu'est-ce que la personne te dit ?",
        audio: "Honestly, it's up to you.",
        options: [
          "Que c'est toi qui décides",
          "Qu'elle est au-dessus de toi",
          "Qu'il faut monter",
        ],
        correctIndex: 0,
        explanation:
          "« Up to you » n'a rien de vertical : ça veut dire « à toi de voir ».",
        hints: ["Oublie le sens littéral de « up »."],
      },
    ],
    finale: {
      id: "awt-finale",
      type: "chat",
      scene: "Entre amis",
      skill: "reflexes",
      prompt: "Conversation éclair : réponds sans réfléchir.",
      explanation: "Trois réflexes enchaînés — sans passer par le français.",
      hints: ["Les blocs courts du chapitre suffisent."],
      turns: [
        { speaker: "Alex", text: "Hey! Dinner at 8 tonight?" },
        {
          speaker: "Toi",
          text: "",
          options: ["Sounds good!", "It sounds a goodness.", "I am agree with."],
          correctIndex: 0,
          note: "Le réflexe d'acceptation.",
        },
        { speaker: "Alex", text: "Italian or Japanese? I really can't decide." },
        {
          speaker: "Toi",
          text: "",
          options: ["It's up to you!", "It's you who see!", "Decide!"],
          correctIndex: 0,
          note: "Le bloc intraduisible — pris en entier.",
        },
        { speaker: "Alex", text: "Japanese then. Sorry for all the messages by the way!" },
        {
          speaker: "Toi",
          text: "",
          options: ["No worries!", "It is nothing of all.", "You are pardoned."],
          correctIndex: 0,
          note: "Et on termine par LE réflexe universel.",
        },
      ],
    },
    rewardFP: 70,
  },

  /* ================================================================
     4 · Acheter un billet
     ================================================================ */
  {
    id: "buy-a-ticket",
    title: "Acheter un billet",
    theme: "Situations réelles",
    objective: "Acheter ton billet au guichet, prix et paiement compris.",
    mainSkill: "phrases",
    secondarySkills: ["politeness", "reflexes"],
    difficulty: 1,
    duration: 7,
    prerequisites: ["ask-for-help"],
    situation:
      "Le guichet de la gare. L'agent te regarde, la file s'allonge derrière toi. Tu as trente secondes pour demander ton billet, le prix, et payer — sans bafouiller.",
    keyPhrases: [
      {
        id: "kp-return-ticket",
        english: "A return ticket to Oxford, please.",
        french: "Un aller-retour pour Oxford, s'il vous plaît.",
        context: "Au guichet : « return » = aller-retour, « single » = aller simple.",
        variant: {
          english: "A single to Oxford, please.",
          note: "L'aller simple — les natifs laissent souvent tomber « ticket ».",
        },
      },
      {
        id: "kp-how-much",
        english: "How much is it?",
        french: "Combien ça coûte ?",
        context: "LE bloc prix — jamais « How much it costs ».",
      },
      {
        id: "kp-pay-by-card",
        english: "Can I pay by card?",
        french: "Je peux payer par carte ?",
        context: "« By card », « in cash » — les prépositions font la phrase.",
      },
      {
        id: "kp-next-train",
        english: "What time does the next train leave?",
        french: "À quelle heure part le prochain train ?",
        context: "Question au présent : « does » + verbe nu, toujours.",
        variant: {
          english: "When's the next train to Oxford?",
          note: "Version rapide, très courante à l'oral.",
        },
      },
      {
        id: "kp-anything-cheaper",
        english: "Is there anything cheaper?",
        french: "Il y a quelque chose de moins cher ?",
        context: "Négocier sans négocier — la question douce qui sauve le budget.",
      },
    ],
    commonMistakes: [
      {
        wrong: "I want a ticket for go to Oxford.",
        right: "A ticket to Oxford, please.",
        note: "« To + ville » suffit. Pas de « for go » — ça n'existe pas.",
      },
      {
        wrong: "How much it costs?",
        right: "How much is it?",
        note: "La question anglaise inverse : « how much IS it ».",
      },
      {
        wrong: "Can I pay with card?",
        right: "Can I pay by card?",
        note: "On paie « by card » et « in cash ». Les blocs, pas la logique.",
      },
    ],
    dialogue: [
      { speaker: "Agent", text: "Good morning! Where are you off to?" },
      { speaker: "Toi", text: "A return ticket to Oxford, please." },
      { speaker: "Agent", text: "That's twenty-eight fifty." },
      { speaker: "Toi", text: "Can I pay by card?" },
      { speaker: "Agent", text: "Of course. Platform 6, in ten minutes." },
    ],
    exercises: [
      {
        id: "bt-1",
        type: "choice",
        variant: "meaning",
        skill: "comprehension",
        phraseId: "kp-return-ticket",
        prompt: "« A return ticket, please. » — tu viens d'acheter quoi ?",
        options: [
          "Un aller-retour",
          "Un aller simple",
          "Un billet remboursable",
        ],
        correctIndex: 0,
        explanation:
          "« Return » = tu reviens. L'aller simple, c'est « a single ». Deux mots, deux billets.",
        hints: [
          "« Return » contient l'idée de revenir.",
          "L'aller simple se dit « a single ».",
        ],
      },
      {
        id: "bt-2",
        type: "gap",
        skill: "phrases",
        phraseId: "kp-how-much",
        prompt: "Demande le prix :",
        sentence: "How much ___ it?",
        options: ["is", "costs", "does"],
        correctIndex: 0,
        explanation:
          "« How much is it? » — le bloc complet. « How much it costs » est LE calque français à éviter.",
        hints: [
          "La question anglaise inverse sujet et verbe.",
          "Le verbe le plus simple de la langue suffit ici.",
        ],
      },
      {
        id: "bt-3",
        type: "build",
        skill: "phrases",
        phraseId: "kp-pay-by-card",
        prompt: "Reconstruis la phrase",
        intent: "Demande si tu peux payer par carte.",
        words: ["Can", "I", "pay", "by", "card"],
        answer: "Can I pay by card",
        explanation:
          "« Pay by card », « pay in cash » : la préposition fait partie du bloc.",
        hints: [
          "Commence par la permission : « Can I… ».",
          "Ce n'est pas « with » — c'est plus court.",
        ],
      },
      {
        id: "bt-4",
        type: "choice",
        variant: "error-spot",
        skill: "phrases",
        phraseId: "kp-next-train",
        prompt: "« What time leaves the next train? » — qu'est-ce qui cloche ?",
        options: [
          "Il faut « does » : What time does the next train leave?",
          "Il manque « will » avant leaves",
          "Rien, la phrase est correcte",
        ],
        correctIndex: 0,
        explanation:
          "Question au présent = « does » + verbe nu. Le verbe ne passe jamais devant le sujet.",
        hints: [
          "Les questions anglaises ont presque toujours un auxiliaire.",
          "Cherche le petit mot en « d » qui manque.",
        ],
        difficulty: 2,
      },
      {
        id: "bt-5",
        type: "choice",
        variant: "listening",
        skill: "listening",
        phraseId: "kp-anything-cheaper",
        prompt: "Écoute. Que veut la personne ?",
        audio: "That's a bit expensive. Is there anything cheaper?",
        options: [
          "Un billet moins cher",
          "Un remboursement",
          "Un billet première classe",
        ],
        correctIndex: 0,
        explanation:
          "« Anything cheaper » = quelque chose de moins cher. La question douce pour le budget.",
        hints: [
          "« Cheap » = bon marché.",
          "La personne trouve le prix élevé.",
        ],
      },
      {
        id: "bt-6",
        type: "choice",
        variant: "nuance",
        skill: "politeness",
        phraseId: "kp-return-ticket",
        prompt: "Au guichet, le plus naturel pour commander ?",
        options: [
          "A return to Oxford, please.",
          "Give me a ticket to Oxford.",
          "I want to buy one ticket for going to Oxford and coming back.",
        ],
        correctIndex: 0,
        optionNotes: [
          "Court, poli, exactement ce que dit un natif.",
          "Compréhensible mais sec — il manque le « please ».",
          "Trop long : le guichet n'a pas besoin du roman.",
        ],
        explanation:
          "L'anglais du quotidien est court : l'objet + « please ». Le contexte fait le reste.",
        hints: [
          "Le plus court est souvent le plus naturel.",
          "Un mot magique termine la bonne réponse.",
        ],
      },
      {
        id: "bt-7",
        type: "choice",
        variant: "reflex",
        skill: "reflexes",
        phraseId: "kp-how-much",
        prompt: "Vite : l'agent te tend le billet. Le prix ?",
        options: [
          "How much is it?",
          "How much it costs?",
          "What is the price of this?",
        ],
        correctIndex: 0,
        timerSec: 8,
        explanation:
          "Le réflexe : « How much is it? » — trois mots et demi, sans traduire.",
        hints: [
          "Le bloc le plus court, avec l'inversion.",
        ],
      },
    ],
    finale: {
      id: "bt-finale",
      type: "chat",
      scene: "Gare de Londres — guichet",
      skill: "phrases",
      prompt: "À toi : achète ton billet du début à la fin.",
      explanation:
        "Billet, prix, paiement : la transaction complète, sans traduire.",
      hints: [
        "Commande, demande le prix, paie — dans cet ordre.",
      ],
      turns: [
        { speaker: "Agent", text: "Good morning! What can I do for you?" },
        {
          speaker: "Toi",
          text: "",
          options: [
            "A return ticket to Oxford, please.",
            "I want a ticket for go to Oxford.",
            "Oxford. Two directions.",
          ],
          correctIndex: 0,
          note: "« A return ticket to… please » — le bloc du chapitre.",
        },
        { speaker: "Agent", text: "Sure. That's twenty-eight fifty." },
        {
          speaker: "Toi",
          text: "",
          options: [
            "Can I pay by card?",
            "Can I pay with card?",
            "I pay card.",
          ],
          correctIndex: 0,
          note: "« By card » — la préposition fait le natif.",
        },
        { speaker: "Agent", text: "Of course. Here's your ticket — platform 6." },
        {
          speaker: "Toi",
          text: "",
          options: [
            "Perfect — what time does the next train leave?",
            "Perfect — what time leaves the next train?",
            "Perfect — when train?",
          ],
          correctIndex: 0,
          note: "« Does » + verbe nu : la question propre.",
        },
      ],
    },
    rewardFP: 60,
  },

  /* ================================================================
     5 · Annonces et quais
     ================================================================ */
  {
    id: "announcements-and-platforms",
    title: "Annonces et quais",
    theme: "Situations réelles",
    objective: "Comprendre les annonces de gare sans paniquer, même vite dites.",
    mainSkill: "listening",
    secondarySkills: ["comprehension", "reflexes"],
    difficulty: 2,
    duration: 7,
    prerequisites: ["polite-requests"],
    situation:
      "Le haut-parleur grésille : « The 10:42 to Brighton… ». Tout le monde bouge, sauf toi. Ce chapitre t'apprend à attraper les mots qui comptent : destination, quai, retard.",
    keyPhrases: [
      {
        id: "kp-departs-from",
        english: "The train to Brighton departs from platform 2.",
        french: "Le train pour Brighton part du quai 2.",
        context: "Le squelette de toutes les annonces : destination + quai.",
      },
      {
        id: "kp-delayed",
        english: "The 10:42 service is delayed by 15 minutes.",
        french: "Le train de 10 h 42 a 15 minutes de retard.",
        context: "« Delayed » = retardé. « Cancelled » = annulé. Deux mots à capter.",
        variant: {
          english: "The service has been cancelled.",
          note: "Le pire scénario — au moins tu le comprends tout de suite.",
        },
      },
      {
        id: "kp-calling-at",
        english: "This train is calling at Reading and Oxford.",
        french: "Ce train dessert Reading et Oxford.",
        context: "« Calling at » = les arrêts. Rien à voir avec téléphoner.",
      },
      {
        id: "kp-which-platform",
        english: "Which platform is it for Brighton?",
        french: "C'est quel quai pour Brighton ?",
        context: "Quand l'annonce est passée trop vite — demande à un humain.",
      },
      {
        id: "kp-on-time",
        english: "Is the train on time?",
        french: "Le train est à l'heure ?",
        context: "« On time » = à l'heure. Le contraire de ta ligne de RER.",
      },
    ],
    commonMistakes: [
      {
        wrong: "The train is late of 15 minutes.",
        right: "The train is 15 minutes late.",
        note: "Le retard se met AVANT « late » — et sans « of ».",
      },
      {
        wrong: "Which platform for go to Brighton?",
        right: "Which platform is it for Brighton?",
        note: "Pas de « for go ». « For + destination » suffit.",
      },
    ],
    dialogue: [
      { speaker: "Annonce", text: "The 10:42 to Brighton departs from platform 2." },
      { speaker: "Toi", text: "Sorry — which platform is it for Brighton?" },
      { speaker: "Voyageur", text: "Platform 2, just over there." },
      { speaker: "Toi", text: "Is it on time?" },
      { speaker: "Voyageur", text: "Delayed by five minutes, apparently." },
    ],
    exercises: [
      {
        id: "ap-1",
        type: "choice",
        variant: "listening",
        skill: "listening",
        phraseId: "kp-departs-from",
        prompt: "Écoute l'annonce. Le train pour Brighton part d'où ?",
        audio: "The train to Brighton departs from platform 2.",
        options: ["Du quai 2", "Du quai 10", "Du terminal B"],
        correctIndex: 0,
        explanation:
          "« Departs from platform 2 » — dans une annonce, attrape la destination puis le chiffre.",
        hints: [
          "Le chiffre arrive juste après « platform ».",
          "Deux, en anglais…",
        ],
      },
      {
        id: "ap-2",
        type: "choice",
        variant: "meaning",
        skill: "comprehension",
        phraseId: "kp-delayed",
        prompt: "« The service is delayed. » — concrètement ?",
        options: [
          "Le train a du retard",
          "Le train est annulé",
          "Le train est déjà parti",
        ],
        correctIndex: 0,
        explanation:
          "« Delayed » = retardé, « cancelled » = annulé. Les deux mots qui changent ta journée.",
        hints: [
          "Ce n'est pas le pire scénario.",
          "« Cancelled » serait l'annulation.",
        ],
      },
      {
        id: "ap-3",
        type: "choice",
        variant: "listening",
        skill: "listening",
        phraseId: "kp-calling-at",
        prompt: "Écoute. Ce train s'arrête où ?",
        audio: "This train is calling at Reading and Oxford.",
        options: [
          "À Reading et Oxford",
          "Uniquement à Oxford",
          "Il appelle un passager",
        ],
        correctIndex: 0,
        explanation:
          "« Calling at » = desservir. Aucun téléphone dans cette histoire.",
        hints: [
          "« Calling at » annonce la liste des arrêts.",
          "Deux villes sont citées.",
        ],
        difficulty: 2,
      },
      {
        id: "ap-4",
        type: "gap",
        skill: "phrases",
        phraseId: "kp-which-platform",
        prompt: "L'annonce est passée trop vite. Demande :",
        sentence: "___ platform is it for Brighton?",
        options: ["Which", "What place", "Where"],
        correctIndex: 0,
        explanation:
          "« Which platform » — on choisit parmi des quais numérotés, donc « which ».",
        hints: [
          "Tu choisis parmi une liste de quais.",
          "Le mot commence par « Wh » et finit par « ich ».",
        ],
      },
      {
        id: "ap-5",
        type: "choice",
        variant: "error-spot",
        skill: "comprehension",
        phraseId: "kp-delayed",
        prompt: "« The train is late of 15 minutes. » — qu'est-ce qui cloche ?",
        options: [
          "On dit « 15 minutes late », sans « of »",
          "Il faut dire « late from 15 minutes »",
          "Rien, la phrase est correcte",
        ],
        correctIndex: 0,
        explanation:
          "La durée se place avant « late » : « 15 minutes late ». Le « of » est un pur calque du français.",
        hints: [
          "L'ordre des mots est inversé par rapport au français.",
          "La durée passe devant l'adjectif.",
        ],
        difficulty: 2,
      },
      {
        id: "ap-6",
        type: "build",
        skill: "phrases",
        phraseId: "kp-on-time",
        prompt: "Reconstruis la question",
        intent: "Demande si le train est à l'heure.",
        words: ["Is", "the", "train", "on", "time"],
        answer: "Is the train on time",
        explanation:
          "« On time » = à l'heure — le bloc se déplace en entier, préposition comprise.",
        hints: [
          "Commence par le verbe : c'est une question.",
          "« À l'heure » tient en deux petits mots.",
        ],
      },
      {
        id: "ap-7",
        type: "choice",
        variant: "reflex",
        skill: "reflexes",
        phraseId: "kp-departs-from",
        prompt: "Vite : l'annonce dit « platform 4 changed to platform 9 ». Tu vas où ?",
        options: ["Quai 9", "Quai 4", "Je reste où je suis"],
        correctIndex: 0,
        timerSec: 8,
        explanation:
          "« Changed to » : la nouvelle info remplace l'ancienne. Direction quai 9.",
        hints: [
          "Le dernier chiffre annoncé est le bon.",
        ],
      },
    ],
    finale: {
      id: "ap-finale",
      type: "chat",
      scene: "Gare de Londres — quais",
      skill: "listening",
      prompt: "À toi : l'annonce vient de tomber, réagis.",
      explanation:
        "Tu viens de gérer une annonce, un changement de quai et un retard — en anglais.",
      hints: [
        "Attrape la destination, le quai, le retard. Le reste est du bruit.",
      ],
      turns: [
        {
          speaker: "Annonce",
          text: "The 10:42 to Brighton now departs from platform 9, delayed by ten minutes.",
        },
        {
          speaker: "Toi",
          text: "",
          options: [
            "Sorry — which platform is it for Brighton?",
            "Sorry — which platform for go to Brighton?",
            "Sorry — where is the train?",
          ],
          correctIndex: 0,
          note: "Vérifier auprès d'un humain : « Which platform is it for… »",
        },
        { speaker: "Voyageur", text: "Platform 9 now — they just changed it." },
        {
          speaker: "Toi",
          text: "",
          options: [
            "Thanks! Is it on time?",
            "Thanks! Is it in the hour?",
            "Thanks! The train is late of how much?",
          ],
          correctIndex: 0,
          note: "« On time » — le bloc, en entier.",
        },
        { speaker: "Voyageur", text: "Ten minutes late, so you've got time for a coffee." },
        {
          speaker: "Toi",
          text: "",
          options: [
            "Perfect, thanks a lot!",
            "It is a good news.",
            "I go to drink one coffee so.",
          ],
          correctIndex: 0,
          note: "Fin propre — et va le prendre, ce café.",
        },
      ],
    },
    rewardFP: 70,
  },
];

export function getChapterById(id: string): Chapter | undefined {
  return chapters.find((c) => c.id === id);
}
