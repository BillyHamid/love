/**
 * ─────────────────────────────────────────────────────────────
 *  ❤️  LE SEUL FICHIER QUE TU AS BESOIN DE MODIFIER
 * ─────────────────────────────────────────────────────────────
 *  Change les prénoms, le message final et le texte de partage,
 *  puis redéploie. Rien d’autre à toucher.
 */
export const quizConfig = {
  /** Le prénom de ta copine. Apparaît à quelques moments choisis. */
  girlfriendName: "Audrey",

  /** Ton prénom à toi. */
  boyfriendName: "Billy",

  /**
   * Ton numéro WhatsApp, pour qu’elle t’envoie ses réponses en un tap.
   * Format international, sans « + » ni espaces : "22670123456".
   * Laissé vide, WhatsApp s’ouvre quand même et elle te choisit dans
   * sa liste de contacts — ça marche, c’est juste un tap de plus.
   */
  boyfriendPhone: "",

  /**
   * Le message personnel affiché tout à la fin, mot après mot.
   * Écris-le avec tes mots : c’est le cœur de l’expérience.
   * `{elle}` reprend le prénom ci-dessus — un seul endroit à changer.
   */
  finalMessage:
    "{elle}, derrière ce petit quiz se cache simplement une vérité : j’aime chaque moment passé avec toi et je suis heureux de t’avoir dans ma vie. ❤️",

  /** Message pré-rempli quand elle partage le quiz sur WhatsApp. */
  shareMessage:
    "J’ai terminé ton petit quiz ❤️ Maintenant c’est à ton tour 😏",

  /**
   * Photo de vous deux, à déposer dans `public/`.
   * Si le fichier n’existe pas, la carte photo disparaît simplement.
   */
  photoSrc: "/couple.jpg",

  /**
   * Musique d’ambiance, à déposer dans `public/`.
   * Elle ne démarre jamais toute seule : il faut cliquer sur 🎵.
   * Mets `null` pour retirer complètement le bouton musique.
   */
  musicSrc: "/music.mp3" as string | null,
} as const;

export type QuizConfig = typeof quizConfig;
