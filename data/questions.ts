/**
 * Les 10 questions du quiz.
 *
 * Tout se passe ici : pour ajouter, retirer ou réécrire une question,
 * il n’y a aucun composant à toucher. La barre de progression, les
 * réactions et l’écran final s’adaptent automatiquement au tableau.
 *
 * Jetons disponibles dans n’importe quel texte :
 *   {elle} → quizConfig.girlfriendName
 *   {moi}  → quizConfig.boyfriendName
 */

export interface Answer {
  /** Identifiant unique **au sein de la question**. */
  id: string;
  text: string;
  emoji?: string;
  /** Petite réaction affichée ~1 s après ce choix précis. */
  reaction?: string;
}

export interface Question {
  id: number;
  /** Étape émotionnelle, affichée discrètement au-dessus de la question. */
  theme: string;
  /**
   * `"yes-no"` affiche un duo OUI / NON dont le NON se dérobe.
   * `answers` doit alors contenir exactement deux réponses, le OUI d'abord.
   */
  mode?: "choice" | "yes-no";
  /** Libellé du OUI une fois que le NON a renoncé. */
  yesFinalText?: string;
  /**
   * Nombre d'esquives avant que le NON renonce. Défaut : 7.
   * Il augmente d'une question OUI/NON à la suivante — la plaisanterie
   * s'étire au fil du quiz au lieu de se répéter à l'identique.
   */
  evasiveAttempts?: number;
  /** Piques propres à cette question. À défaut, `evasiveTaunts` sert. */
  taunts?: string[];
  /** Mot de la fin propre à cette question. À défaut, `evasiveSurrender`. */
  surrenderMessage?: string;
  /** Phrase d’accroche facultative, au-dessus du thème. */
  intro?: string;
  question: string;
  answers: Answer[];
  /**
   * Réactions génériques tirées au sort si la réponse choisie
   * n’a pas la sienne. Absent = pas de réaction sur cette question.
   */
  reactions?: string[];
}

