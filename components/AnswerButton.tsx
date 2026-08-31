"use client";

import { motion } from "framer-motion";
import type { Answer } from "@/data/story";
import { personalize } from "@/lib/quiz";

interface AnswerButtonProps {
  answer: Answer;
  /** Position dans la liste, pour l'apparition en cascade. */
  index: number;
  isSelected: boolean;
  /** Vrai dès qu'un choix est fait : on fige la question. */
  isLocked: boolean;
  onSelect: (answer: Answer) => void;
}

export default function AnswerButton({
  answer,
  index,
  isSelected,
  isLocked,
  onSelect,
}: AnswerButtonProps) {
  return (
    <motion.button
      type="button"
      disabled={isLocked}
      onClick={() => onSelect(answer)}
      initial={{ opacity: 0, y: 14 }}
      // L'estompage des choix non retenus passe par l'animation, pas par une
      // classe : Framer Motion écrit `opacity` en style inline, qui gagnerait.
      animate={{ opacity: isLocked && !isSelected ? 0.4 : 1, y: 0 }}
      transition={{ delay: 0.12 + index * 0.07, duration: 0.35, ease: "easeOut" }}
      whileTap={isLocked ? undefined : { scale: 0.975 }}
      className={`group flex w-full items-center gap-3.5 rounded-2xl border px-4 py-3 text-left transition-colors duration-200 min-h-[3.5rem] ${
        isSelected
          ? "border-rose bg-rose/8 text-ink"
          : "border-line bg-white/70 text-ink hover:border-rose-soft hover:bg-white"
      } disabled:cursor-default`}
    >
      {answer.emoji ? (
        <motion.span
          aria-hidden="true"
          className="shrink-0 text-xl leading-none"
          animate={isSelected ? { scale: [1, 1.35, 1] } : { scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          {answer.emoji}
        </motion.span>
      ) : null}

      <span className="text-[0.95rem] leading-snug font-medium">
        {personalize(answer.text)}
      </span>
    </motion.button>
  );
}
