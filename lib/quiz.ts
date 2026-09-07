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

/**
 * Résumé des réponses, prêt à être envoyé.
 *
 * C’est le seul moyen pour lui de savoir ce qu’elle a répondu : sans
 * backend, rien ne quitte son téléphone tant qu’elle ne l’envoie pas
 * elle-même. Rien n’est collecté à son insu.
 */
export function buildRecap(answers: Record<string, string>): string[] {
  const lignes: string[] = [];

  for (const beat of story) {
    if (beat.kind !== "question") continue;
    const chosenId = answers[beat.id];
    if (!chosenId) continue;
    const chosen = beat.answers.find((a) => a.id === chosenId);
    if (!chosen) continue;
    lignes.push(
      `${personalize(beat.question)}\n→ ${chosen.emoji ? `${chosen.emoji} ` : ""}${personalize(chosen.text)}`,
    );
  }

  return lignes;
}

/** Lien WhatsApp pré-rempli avec le résumé. */
export function buildRecapUrl(answers: Record<string, string>): string {
  const entete = `Mes réponses ❤️ — pour ${quizConfig.boyfriendName}`;
  const corps = buildRecap(answers)
    .map((l, i) => `${i + 1}. ${l}`)
    .join("\n\n");
  const texte = `${entete}\n\n${corps}`;
  const destinataire = quizConfig.boyfriendPhone.replace(/\D/g, "");
  return `https://wa.me/${destinataire}?text=${encodeURIComponent(texte)}`;
}
