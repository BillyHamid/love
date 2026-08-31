import { questions, type Answer, type Question } from "@/data/questions";
import { quizConfig } from "@/lib/config";

export const TOTAL_QUESTIONS = questions.length;

/** Remplace les jetons `{elle}` / `{moi}` par les prénoms configurés. */
export function personalize(text: string): string {
  return text
    .split("{elle}")
    .join(quizConfig.girlfriendName)
    .split("{moi}")
    .join(quizConfig.boyfriendName);
}

export function getQuestion(index: number): Question | undefined {
  return questions[index];
}

/** Progression en pourcentage, question courante comprise (0-indexée). */
export function progressPercent(index: number): number {
  if (TOTAL_QUESTIONS === 0) return 0;
  const clamped = Math.min(Math.max(index + 1, 0), TOTAL_QUESTIONS);
  return Math.round((clamped / TOTAL_QUESTIONS) * 100);
}

function pickRandom<T>(items: readonly T[]): T | undefined {
  if (items.length === 0) return undefined;
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * Réaction à afficher après un choix :
 *   1. celle attachée à la réponse, sinon
 *   2. une réaction générique de la question tirée au sort, sinon
 *   3. rien — toutes les questions n'en ont pas, pour éviter la répétition.
 */
export function getReaction(question: Question, answer: Answer): string | null {
  const raw = answer.reaction ?? pickRandom(question.reactions ?? []);
  return raw ? personalize(raw) : null;
}

/** URL courante de l'application, sans le chemin interne (/quiz, /result…). */
export function getShareUrl(): string {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}${window.location.pathname.replace(
    /\/(quiz|result)\/?$/,
    "/",
  )}`;
}

export function buildWhatsAppUrl(url: string): string {
  const text = `${personalize(quizConfig.shareMessage)}\n${url}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
