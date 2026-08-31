"use client";

import { AnimatePresence, motion } from "framer-motion";

interface ReactionMessageProps {
  /** Texte à afficher, ou `null` pour ne rien montrer. */
  message: string | null;
}

/**
 * La petite pique affichée ~1 s après un choix, avant la question suivante.
 * `aria-live="polite"` la fait lire par les lecteurs d'écran sans couper
 * la lecture en cours.
 */
export default function ReactionMessage({ message }: ReactionMessageProps) {
  return (
    <div className="pointer-events-none min-h-[2.25rem]" aria-live="polite">
      <AnimatePresence mode="wait">
        {message ? (
          <motion.p
            key={message}
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="font-display text-center text-[1.15rem] leading-snug text-rose"
          >
            {message}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
