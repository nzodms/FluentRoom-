import type { Room } from "@/types/learning";

/**
 * Contenu pédagogique seed de la V1.
 * 10 rooms complètes : dialogue natif, compréhension, décodage,
 * shadowing, speak back et phrases à débloquer.
 */
export const rooms: Room[] = [
  {
    id: "running-late",
    title: "Running Late",
    subtitle: "Comprendre quelqu'un qui prévient qu'il est en retard",
    emoji: "⏰",
    level: "A2",
    levelLabel: "A2/B1",
    duration: 8,
    accent: "US",
    goal: "Prévenir ou comprendre un retard sans paniquer.",
    focus: "Conversation de la vraie vie",
    category: "everyday",
    free: true,
    dialogue: [
      {
        id: 0,
        speaker: "Jake",
        text: "Hey, it's me. So… I'm running a bit late.",
        translation: "Salut, c'est moi. Bon… je vais avoir un peu de retard.",
      },
      {
        id: 1,
        speaker: "Emma",
        text: "Oh no, what happened?",
        translation: "Oh non, qu'est-ce qui s'est passé ?",
      },
      {
        id: 2,
        speaker: "Jake",
        text: "Traffic is crazy right now. I'll be there in ten, fifteen tops.",
        translation:
          "La circulation est dingue là. J'arrive dans dix minutes, quinze max.",
      },
      {
        id: 3,
        speaker: "Emma",
        text: "No worries, take your time. I'll grab us a table.",
        translation:
          "Pas de souci, prends ton temps. Je nous trouve une table.",
      },
      {
        id: 4,
        speaker: "Jake",
        text: "You're the best. See you soon!",
        translation: "T'es la meilleure. À tout de suite !",
      },
    ],
    expectedIdeas: [
      "Jake est en retard à cause de la circulation.",
      "Il arrive dans 10 à 15 minutes.",
      "Emma n'est pas fâchée : elle prend une table en attendant.",
    ],
    quickChoices: [
      "Quelqu'un est en retard et prévient son ami",
      "Deux amis annulent leur rendez-vous",
      "Quelqu'un demande son chemin",
    ],
    questions: [
      {
        id: "rl-q1",
        question: "Pourquoi Jake est-il en retard ?",
        options: [
          "Il a raté son bus",
          "La circulation est terrible",
          "Il a oublié le rendez-vous",
        ],
        correctIndex: 1,
        explanation:
          "« Traffic is crazy » = la circulation est dingue. C'est LA phrase d'excuse classique aux US.",
      },
      {
        id: "rl-q2",
        question: "Dans combien de temps arrive-t-il ?",
        options: ["Dans 5 minutes", "Dans 30 minutes", "Dans 10 à 15 minutes"],
        correctIndex: 2,
        explanation:
          "« I'll be there in ten, fifteen tops » — « tops » veut dire « maximum ».",
      },
      {
        id: "rl-q3",
        question: "Comment réagit Emma ?",
        options: [
          "Elle est énervée",
          "Elle est cool et prend une table",
          "Elle décide de partir",
        ],
        correctIndex: 1,
        explanation:
          "« No worries, take your time » : la réponse détendue par excellence.",
      },
    ],
    decodeNotes: [
      {
        line: "I'm running a bit late.",
        translation: "Je vais avoir un peu de retard.",
        explanation:
          "« Running late » = être en retard. Hyper courant à l'oral, bien plus naturel que « I will be late ».",
        chunk: "I'm running late",
      },
      {
        line: "I'll be there in ten, fifteen tops.",
        translation: "J'arrive dans dix minutes, quinze max.",
        explanation:
          "Les natifs coupent « minutes » : « in ten » suffit. « Tops » = grand maximum.",
        chunk: "I'll be there in 10",
      },
      {
        line: "No worries, take your time.",
        translation: "Pas de souci, prends ton temps.",
        explanation:
          "« No worries » remplace « it's okay » dans 90 % des cas à l'oral. À dégainer sans réfléchir.",
        chunk: "No worries",
      },
      {
        line: "See you soon!",
        translation: "À tout de suite !",
        explanation:
          "Clôture universelle. Variante : « see you in a bit » quand c'est vraiment imminent.",
        chunk: "See you soon",
      },
    ],
    phrases: [
      {
        id: "p-running-late",
        english: "I'm running late",
        french: "Je suis en retard / je vais être en retard",
        example: "Sorry, I'm running late — start without me.",
        context: "À envoyer dès que tu sens que tu ne seras pas à l'heure.",
        category: "everyday",
        roomId: "running-late",
      },
      {
        id: "p-be-there-in-10",
        english: "I'll be there in 10",
        french: "J'arrive dans 10 minutes",
        example: "Just parking the car, I'll be there in 10.",
        context: "Donne un délai concret, ça rassure tout de suite.",
        category: "everyday",
        roomId: "running-late",
      },
      {
        id: "p-no-worries",
        english: "No worries",
        french: "Pas de souci",
        example: "“Sorry I'm late!” — “No worries.”",
        context: "La réponse détendue à presque toutes les excuses.",
        category: "everyday",
        roomId: "running-late",
      },
      {
        id: "p-take-your-time",
        english: "Take your time",
        french: "Prends ton temps",
        example: "No rush, take your time.",
        context: "Pour mettre l'autre à l'aise quand il s'excuse.",
        category: "everyday",
        roomId: "running-late",
      },
      {
        id: "p-see-you-soon",
        english: "See you soon",
        french: "À bientôt / à tout de suite",
        example: "Okay, leaving now. See you soon!",
        context: "Clôture naturelle d'un message ou d'un appel.",
        category: "everyday",
        roomId: "running-late",
      },
    ],
    speakBack: {
      situation:
        "Ton ami t'écrit qu'il est en retard. Réponds-lui naturellement, sans le stresser.",
      heard: "Hey, so sorry, I'm running late. Traffic is insane.",
      suggestedAnswers: [
        "No worries, take your time.",
        "All good, see you soon.",
        "That's fine, I'll wait inside.",
      ],
    },
    shadowingLineIds: [0, 2, 3],
  },

  {
    id: "ordering-coffee",
    title: "Ordering Coffee",
    subtitle: "Commander un café sans stresser au comptoir",
    emoji: "☕️",
    level: "A2",
    levelLabel: "A2",
    duration: 7,
    accent: "US",
    goal: "Commander simplement et comprendre les questions du serveur.",
    focus: "Situations du quotidien",
    category: "travel",
    free: true,
    dialogue: [
      {
        id: 0,
        speaker: "Barista",
        text: "Hi there! What can I get you?",
        translation: "Bonjour ! Qu'est-ce que je vous sers ?",
      },
      {
        id: 1,
        speaker: "You",
        text: "Can I get a medium latte, please?",
        translation: "Je peux avoir un latte moyen, s'il vous plaît ?",
      },
      {
        id: 2,
        speaker: "Barista",
        text: "Sure! For here or to go?",
        translation: "Bien sûr ! Sur place ou à emporter ?",
      },
      {
        id: 3,
        speaker: "You",
        text: "To go, please.",
        translation: "À emporter, s'il vous plaît.",
      },
      {
        id: 4,
        speaker: "Barista",
        text: "Anything else? We've got fresh muffins today.",
        translation:
          "Autre chose ? On a des muffins tout frais aujourd'hui.",
      },
      {
        id: 5,
        speaker: "You",
        text: "I'm good, thanks. Just the latte.",
        translation: "C'est bon pour moi, merci. Juste le latte.",
      },
      {
        id: 6,
        speaker: "Barista",
        text: "That'll be four fifty.",
        translation: "Ça fera quatre dollars cinquante.",
      },
    ],
    expectedIdeas: [
      "Quelqu'un commande un latte moyen à emporter.",
      "Le barista propose autre chose (des muffins), le client refuse poliment.",
      "Le total est de 4,50 $.",
    ],
    quickChoices: [
      "Quelqu'un commande un café à emporter",
      "Quelqu'un réserve une table au restaurant",
      "Quelqu'un se plaint de sa commande",
    ],
    questions: [
      {
        id: "oc-q1",
        question: "Que commande le client ?",
        options: ["Un cappuccino", "Un latte moyen", "Un thé et un muffin"],
        correctIndex: 1,
        explanation:
          "« Can I get a medium latte? » — « Can I get… » est LA façon naturelle de commander aux US.",
      },
      {
        id: "oc-q2",
        question: "Que veut dire « for here or to go? »",
        options: [
          "Payer en carte ou en espèces ?",
          "Sur place ou à emporter ?",
          "Petit ou grand format ?",
        ],
        correctIndex: 1,
        explanation:
          "Question posée à chaque commande. « To go » = à emporter. Au UK on dit plutôt « takeaway ».",
      },
      {
        id: "oc-q3",
        question: "Comment le client refuse-t-il les muffins ?",
        options: [
          "“No, I hate muffins.”",
          "“I'm good, thanks.”",
          "“Maybe tomorrow.”",
        ],
        correctIndex: 1,
        explanation:
          "« I'm good, thanks » = « c'est bon pour moi ». Le refus poli universel.",
      },
      {
        id: "oc-q4",
        question: "Combien coûte la commande ?",
        options: ["4,15 $", "4,50 $", "5,40 $"],
        correctIndex: 1,
        explanation:
          "« That'll be four fifty » : les prix se disent sans « dollars » ni « cents ».",
      },
    ],
    decodeNotes: [
      {
        line: "Can I get a medium latte, please?",
        translation: "Je peux avoir un latte moyen, s'il vous plaît ?",
        explanation:
          "« Can I get… » est plus naturel que « I would like… » dans un café. Personne ne dit « I would like ».",
        chunk: "Can I get…",
      },
      {
        line: "For here or to go?",
        translation: "Sur place ou à emporter ?",
        explanation:
          "Tu l'entendras à CHAQUE commande aux US. Réponds juste « for here » ou « to go ».",
        chunk: "For here or to go?",
      },
      {
        line: "Anything else?",
        translation: "Autre chose ?",
        explanation:
          "Question réflexe du serveur. Si c'est tout : « I'm good, thanks » ou « that's it, thanks ».",
        chunk: "Anything else?",
      },
      {
        line: "I'm good, thanks.",
        translation: "C'est bon pour moi, merci.",
        explanation:
          "Ne veut PAS dire « je vais bien » ici. C'est un refus poli : « ça ira, merci ».",
        chunk: "I'm good, thanks",
      },
      {
        line: "That'll be four fifty.",
        translation: "Ça fera 4,50 $.",
        explanation:
          "« That'll be… » annonce le prix. « Four fifty » = 4 dollars 50, dit à toute vitesse.",
        chunk: "That'll be…",
      },
    ],
    phrases: [
      {
        id: "p-can-i-get",
        english: "Can I get…",
        french: "Je peux avoir… (pour commander)",
        example: "Can I get a small cappuccino?",
        context: "La formule de commande la plus utilisée aux US.",
        category: "travel",
        roomId: "ordering-coffee",
      },
      {
        id: "p-for-here-to-go",
        english: "For here or to go?",
        french: "Sur place ou à emporter ?",
        example: "“For here or to go?” — “To go, please.”",
        context: "Tu l'entendras à chaque commande. Prépare ta réponse.",
        category: "travel",
        roomId: "ordering-coffee",
      },
      {
        id: "p-thatll-be",
        english: "That'll be…",
        french: "Ça fera… (le prix)",
        example: "That'll be six twenty.",
        context: "Annonce du prix. Écoute les deux nombres, pas les mots.",
        category: "travel",
        roomId: "ordering-coffee",
      },
      {
        id: "p-anything-else",
        english: "Anything else?",
        french: "Autre chose ?",
        example: "“Anything else?” — “That's it, thanks.”",
        context: "Question réflexe en caisse, au resto, au drive.",
        category: "travel",
        roomId: "ordering-coffee",
      },
      {
        id: "p-im-good-thanks",
        english: "I'm good, thanks",
        french: "C'est bon pour moi, merci",
        example: "“Want a refill?” — “I'm good, thanks.”",
        context: "Refus poli passe-partout, sans froisser personne.",
        category: "travel",
        roomId: "ordering-coffee",
      },
    ],
    speakBack: {
      situation:
        "Tu es au comptoir d'un coffee shop à New York. Le barista te demande ce que tu veux. Commande quelque chose.",
      heard: "Hi! What can I get you today?",
      suggestedAnswers: [
        "Can I get a medium latte, please?",
        "Just a black coffee to go, please.",
        "Can I get a cappuccino? For here.",
      ],
    },
    shadowingLineIds: [1, 3, 5],
  },

  {
    id: "meeting-someone",
    title: "Meeting Someone",
    subtitle: "Se présenter naturellement, sans réciter un CV",
    emoji: "👋",
    level: "A2",
    levelLabel: "A2/B1",
    duration: 9,
    accent: "Mixed",
    goal: "Faire connaissance avec des questions simples et des réactions naturelles.",
    focus: "Premier contact",
    category: "social",
    free: true,
    dialogue: [
      {
        id: 0,
        speaker: "Maya",
        text: "Hi, I'm Maya. I don't think we've met!",
        translation: "Salut, moi c'est Maya. Je crois qu'on ne se connaît pas !",
      },
      {
        id: 1,
        speaker: "Tom",
        text: "Hey Maya, I'm Tom. Nice to meet you.",
        translation: "Salut Maya, moi c'est Tom. Enchanté.",
      },
      {
        id: 2,
        speaker: "Maya",
        text: "Nice to meet you too. So, what do you do?",
        translation: "Enchantée aussi. Alors, tu fais quoi dans la vie ?",
      },
      {
        id: 3,
        speaker: "Tom",
        text: "I'm a designer. And outside of work, I'm really into photography.",
        translation:
          "Je suis designer. Et en dehors du boulot, je suis à fond dans la photo.",
      },
      {
        id: 4,
        speaker: "Maya",
        text: "Oh, that sounds cool! Where are you from, by the way?",
        translation: "Oh, ça a l'air sympa ! Tu viens d'où, au fait ?",
      },
      {
        id: 5,
        speaker: "Tom",
        text: "I'm from Lyon, in France. Been here for two years now.",
        translation: "Je viens de Lyon, en France. Ça fait deux ans que je suis ici.",
      },
    ],
    expectedIdeas: [
      "Maya et Tom se rencontrent pour la première fois.",
      "Tom est designer et passionné de photo.",
      "Tom vient de Lyon et vit ici depuis deux ans.",
    ],
    quickChoices: [
      "Deux personnes font connaissance",
      "Deux collègues préparent une réunion",
      "Deux amis se disputent",
    ],
    questions: [
      {
        id: "ms-q1",
        question: "Quel est le métier de Tom ?",
        options: ["Photographe", "Designer", "Développeur"],
        correctIndex: 1,
        explanation:
          "« I'm a designer » — la photo, c'est sa passion, pas son métier (« I'm into photography »).",
      },
      {
        id: "ms-q2",
        question: "Que veut dire « I'm into photography » ?",
        options: [
          "Je travaille dans la photo",
          "Je suis à fond dans la photo",
          "Je veux acheter un appareil photo",
        ],
        correctIndex: 1,
        explanation:
          "« To be into something » = adorer quelque chose. Bien plus naturel que « I like ».",
      },
      {
        id: "ms-q3",
        question: "Depuis combien de temps Tom vit-il ici ?",
        options: ["Six mois", "Deux ans", "Dix ans"],
        correctIndex: 1,
        explanation:
          "« Been here for two years » — les natifs coupent « I have » : « (I've) been here… ».",
      },
    ],
    decodeNotes: [
      {
        line: "Nice to meet you.",
        translation: "Enchanté(e).",
        explanation:
          "Le classique indémodable. Réponse : « nice to meet you too », souvent réduit à « you too ».",
        chunk: "Nice to meet you",
      },
      {
        line: "So, what do you do?",
        translation: "Alors, tu fais quoi dans la vie ?",
        explanation:
          "« What do you do? » = quel est ton métier. Pas besoin d'ajouter « for a living ».",
        chunk: "What do you do?",
      },
      {
        line: "I'm really into photography.",
        translation: "Je suis à fond dans la photo.",
        explanation:
          "« I'm into… » exprime une passion. Retiens le bloc entier, il marche avec tout : music, hiking, cooking…",
        chunk: "I'm into…",
      },
      {
        line: "That sounds cool!",
        translation: "Ça a l'air sympa !",
        explanation:
          "Réaction passe-partout pour relancer. Variantes : « sounds great », « sounds fun ».",
        chunk: "That sounds cool",
      },
      {
        line: "Where are you from?",
        translation: "Tu viens d'où ?",
        explanation:
          "Question inévitable en voyage. Réponds « I'm from… » + ta ville ou ton pays.",
        chunk: "Where are you from?",
      },
    ],
    phrases: [
      {
        id: "p-nice-to-meet-you",
        english: "Nice to meet you",
        french: "Enchanté(e)",
        example: "Hi, I'm Léa. Nice to meet you!",
        context: "À chaque première rencontre. Réponse : « you too ».",
        category: "social",
        roomId: "meeting-someone",
      },
      {
        id: "p-what-do-you-do",
        english: "What do you do?",
        french: "Tu fais quoi dans la vie ?",
        example: "So, what do you do? — I'm a nurse.",
        context: "LA question métier. Simple, directe, universelle.",
        category: "social",
        roomId: "meeting-someone",
      },
      {
        id: "p-im-into",
        english: "I'm into…",
        french: "Je suis à fond dans… / j'adore…",
        example: "I'm really into old movies.",
        context: "Pour parler de tes passions sans dire « I like » en boucle.",
        category: "social",
        roomId: "meeting-someone",
      },
      {
        id: "p-where-are-you-from",
        english: "Where are you from?",
        french: "Tu viens d'où ?",
        example: "Where are you from? — I'm from France.",
        context: "Question réflexe entre voyageurs. Prépare ta réponse.",
        category: "social",
        roomId: "meeting-someone",
      },
      {
        id: "p-that-sounds-cool",
        english: "That sounds cool",
        french: "Ça a l'air sympa",
        example: "“I'm learning to surf.” — “That sounds cool!”",
        context: "Réaction simple qui montre ton intérêt et relance la conversation.",
        category: "social",
        roomId: "meeting-someone",
      },
    ],
    speakBack: {
      situation:
        "Dans une soirée, quelqu'un se présente et te demande ce que tu fais dans la vie. Réponds et relance.",
      heard: "Hi, I'm Sam! So, what do you do?",
      suggestedAnswers: [
        "Nice to meet you! I'm a student. What about you?",
        "Hey Sam! I work in marketing. And you?",
        "Hi! I'm a developer, and I'm really into music. What do you do?",
      ],
    },
    shadowingLineIds: [1, 3, 4],
  },

  {
    id: "asking-for-help",
    title: "Asking for Help",
    subtitle: "Demander de l'aide sans chercher tes mots pendant 10 secondes",
    emoji: "🙋",
    level: "A2",
    levelLabel: "A2",
    duration: 8,
    accent: "UK",
    goal: "Demander de l'aide, dire que tu ne comprends pas, et rebondir.",
    focus: "Débloquer une situation",
    category: "problems",
    free: true,
    dialogue: [
      {
        id: 0,
        speaker: "You",
        text: "Excuse me, could you help me? I'm trying to buy a ticket but the machine won't take my card.",
        translation:
          "Excusez-moi, vous pourriez m'aider ? J'essaie d'acheter un billet mais la machine refuse ma carte.",
      },
      {
        id: 1,
        speaker: "Agent",
        text: "Of course. Did you tap it or insert it?",
        translation:
          "Bien sûr. Vous l'avez passée en sans-contact ou insérée ?",
      },
      {
        id: 2,
        speaker: "You",
        text: "Sorry, what do you mean?",
        translation: "Pardon, qu'est-ce que vous voulez dire ?",
      },
      {
        id: 3,
        speaker: "Agent",
        text: "Contactless — just touch the card on the reader, at the bottom.",
        translation:
          "Sans contact — posez juste la carte sur le lecteur, en bas.",
      },
      {
        id: 4,
        speaker: "You",
        text: "Oh, I see! Let me try again… It worked. Thanks so much!",
        translation:
          "Ah, je vois ! Je réessaie… Ça a marché. Merci beaucoup !",
      },
    ],
    expectedIdeas: [
      "Quelqu'un n'arrive pas à acheter un billet, la machine refuse sa carte.",
      "Il ne comprend pas un mot et demande une explication.",
      "L'agent explique le sans-contact et ça finit par marcher.",
    ],
    quickChoices: [
      "Quelqu'un demande de l'aide avec une machine",
      "Quelqu'un achète un billet sans problème",
      "Quelqu'un signale une carte volée",
    ],
    questions: [
      {
        id: "ah-q1",
        question: "Quel est le problème au départ ?",
        options: [
          "La machine refuse la carte",
          "Le billet est trop cher",
          "La machine est en panne",
        ],
        correctIndex: 0,
        explanation:
          "« The machine won't take my card » — « won't » ici = « refuse de ».",
      },
      {
        id: "ah-q2",
        question: "Que fait la personne quand elle ne comprend pas « tap » ?",
        options: [
          "Elle abandonne",
          "Elle demande « what do you mean? »",
          "Elle sort son téléphone pour traduire",
        ],
        correctIndex: 1,
        explanation:
          "« What do you mean? » est le réflexe à avoir. Personne ne t'en voudra jamais de le demander.",
      },
      {
        id: "ah-q3",
        question: "Comment ça se termine ?",
        options: [
          "Elle paie en espèces",
          "Elle réessaie et ça marche",
          "Elle va à un autre guichet",
        ],
        correctIndex: 1,
        explanation: "« Let me try again… It worked. » Fin heureuse.",
      },
    ],
    decodeNotes: [
      {
        line: "Could you help me?",
        translation: "Vous pourriez m'aider ?",
        explanation:
          "« Could you… » est poli sans être guindé. Plus doux que « can you ».",
        chunk: "Could you help me?",
      },
      {
        line: "I'm trying to buy a ticket.",
        translation: "J'essaie d'acheter un billet.",
        explanation:
          "« I'm trying to… » explique ton intention. Commence toujours par ça quand tu demandes de l'aide.",
        chunk: "I'm trying to…",
      },
      {
        line: "Sorry, what do you mean?",
        translation: "Pardon, qu'est-ce que vous voulez dire ?",
        explanation:
          "Ton meilleur ami quand tu ne comprends pas UN mot. Évite le silence gêné.",
        chunk: "What do you mean?",
      },
      {
        line: "I don't get it.",
        translation: "Je ne comprends pas.",
        explanation:
          "Version orale de « I don't understand ». « To get » = comprendre, à l'oral.",
        chunk: "I don't get it",
      },
      {
        line: "Let me try again.",
        translation: "Je réessaie. / Laissez-moi réessayer.",
        explanation:
          "« Let me… » = « laisse(z)-moi… ». Un bloc à réutiliser partout : let me see, let me check…",
        chunk: "Let me try again",
      },
    ],
    phrases: [
      {
        id: "p-could-you-help-me",
        english: "Could you help me?",
        french: "Vous pourriez m'aider ?",
        example: "Excuse me, could you help me? I'm a bit lost.",
        context: "Ouvre n'importe quelle demande d'aide, poliment.",
        category: "problems",
        roomId: "asking-for-help",
      },
      {
        id: "p-im-trying-to",
        english: "I'm trying to…",
        french: "J'essaie de…",
        example: "I'm trying to find the train station.",
        context: "Explique ce que tu veux faire avant de demander de l'aide.",
        category: "problems",
        roomId: "asking-for-help",
      },
      {
        id: "p-i-dont-get-it",
        english: "I don't get it",
        french: "Je ne comprends pas",
        example: "Sorry, I don't get it. Can you show me?",
        context: "Version naturelle de « I don't understand ».",
        category: "problems",
        roomId: "asking-for-help",
      },
      {
        id: "p-what-do-you-mean",
        english: "What do you mean?",
        french: "Qu'est-ce que vous voulez dire ?",
        example: "“You need to validate it.” — “What do you mean?”",
        context: "Le réflexe anti-blocage quand un mot t'échappe.",
        category: "problems",
        roomId: "asking-for-help",
      },
      {
        id: "p-let-me-try-again",
        english: "Let me try again",
        french: "Je réessaie",
        example: "Hold on, let me try again.",
        context: "Pour garder la main sans paniquer quand ça rate.",
        category: "problems",
        roomId: "asking-for-help",
      },
    ],
    speakBack: {
      situation:
        "Tu es dans le métro à Londres. Ta carte ne passe pas au portique. Un agent est à côté. Demande de l'aide.",
      heard: "Everything all right there?",
      suggestedAnswers: [
        "Could you help me? My card isn't working.",
        "I'm trying to get through, but it won't open.",
        "Sorry, I don't get it — where do I tap the card?",
      ],
    },
    shadowingLineIds: [0, 2, 4],
  },

  {
    id: "small-talk",
    title: "Small Talk",
    subtitle: "Tenir une conversation légère sans donner ta vie entière",
    emoji: "💬",
    level: "A2",
    levelLabel: "A2",
    duration: 7,
    accent: "US",
    goal: "Répondre du tac au tac aux questions de politesse et relancer.",
    focus: "Réflexes de conversation",
    category: "social",
    free: true,
    dialogue: [
      {
        id: 0,
        speaker: "Alex",
        text: "Hey! How's it going?",
        translation: "Salut ! Ça va ?",
      },
      {
        id: 1,
        speaker: "Sam",
        text: "Pretty good! Busy week, but I can't complain. What about you?",
        translation:
          "Plutôt bien ! Semaine chargée, mais je ne me plains pas. Et toi ?",
      },
      {
        id: 2,
        speaker: "Alex",
        text: "Not too bad. Any plans for the weekend?",
        translation: "Pas trop mal. Des projets pour le week-end ?",
      },
      {
        id: 3,
        speaker: "Sam",
        text: "Probably just chilling at home. Maybe a movie. You?",
        translation:
          "Sûrement juste me poser à la maison. Peut-être un film. Toi ?",
      },
      {
        id: 4,
        speaker: "Alex",
        text: "A few friends are coming over on Saturday. You should join!",
        translation:
          "Des amis viennent samedi. Tu devrais passer !",
      },
      {
        id: 5,
        speaker: "Sam",
        text: "Oh nice, sounds good! Count me in.",
        translation: "Oh sympa, ça me dit bien ! Compte sur moi.",
      },
    ],
    expectedIdeas: [
      "Deux personnes échangent des nouvelles rapidement.",
      "Sam prévoit un week-end tranquille à la maison.",
      "Alex l'invite samedi et Sam accepte.",
    ],
    quickChoices: [
      "Deux amis discutent du week-end",
      "Deux collègues parlent d'un projet",
      "Quelqu'un annule une invitation",
    ],
    questions: [
      {
        id: "st-q1",
        question: "Comment répond Sam à « How's it going? »",
        options: [
          "“I am fine thank you and you”",
          "“Pretty good!”",
          "“Very well indeed”",
        ],
        correctIndex: 1,
        explanation:
          "« Pretty good » = « plutôt bien ». Oublie le « I am fine thank you » de l'école.",
      },
      {
        id: "st-q2",
        question: "Que compte faire Sam ce week-end ?",
        options: [
          "Partir en voyage",
          "Se poser à la maison",
          "Travailler",
        ],
        correctIndex: 1,
        explanation:
          "« Just chilling at home » — « chilling » = se détendre, glander tranquillement.",
      },
      {
        id: "st-q3",
        question: "Que veut dire « count me in » ?",
        options: ["Compte sur moi, j'en suis", "Compte jusqu'à trois", "Je réfléchis"],
        correctIndex: 0,
        explanation:
          "« Count me in » = « j'en suis ». L'inverse : « count me out ».",
      },
    ],
    decodeNotes: [
      {
        line: "How's it going?",
        translation: "Ça va ?",
        explanation:
          "Salut standard. On n'attend PAS un vrai bilan de ta vie : une réponse courte + relance.",
        chunk: "How's it going?",
      },
      {
        line: "Pretty good!",
        translation: "Plutôt bien !",
        explanation:
          "« Pretty » adoucit tout : pretty good, pretty busy, pretty tired. Réponse réflexe n°1.",
        chunk: "Pretty good",
      },
      {
        line: "Not too bad.",
        translation: "Pas trop mal. / Ça va.",
        explanation:
          "L'autre réponse réflexe. Légèrement plus neutre que « pretty good ».",
        chunk: "Not too bad",
      },
      {
        line: "What about you?",
        translation: "Et toi ?",
        explanation:
          "La relance magique. Réponds court, puis renvoie la question — c'est ça, le small talk.",
        chunk: "What about you?",
      },
      {
        line: "Sounds good!",
        translation: "Ça me va ! / Bonne idée !",
        explanation:
          "Valide un plan en deux mots. Cousin de « sounds great » et « sounds like a plan ».",
        chunk: "Sounds good",
      },
    ],
    phrases: [
      {
        id: "p-hows-it-going",
        english: "How's it going?",
        french: "Ça va ?",
        example: "Hey Marc! How's it going?",
        context: "Salutation standard, plus naturelle que « how are you ».",
        category: "social",
        roomId: "small-talk",
      },
      {
        id: "p-pretty-good",
        english: "Pretty good",
        french: "Plutôt bien",
        example: "“How's it going?” — “Pretty good, and you?”",
        context: "Réponse réflexe, à sortir sans réfléchir.",
        category: "social",
        roomId: "small-talk",
      },
      {
        id: "p-not-too-bad",
        english: "Not too bad",
        french: "Pas trop mal",
        example: "“How was your day?” — “Not too bad.”",
        context: "Variante neutre de « pretty good ».",
        category: "social",
        roomId: "small-talk",
      },
      {
        id: "p-what-about-you",
        english: "What about you?",
        french: "Et toi ?",
        example: "I'm just relaxing today. What about you?",
        context: "Relance la conversation au lieu de la laisser mourir.",
        category: "social",
        roomId: "small-talk",
      },
      {
        id: "p-sounds-good",
        english: "Sounds good",
        french: "Ça me va / bonne idée",
        example: "“Pizza tonight?” — “Sounds good!”",
        context: "Valide un plan en deux mots.",
        category: "social",
        roomId: "small-talk",
      },
    ],
    speakBack: {
      situation:
        "Un collègue anglophone te croise à la machine à café et te lance un « how's it going? ». Réponds et relance.",
      heard: "Hey! How's it going?",
      suggestedAnswers: [
        "Pretty good! What about you?",
        "Not too bad, busy week. And you?",
        "Good, thanks! Any plans for the weekend?",
      ],
    },
    shadowingLineIds: [1, 2, 5],
  },

  {
    id: "travel-problem",
    title: "Travel Problem",
    subtitle: "Expliquer un problème en voyage sans paniquer",
    emoji: "🧳",
    level: "B1",
    levelLabel: "B1",
    duration: 10,
    accent: "UK",
    goal: "Décrire un objet perdu, demander une solution et remercier.",
    focus: "Gérer un imprévu",
    category: "travel",
    free: true,
    dialogue: [
      {
        id: 0,
        speaker: "You",
        text: "Hi, excuse me. I think I lost my backpack on the train from Manchester.",
        translation:
          "Bonjour, excusez-moi. Je crois que j'ai perdu mon sac à dos dans le train depuis Manchester.",
      },
      {
        id: 1,
        speaker: "Staff",
        text: "Oh dear. Which service was it, and where were you sitting?",
        translation:
          "Oh là. C'était quel train, et où étiez-vous assis ?",
      },
      {
        id: 2,
        speaker: "You",
        text: "The 2:15, coach C I think. I can't find it anywhere.",
        translation:
          "Celui de 14 h 15, voiture C je crois. Je ne le trouve nulle part.",
      },
      {
        id: 3,
        speaker: "Staff",
        text: "Right. Is there anything valuable inside?",
        translation: "D'accord. Il y a des objets de valeur dedans ?",
      },
      {
        id: 4,
        speaker: "You",
        text: "My laptop, mostly. Is there a way to check the lost property office?",
        translation:
          "Mon ordinateur, surtout. Est-ce qu'il y a moyen de vérifier aux objets trouvés ?",
      },
      {
        id: 5,
        speaker: "Staff",
        text: "Of course. Could you fill in this form? We'll ring you if it turns up.",
        translation:
          "Bien sûr. Vous pouvez remplir ce formulaire ? On vous appellera s'il réapparaît.",
      },
      {
        id: 6,
        speaker: "You",
        text: "Thank you, I really appreciate it.",
        translation: "Merci, c'est vraiment gentil.",
      },
    ],
    expectedIdeas: [
      "Quelqu'un a perdu son sac à dos dans un train.",
      "Il y avait un ordinateur portable dedans.",
      "L'employé fait remplir un formulaire et appellera si le sac est retrouvé.",
    ],
    quickChoices: [
      "Quelqu'un a perdu un sac dans un train",
      "Quelqu'un rate sa correspondance",
      "Quelqu'un achète un billet de train",
    ],
    questions: [
      {
        id: "tp-q1",
        question: "Qu'a perdu le voyageur ?",
        options: ["Sa valise", "Son sac à dos", "Son téléphone"],
        correctIndex: 1,
        explanation:
          "« I think I lost my backpack » — « I think » adoucit : « je crois que ».",
      },
      {
        id: "tp-q2",
        question: "Qu'y avait-il de précieux dedans ?",
        options: ["Son passeport", "Son ordinateur portable", "Ses clés"],
        correctIndex: 1,
        explanation: "« My laptop, mostly » — « mostly » = « surtout ».",
      },
      {
        id: "tp-q3",
        question: "Que propose l'employé ?",
        options: [
          "De rembourser le billet",
          "De remplir un formulaire",
          "D'appeler la police",
        ],
        correctIndex: 1,
        explanation:
          "« Could you fill in this form? » — au UK on dit « fill in », aux US plutôt « fill out ». Même sens.",
      },
      {
        id: "tp-q4",
        question: "Que veut dire « if it turns up » ?",
        options: ["S'il est volé", "S'il réapparaît", "S'il est cassé"],
        correctIndex: 1,
        explanation:
          "« To turn up » = réapparaître, refaire surface. Très courant pour les objets perdus… et les gens en retard.",
      },
    ],
    decodeNotes: [
      {
        line: "I think I lost my backpack.",
        translation: "Je crois que j'ai perdu mon sac à dos.",
        explanation:
          "Commence par « I think I lost… » : ça pose le problème calmement et ça t'achète du temps.",
        chunk: "I think I lost…",
      },
      {
        line: "I can't find it anywhere.",
        translation: "Je ne le trouve nulle part.",
        explanation:
          "Bloc entier à retenir. « Anywhere » renforce le « can't find ».",
        chunk: "I can't find…",
      },
      {
        line: "Is there a way to check the lost property office?",
        translation: "Est-ce qu'il y a moyen de vérifier aux objets trouvés ?",
        explanation:
          "« Is there a way to…? » = « y a-t-il moyen de… ? ». Parfait pour demander une solution sans exiger.",
        chunk: "Is there a way to…?",
      },
      {
        line: "Could you check?",
        translation: "Vous pourriez vérifier ?",
        explanation:
          "Court, poli, efficace. « Check » est un des verbes les plus rentables de l'anglais.",
        chunk: "Could you check?",
      },
      {
        line: "I really appreciate it.",
        translation: "C'est vraiment gentil. / Merci beaucoup.",
        explanation:
          "Un cran au-dessus de « thank you ». À utiliser quand quelqu'un t'a vraiment aidé.",
        chunk: "I really appreciate it",
      },
    ],
    phrases: [
      {
        id: "p-i-cant-find",
        english: "I can't find…",
        french: "Je ne trouve pas…",
        example: "I can't find my boarding pass.",
        context: "Premier réflexe quand quelque chose a disparu.",
        category: "travel",
        roomId: "travel-problem",
      },
      {
        id: "p-i-think-i-lost",
        english: "I think I lost…",
        french: "Je crois que j'ai perdu…",
        example: "I think I lost my phone in the taxi.",
        context: "Pose le problème calmement, sans drame.",
        category: "travel",
        roomId: "travel-problem",
      },
      {
        id: "p-is-there-a-way-to",
        english: "Is there a way to…?",
        french: "Est-ce qu'il y a moyen de… ?",
        example: "Is there a way to change my seat?",
        context: "Demande une solution poliment, sans exiger.",
        category: "travel",
        roomId: "travel-problem",
      },
      {
        id: "p-could-you-check",
        english: "Could you check?",
        french: "Vous pourriez vérifier ?",
        example: "Could you check if there's another train tonight?",
        context: "Court et poli. Marche au guichet, à l'hôtel, partout.",
        category: "travel",
        roomId: "travel-problem",
      },
      {
        id: "p-i-really-appreciate-it",
        english: "I really appreciate it",
        french: "C'est vraiment gentil / merci beaucoup",
        example: "Thanks for your help, I really appreciate it.",
        context: "Le remerciement sincère, au-dessus du simple « thanks ».",
        category: "travel",
        roomId: "travel-problem",
      },
    ],
    speakBack: {
      situation:
        "À l'aéroport, ta valise n'est pas arrivée sur le tapis. Explique le problème à l'agent du comptoir.",
      heard: "Hello, how can I help you?",
      suggestedAnswers: [
        "Hi, I can't find my suitcase. It wasn't on the belt.",
        "I think I lost my bag — it never came out.",
        "Is there a way to track my luggage? It didn't arrive.",
      ],
    },
    shadowingLineIds: [0, 4, 6],
  },

  {
    id: "making-plans",
    title: "Making Plans",
    subtitle: "Proposer un plan et caler une heure sans dix messages",
    emoji: "📅",
    level: "B1",
    levelLabel: "B1",
    duration: 8,
    accent: "US",
    goal: "Proposer, accepter, négocier une heure et conclure un plan.",
    focus: "Organisation entre amis",
    category: "social",
    free: false,
    dialogue: [
      {
        id: 0,
        speaker: "Chris",
        text: "Hey, do you want to grab dinner this week?",
        translation: "Hé, ça te dit qu'on aille dîner cette semaine ?",
      },
      {
        id: 1,
        speaker: "Nina",
        text: "Yeah, I'm down! When were you thinking?",
        translation: "Ouais, je suis partante ! Tu pensais à quand ?",
      },
      {
        id: 2,
        speaker: "Chris",
        text: "Maybe Thursday? There's that new ramen place downtown.",
        translation:
          "Peut-être jeudi ? Il y a ce nouveau resto de ramen en centre-ville.",
      },
      {
        id: 3,
        speaker: "Nina",
        text: "Hmm, it depends. I might finish work late. What time works for you?",
        translation:
          "Hmm, ça dépend. Je risque de finir tard. Quelle heure t'arrange ?",
      },
      {
        id: 4,
        speaker: "Chris",
        text: "Anytime after seven, honestly.",
        translation: "N'importe quand après 19 h, franchement.",
      },
      {
        id: 5,
        speaker: "Nina",
        text: "Okay, let's say seven thirty. I'll let you know if anything changes.",
        translation:
          "Ok, disons 19 h 30. Je te tiens au courant si ça change.",
      },
    ],
    expectedIdeas: [
      "Chris propose un dîner cette semaine, dans un nouveau resto de ramen.",
      "Nina est partante mais risque de finir le travail tard.",
      "Ils se mettent d'accord sur jeudi 19 h 30.",
    ],
    quickChoices: [
      "Deux amis organisent un dîner",
      "Deux amis annulent une soirée",
      "Deux collègues planifient une réunion",
    ],
    questions: [
      {
        id: "mp-q1",
        question: "Que veut dire « I'm down » ?",
        options: ["Je suis déprimé(e)", "Je suis partant(e)", "Je suis en bas"],
        correctIndex: 1,
        explanation:
          "Piège classique ! « I'm down » = « j'en suis ». Rien à voir avec être triste. Synonyme : « I'm in ».",
      },
      {
        id: "mp-q2",
        question: "Pourquoi Nina hésite-t-elle pour jeudi ?",
        options: [
          "Elle n'aime pas les ramen",
          "Elle risque de finir le travail tard",
          "Elle a déjà un rendez-vous",
        ],
        correctIndex: 1,
        explanation:
          "« I might finish work late » — « might » = « il se peut que ».",
      },
      {
        id: "mp-q3",
        question: "À quelle heure se retrouvent-ils ?",
        options: ["19 h", "19 h 30", "20 h"],
        correctIndex: 1,
        explanation:
          "« Let's say seven thirty » — « let's say… » sert à fixer un point précis.",
      },
    ],
    decodeNotes: [
      {
        line: "Do you want to grab dinner?",
        translation: "Ça te dit qu'on aille dîner ?",
        explanation:
          "« Grab » = prendre vite fait, sans cérémonie : grab dinner, grab a coffee, grab a drink.",
        chunk: "Do you want to…?",
      },
      {
        line: "I'm down!",
        translation: "Je suis partant(e) !",
        explanation:
          "Très courant chez les moins de 40 ans. « I'm down » ou « I'm in » = j'en suis.",
        chunk: "I'm down",
      },
      {
        line: "It depends. I might finish work late.",
        translation: "Ça dépend. Je risque de finir tard.",
        explanation:
          "« It depends » te laisse réfléchir sans dire non. Suivi d'une raison, c'est parfait.",
        chunk: "It depends",
      },
      {
        line: "What time works for you?",
        translation: "Quelle heure t'arrange ?",
        explanation:
          "« Works for you » = « t'arrange ». Réponse : « seven works for me ».",
        chunk: "What time works for you?",
      },
      {
        line: "I'll let you know.",
        translation: "Je te tiens au courant.",
        explanation:
          "Clôture universelle des plans. Souvent réduit à « I'll let you know! » en fin de message.",
        chunk: "Let me know",
      },
    ],
    phrases: [
      {
        id: "p-do-you-want-to",
        english: "Do you want to…?",
        french: "Ça te dit de… ?",
        example: "Do you want to grab a coffee later?",
        context: "La façon la plus simple de proposer un plan.",
        category: "social",
        roomId: "making-plans",
      },
      {
        id: "p-im-down",
        english: "I'm down",
        french: "Je suis partant(e)",
        example: "“Movie night?” — “I'm down!”",
        context: "Accepte un plan avec énergie. Synonyme : « I'm in ».",
        category: "social",
        roomId: "making-plans",
      },
      {
        id: "p-it-depends",
        english: "It depends",
        french: "Ça dépend",
        example: "“Coming tonight?” — “It depends, I might work late.”",
        context: "Gagne du temps sans fermer la porte.",
        category: "social",
        roomId: "making-plans",
      },
      {
        id: "p-what-time-works",
        english: "What time works for you?",
        french: "Quelle heure t'arrange ?",
        example: "I'm free all evening — what time works for you?",
        context: "Cale une heure sans dix allers-retours de messages.",
        category: "social",
        roomId: "making-plans",
      },
      {
        id: "p-let-me-know",
        english: "Let me know",
        french: "Tiens-moi au courant",
        example: "Let me know if you can make it!",
        context: "Termine proprement l'organisation d'un plan.",
        category: "social",
        roomId: "making-plans",
      },
    ],
    speakBack: {
      situation:
        "Un ami te propose un ciné vendredi soir. Tu es plutôt chaud, mais tu as peut-être un truc avant. Réponds.",
      heard: "Hey, do you want to catch a movie Friday night?",
      suggestedAnswers: [
        "I'm down! What time works for you?",
        "It depends — I might have dinner with my family first. Maybe 9?",
        "Sounds good! Let me check and I'll let you know.",
      ],
    },
    shadowingLineIds: [0, 1, 5],
  },

  {
    id: "giving-an-opinion",
    title: "Giving an Opinion",
    subtitle: "Donner ton avis simplement, sans phrases de dissertation",
    emoji: "💡",
    level: "B1",
    levelLabel: "B1",
    duration: 9,
    accent: "Mixed",
    goal: "Exprimer un avis, nuancer, et rebondir sur celui des autres.",
    focus: "Discussion naturelle",
    category: "opinions",
    free: false,
    dialogue: [
      {
        id: 0,
        speaker: "Priya",
        text: "So, what did you think of the movie?",
        translation: "Alors, t'as pensé quoi du film ?",
      },
      {
        id: 1,
        speaker: "Dan",
        text: "Honestly? I feel like the ending was a bit rushed.",
        translation:
          "Honnêtement ? J'ai l'impression que la fin était un peu bâclée.",
      },
      {
        id: 2,
        speaker: "Priya",
        text: "Really? I'm not sure. I thought it left room for a sequel.",
        translation:
          "Ah bon ? Je ne suis pas sûre. Je trouve que ça laissait la place à une suite.",
      },
      {
        id: 3,
        speaker: "Dan",
        text: "Hmm, that makes sense, actually. I hadn't seen it that way.",
        translation:
          "Hmm, c'est logique, en fait. Je ne l'avais pas vu comme ça.",
      },
      {
        id: 4,
        speaker: "Priya",
        text: "In my opinion, the first hour was the best part anyway.",
        translation:
          "À mon avis, la première heure était la meilleure partie de toute façon.",
      },
      {
        id: 5,
        speaker: "Dan",
        text: "Yeah, I see what you mean. The beginning was really strong.",
        translation:
          "Ouais, je vois ce que tu veux dire. Le début était vraiment fort.",
      },
    ],
    expectedIdeas: [
      "Deux amis débriefent un film.",
      "Dan trouve la fin bâclée, Priya pense qu'elle prépare une suite.",
      "Ils finissent par se rejoindre : le début était la meilleure partie.",
    ],
    quickChoices: [
      "Deux amis donnent leur avis sur un film",
      "Deux critiques écrivent un article",
      "Deux amis choisissent quel film regarder",
    ],
    questions: [
      {
        id: "go-q1",
        question: "Que pense Dan de la fin du film ?",
        options: [
          "Elle était parfaite",
          "Elle était un peu bâclée",
          "Elle était trop longue",
        ],
        correctIndex: 1,
        explanation:
          "« The ending was a bit rushed » — « rushed » = fait à la va-vite.",
      },
      {
        id: "go-q2",
        question: "Que veut dire « that makes sense » ?",
        options: [
          "C'est n'importe quoi",
          "C'est logique / ça se tient",
          "C'est une bonne odeur",
        ],
        correctIndex: 1,
        explanation:
          "« That makes sense » valide l'argument de l'autre. Très utilisé en conversation ET au travail.",
      },
      {
        id: "go-q3",
        question: "Sur quoi sont-ils d'accord à la fin ?",
        options: [
          "La fin était géniale",
          "Le début était très bon",
          "Le film était trop court",
        ],
        correctIndex: 1,
        explanation:
          "« The beginning was really strong » — ils se rejoignent sur la première heure.",
      },
    ],
    decodeNotes: [
      {
        line: "I feel like the ending was a bit rushed.",
        translation: "J'ai l'impression que la fin était un peu bâclée.",
        explanation:
          "« I feel like… » = « j'ai l'impression que… ». La façon douce et naturelle de donner un avis.",
        chunk: "I feel like…",
      },
      {
        line: "I'm not sure.",
        translation: "Je ne suis pas sûr(e). / Mouais.",
        explanation:
          "Désaccord poli en trois mots. Bien plus fluide que « I don't agree with you ».",
        chunk: "I'm not sure",
      },
      {
        line: "That makes sense.",
        translation: "C'est logique. / Ça se tient.",
        explanation:
          "Reconnaît un bon argument sans forcément céder. Indispensable en réunion.",
        chunk: "That makes sense",
      },
      {
        line: "In my opinion, the first hour was the best part.",
        translation: "À mon avis, la première heure était la meilleure partie.",
        explanation:
          "« In my opinion » marche partout, mais à l'oral « I think » ou « I feel like » sont plus fréquents.",
        chunk: "In my opinion…",
      },
      {
        line: "I see what you mean.",
        translation: "Je vois ce que tu veux dire.",
        explanation:
          "Montre que tu as compris l'argument. Parfait avant de nuancer : « I see what you mean, but… ».",
        chunk: "I see what you mean",
      },
    ],
    phrases: [
      {
        id: "p-i-feel-like",
        english: "I feel like…",
        french: "J'ai l'impression que…",
        example: "I feel like this place is overpriced.",
        context: "Donne ton avis en douceur, sans l'imposer.",
        category: "opinions",
        roomId: "giving-an-opinion",
      },
      {
        id: "p-in-my-opinion",
        english: "In my opinion…",
        french: "À mon avis…",
        example: "In my opinion, the book is better.",
        context: "Version un peu plus posée, utile au travail.",
        category: "opinions",
        roomId: "giving-an-opinion",
      },
      {
        id: "p-im-not-sure",
        english: "I'm not sure",
        french: "Je ne suis pas sûr(e)",
        example: "I'm not sure, I liked the other one more.",
        context: "Désaccord poli, sans confrontation.",
        category: "opinions",
        roomId: "giving-an-opinion",
      },
      {
        id: "p-that-makes-sense",
        english: "That makes sense",
        french: "C'est logique / ça se tient",
        example: "“I left early to avoid traffic.” — “That makes sense.”",
        context: "Valide l'argument de l'autre. Marche partout.",
        category: "opinions",
        roomId: "giving-an-opinion",
      },
      {
        id: "p-i-see-what-you-mean",
        english: "I see what you mean",
        french: "Je vois ce que tu veux dire",
        example: "I see what you mean, but I still prefer the original.",
        context: "Montre que tu comprends avant de nuancer.",
        category: "opinions",
        roomId: "giving-an-opinion",
      },
    ],
    speakBack: {
      situation:
        "Un ami te demande ton avis sur une série que vous avez regardée tous les deux. Donne un avis nuancé.",
      heard: "So, what did you think of the show?",
      suggestedAnswers: [
        "I feel like the first season was way better.",
        "Honestly, I'm not sure — the story lost me halfway.",
        "I loved it! In my opinion, the main actor carries the whole thing.",
      ],
    },
    shadowingLineIds: [1, 3, 5],
  },

  {
    id: "fast-english",
    title: "Understanding Fast English",
    subtitle: "Décoder gonna, wanna, gotta — l'anglais tel qu'il se prononce vraiment",
    emoji: "⚡️",
    level: "B1",
    levelLabel: "B1",
    duration: 10,
    accent: "US",
    goal: "Reconnaître les contractions orales qui rendent l'anglais « trop rapide ».",
    focus: "Oreille & vitesse",
    category: "fast-english",
    free: false,
    dialogue: [
      {
        id: 0,
        speaker: "Tyler",
        text: "Hey, I'm gonna order some food. You want anything?",
        translation:
          "Hé, je vais commander à manger. Tu veux quelque chose ?",
      },
      {
        id: 1,
        speaker: "Zoe",
        text: "Hmm, I dunno… What are you getting?",
        translation: "Hmm, je sais pas… Tu prends quoi ?",
      },
      {
        id: 2,
        speaker: "Tyler",
        text: "Probably tacos. But we gotta order now if we wanna eat before the game.",
        translation:
          "Sûrement des tacos. Mais faut commander maintenant si on veut manger avant le match.",
      },
      {
        id: 3,
        speaker: "Zoe",
        text: "Okay, okay. Lemme see the menu real quick.",
        translation: "Ok, ok. Fais-moi voir le menu vite fait.",
      },
      {
        id: 4,
        speaker: "Tyler",
        text: "It's kinda long, just pick something!",
        translation: "Il est un peu long, choisis un truc !",
      },
      {
        id: 5,
        speaker: "Zoe",
        text: "Fine! I'm gonna go with the chicken tacos.",
        translation: "Bon ! Je vais partir sur les tacos au poulet.",
      },
    ],
    expectedIdeas: [
      "Tyler va commander à manger et propose à Zoe.",
      "Il faut commander vite pour manger avant le match.",
      "Zoe hésite puis choisit des tacos au poulet.",
    ],
    quickChoices: [
      "Deux amis commandent à manger avant un match",
      "Deux amis cuisinent ensemble",
      "Deux amis vont au restaurant",
    ],
    questions: [
      {
        id: "fe-q1",
        question: "Que veut dire « I'm gonna order » ?",
        options: [
          "I'm going to order",
          "I want to order",
          "I have to order",
        ],
        correctIndex: 0,
        explanation:
          "« Gonna » = « going to ». La contraction orale la plus fréquente de l'anglais.",
      },
      {
        id: "fe-q2",
        question: "Pourquoi doivent-ils commander maintenant ?",
        options: [
          "Le resto va fermer",
          "Pour manger avant le match",
          "Parce que Zoe a très faim",
        ],
        correctIndex: 1,
        explanation:
          "« We gotta order now if we wanna eat before the game » — deux contractions dans une phrase !",
      },
      {
        id: "fe-q3",
        question: "Que veut dire « I dunno » ?",
        options: ["I don't know", "I don't want", "I do now"],
        correctIndex: 0,
        explanation:
          "« Dunno » = « don't know ». Souvent à peine articulé : « I-uh-no ».",
      },
      {
        id: "fe-q4",
        question: "Que veut dire « lemme see » ?",
        options: ["Let me see", "Leave me", "Lemon, please"],
        correctIndex: 0,
        explanation:
          "« Lemme » = « let me ». Comme « gimme » = « give me ».",
      },
    ],
    decodeNotes: [
      {
        line: "I'm gonna order some food.",
        translation: "Je vais commander à manger.",
        explanation:
          "« Gonna » = « going to ». À l'oral, personne ne dit « going to » en entier. C'est informel : ne l'écris pas dans un email pro.",
        chunk: "gonna = going to",
      },
      {
        line: "I dunno…",
        translation: "Je sais pas…",
        explanation:
          "« Dunno » = « don't know ». Si tu entends un son flou après « I », c'est probablement ça.",
        chunk: "dunno = don't know",
      },
      {
        line: "We gotta order now.",
        translation: "Faut qu'on commande maintenant.",
        explanation:
          "« Gotta » = « got to » = « have to ». Exprime l'obligation, version éclair.",
        chunk: "gotta = have to",
      },
      {
        line: "If we wanna eat before the game.",
        translation: "Si on veut manger avant le match.",
        explanation:
          "« Wanna » = « want to ». Gonna, wanna, gotta : le trio que tu entendras dans CHAQUE série.",
        chunk: "wanna = want to",
      },
      {
        line: "Lemme see the menu.",
        translation: "Fais-moi voir le menu.",
        explanation:
          "« Lemme » = « let me ». Toutes ces formes sont orales et informelles — comprends-les toutes, utilise-les avec des amis.",
        chunk: "lemme = let me",
      },
      {
        line: "It's kinda long.",
        translation: "Il est un peu long.",
        explanation:
          "« Kinda » = « kind of » = « un peu / plutôt ». Adoucit tout : kinda tired, kinda weird, kinda cool.",
        chunk: "kinda = kind of",
      },
    ],
    phrases: [
      {
        id: "p-gonna",
        english: "gonna",
        french: "= going to (je vais…)",
        example: "I'm gonna call you tonight.",
        context: "Forme orale informelle. À l'écrit pro, garde « going to ».",
        category: "fast-english",
        roomId: "fast-english",
      },
      {
        id: "p-wanna",
        english: "wanna",
        french: "= want to (vouloir)",
        example: "Do you wanna come with us?",
        context: "Forme orale informelle de « want to ».",
        category: "fast-english",
        roomId: "fast-english",
      },
      {
        id: "p-gotta",
        english: "gotta",
        french: "= have to (devoir)",
        example: "Sorry, I gotta go!",
        context: "Obligation version express. « I gotta go » = il faut que j'y aille.",
        category: "fast-english",
        roomId: "fast-english",
      },
      {
        id: "p-kinda",
        english: "kinda",
        french: "= kind of (un peu, plutôt)",
        example: "The movie was kinda boring.",
        context: "Adoucit un adjectif. Très fréquent dans les séries.",
        category: "fast-english",
        roomId: "fast-english",
      },
      {
        id: "p-lemme",
        english: "lemme",
        french: "= let me (laisse-moi)",
        example: "Lemme check my calendar.",
        context: "Forme orale de « let me ». Cousine : « gimme » (give me).",
        category: "fast-english",
        roomId: "fast-english",
      },
      {
        id: "p-dunno",
        english: "dunno",
        french: "= don't know (je sais pas)",
        example: "“Where's Jake?” — “Dunno.”",
        context: "Réponse floue par excellence. Souvent à peine articulée.",
        category: "fast-english",
        roomId: "fast-english",
      },
    ],
    speakBack: {
      situation:
        "Un ami te propose de venir voir le match ce soir. Tu hésites parce que tu dois finir un truc. Réponds en anglais oral, détendu.",
      heard: "Yo, we're watching the game tonight. You wanna come?",
      suggestedAnswers: [
        "I dunno… I gotta finish something first. Maybe after?",
        "I'm down, but I'm gonna be late. Save me a seat!",
        "Kinda tired, but okay — I wanna see this game!",
      ],
    },
    shadowingLineIds: [0, 2, 3],
  },

  {
    id: "telling-your-day",
    title: "Telling Your Day",
    subtitle: "Raconter ta journée sans chercher tes mots à chaque phrase",
    emoji: "🌇",
    level: "A2",
    levelLabel: "A2/B1",
    duration: 9,
    accent: "US",
    goal: "Enchaîner les moments d'une journée avec des connecteurs naturels.",
    focus: "Raconter au passé",
    category: "everyday",
    free: false,
    dialogue: [
      {
        id: 0,
        speaker: "Mia",
        text: "Hey! How was your day?",
        translation: "Salut ! C'était comment ta journée ?",
      },
      {
        id: 1,
        speaker: "Leo",
        text: "Long! I woke up early because I had to finish a report before nine.",
        translation:
          "Longue ! Je me suis levé tôt parce que je devais finir un rapport avant neuf heures.",
      },
      {
        id: 2,
        speaker: "Mia",
        text: "Ouch. Did you make it?",
        translation: "Aïe. T'as réussi ?",
      },
      {
        id: 3,
        speaker: "Leo",
        text: "Barely. Then my laptop crashed, so I ended up rewriting half of it.",
        translation:
          "Tout juste. Ensuite mon ordi a planté, du coup j'ai fini par en réécrire la moitié.",
      },
      {
        id: 4,
        speaker: "Mia",
        text: "Oh no. So the day was a disaster?",
        translation: "Oh non. Donc la journée a été un désastre ?",
      },
      {
        id: 5,
        speaker: "Leo",
        text: "Actually, it was pretty good in the end. The client loved it, and I'm glad I pushed through.",
        translation:
          "En fait, c'était plutôt bien au final. Le client a adoré, et je suis content de m'être accroché.",
      },
    ],
    expectedIdeas: [
      "Leo s'est levé tôt pour finir un rapport avant 9 h.",
      "Son ordinateur a planté et il a dû réécrire la moitié du rapport.",
      "Au final le client a adoré et il est content de s'être accroché.",
    ],
    quickChoices: [
      "Quelqu'un raconte sa journée difficile mais réussie",
      "Quelqu'un annonce qu'il a perdu son travail",
      "Deux collègues préparent une présentation",
    ],
    questions: [
      {
        id: "td-q1",
        question: "Pourquoi Leo s'est-il levé tôt ?",
        options: [
          "Pour aller à la salle de sport",
          "Pour finir un rapport avant 9 h",
          "Pour prendre un avion",
        ],
        correctIndex: 1,
        explanation:
          "« I had to finish a report before nine » — « I had to » = « je devais ».",
      },
      {
        id: "td-q2",
        question: "Que veut dire « I ended up rewriting half of it » ?",
        options: [
          "J'ai arrêté d'écrire",
          "J'ai fini par en réécrire la moitié",
          "J'ai rendu la moitié du rapport",
        ],
        correctIndex: 1,
        explanation:
          "« To end up doing » = finir par faire (souvent pas comme prévu). Bloc en or pour raconter.",
      },
      {
        id: "td-q3",
        question: "Comment la journée se termine-t-elle ?",
        options: [
          "Le client a détesté le rapport",
          "Le client a adoré",
          "Le rapport n'a pas été rendu",
        ],
        correctIndex: 1,
        explanation:
          "« The client loved it » — et « I'm glad I pushed through » = content de ne pas avoir lâché.",
      },
    ],
    decodeNotes: [
      {
        line: "I woke up early.",
        translation: "Je me suis levé(e) tôt.",
        explanation:
          "« Wake up » = se réveiller. Le point de départ de 90 % des récits de journée.",
        chunk: "I woke up early",
      },
      {
        line: "I had to finish a report.",
        translation: "Je devais finir un rapport.",
        explanation:
          "« I had to… » = « j'ai dû / je devais ». LE bloc pour raconter une obligation passée.",
        chunk: "I had to…",
      },
      {
        line: "I ended up rewriting half of it.",
        translation: "J'ai fini par en réécrire la moitié.",
        explanation:
          "« I ended up + -ing » = « j'ai fini par… ». Parfait pour les plans qui déraillent.",
        chunk: "I ended up…",
      },
      {
        line: "It was pretty good in the end.",
        translation: "C'était plutôt bien au final.",
        explanation:
          "« It was pretty… » + adjectif : la structure la plus simple pour donner ton ressenti.",
        chunk: "It was pretty…",
      },
      {
        line: "I'm glad I pushed through.",
        translation: "Je suis content de m'être accroché.",
        explanation:
          "« I'm glad I… » = « je suis content d'avoir… ». Termine un récit sur une note positive.",
        chunk: "I'm glad I…",
      },
    ],
    phrases: [
      {
        id: "p-i-woke-up-early",
        english: "I woke up early",
        french: "Je me suis levé(e) tôt",
        example: "I woke up early to catch the sunrise.",
        context: "Démarre naturellement le récit d'une journée.",
        category: "everyday",
        roomId: "telling-your-day",
      },
      {
        id: "p-i-had-to",
        english: "I had to…",
        french: "J'ai dû… / je devais…",
        example: "I had to take the car to the garage.",
        context: "Raconte une obligation passée sans te tordre le cerveau.",
        category: "everyday",
        roomId: "telling-your-day",
      },
      {
        id: "p-i-ended-up",
        english: "I ended up…",
        french: "J'ai fini par…",
        example: "We ended up staying until midnight.",
        context: "Pour les plans qui ne se passent pas comme prévu.",
        category: "everyday",
        roomId: "telling-your-day",
      },
      {
        id: "p-it-was-pretty",
        english: "It was pretty…",
        french: "C'était plutôt…",
        example: "It was pretty intense, but fun.",
        context: "Donne ton ressenti avec n'importe quel adjectif.",
        category: "everyday",
        roomId: "telling-your-day",
      },
      {
        id: "p-im-glad-i",
        english: "I'm glad I…",
        french: "Je suis content(e) d'avoir…",
        example: "I'm glad I came, it was a great night.",
        context: "Conclut ton récit sur une note positive.",
        category: "everyday",
        roomId: "telling-your-day",
      },
    ],
    speakBack: {
      situation:
        "Un ami te demande comment s'est passée ta journée. Raconte-la en 2-3 phrases, avec un début et une fin.",
      heard: "Hey! How was your day?",
      suggestedAnswers: [
        "Pretty good! I woke up early, I had to run some errands, but I ended up relaxing all afternoon.",
        "Long day! I had to work late, but I'm glad I finished everything.",
        "Not too bad. It was pretty quiet, actually. What about you?",
      ],
    },
    shadowingLineIds: [1, 3, 5],
  },

  {
    id: "quick-reactions",
    title: "Quick Reactions",
    subtitle: "Réagir en une seconde : surprise, accord, compassion",
    emoji: "🎯",
    level: "A2",
    levelLabel: "A2/B1",
    duration: 7,
    accent: "Mixed",
    goal: "Avoir une réaction naturelle prête pour chaque type de nouvelle.",
    focus: "Réflexes instantanés",
    category: "social",
    free: false,
    dialogue: [
      {
        id: 0,
        speaker: "Ella",
        text: "Guess what? I got the job!",
        translation: "Devine quoi ? J'ai eu le poste !",
      },
      {
        id: 1,
        speaker: "Ben",
        text: "No way! That's amazing, congrats!",
        translation: "Non, sérieux ?! C'est génial, félicitations !",
      },
      {
        id: 2,
        speaker: "Ella",
        text: "Thanks! But it means I'm moving to Dublin next month.",
        translation:
          "Merci ! Mais du coup je déménage à Dublin le mois prochain.",
      },
      {
        id: 3,
        speaker: "Ben",
        text: "Oh wow, that's huge. Are you excited?",
        translation: "Oh waouh, c'est énorme. T'es contente ?",
      },
      {
        id: 4,
        speaker: "Ella",
        text: "Excited and terrified at the same time, honestly.",
        translation:
          "Contente et terrifiée en même temps, honnêtement.",
      },
      {
        id: 5,
        speaker: "Ben",
        text: "That makes sense. You're gonna crush it, though.",
        translation:
          "C'est normal. Mais tu vas tout déchirer, c'est sûr.",
      },
    ],
    expectedIdeas: [
      "Ella annonce qu'elle a décroché le poste.",
      "Elle déménage à Dublin le mois prochain.",
      "Elle est à la fois excitée et terrifiée ; Ben l'encourage.",
    ],
    quickChoices: [
      "Quelqu'un annonce une grande nouvelle à un ami",
      "Deux amis planifient des vacances à Dublin",
      "Quelqu'un annonce qu'il quitte son travail",
    ],
    questions: [
      {
        id: "qr-q1",
        question: "Que veut dire « No way! » ici ?",
        options: [
          "Hors de question",
          "Non, sérieux ?! (surprise)",
          "Il n'y a pas de chemin",
        ],
        correctIndex: 1,
        explanation:
          "Selon le ton, « no way » = refus OU surprise. Ici c'est la surprise enthousiaste.",
      },
      {
        id: "qr-q2",
        question: "Quelle est la grande nouvelle d'Ella ?",
        options: [
          "Elle se marie",
          "Elle a eu le poste et déménage à Dublin",
          "Elle a gagné un voyage",
        ],
        correctIndex: 1,
        explanation:
          "« I got the job » + « I'm moving to Dublin next month ».",
      },
      {
        id: "qr-q3",
        question: "Que veut dire « you're gonna crush it » ?",
        options: [
          "Tu vas tout casser (échouer)",
          "Tu vas tout déchirer (réussir)",
          "Tu vas être écrasée de travail",
        ],
        correctIndex: 1,
        explanation:
          "« To crush it » = cartonner, tout déchirer. 100 % positif, très courant.",
      },
    ],
    decodeNotes: [
      {
        line: "Guess what?",
        translation: "Devine quoi ?",
        explanation:
          "Annonce qu'une nouvelle arrive. Tu n'es pas obligé de deviner — réponds juste « what? ».",
        chunk: "Guess what?",
      },
      {
        line: "No way!",
        translation: "Non, sérieux ?!",
        explanation:
          "LA réaction de surprise. Variantes : « for real? », « seriously? », « you're kidding! ».",
        chunk: "No way!",
      },
      {
        line: "That's amazing, congrats!",
        translation: "C'est génial, félicitations !",
        explanation:
          "« Congrats » = « congratulations » raccourci. Toujours apprécié, jamais trop.",
        chunk: "Congrats!",
      },
      {
        line: "That's huge.",
        translation: "C'est énorme.",
        explanation:
          "Pour une nouvelle importante. « Huge » marche pour le bon comme pour l'impressionnant.",
        chunk: "That's huge",
      },
      {
        line: "You're gonna crush it.",
        translation: "Tu vas tout déchirer.",
        explanation:
          "Encouragement moderne. Variante : « you got this » = « tu gères ».",
        chunk: "You're gonna crush it",
      },
    ],
    phrases: [
      {
        id: "p-guess-what",
        english: "Guess what?",
        french: "Devine quoi ?",
        example: "Guess what? We're going to Japan!",
        context: "Lance une annonce. Réponse attendue : « what?! »",
        category: "social",
        roomId: "quick-reactions",
      },
      {
        id: "p-no-way",
        english: "No way!",
        french: "Non, sérieux ?!",
        example: "“I met Beyoncé.” — “No way!”",
        context: "Réaction de surprise universelle.",
        category: "social",
        roomId: "quick-reactions",
      },
      {
        id: "p-congrats",
        english: "Congrats!",
        french: "Félicitations !",
        example: "You passed? Congrats!",
        context: "Version courte et chaleureuse de « congratulations ».",
        category: "social",
        roomId: "quick-reactions",
      },
      {
        id: "p-thats-huge",
        english: "That's huge",
        french: "C'est énorme",
        example: "A promotion? That's huge!",
        context: "Souligne l'importance d'une nouvelle.",
        category: "social",
        roomId: "quick-reactions",
      },
      {
        id: "p-you-got-this",
        english: "You got this",
        french: "Tu gères / tu vas y arriver",
        example: "Don't stress the interview — you got this.",
        context: "Encouragement court avant un défi.",
        category: "social",
        roomId: "quick-reactions",
      },
    ],
    speakBack: {
      situation:
        "Ta collègue t'annonce une super nouvelle : elle a réussi son examen. Réagis avec enthousiasme.",
      heard: "Guess what? I passed my exam!",
      suggestedAnswers: [
        "No way! Congrats, that's amazing!",
        "That's huge! I knew you'd crush it.",
        "Seriously? Congrats! We have to celebrate.",
      ],
    },
    shadowingLineIds: [1, 3, 5],
  },
];

export function getRoomById(id: string): Room | undefined {
  return rooms.find((room) => room.id === id);
}

/** Room du jour : rotation déterministe selon la date, en sautant les rooms terminées si possible. */
export function getTodayRoom(completedIds: string[], dayOffset = 0): Room {
  const remaining = rooms.filter((room) => !completedIds.includes(room.id));
  const pool = remaining.length > 0 ? remaining : rooms;
  const dayIndex = Math.floor(Date.now() / 86_400_000) + dayOffset;
  return pool[dayIndex % pool.length];
}
