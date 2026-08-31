"use client";

import { motion, useReducedMotion } from "framer-motion";

interface TypewriterTextProps {
  text: string;
  className?: string;
  /** Secondes avant le premier mot. */
  delay?: number;
}

/**
 * Révèle un texte mot à mot. Volontairement mot à mot plutôt que lettre à
 * lettre : c'est plus lisible, et le texte reste sélectionnable et lisible
 * d'un seul tenant par un lecteur d'écran.
 */
export default function TypewriterText({
  text,
  className = "",
  delay = 0,
}: TypewriterTextProps) {
  const prefersReducedMotion = useReducedMotion();
  const words = text.split(" ");

  if (prefersReducedMotion) {
    return (
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, delay }}
        className={className}
      >
        {text}
      </motion.p>
    );
  }

  return (
    <motion.p
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.055, delayChildren: delay } },
      }}
    >
      {words.map((word, index) => (
        <motion.span
          // Les mots peuvent se répéter : l'index fait partie de la clé.
          key={`${word}-${index}`}
          className="inline-block whitespace-pre"
          variants={{
            hidden: { opacity: 0, y: 6, filter: "blur(3px)" },
            show: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 0.35, ease: "easeOut" },
            },
          }}
        >
          {word}
          {index < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </motion.p>
  );
}
