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
    question: "Qu’est-ce qui te fait le plus sourire chez moi ?",
    answers: [
      { id: "a", emoji: "😄", text: "Ta façon de me faire rire pour rien" },
      { id: "b", emoji: "🫠", text: "Ce regard quand tu prépares une bêtise" },
      { id: "c", emoji: "🤗", text: "Ta manière de me rassurer en deux mots" },
      { id: "d", emoji: "😌", text: "Le fait que tu sois là, tout simplement" },
    ],
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
    question: "Il y a eu un moment où tu t’es dit « lui, il est différent ». C’était…",
    answers: [
      { id: "a", emoji: "✨", text: "Dès le début, honnêtement" },
      { id: "b", emoji: "🕰️", text: "Petit à petit, sans m’en rendre compte" },
      { id: "c", emoji: "💬", text: "Le jour où tu m’as dit exactement ce qu’il fallait" },
      {
        id: "d",
        emoji: "🤫",
        text: "Ça, je le garde pour moi",
        reaction: "Tu crois vraiment que je vais laisser passer ça ? 😏",
      },
    ],
    reactions: ["Je note ça quelque part 😌", "Voilà une réponse que je garde."],
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
    intro: "Sois honnête. Personne ne regarde. 😌",
    question: "Ce qui t’attire vraiment chez moi, c’est…",
    answers: [
      { id: "a", emoji: "🧠", text: "Ta tête. Ta façon de penser." },
      { id: "b", emoji: "🎙️", text: "Ta voix" },
      { id: "c", emoji: "💪", text: "Tes bras. Disons-le." },
      {
        id: "d",
        emoji: "🔥",
        text: "Le fait que tu saches exactement ce que tu fais",
        reaction: "Ça, c’était la bonne réponse. 😏",
      },
    ],
    reactions: ["Cette réponse me plaît beaucoup…", "Intéressant. Très intéressant. 👀"],
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
    answers: [
      {
        id: "yes",
        emoji: "❤️",
        text: "OUI",
        reaction: "Alors prépare-toi. Je ne plaisantais pas. 😌",
      },
      { id: "no", emoji: "😏", text: "NON" },
    ],
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
    question:
      "Après tout ce qu’on vient de parcourir… est-ce que tu réalises à quel point tu comptes pour moi ?",
    answers: [
      { id: "yes", emoji: "❤️", text: "OUI" },
      { id: "no", emoji: "😏", text: "NON" },
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
