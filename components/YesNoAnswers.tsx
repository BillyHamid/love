"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import EvasiveButton from "@/components/EvasiveButton";
import {
  evasiveSurrender,
  evasiveTaunts,
  type Answer,
  type Question,
} from "@/data/story";
import { personalize } from "@/lib/quiz";

interface YesNoAnswersProps {
  question: Question;
  isLocked: boolean;
  onSelect: (answer: Answer) => void;
}

/** Utilisé quand la question ne fixe pas son propre nombre d'esquives. */
const DEFAULT_MAX_ATTEMPTS = 7;

/**
 * Le duo OUI / NON, où le NON se dérobe.
 *
 * Les deux boutons vivent dans une zone de jeu à position relative : le NON
 * est placé en absolu et n'est déplacé que par des transformations, donc il
 * ne touche jamais au flux de la page — pas de scroll horizontal, pas de
 * barre de défilement, pas de hauteur qui bouge. Le OUI reste au même
 * endroit et toujours cliquable.
 */
export default function YesNoAnswers({ question, isLocked, onSelect }: YesNoAnswersProps) {
  const areaRef = useRef<HTMLDivElement | null>(null);
  const yesRef = useRef<HTMLButtonElement | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [hasSurrendered, setHasSurrendered] = useState(false);

  const [yes, no] = question.answers;
  if (!yes || !no) return null;

  const maxAttempts = question.evasiveAttempts ?? DEFAULT_MAX_ATTEMPTS;
  const taunts = question.taunts ?? evasiveTaunts;

  const yesLabel = hasSurrendered ? (question.yesFinalText ?? "OUI, ÉVIDEMMENT") : yes.text;

  const message = hasSurrendered
    ? (question.surrenderMessage ?? evasiveSurrender)
    : attempts > 0
      ? (taunts[Math.min(attempts, taunts.length) - 1] ?? null)
      : null;

  return (
    <div>
      {/*
        Hauteur proportionnelle à l'écran, bornée : sur un petit téléphone la
        carte entière doit tenir dans le viewport, sinon le bouton pourrait
        fuir dans une zone hors du champ visible.

        Pas d'`overflow-hidden` ici : il rognerait l'ombre du bouton OUI.
        Ce sont les bornes calculées dans EvasiveButton qui garantissent que
        le NON reste dans la zone, et `overflow-x: hidden` sur `body` qui
        interdit tout défilement horizontal.
      */}
      <div ref={areaRef} className="relative h-[clamp(9.5rem,30svh,17rem)]">
        <EvasiveButton
          label={`${no.emoji ?? ""} ${personalize(no.text)}`.trim()}
          // Il reste fuyant même une fois la réponse donnée : le rendre
          // soudain attrapable pendant la transition serait déroutant.
          // Un choix tardif est de toute façon ignoré par le QuizCard.
          evasive
          maxAttempts={maxAttempts}
          playAreaRef={areaRef}
          avoidRef={yesRef}
          onEscape={setAttempts}
          onSurrender={() => setHasSurrendered(true)}
          onClick={() => onSelect(no)}
          className="flex min-h-[3.25rem] items-center justify-center gap-2 rounded-2xl border border-line bg-white/85 px-6 text-[0.95rem] font-semibold text-ink shadow-soft"
        />

        <motion.button
          ref={yesRef}
          type="button"
          disabled={isLocked}
          onClick={() => onSelect(yes)}
          whileTap={isLocked ? undefined : { scale: 0.97 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute right-0 bottom-0 left-0 flex min-h-[3.5rem] touch-manipulation items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose to-rose-deep px-6 text-[1rem] font-semibold text-white shadow-[0_10px_30px_-8px_rgba(217,72,107,0.65)]"
        >
          {yes.emoji ? <span aria-hidden="true">{yes.emoji}</span> : null}
          {personalize(yesLabel)}
        </motion.button>
      </div>

      {/*
        Hauteur FIXE, pas seulement minimale : les piques tiennent sur une ou
        deux lignes selon la largeur, et une hauteur variable ferait bouger la
        page à chaque esquive.
      */}
      <div
        className="mt-3 flex h-11 items-center justify-center"
        aria-live="polite"
      >
        <AnimatePresence mode="wait">
          {message ? (
            <motion.p
              key={message}
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="text-center text-[0.9rem] leading-snug text-muted text-balance"
            >
              {personalize(message)}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
