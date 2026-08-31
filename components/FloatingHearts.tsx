"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface FloatingHeartsProps {
  count?: number;
  /** `burst` : une explosion courte. `ambient` : un flux lent et continu. */
  variant?: "burst" | "ambient";
  /** Plan d'empilement. Par défaut derrière les cartes (qui sont en z-10). */
  zClass?: string;
}

const GLYPHS = ["❤️", "🤍", "💗", "✨"] as const;

interface Particle {
  id: number;
  left: number;
  glyph: string;
  size: number;
  delay: number;
  duration: number;
  drift: number;
}

/**
 * Particules purement décoratives (cœurs et étincelles).
 * - Générées uniquement après le montage : aucun écart d'hydratation.
 * - Retirées si l'utilisatrice a demandé moins d'animations.
 * - `pointer-events-none` + `aria-hidden` : jamais dans le chemin d'un clic
 *   ni dans celui d'un lecteur d'écran.
 * - Positionnées en `fixed` : sur une page longue comme l'écran final, un
 *   conteneur `absolute` les reléguerait toutes tout en bas.
 */
export default function FloatingHearts({
  count = 14,
  variant = "burst",
  zClass = "z-0",
}: FloatingHeartsProps) {
  const [mounted, setMounted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => setMounted(true), []);

  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: count }, (_, id) => ({
        id,
        left: Math.random() * 100,
        glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? "❤️",
        size: 0.75 + Math.random() * 0.85,
        delay: Math.random() * (variant === "burst" ? 0.5 : 4),
        duration: (variant === "burst" ? 2.4 : 7) + Math.random() * 2.5,
        drift: (Math.random() - 0.5) * 90,
      })),
    [count, variant],
  );

  if (!mounted || prefersReducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 overflow-hidden ${zClass}`}
    >
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute bottom-0 select-none"
          style={{ left: `${particle.left}%`, fontSize: `${particle.size}rem` }}
          initial={{ opacity: 0, y: 0, scale: 0.6 }}
          animate={{
            opacity: variant === "ambient" ? [0, 0.4, 0.4, 0] : [0, 0.9, 0.9, 0],
            y: "-95svh",
            x: particle.drift,
            scale: [0.6, 1, 1, 0.9],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: "easeOut",
            repeat: variant === "ambient" ? Infinity : 0,
            repeatDelay: variant === "ambient" ? Math.random() * 3 : 0,
          }}
        >
          {particle.glyph}
        </motion.span>
      ))}
    </div>
  );
}
