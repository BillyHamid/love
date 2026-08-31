import { story, type Answer, type Beat, type Question } from "@/data/story";
import { quizConfig } from "@/lib/config";

export const TOTAL_BEATS = story.length;

/** Remplace les jetons `{elle}` / `{moi}` par les prénoms configurés. */
export function personalize(text: string): string {
  return text
    .split("{elle}")
    .join(quizConfig.girlfriendName)
    .split("{moi}")
    .join(quizConfig.boyfriendName);
}

export function getBeat(index: number): Beat | undefined {
  return story[index];
}

/** Progression en pourcentage, moment courant compris (index 0-indexé). */
export function progressPercent(index: number): number {
  if (TOTAL_BEATS === 0) return 0;
  const clamped = Math.min(Math.max(index + 1, 0), TOTAL_BEATS);
  return Math.round((clamped / TOTAL_BEATS) * 100);
}

/** Nombre de questions du récit — les scènes ne comptent pas. */
export const TOTAL_QUESTIONS = story.filter((beat) => beat.kind === "question").length;

function pickRandom<T>(items: readonly T[]): T | undefined {
  if (items.length === 0) return undefined;
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * Réaction à afficher après un choix :
 *   1. celle attachée à la réponse, sinon
 *   2. une réaction générique de la question tirée au sort, sinon
 *   3. rien — toutes les questions n’en ont pas, pour éviter la répétition.
 */
export function getReaction(question: Question, answer: Answer): string | null {
  const raw = answer.reaction ?? pickRandom(question.reactions ?? []);
  return raw ? personalize(raw) : null;
}
