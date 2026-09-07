"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Send } from "lucide-react";
import { buildRecap, buildRecapUrl, personalize } from "@/lib/quiz";
import { quizConfig } from "@/lib/config";
import type { AnswerMap } from "@/lib/quiz-store";

interface AnswersRecapProps {
  answers: AnswerMap;
}

/**
 * Le récapitulatif de ses réponses, et le bouton pour les lui envoyer.
 *
 * Sans backend, rien ne quitte son téléphone tant qu’elle n’appuie pas
 * elle-même : c’est elle qui décide d’envoyer, et elle voit exactement
 * ce qu’elle envoie.
 */
export default function AnswersRecap({ answers }: AnswersRecapProps) {
  const [isOpen, setIsOpen] = useState(false);
  const lignes = buildRecap(answers);

  if (lignes.length === 0) return null;

  return (
    <div>
      <p className="text-center font-display text-[1.15rem] leading-snug text-ink text-balance">
        Envoie-moi tes réponses, {personalize("{elle}")} 💌
      </p>
      <p className="mt-2 text-center text-[0.85rem] leading-relaxed text-muted text-balance">
        Je n’ai aucun moyen de les voir autrement — elles sont restées sur ton
        téléphone.
      </p>

      <motion.a
        href={buildRecapUrl(answers)}
        target="_blank"
        rel="noopener noreferrer"
        whileTap={{ scale: 0.97 }}
        className="mt-5 flex min-h-[3.5rem] w-full touch-manipulation items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose to-rose-deep px-6 text-[0.98rem] font-semibold text-white shadow-[0_10px_30px_-8px_rgba(217,72,107,0.65)]"
      >
        <Send className="size-4" aria-hidden="true" />
        Envoyer à {quizConfig.boyfriendName}
      </motion.a>

      {/* Elle doit pouvoir relire ce qu’elle envoie avant de l’envoyer. */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        className="mt-3 flex min-h-11 w-full touch-manipulation items-center justify-center gap-1.5 text-[0.85rem] font-medium text-muted transition-colors hover:text-rose"
      >
        {isOpen ? "Masquer mes réponses" : "Revoir mes réponses"}
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown className="size-4" aria-hidden="true" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.ol
            key="recap"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            {lignes.map((ligne, index) => {
              const [question, reponse] = ligne.split("\n");
              return (
                <li
                  key={question}
                  className={`border-line py-3 text-left ${index > 0 ? "border-t" : "mt-2 border-t"}`}
                >
                  <p className="text-[0.8rem] leading-snug text-muted">{question}</p>
                  <p className="mt-1 text-[0.9rem] leading-snug font-medium text-ink">
                    {reponse}
                  </p>
                </li>
              );
            })}
          </motion.ol>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