export const questions: Question[] = [
  {
    id: 1,
    theme: "Complicité",
    intro: "Prête, {elle} ? 😏",
    question: "Quand tu vois mon nom apparaître sur ton téléphone, tu…",
    answers: [
      {
        id: "a",
        emoji: "🥰",
        text: "Souris automatiquement",
        reaction: "Je savais que tu allais choisir ça 😏",
      },
      {
        id: "b",
        emoji: "😏",
        text: "Fais semblant de ne pas être contente",
        reaction: "Très mauvaise menteuse. Et tu le sais.",
      },
      {
        id: "c",
        emoji: "😂",
        text: "Attends quelques minutes avant de répondre",
        reaction: "Ah, la fameuse stratégie… 👀",
      },
      {
        id: "d",
        emoji: "❤️",
        text: "Te demandes quand je vais enfin t’appeler",
        reaction: "Note à moi-même : t’appeler beaucoup plus souvent.",
      },
    ],
  },
  {
    id: 2,
    theme: "Sourire",
    mode: "yes-no",
    question: "Avoue : je te fais sourire même quand tu essaies de résister ?",
    yesFinalText: "OUI, ÉVIDEMMENT",
    evasiveAttempts: 3,
    answers: [
      {
        id: "yes",
        emoji: "❤️",
        text: "OUI",
        reaction: "Je le savais. Tu es beaucoup trop facile à lire. 😌",
      },
      { id: "no", emoji: "😏", text: "NON" },
    ],
    taunts: [
      "Hmm… essaie encore 😏",
      "Tu pensais vraiment pouvoir cliquer dessus ? 😂",
      "Bon. On sait tous les deux ce que tu vas répondre.",
    ],
    surrenderMessage: "Voilà. C’était plus simple d’avouer 😌",
  },
  {
    id: 3,
    theme: "Tendresse",
    question: "Ta version préférée de nous deux, c’est…",
    answers: [
      { id: "a", emoji: "🛋️", text: "Un film, une couverture, zéro envie de bouger" },
      { id: "b", emoji: "🌙", text: "Parler jusqu’à des heures impossibles" },
      { id: "c", emoji: "🚶", text: "Marcher côte à côte sans rien dire" },
      { id: "d", emoji: "🍽️", text: "Un bon repas et rire beaucoup trop fort" },
    ],
    reactions: [
      "Tu viens de me faire sourire.",
      "Cette réponse me plaît beaucoup…",
      "Hum… intéressant 👀",
    ],
  },
  {
    id: 4,
    theme: "Sentiments",
    mode: "yes-no",
    question:
      "Il y a eu un moment précis où tu t’es dit « lui, il est différent ». Je me trompe ?",
    yesFinalText: "OUI, ÉVIDEMMENT",
    evasiveAttempts: 4,
    answers: [
      {
        id: "yes",
        emoji: "❤️",
        text: "OUI",
        reaction: "Un jour tu me diras lequel. J’attendrai le temps qu’il faudra.",
      },
      { id: "no", emoji: "😏", text: "NON" },
    ],
    taunts: [
      "Non ? Vraiment ? 👀",
      "Ce bouton n’a pas envie de te laisser mentir.",
      "Même ton téléphone est de mon côté 😌",
      "Allez. Dis-le.",
    ],
    surrenderMessage: "Tu vois. Tu le savais déjà 😌",
  },
  {
    id: 5,
    theme: "Séduction",
    question: "Qu’est-ce que tu préfères quand nous sommes tous les deux ?",
    answers: [
      { id: "a", emoji: "🫂", text: "Quand tu m’attires contre toi sans prévenir" },
      { id: "b", emoji: "👀", text: "Quand tu me regardes un peu trop longtemps" },
      { id: "c", emoji: "😏", text: "Ce que tu me dis tout bas, et à personne d’autre" },
      { id: "d", emoji: "🤍", text: "Tout. Vraiment tout." },
    ],
    reactions: [
      "On commence à devenir dangereux là 😏",
      "D’accord… continue.",
      "Tu joues avec le feu, {elle}. 👀",
    ],
  },
  {
    id: 6,
    theme: "Attraction",
    mode: "yes-no",
    intro: "Sois honnête. Personne ne regarde. 😌",
    question: "Est-ce que tu me trouves dangereusement attirant ?",
    yesFinalText: "OUI, ÉVIDEMMENT",
    evasiveAttempts: 5,
    answers: [
      {
        id: "yes",
        emoji: "❤️",
        text: "OUI",
        reaction: "Dangereusement. Retiens bien ce mot-là. 😏",
      },
      { id: "no", emoji: "😏", text: "NON" },
    ],
    taunts: [
      "Ah non, pas celui-là 😏",
      "Tu insistes… c’est déjà une réponse.",
      "Il court plus vite que ta mauvaise foi 😂",
      "Pourquoi tu t’acharnes autant ? 👀",
      "Tu veux vraiment dire non, là ?",
    ],
    surrenderMessage: "Il a abandonné. Comme toi, dans trois secondes 😏",
  },
  {
    id: 7,
    theme: "Souvenirs",
    question: "Quel moment avec moi tu aimerais revivre, là, maintenant ?",
    answers: [
      { id: "a", emoji: "🌅", text: "Notre premier vrai moment à deux" },
      { id: "b", emoji: "😂", text: "Ce fou rire dont on se souvient encore" },
      { id: "c", emoji: "🤍", text: "Le jour où tout est devenu évident" },
      {
        id: "d",
        emoji: "🌍",
        text: "Le prochain. Celui qu’on n’a pas encore vécu.",
        reaction: "Alors on va s’en occuper. Très bientôt.",
      },
    ],
    reactions: ["Je m’en souviens aussi, tu sais.", "Tu viens de me faire sourire."],
  },
  {
    id: 8,
    theme: "Émotions",
    mode: "yes-no",
    question:
      "Si je venais te chercher maintenant pour passer la soirée avec toi… tu dirais oui ?",
    yesFinalText: "OUI, ÉVIDEMMENT",
    evasiveAttempts: 6,
    answers: [
      {
        id: "yes",
        emoji: "❤️",
        text: "OUI",
        reaction: "Alors prépare-toi. Je ne plaisantais pas. 😌",
      },
      { id: "no", emoji: "😏", text: "NON" },
    ],
    taunts: [
      "Trop lent 😏",
      "Tu pensais vraiment pouvoir cliquer dessus ? 😂",
      "Même ton téléphone est de mon côté 😌",
      "Il commence à s’amuser, là.",
      "Pourquoi tu insistes autant ? 👀",
      "Bon… tu veux vraiment dire NON ? 😏❤️",
    ],
    surrenderMessage: "Ce bouton n’a jamais eu la moindre chance 😌",
  },
  {
    id: 9,
    theme: "Question piège",
    intro: "Attention. 👀",
    question: "Entre nous deux, qui tient le plus à l’autre ?",
    answers: [
      {
        id: "a",
        emoji: "☝️",
        text: "Moi, évidemment",
        reaction: "Alors là, on va devoir en discuter sérieusement. 👀",
      },
      {
        id: "b",
        emoji: "😏",
        text: "Toi, clairement",
        reaction: "Faux. Mais je te laisse gagner celle-là. 😏",
      },
      {
        id: "c",
        emoji: "⚖️",
        text: "Match nul. On est aussi accros l’un que l’autre.",
        reaction: "Match nul accepté. Provisoirement.",
      },
      {
        id: "d",
        emoji: "🙃",
        text: "Je refuse de répondre, c’est un piège",
        reaction: "Bien joué. C’en était un. 😏",
      },
    ],
  },
  {
    id: 10,
    theme: "La grande question",
    mode: "yes-no",
    intro: "Dernière question, {elle}.",
    yesFinalText: "OUI, ÉVIDEMMENT",
    evasiveAttempts: 7,
    question:
      "Après tout ce qu’on vient de parcourir… est-ce que tu réalises à quel point tu comptes pour moi ?",
    answers: [
      {
        id: "yes",
        emoji: "❤️",
        text: "OUI",
        reaction: "Alors je n’ai plus rien à ajouter. ❤️",
      },
      { id: "no", emoji: "😏", text: "NON" },
    ],
    taunts: [
      "Hmm… essaie encore 😏",
      "Tu pensais vraiment pouvoir cliquer dessus ? 😂",
      "Même ton téléphone est de mon côté 😌",
      "Pourquoi tu insistes autant ? 👀",
      "Bon… tu veux vraiment dire NON ? 😏❤️",
      "Tu sais très bien que ce n’est pas la vraie réponse.",
      "Dernière chance de dire la vérité 😌",
    ],
  },
];

/**
 * Les piques affichées au fil des tentatives sur le bouton NON.
 * La dernière sert aussi quand il y a plus de tentatives que de messages.
 */
export const evasiveTaunts: string[] = [
  "Hmm… essaie encore 😏",
  "Tu pensais vraiment pouvoir cliquer dessus ? 😂",
  "Même ton téléphone est de mon côté 😌",
  "Pourquoi tu insistes autant ? 👀",
  "Bon… tu veux vraiment dire NON ? 😏❤️",
];

/** Le mot de la fin, une fois que le bouton NON a renoncé. */
export const evasiveSurrender =
  "Bon… j’ai compris. Tu n’avais pas vraiment envie de dire non 😌❤️";
