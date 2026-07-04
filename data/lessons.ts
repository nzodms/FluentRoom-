import type { Lesson, Phrase } from "@/types/learning";
import { rooms } from "./rooms";

const roomPhrases = rooms.flatMap((room) => room.phrases);

/** Réutilise la phrase existante d'une room quand la structure y est déjà. */
function fromRoom(id: string): Phrase {
  const phrase = roomPhrases.find((p) => p.id === id);
  if (!phrase) throw new Error(`Phrase introuvable : ${id}`);
  return phrase;
}

/**
 * 12 mini-leçons écrites : les structures les plus rentables de l'anglais
 * parlé. Chaque leçon ajoute sa structure à la Phrase Bank.
 */
export const lessons: Lesson[] = [
  {
    id: "trying-to",
    structure: "I'm trying to…",
    title: "Expliquer ce que tu essaies de faire",
    emoji: "🎯",
    objective: "Dire ce que tu es en train d'essayer de faire, sans chercher tes mots.",
    explanation:
      "« I'm trying to » + verbe = « j'essaie de… ». C'est LA structure pour demander de l'aide ou expliquer ta situation. Les natifs l'utilisent en ouverture de phrase, avant même de dire bonjour parfois.",
    examples: [
      { english: "I'm trying to understand.", french: "J'essaie de comprendre." },
      { english: "I'm trying to find my phone.", french: "J'essaie de retrouver mon téléphone." },
      { english: "I'm trying to improve my English.", french: "J'essaie d'améliorer mon anglais." },
      { english: "I'm trying to save money.", french: "J'essaie de mettre de l'argent de côté." },
      { english: "I'm trying to sleep!", french: "J'essaie de dormir !" },
      { english: "We're trying to decide.", french: "On essaie de se décider." },
    ],
    commonMistake: {
      wrong: "I try to call you since one hour.",
      right: "I've been trying to call you for an hour.",
      note: "Pour une action en cours, l'anglais veut la forme en -ing. « I try » = habitude générale, pas ce que tu fais maintenant.",
    },
    quiz: [
      {
        id: "lt-q1",
        question: "Tu galères à ouvrir une porte. Tu dis :",
        options: [
          "I try to open the door.",
          "I'm trying to open the door.",
          "I will try open the door.",
        ],
        correctIndex: 1,
        explanation: "Action en cours = forme en -ing : « I'm trying to… ».",
      },
      {
        id: "lt-q2",
        question: "« I'm trying to reach him » veut dire :",
        options: [
          "J'essaie de le joindre",
          "J'essaie de l'éviter",
          "Je vais le rejoindre",
        ],
        correctIndex: 0,
        explanation: "« To reach someone » = joindre quelqu'un (téléphone, message).",
      },
    ],
    build: {
      prompt: "« J'essaie de trouver la gare. »",
      words: ["I'm", "trying", "to", "find", "the", "station"],
      answer: "I'm trying to find the station",
    },
    shadowLine: "I'm trying to improve my English.",
    phrase: fromRoom("p-im-trying-to"),
  },
  {
    id: "used-to",
    structure: "I used to…",
    title: "Parler d'une ancienne habitude",
    emoji: "⏪",
    objective: "Raconter ce que tu faisais avant, en une structure toute prête.",
    explanation:
      "« I used to » + verbe = « avant, je… » / « j'avais l'habitude de… ». Ça implique automatiquement que ce n'est plus le cas — pas besoin d'ajouter « but not anymore ».",
    examples: [
      { english: "I used to live here.", french: "Avant, j'habitais ici." },
      { english: "I used to watch this show.", french: "Avant, je regardais cette série." },
      { english: "I used to be shy.", french: "Avant, j'étais timide." },
      { english: "We used to talk every day.", french: "Avant, on se parlait tous les jours." },
      { english: "I used to hate coffee.", french: "Avant, je détestais le café." },
    ],
    commonMistake: {
      wrong: "I use to play football when I was young.",
      right: "I used to play football when I was young.",
      note: "Toujours « used » avec un D au passé. « I use to » n'existe pas — c'est l'erreur n°1 même chez les natifs à l'écrit.",
    },
    quiz: [
      {
        id: "lu-q1",
        question: "« I used to be shy » implique que :",
        options: [
          "Je suis toujours timide",
          "Je ne suis plus timide",
          "Je serai timide",
        ],
        correctIndex: 1,
        explanation: "« Used to » = c'était vrai avant, ça ne l'est plus.",
      },
      {
        id: "lu-q2",
        question: "Comment dire « Avant, on sortait beaucoup » ?",
        options: [
          "We use to go out a lot.",
          "We used to go out a lot.",
          "We were used to go out a lot.",
        ],
        correctIndex: 1,
        explanation: "« Used to » + verbe, avec le D.",
      },
    ],
    build: {
      prompt: "« Avant, j'habitais à Paris. »",
      words: ["I", "used", "to", "live", "in", "Paris"],
      answer: "I used to live in Paris",
    },
    shadowLine: "I used to be shy, but not anymore.",
    phrase: {
      id: "p-i-used-to",
      english: "I used to…",
      french: "Avant, je… / j'avais l'habitude de…",
      example: "I used to live here.",
      context: "Raconte une ancienne habitude — implique que c'est fini.",
      category: "everyday",
      roomId: "lesson:used-to",
    },
  },
  {
    id: "about-to",
    structure: "I'm about to…",
    title: "Dire que tu vas le faire, là, maintenant",
    emoji: "🚀",
    objective: "Annoncer une action imminente sans te compliquer la vie.",
    explanation:
      "« I'm about to » + verbe = « je suis sur le point de… ». Plus immédiat que « I'm going to ». Si tu es à deux secondes de le faire, c'est « about to ».",
    examples: [
      { english: "I'm about to leave.", french: "Je suis sur le point de partir." },
      { english: "I'm about to call him.", french: "J'allais justement l'appeler." },
      { english: "I'm about to start.", french: "Je commence dans une seconde." },
      { english: "The movie is about to start.", french: "Le film va commencer." },
      { english: "I was about to say that!", french: "J'allais justement dire ça !" },
    ],
    commonMistake: {
      wrong: "I'm about leaving.",
      right: "I'm about to leave.",
      note: "Toujours « about TO » + verbe à l'infinitif. Jamais de -ing après « about » dans cette structure.",
    },
    quiz: [
      {
        id: "la-q1",
        question: "Ton ami t'appelle pile quand tu allais lui écrire. Tu dis :",
        options: [
          "I was about to text you!",
          "I'm about texting you!",
          "I will about to text you!",
        ],
        correctIndex: 0,
        explanation: "« I was about to… » = j'allais justement… Effet garanti en conversation.",
      },
      {
        id: "la-q2",
        question: "« The train is about to leave » signifie :",
        options: [
          "Le train vient de partir",
          "Le train va partir d'une seconde à l'autre",
          "Le train est en retard",
        ],
        correctIndex: 1,
        explanation: "Imminence totale : cours si tu veux le prendre.",
      },
    ],
    build: {
      prompt: "« Je suis sur le point de partir. »",
      words: ["I'm", "about", "to", "leave"],
      answer: "I'm about to leave",
    },
    shadowLine: "Hurry up, the movie is about to start!",
    phrase: {
      id: "p-im-about-to",
      english: "I'm about to…",
      french: "Je suis sur le point de…",
      example: "I'm about to leave, can I call you back?",
      context: "Action imminente. « I was about to… » = j'allais justement…",
      category: "everyday",
      roomId: "lesson:about-to",
    },
  },
  {
    id: "feel-like",
    structure: "I feel like…",
    title: "Donner ton avis en douceur",
    emoji: "💭",
    objective: "Exprimer une impression ou une envie sans être catégorique.",
    explanation:
      "Deux usages en or : « I feel like + phrase » = « j'ai l'impression que… », et « I feel like + -ing » = « j'ai envie de… ». Les natifs commencent la moitié de leurs opinions comme ça.",
    examples: [
      { english: "I feel like it's too expensive.", french: "J'ai l'impression que c'est trop cher." },
      { english: "I feel like we should wait.", french: "Je pense qu'on devrait attendre." },
      { english: "I feel like I'm improving.", french: "J'ai l'impression de progresser." },
      { english: "I feel like eating pizza.", french: "J'ai envie de pizza." },
      { english: "I don't feel like going out.", french: "Je n'ai pas envie de sortir." },
    ],
    commonMistake: {
      wrong: "I have envy to go out.",
      right: "I feel like going out.",
      note: "« Envy » = la jalousie, pas l'envie ! Pour « avoir envie de », utilise « I feel like + -ing » ou « I want to ».",
    },
    quiz: [
      {
        id: "lf-q1",
        question: "« I don't feel like cooking tonight » veut dire :",
        options: [
          "Je ne sais pas cuisiner",
          "Je n'ai pas envie de cuisiner ce soir",
          "Je ne sens pas la cuisine",
        ],
        correctIndex: 1,
        explanation: "« I don't feel like + -ing » = je n'ai pas envie de…",
      },
      {
        id: "lf-q2",
        question: "Comment dire « J'ai l'impression qu'il est fatigué » ?",
        options: [
          "I feel like he's tired.",
          "I feel him tired.",
          "I'm feeling that he tired.",
        ],
        correctIndex: 0,
        explanation: "« I feel like » + phrase complète. Simple et naturel.",
      },
    ],
    build: {
      prompt: "« J'ai l'impression de progresser. »",
      words: ["I", "feel", "like", "I'm", "improving"],
      answer: "I feel like I'm improving",
    },
    shadowLine: "I feel like we should wait a bit.",
    phrase: fromRoom("p-i-feel-like"),
  },
  {
    id: "it-depends",
    structure: "It depends…",
    title: "Répondre sans être catégorique",
    emoji: "⚖️",
    objective: "Gagner du temps et nuancer, comme un natif.",
    explanation:
      "« It depends » tout seul suffit. Pour préciser, c'est « it depends ON » quelque chose — jamais « of ». C'est la réponse qui te sauve quand tu n'as pas d'avis tranché.",
    examples: [
      { english: "It depends on the price.", french: "Ça dépend du prix." },
      { english: "It depends on what you want.", french: "Ça dépend de ce que tu veux." },
      { english: "It depends on the weather.", french: "Ça dépend du temps." },
      { english: "“Are you coming?” — “It depends.”", french: "« Tu viens ? » — « Ça dépend. »" },
      { english: "It depends on how you look at it.", french: "Ça dépend comment tu vois les choses." },
    ],
    commonMistake: {
      wrong: "It depends of the weather.",
      right: "It depends on the weather.",
      note: "Piège classique du francophone : « dépendre DE » devient « depend ON » en anglais. Toujours ON.",
    },
    quiz: [
      {
        id: "ld-q1",
        question: "Complète : « It depends ___ the traffic. »",
        options: ["of", "on", "from"],
        correctIndex: 1,
        explanation: "« Depend on », toujours. Grave ça une bonne fois pour toutes.",
      },
      {
        id: "ld-q2",
        question: "On te demande si tu préfères la mer ou la montagne. Réponse nuancée :",
        options: [
          "It depends on the season.",
          "Yes.",
          "I depend on the season.",
        ],
        correctIndex: 0,
        explanation: "« It depends on… » + le critère. Réponse parfaite.",
      },
    ],
    build: {
      prompt: "« Ça dépend du prix. »",
      words: ["It", "depends", "on", "the", "price"],
      answer: "It depends on the price",
    },
    shadowLine: "Honestly, it depends on the price.",
    phrase: fromRoom("p-it-depends"),
  },
  {
    id: "didnt-mean-to",
    structure: "I didn't mean to…",
    title: "Dire que tu n'as pas fait exprès",
    emoji: "🙏",
    objective: "T'excuser proprement quand tu as gaffé.",
    explanation:
      "« I didn't mean to » + verbe = « je ne voulais pas… / je n'ai pas fait exprès de… ». Indispensable pour désamorcer un malentendu. Souvent prononcé « I didn' mean-uh ».",
    examples: [
      { english: "I didn't mean to hurt you.", french: "Je ne voulais pas te blesser." },
      { english: "I didn't mean to be rude.", french: "Je ne voulais pas être impoli." },
      { english: "I didn't mean to say that.", french: "Je n'avais pas l'intention de dire ça." },
      { english: "Sorry, I didn't mean to interrupt.", french: "Pardon, je ne voulais pas interrompre." },
      { english: "I didn't mean it!", french: "Je ne le pensais pas !" },
    ],
    commonMistake: {
      wrong: "I didn't want to hurt you, it was not exprès.",
      right: "I didn't mean to hurt you.",
      note: "« Faire exprès » n'a pas de traduction directe. Le réflexe natif, c'est « mean to ». Et « on purpose » = exprès (« I didn't do it on purpose »).",
    },
    quiz: [
      {
        id: "lm-q1",
        question: "Tu bouscules quelqu'un dans le métro. Tu dis :",
        options: [
          "Sorry, I didn't mean to push you.",
          "Sorry, it was not my faith.",
          "Sorry, I didn't want push.",
        ],
        correctIndex: 0,
        explanation: "« I didn't mean to… » = je n'ai pas fait exprès de…",
      },
      {
        id: "lm-q2",
        question: "« I didn't mean it » veut dire :",
        options: [
          "Je ne l'ai pas fait",
          "Je ne le pensais pas",
          "Je ne comprends pas",
        ],
        correctIndex: 1,
        explanation: "Après des mots durs : « I didn't mean it » = ce n'était pas sincère.",
      },
    ],
    build: {
      prompt: "« Je ne voulais pas être impoli. »",
      words: ["I", "didn't", "mean", "to", "be", "rude"],
      answer: "I didn't mean to be rude",
    },
    shadowLine: "Sorry, I didn't mean to interrupt.",
    phrase: {
      id: "p-didnt-mean-to",
      english: "I didn't mean to…",
      french: "Je n'ai pas fait exprès de… / je ne voulais pas…",
      example: "Sorry, I didn't mean to interrupt.",
      context: "Désamorce un malentendu ou une gaffe en une phrase.",
      category: "problems",
      roomId: "lesson:didnt-mean-to",
    },
  },
  {
    id: "ended-up",
    structure: "I ended up…",
    title: "Raconter ce qui s'est finalement passé",
    emoji: "🌀",
    objective: "Conclure un récit quand le plan a changé en route.",
    explanation:
      "« I ended up » + -ing = « j'ai fini par… ». Parfait quand les choses ne se sont pas passées comme prévu. C'est le connecteur préféré des vlogs et des récits de soirée.",
    examples: [
      { english: "I ended up staying home.", french: "J'ai fini par rester à la maison." },
      { english: "I ended up buying it.", french: "J'ai fini par l'acheter." },
      { english: "I ended up talking to him.", french: "J'ai fini par lui parler." },
      { english: "We ended up walking for hours.", french: "On a fini par marcher pendant des heures." },
      { english: "It ended up being great.", french: "Au final, c'était génial." },
    ],
    commonMistake: {
      wrong: "Finally, I stayed home.",
      right: "I ended up staying home.",
      note: "« Finally » = enfin (après une attente), pas « finalement ». Pour « finalement / au final », les natifs disent « I ended up… » ou « in the end ».",
    },
    quiz: [
      {
        id: "le-q1",
        question: "Ton resto était fermé, vous avez mangé une pizza. Tu racontes :",
        options: [
          "We finally ate pizza.",
          "We ended up eating pizza.",
          "We ended to eat pizza.",
        ],
        correctIndex: 1,
        explanation: "« Ended up + -ing » : le plan a changé, voilà le résultat.",
      },
      {
        id: "le-q2",
        question: "« It ended up being great » veut dire :",
        options: [
          "C'est bientôt fini",
          "Au final, c'était génial",
          "Ça s'est mal fini",
        ],
        correctIndex: 1,
        explanation: "Souvent utilisé pour une bonne surprise après un plan bancal.",
      },
    ],
    build: {
      prompt: "« On a fini par rester à la maison. »",
      words: ["We", "ended", "up", "staying", "home"],
      answer: "We ended up staying home",
    },
    shadowLine: "We ended up staying until midnight.",
    phrase: fromRoom("p-i-ended-up"),
  },
  {
    id: "do-you-mind",
    structure: "Do you mind if…?",
    title: "Demander la permission poliment",
    emoji: "🚪",
    objective: "Demander quelque chose sans paraître brusque.",
    explanation:
      "« Do you mind if I…? » = « ça te dérange si je… ? ». Attention au piège : si la personne est d'accord, elle répond « no » (= non, ça ne me dérange pas) — pas « yes » !",
    examples: [
      { english: "Do you mind if I sit here?", french: "Ça vous dérange si je m'assieds ici ?" },
      { english: "Do you mind if I ask you something?", french: "Ça te dérange si je te demande un truc ?" },
      { english: "Do you mind if I call you later?", french: "Ça te dérange si je te rappelle plus tard ?" },
      { english: "Do you mind if I open the window?", french: "Ça vous dérange si j'ouvre la fenêtre ?" },
      { english: "“Do you mind?” — “Not at all.”", french: "« Ça vous dérange ? » — « Pas du tout. »" },
    ],
    commonMistake: {
      wrong: "— Do you mind if I sit here? — Yes, please!",
      right: "— Do you mind if I sit here? — No, go ahead!",
      note: "« Yes » = OUI ça me dérange. Pour accepter, dis « no », « not at all », ou « go ahead ». Le contresens classique.",
    },
    quiz: [
      {
        id: "lq-q1",
        question: "Quelqu'un demande « Do you mind if I sit here? ». Tu es d'accord. Tu réponds :",
        options: ["Yes!", "Not at all, go ahead.", "I mind."],
        correctIndex: 1,
        explanation: "« Not at all » = pas du tout (ça ne me dérange pas). « Yes » dirait l'inverse !",
      },
      {
        id: "lq-q2",
        question: "Comment demander poliment de poser une question ?",
        options: [
          "Do you mind if I ask you something?",
          "You mind I ask something?",
          "Do you mind to ask something?",
        ],
        correctIndex: 0,
        explanation: "« Do you mind if » + sujet + verbe. La formule complète.",
      },
    ],
    build: {
      prompt: "« Ça vous dérange si je m'assieds ici ? »",
      words: ["Do", "you", "mind", "if", "I", "sit", "here?"],
      answer: "Do you mind if I sit here?",
    },
    shadowLine: "Do you mind if I ask you something?",
    phrase: {
      id: "p-do-you-mind-if",
      english: "Do you mind if…?",
      french: "Ça te/vous dérange si… ?",
      example: "Do you mind if I sit here?",
      context: "Permission polie. Pour accepter : « not at all », jamais « yes ».",
      category: "social",
      roomId: "lesson:do-you-mind",
    },
  },
  {
    id: "not-sure",
    structure: "I'm not sure…",
    title: "Exprimer une hésitation sans bloquer",
    emoji: "🤔",
    objective: "Hésiter à voix haute au lieu de rester silencieux.",
    explanation:
      "« I'm not sure » se combine avec tout : « what to do », « if it's a good idea », « I understand ». C'est ta phrase-pont : elle te laisse réfléchir tout en continuant à parler.",
    examples: [
      { english: "I'm not sure what to do.", french: "Je ne sais pas trop quoi faire." },
      { english: "I'm not sure I understand.", french: "Je ne suis pas sûr de comprendre." },
      { english: "I'm not sure if it's a good idea.", french: "Je ne suis pas sûr que ce soit une bonne idée." },
      { english: "I'm not sure yet.", french: "Je ne sais pas encore." },
      { english: "I'm not sure about that.", french: "Ça, j'en suis pas si sûr." },
    ],
    commonMistake: {
      wrong: "I'm not sure to understand.",
      right: "I'm not sure I understand.",
      note: "Pas de « to » ici : « I'm not sure » + phrase complète (I'm not sure I understand / I'm not sure it works).",
    },
    quiz: [
      {
        id: "ln-q1",
        question: "Comment dire « Je ne suis pas sûr de comprendre » ?",
        options: [
          "I'm not sure to understand.",
          "I'm not sure I understand.",
          "I'm not sure for understand.",
        ],
        correctIndex: 1,
        explanation: "« I'm not sure » + sujet + verbe. Sans « to ».",
      },
      {
        id: "ln-q2",
        question: "« I'm not sure about that » exprime :",
        options: ["Un accord total", "Un doute poli", "Une colère"],
        correctIndex: 1,
        explanation: "Façon douce de dire « mouais, pas convaincu ».",
      },
    ],
    build: {
      prompt: "« Je ne sais pas trop quoi faire. »",
      words: ["I'm", "not", "sure", "what", "to", "do"],
      answer: "I'm not sure what to do",
    },
    shadowLine: "I'm not sure if it's a good idea.",
    phrase: fromRoom("p-im-not-sure"),
  },
  {
    id: "makes-sense",
    structure: "That makes sense",
    title: "Réagir comme un natif",
    emoji: "💡",
    objective: "Valider ce qu'on vient de te dire, en trois mots.",
    explanation:
      "« That makes sense » = « c'est logique / ça se tient ». La réaction n°1 en conversation ET en réunion. À l'inverse : « that doesn't make sense » = ça n'a pas de sens.",
    examples: [
      { english: "Yeah, that makes sense.", french: "Ouais, c'est logique." },
      { english: "It makes sense now.", french: "Maintenant je comprends." },
      { english: "That doesn't really make sense.", french: "Ça ne tient pas trop debout." },
      { english: "Makes sense!", french: "Logique !" },
      { english: "It makes sense to book early.", french: "C'est logique de réserver tôt." },
    ],
    commonMistake: {
      wrong: "It's logic!",
      right: "That makes sense!",
      note: "« It's logic » ne se dit pas. « Logical » existe mais les natifs disent « that makes sense » 95 % du temps.",
    },
    quiz: [
      {
        id: "lk-q1",
        question: "Ton collègue explique pourquoi il part tôt. Tu valides :",
        options: ["It's logic.", "That makes sense.", "You make sense to me."],
        correctIndex: 1,
        explanation: "« That makes sense » : validation naturelle et passe-partout.",
      },
      {
        id: "lk-q2",
        question: "« That doesn't make sense » veut dire :",
        options: [
          "Ça n'a pas de sens",
          "Ce n'est pas important",
          "Ça ne sent pas bon",
        ],
        correctIndex: 0,
        explanation: "Utile pour dire poliment que quelque chose cloche.",
      },
    ],
    build: {
      prompt: "« Maintenant, ça a du sens. »",
      words: ["It", "makes", "sense", "now"],
      answer: "It makes sense now",
    },
    shadowLine: "Yeah, that makes sense, actually.",
    phrase: fromRoom("p-that-makes-sense"),
  },
  {
    id: "i-guess",
    structure: "I guess…",
    title: "Répondre avec de la nuance",
    emoji: "🌗",
    objective: "Donner un accord mou ou une réponse prudente, très naturelle.",
    explanation:
      "« I guess » = « j'imagine / sans doute / bon, ok ». Il adoucit tout ce que tu dis. « I guess you're right » = t'as raison (même si ça me coûte de le dire). Souvent prononcé « I guess… » avec un petit soupir.",
    examples: [
      { english: "I guess you're right.", french: "J'imagine que t'as raison." },
      { english: "I guess we can try.", french: "On peut essayer, j'imagine." },
      { english: "I guess it depends.", french: "Ça dépend, j'imagine." },
      { english: "I guess so.", french: "Sans doute, oui." },
      { english: "I guess not.", french: "Non, j'imagine." },
    ],
    commonMistake: {
      wrong: "I think yes.",
      right: "I guess so. / I think so.",
      note: "Pour répondre « je pense que oui », c'est « I think so » ou « I guess so » — jamais « I think yes ».",
    },
    quiz: [
      {
        id: "lg-q1",
        question: "On te demande « Is he coming? ». Tu penses que oui, sans certitude :",
        options: ["I guess so.", "I think yes.", "Guess him coming."],
        correctIndex: 0,
        explanation: "« I guess so » = réponse prudente et naturelle.",
      },
      {
        id: "lg-q2",
        question: "« I guess you're right » exprime :",
        options: [
          "Un accord enthousiaste",
          "Un accord un peu à contrecœur",
          "Un désaccord",
        ],
        correctIndex: 1,
        explanation: "Tu concèdes le point — le « I guess » montre la petite réticence.",
      },
    ],
    build: {
      prompt: "« On peut essayer, j'imagine. »",
      words: ["I", "guess", "we", "can", "try"],
      answer: "I guess we can try",
    },
    shadowLine: "I guess you're right.",
    phrase: {
      id: "p-i-guess",
      english: "I guess…",
      french: "J'imagine… / sans doute…",
      example: "I guess we can try.",
      context: "Adoucit une réponse. « I guess so » = je pense que oui.",
      category: "opinions",
      roomId: "lesson:i-guess",
    },
  },
  {
    id: "let-me-know",
    structure: "Let me know…",
    title: "Demander un retour naturellement",
    emoji: "📬",
    objective: "Clôturer un message ou un plan en gardant le lien.",
    explanation:
      "« Let me know » = « tiens-moi au courant / dis-moi ». C'est la phrase de fin de message par excellence : plans, boulot, questions. Souvent réduit à « LMK » à l'écrit.",
    examples: [
      { english: "Let me know when you're ready.", french: "Dis-moi quand tu es prêt." },
      { english: "Let me know what you think.", french: "Dis-moi ce que tu en penses." },
      { english: "Let me know if you need help.", french: "Dis-moi si tu as besoin d'aide." },
      { english: "I'll let you know.", french: "Je te tiens au courant." },
      { english: "Just let me know!", french: "Tu me dis, c'est tout !" },
    ],
    commonMistake: {
      wrong: "Say me when you arrive.",
      right: "Let me know when you arrive.",
      note: "« Say me » n'existe pas. C'est « tell me » ou, plus naturel pour un suivi : « let me know ».",
    },
    quiz: [
      {
        id: "ll-q1",
        question: "Tu termines un message pour proposer ton aide :",
        options: [
          "Say me if you need help.",
          "Let me know if you need help.",
          "Know me if you need help.",
        ],
        correctIndex: 1,
        explanation: "« Let me know if… » : la clôture de message universelle.",
      },
      {
        id: "ll-q2",
        question: "« I'll let you know » veut dire :",
        options: [
          "Je te laisse partir",
          "Je te tiens au courant",
          "Je te connais bien",
        ],
        correctIndex: 1,
        explanation: "La réponse classique quand tu n'as pas encore décidé.",
      },
    ],
    build: {
      prompt: "« Dis-moi ce que tu en penses. »",
      words: ["Let", "me", "know", "what", "you", "think"],
      answer: "Let me know what you think",
    },
    shadowLine: "Let me know when you're ready.",
    phrase: fromRoom("p-let-me-know"),
  },
];

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === id);
}

/** Leçon du jour : rotation quotidienne, en sautant les leçons maîtrisées si possible. */
export function getTodayLesson(masteredIds: string[]): Lesson {
  const remaining = lessons.filter((l) => !masteredIds.includes(l.id));
  const pool = remaining.length > 0 ? remaining : lessons;
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  return pool[dayIndex % pool.length];
}

/** Phrases apportées par les leçons et absentes des rooms. */
export const lessonOnlyPhrases: Phrase[] = lessons
  .map((lesson) => lesson.phrase)
  .filter((phrase) => !roomPhrases.some((p) => p.id === phrase.id));
