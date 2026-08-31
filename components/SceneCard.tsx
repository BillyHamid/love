"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Scene } from "@/data/story";
import { personalize } from "@/lib/quiz";

interface SceneCardProps {
  scene: Scene;
  onContinue: () => void;
}

/** Une ligne apparaît, on la lit, la suivante arrive. */
const LINE_DELAY = 0.85;

/**
 * Un temps de récit : quelques phrases qui se posent l’une après l’autre,
 * puis un bouton pour continuer. Le bouton n’apparaît qu’après la dernière
 * ligne — impossible de sauter l’histoire sans l’avoir vue passer.
 */
export default function SceneCard({ scene, onContinue }: SceneCardProps) {
  const lines = scene.lines;

  return (
    <div className="py-2 text-center">
      <div className="flex flex-col gap-5">
        {lines.map((line, index) => (
          <motion.p
            key={line}
            initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.7,
              delay: 0.25 + index * LINE_DELAY,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={
              index === 0
                ? "font-display text-[1.4rem] leading-[1.3] text-ink text-balance"
                : "font-display text-[1.25rem] leading-[1.35] text-plum text-balance"
            }
          >
            {personalize(line)}
          </motion.p>
        ))}
      </div>

      <motion.button
        type="button"
        onClick={onContinue}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.35 + lines.length * LINE_DELAY,
          ease: "easeOut",
        }}
        whileTap={{ scale: 0.97 }}
        className="mt-9 inline-flex min-h-[3.25rem] touch-manipulation items-center justify-center gap-2 rounded-2xl border border-line bg-white/80 px-7 text-[0.95rem] font-semibold text-ink shadow-soft"
      >
        {personalize(scene.cta ?? "Continuer")}
        <ArrowRight className="size-4 text-rose" aria-hidden="true" />
      </motion.button>
    </div>
  );
}
