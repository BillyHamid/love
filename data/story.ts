/**
 * L’histoire, du début à la fin.
 *
 * Tout est ici : les scènes narratives, les questions, les réactions, les
 * piques du bouton NON. Aucun texte n’est écrit en dur dans les composants,
 * et l’ordre du tableau est l’ordre du récit — déplacer une scène ou une
 * question suffit, la barre de progression suit.
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

interface BaseBeat {
  id: string;
  /** Acte auquel appartient ce moment, affiché en tête de carte. */
  act: string;
}

/** Un temps de récit : quelques lignes qui se posent, puis on continue. */
export interface Scene extends BaseBeat {
  kind: "scene";
  lines: string[];
  /** Libellé du bouton. Défaut : « Continuer ». */
  cta?: string;
}

export interface Question extends BaseBeat {
  kind: "question";
  /**
   * `"yes-no"` affiche un duo OUI / NON dont le NON se dérobe.
   * `answers` doit alors contenir exactement deux réponses, le OUI d’abord.
   */
  mode?: "choice" | "yes-no";
  /** Phrase d’accroche facultative, au-dessus de la question. */
  intro?: string;
  question: string;
  answers: Answer[];
  /**
   * Réactions génériques tirées au sort si la réponse choisie n’a pas la
   * sienne. Absent = pas de réaction sur cette question.
   */
  reactions?: string[];
  /** Libellé du OUI une fois que le NON a renoncé. */
  yesFinalText?: string;
  /**
   * Nombre d’esquives avant que le NON renonce. Défaut : 7.
   * Il augmente d’un acte à l’autre — la plaisanterie s’étire au fil du
   * récit au lieu de se répéter à l’identique.
   */
  evasiveAttempts?: number;
  /** Piques propres à cette question. À défaut, `evasiveTaunts` sert. */
  taunts?: string[];
  /** Mot de la fin propre à cette question. À défaut, `evasiveSurrender`. */
  surrenderMessage?: string;
}

export type Beat = Scene | Question;

const ACTE_I = "Acte I — Le début";
const ACTE_II = "Acte II — Ce que je remarque";
const ACTE_III = "Acte III — Plus près";
const ACTE_IV = "Acte IV — Ce qu’on a déjà";
const ACTE_V = "Acte V — La vérité";

export const story: Beat[] = [
  // ───────────────────────────── ACTE I ─────────────────────────────
  {
    id: "scene-1",
    act: ACTE_I,
    kind: "scene",
    lines: [
      "Il y a une chose que je n’ai jamais pris le temps de te dire correctement.",
      "Alors j’ai construit ça. Pour toi. Juste pour toi.",
      "Trois minutes. Une seule règle : sois honnête avec moi.",
    ],
    cta: "Je t’écoute ❤️",
  },
  {
    id: "q-nom",
    act: ACTE_I,
    kind: "question",
    intro: "Commençons doucement, {elle}.",
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
    id: "q-sourire",
    act: ACTE_I,
    kind: "question",
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

  // ───────────────────────────── ACTE II ────────────────────────────
  {
    id: "scene-2",
    act: ACTE_II,
    kind: "scene",
    lines: [
      "On dit qu’on finit toujours par s’habituer aux gens.",
      "Je n’ai jamais réussi à m’habituer à toi.",
      "Il y a toujours un détail qui me prend au dépourvu.",
    ],
  },
  {
    id: "q-nous",
    act: ACTE_II,
    kind: "question",
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
    id: "q-different",
    act: ACTE_II,
    kind: "question",
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

  // ──────────────────────────── ACTE III ────────────────────────────
  {
    id: "scene-3",
    act: ACTE_III,
    kind: "scene",
    lines: [
      "Bon. On va être honnêtes deux minutes.",
      "Il y a des choses que je pense très fort, et que je ne dis jamais à voix haute.",
      "Ce chapitre est pour celles-là. 😏",
    ],
    cta: "Je suis prête",
  },
  {
    id: "q-deux",
    act: ACTE_III,
    kind: "question",
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
    id: "q-attirant",
    act: ACTE_III,
    kind: "question",
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

  // ──────────────────────────── ACTE IV ─────────────────────────────
  {
    id: "scene-4",
    act: ACTE_IV,
    kind: "scene",
    lines: [
      "On a déjà une histoire, tu sais.",
      "Des fous rires, des soirées trop courtes, des silences confortables.",
      "Et une longue liste de choses qu’on n’a pas encore vécues.",
    ],
  },
  {
    id: "q-souvenir",
    act: ACTE_IV,
    kind: "question",
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
    id: "q-ce-soir",
    act: ACTE_IV,
    kind: "question",
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

  // ───────────────────────────── ACTE V ─────────────────────────────
  {
    id: "scene-5",
    act: ACTE_V,
    kind: "scene",
    lines: [
      "On y est.",
      "Tout ce qui précède n’était qu’un prétexte.",
      "Je voulais juste te garder un peu plus longtemps. 😌",
    ],
    cta: "Vas-y.",
  },
  {
    id: "q-piege",
    act: ACTE_V,
    kind: "question",
    intro: "Attention. Question piège. 👀",
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
    id: "q-finale",
    act: ACTE_V,
    kind: "question",
    mode: "yes-no",
    intro: "Dernière question, {elle}.",
    question:
      "Après tout ce qu’on vient de parcourir… est-ce que tu réalises à quel point tu comptes pour moi ?",
    yesFinalText: "OUI, ÉVIDEMMENT",
    evasiveAttempts: 7,
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

/** Piques par défaut, quand une question n’a pas les siennes. */
export const evasiveTaunts: string[] = [
  "Hmm… essaie encore 😏",
  "Tu pensais vraiment pouvoir cliquer dessus ? 😂",
  "Même ton téléphone est de mon côté 😌",
  "Pourquoi tu insistes autant ? 👀",
  "Bon… tu veux vraiment dire NON ? 😏❤️",
];

/** Le mot de la fin par défaut, une fois que le bouton NON a renoncé. */
export const evasiveSurrender =
  "Bon… j’ai compris. Tu n’avais pas vraiment envie de dire non 😌❤️";
